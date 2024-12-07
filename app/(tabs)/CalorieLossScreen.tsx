import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const exercises = [
  { id: '1', name: 'Running (30 mins)', calories: 300 },
  { id: '2', name: 'Cycling (20 mins)', calories: 250 },
  { id: '3', name: 'Yoga (1 hour)', calories: 180 },
];

const CalorieLossScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calories Burned</Text>
      <FlatList
        data={exercises}
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

export default CalorieLossScreen;
