import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NutritionItem {
    FoodID: number;
    Food: string;
    Kilocalories: number;
}

interface User {
    userID: string;
}

const CustomRecipeScreen = () => {
    const [user, setUser] = useState<User>({ userID: '' });
    const [allIngredients, setAllIngredients] = useState<NutritionItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIngredients, setFilteredIngredients] = useState<NutritionItem[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<{ FoodID: number; Food: string; Kilocalories: number; Quantity: number }[]>([]);
    const [recipeName, setRecipeName] = useState('');

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

        const fetchIngredients = async () => {
            try {
                const response = await axios.get('http://localhost:3000/nutrition');
                const ingredients: NutritionItem[] = response.data.ingredients;
                ingredients.sort((a, b) => a.Food.localeCompare(b.Food));
                setAllIngredients(ingredients);
                setFilteredIngredients(ingredients);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                Alert.alert('Error', 'Failed to fetch ingredients. Please try again.');
            }
        };

        fetchUserData().then(fetchIngredients);
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredIngredients(allIngredients);
        } else {
            const lowerSearch = searchTerm.toLowerCase();
            const filtered = allIngredients.filter(item =>
                item.Food.toLowerCase().includes(lowerSearch)
            );
            setFilteredIngredients(filtered);
        }
    }, [searchTerm, allIngredients]);

    const handleAddIngredient = (item: NutritionItem) => {
        if (selectedIngredients.some(i => i.FoodID === item.FoodID)) {
            Alert.alert('Info', 'This ingredient is already added.');
            return;
        }
        setSelectedIngredients(prev => [...prev, { ...item, Quantity: 1 }]);
    };

    const handleRemoveIngredient = (foodID: number) => {
        setSelectedIngredients(prev => prev.filter(item => item.FoodID !== foodID));
    };

    const handleQuantityChange = (foodID: number, newQuantity: string) => {
        const quantity = parseFloat(newQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            Alert.alert('Error', 'Please enter a valid quantity greater than 0.');
            return;
        }

        setSelectedIngredients(prev =>
            prev.map(item => item.FoodID === foodID ? { ...item, Quantity: quantity } : item)
        );
    };

    const totalCalories = selectedIngredients.reduce((sum, item) => sum + item.Kilocalories * item.Quantity, 0);

    const handleSaveRecipe = async () => {
        if (selectedIngredients.length === 0) {
            Alert.alert('Error', 'Please add at least one ingredient to the recipe.');
            return;
        }

        if (!recipeName.trim()) {
            Alert.alert('Error', 'Please enter a name for your recipe.');
            return;
        }

        try {
            // Construct payload according to the backend expected format
            const payload = {
                UserID: user.userID,
                recipeName: recipeName.trim(),
                description: '',
                ingredients: selectedIngredients.map(item => ({
                    FoodID: item.FoodID,
                    Quantity: item.Quantity
                }))
            };

            const response = await axios.post('http://localhost:3000/created-recipe', payload);

            if (response.data.success) {
                Alert.alert('Success', 'Your recipe has been saved!');
                setSelectedIngredients([]);
                setSearchTerm('');
                setRecipeName('');
            } else {
                Alert.alert('Error', 'Failed to save recipe. Please try again.');
            }
        } catch (error) {
            console.error('Error saving recipe:', error);
            Alert.alert('Error', 'An error occurred while saving your recipe.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a Custom Recipe</Text>

            <Text style={styles.sectionTitle}>Recipe Name</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. My Delicious Salad"
                value={recipeName}
                onChangeText={setRecipeName}
            />

            <Text style={styles.sectionTitle}>Search Ingredients</Text>
            <TextInput
                style={styles.input}
                placeholder="Type an ingredient..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            <FlatList
                data={filteredIngredients}
                keyExtractor={(item) => item.FoodID.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.ingredientItem} onPress={() => handleAddIngredient(item)}>
                        <Text style={styles.ingredientText}>{item.Food} ({item.Kilocalories} kcal)</Text>
                    </TouchableOpacity>
                )}
                style={styles.list}
                ListHeaderComponent={<Text style={styles.subSectionTitle}>Available Ingredients</Text>}
            />

            <Text style={styles.sectionTitle}>Selected Ingredients</Text>
            <FlatList
                data={selectedIngredients}
                keyExtractor={item => item.FoodID.toString()}
                renderItem={({ item }) => (
                    <View style={styles.selectedItemContainer}>
                        <Text style={styles.itemText}>{item.Food} ({item.Kilocalories} kcal/unit)</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                style={styles.quantityInput}
                                keyboardType="numeric"
                                value={item.Quantity.toString()}
                                onChangeText={(val) => handleQuantityChange(item.FoodID, val)}
                            />
                            <Button title="Remove" onPress={() => handleRemoveIngredient(item.FoodID)} />
                        </View>
                    </View>
                )}
            />

            <Text style={styles.sectionTitle}>Total Calories: {totalCalories}</Text>

            <Button title="Save Recipe" onPress={handleSaveRecipe} />
        </View>
    );
};

export default CustomRecipeScreen;

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
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    subSectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 5,
    },
    list: {
        marginBottom: 20,
        maxHeight: 200,
    },
    input: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    ingredientItem: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
    },
    ingredientText: {
        fontSize: 16,
    },
    selectedItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    itemText: {
        fontSize: 18,
        flex: 1,
        marginRight: 10,
    },
    quantityInput: {
        width: 60,
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        paddingHorizontal: 10,
    },
});
