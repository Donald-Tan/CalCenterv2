import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const [caloriesGained, setCaloriesGained] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Mock data fetch
    setCaloriesGained(1200); // Replace with actual data fetching
    setCaloriesBurned(500); // Replace with actual data fetching
  }, []);

  const netCalories = caloriesGained - caloriesBurned;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Tracker</Text>
      <Text style={styles.statText}>Calories Consumed: {caloriesGained} kcal</Text>
      <Text style={styles.statText}>Calories Burned: {caloriesBurned} kcal</Text>
      <Text style={styles.summaryText}>
        Net Calories: {netCalories > 0 ? `+${netCalories}` : netCalories} kcal
      </Text>
      <Button
        title="View Calories Gained"
        onPress={() => router.push('/CalorieGainedScreen')}
      />
      <Button
        title="View Calories Burned"
        onPress={() => router.push('/CalorieLossScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Platform.OS === 'ios' ? '#f9f9f9' : '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statText: {
    fontSize: 20,
    marginVertical: 5,
  },
  summaryText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#2e86de',
  },
});

export default HomeScreen;
