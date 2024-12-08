import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';

interface Food {
  id: string;
  name: string;
  calories: number;
}

const CalorieGainedScreen = () => {
  const [foodName, setFoodName] = useState('');
  const [calorieCount, setCalorieCount] = useState('');
  const [loggedFoods, setLoggedFoods] = useState<Food[]>([]);

  // Define foodDatabase with an index signature
  const foodDatabase: { [key: string]: number } = {
    apple: 95,
    banana: 105,
    pizza: 285,
  };

  // Simulating a function that fetches food calories from the database
  const fetchFoodCaloriesFromDatabase = (foodName: string): number | null => {
    // Convert foodName to lowercase to make it case-insensitive
    const lowerCaseFoodName = foodName.toLowerCase();

    // Return calories if food exists in database, otherwise null
    return foodDatabase[lowerCaseFoodName] ?? null;
  };

  const handleAddFood = () => {
    if (!foodName || !calorieCount) {
      Alert.alert('Error', 'Please enter both food name and calorie count.');
      return;
    }

    // Try to fetch the calories from the database
    const caloriesFromDatabase = fetchFoodCaloriesFromDatabase(foodName);

    let calories = 0;

    if (caloriesFromDatabase !== null) {
      // If the food is in the database, use its calorie value
      calories = caloriesFromDatabase;
    } else {
      // Otherwise, use the user's input for calories
      calories = parseInt(calorieCount);
    }

    if (isNaN(calories)) {
      Alert.alert('Error', 'Please enter a valid calorie count.');
      return;
    }

    const newFood: Food = {
      id: Date.now().toString(),
      name: foodName,
      calories,
    };

    setLoggedFoods((prevFoods) => [...prevFoods, newFood]);
    setFoodName('');
    setCalorieCount('');
  };

  const totalCalories = loggedFoods.reduce((sum, food) => sum + food.calories, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calories Gained</Text>

      {/* Total calories */}
      <Text style={styles.totalText}>Total Calories: {totalCalories} kcal</Text>

      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Enter food name"
        value={foodName}
        onChangeText={setFoodName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter calorie count (if known)"
        value={calorieCount}
        onChangeText={setCalorieCount}
        keyboardType="numeric"
      />
      <Button title="Add Food" onPress={handleAddFood} />

      {/* Logged foods */}
      <FlatList
        data={loggedFoods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.itemText}>
            {item.name}: {item.calories} kcal
          </Text>
        )}
        style={styles.list}
      />
    </View>
  );
};

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
  list: {
    marginTop: 20,
  },
});

export default CalorieGainedScreen;
