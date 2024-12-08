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

interface Exercise {
  id: string;
  name: string;
  duration: number; // in hours
  caloriesBurned: number;
}

interface Food {
  id: string;
  name: string;
  calories: number;
}

const CalorieLossScreen = ({ loggedFoods = [] }: { loggedFoods?: Food[] }) => {
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseDuration, setExerciseDuration] = useState('');
    const [manualCaloriesBurned, setManualCaloriesBurned] = useState('');
    const [loggedExercises, setLoggedExercises] = useState<Exercise[]>([]);
  
    // Simulated database of exercises with calories burned per hour
    const exerciseDatabase: { [key: string]: number } = {
      running: 600,
      cycling: 400,
      swimming: 500,
    };
  
    const fetchExerciseCaloriesFromDatabase = (exerciseName: string): number | null => {
      const lowerCaseExerciseName = exerciseName.toLowerCase();
      return exerciseDatabase[lowerCaseExerciseName] ?? null;
    };
  
    const handleAddExercise = () => {
      if (!exerciseName || (!exerciseDuration && !manualCaloriesBurned)) {
        Alert.alert('Error', 'Please enter exercise details and duration or calories burned.');
        return;
      }
  
      let caloriesBurned = 0;
  
      const duration = parseFloat(exerciseDuration);
      if (isNaN(duration) && !manualCaloriesBurned) {
        Alert.alert('Error', 'Please enter a valid exercise duration or calories burned.');
        return;
      }
  
      const caloriesFromDatabase = fetchExerciseCaloriesFromDatabase(exerciseName);
  
      if (caloriesFromDatabase !== null) {
        caloriesBurned = caloriesFromDatabase * duration;
      } else if (manualCaloriesBurned) {
        caloriesBurned = parseFloat(manualCaloriesBurned);
        if (isNaN(caloriesBurned)) {
          Alert.alert('Error', 'Please enter valid manual calories burned.');
          return;
        }
      } else {
        Alert.alert('Error', 'Please provide a valid exercise or manual calorie count.');
        return;
      }
  
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: exerciseName,
        duration,
        caloriesBurned,
      };
  
      setLoggedExercises((prevExercises) => [...prevExercises, newExercise]);
      setExerciseName('');
      setExerciseDuration('');
      setManualCaloriesBurned('');
    };
  
    const totalCaloriesBurned = loggedExercises.reduce(
      (sum, exercise) => sum + exercise.caloriesBurned,
      0
    );
  
    const totalCaloriesGained = loggedFoods.reduce(
      (sum, food) => sum + food.calories,
      0
    );
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Calories Burned</Text>
  
        {/* Total calories burned */}
        <Text style={styles.totalText}>Total Calories Burned: {totalCaloriesBurned} kcal</Text>
  
        {/* Total calories gained */}
        <Text style={styles.totalText}>Total Calories Gained: {totalCaloriesGained} kcal</Text>
  
        {/* Input fields */}
        <TextInput
          style={styles.input}
          placeholder="Enter exercise name"
          value={exerciseName}
          onChangeText={setExerciseName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter duration in hours"
          value={exerciseDuration}
          onChangeText={setExerciseDuration}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter calories burned manually (optional)"
          value={manualCaloriesBurned}
          onChangeText={setManualCaloriesBurned}
          keyboardType="numeric"
        />
        <Button title="Add Exercise" onPress={handleAddExercise} />
  
        {/* Logged exercises */}
        <FlatList
          data={loggedExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.itemText}>
              {item.name} ({item.duration} hr): {item.caloriesBurned} kcal
            </Text>
          )}
          style={styles.list}
        />
  
        <Text style={styles.sectionTitle}>Food Logged Today</Text>
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
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

export default CalorieLossScreen;
