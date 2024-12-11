import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

interface Recipe {
  RecipeID: number;
  Name: string;
  TotalCalories: number;
}

interface LoggedRecipe {
  RecipeID: number;
  Name: string;
  Quantity: number;
}

const CalorieGainedScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loggedRecipes, setLoggedRecipes] = useState<LoggedRecipe[]>([]);
  const [user, setUser] = useState<{ userID: string }>({ userID: '' });

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'yyyy-MM-dd');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUser(parsedData);
        }
      } catch (error) {
        Alert.alert('Error', 'Could not fetch user data');
      }
    };

    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/recipes');
        const recipes: Recipe[] = response.data;
        setAllRecipes(recipes);
        setFilteredRecipes(recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        Alert.alert('Error', 'Failed to fetch recipes. Please try again.');
      }
    };

    fetchUserData().then(fetchRecipes);
  }, []);

  useEffect(() => {
    if (user.userID) {
      const fetchLoggedRecipes = async () => {
        try {
          const response = await axios.get('http://localhost:3000/recipe-logs', {
            params: {
              userID: user.userID,
              date: formattedDate
            }
          });
          setLoggedRecipes(response.data.loggedRecipes);
        } catch (error) {
          console.error('Error fetching logged recipes:', error);
          Alert.alert('Error', 'Failed to fetch logged recipes. Please try again.');
        }
      };
      fetchLoggedRecipes();
    }
  }, [user.userID]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecipes(allRecipes);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = allRecipes.filter(r =>
          r.Name.toLowerCase().includes(lowerSearch)
      );
      setFilteredRecipes(filtered);
    }
  }, [searchTerm, allRecipes]);

  const handleAddRecipe = async (recipe: Recipe) => {
    if (loggedRecipes.some(r => r.Name === recipe.Name)) {
      Alert.alert('Info', 'This recipe is already logged.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/recipe-logs', {
        UserID: user.userID,
        RecipeID: recipe.RecipeID,
        Date: formattedDate,
        Quantity: 1
      });

      console.log(recipe.RecipeID.toString(), recipe.Name, recipe.TotalCalories);
      // Update local state w/ server response
      setLoggedRecipes(prev => [
        ...prev,
        { RecipeID: recipe.RecipeID, Name: recipe.Name, Quantity: 1 }
      ]);
      console.log(loggedRecipes);
    } catch (error) {
      console.error('Error adding intake to log:', error);
      Alert.alert('Error', 'Failed to log the intake. Please try again.');
    }
  };

  const totalCalories = loggedRecipes.reduce((total: number, log: any) => {
    const matchingRecipe = allRecipes.find(a => a.RecipeID === log.RecipeID);
    if (matchingRecipe) {
      return total + (matchingRecipe.TotalCalories * log.Quantity);
    }
    return total;
  }, 0);

  // Function to get the calories gained for a logged recipe
  const getCalories = (recipeID: number, quantity: number): number => {
    const recipe = allRecipes.find(a => a.RecipeID === recipeID);
    if (!recipe) return 0;
    return recipe.TotalCalories * quantity;
  };
  return (
      <View style={styles.container}>
        <Text style={styles.title}>Calories Gained</Text>
        <Text style={styles.totalText}>Total Calories: {totalCalories} kcal</Text>
        <TextInput
            style={styles.input}
            placeholder="Search for a recipe..."
            value={searchTerm}
            onChangeText={setSearchTerm}
        />
        <FlatList
            data={filteredRecipes}
            keyExtractor={(item) => item.RecipeID.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.recipeItem} onPress={() => handleAddRecipe(item)}>
                  <Text style={styles.itemText}>
                    {item.Name} ({item.TotalCalories} kcal)
                  </Text>
                </TouchableOpacity>
            )}
            style={styles.list}
        />
        <Text style={styles.sectionTitle}>Logged Recipes</Text>
        <FlatList
            data={loggedRecipes}
            keyExtractor={(_, item) => item.toString()}
            renderItem={({ item }) => {
                const caloriesGained = getCalories(item.RecipeID, item.Quantity);
                const recipy = allRecipes.find(a => a.RecipeID === item.RecipeID);
                return (
                  <Text style={styles.itemText}>
                    {recipy ? recipy.Name : "Unknown Recipe"}{' '}
                    ({item.Quantity}x): {caloriesGained} kcal
                  </Text>
                );
            }}
            style={styles.list}
        />
      </View>
  );
};

export default CalorieGainedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: 18,
    marginVertical: 5,
  },
  recipeItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  list: {
    marginBottom: 20,
  },
});