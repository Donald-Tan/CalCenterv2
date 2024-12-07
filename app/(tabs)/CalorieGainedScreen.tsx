import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const foods = [
  { id: '1', name: 'Apple', calories: 95 },
  { id: '2', name: 'Banana', calories: 105 },
  { id: '3', name: 'Pizza Slice', calories: 285 },
];

const CalorieGainedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calories Gained</Text>
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.itemText}>
            {item.name}: {item.calories} kcal
          </Text>
        )}
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
  itemText: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default CalorieGainedScreen;
