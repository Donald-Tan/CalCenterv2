import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, parse } from 'date-fns';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Recipe {
  RecipeID: number;
  Name: string;
  TotalCalories: number;
}

interface Activity {
  ActivityID: number;
  ActivityName: string;
  CaloriesPerHour: number;
}

// Calculate today's date in 'yyyy-MM-dd' format
const today = format(new Date(), 'yyyy-MM-dd');
const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [totalCaloriesGained, setTotalCaloriesGained] = useState<number | null>(null);
  const [netCalories, setNetCalories] = useState<number | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState<number | null>(null);
  const [user, setUser] = useState<{ userID: string }>({ userID: '' });
  const [activities, setActivities] = useState<Activity[]>([]);

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

    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/activities');
        setActivities(response.data.activities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        Alert.alert('Error', 'Failed to fetch activities. Please try again.');
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

    fetchUserData().then(fetchActivities).finally(fetchRecipes);
  }, []);

  const handleDayPress = async (day: any) => {
    const date = parse(day.dateString, 'yyyy-MM-dd', new Date()); // Needs to be a Date object for formatting
    const formattedDate = format(date, 'MM/dd/yyyy');
    setSelectedDate(formattedDate);

    try {
      const response = await axios.get('http://localhost:3000/activity-logs', {
        params: {
          userID: user.userID,
          date: date.toISOString().split('T')[0]
        },
      });

      const activityLogs = response.data.loggedActivities;

      // Calorie burned calculation
      const totalCaloriesBurned = activityLogs.reduce((total: number, log: any) => {
        const matchingActivity = activities.find(a => a.ActivityID === log.ActivityID);
        if (matchingActivity) {
          return total + (matchingActivity.CaloriesPerHour * log.Duration);
        }
        return total;
      }, 0);
      setTotalCaloriesBurned(totalCaloriesBurned);

      const intakeResponse = await axios.get('http://localhost:3000/recipe-logs', {
        params: {
          userID: user.userID,
          date: date.toISOString().split('T')[0]
        },
      });

      const recipeLogs = intakeResponse.data.loggedRecipes;

      const totalCaloriesGained = recipeLogs.reduce((total: number, log: any) => {
        const matchingRecipe = allRecipes.find(a => a.RecipeID === log.RecipeID);
        if (matchingRecipe) {
          return total + (matchingRecipe.TotalCalories * log.Quantity);
        }
        return total;
      }, 0);
      setTotalCaloriesGained(totalCaloriesGained);

      setNetCalories(totalCaloriesGained - totalCaloriesBurned);
    } catch (error) {
      console.error('Error fetching activity logs: ', error);
      Alert.alert('Error', 'Failed to fetch activity logs. Please try again.');
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Select a Date</Text>

        <Calendar
            onDayPress={handleDayPress}
            style={styles.calendar}
            theme={{
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 16,
            }}
            maxDate={today} // Disable future dates
            disableAllTouchEventsForDisabledDays={true} // Prevent interaction with disabled days
            enableSwipeMonths={true}
        />

        {selectedDate ? (
            <View style={styles.resultsContainer}>
              <Text style={styles.label}>Selected Date: {selectedDate}</Text>
              <Text style={styles.label}>Caloric Intake: {totalCaloriesGained !== null ? `${totalCaloriesGained} kcal` : 'Loading...'}</Text>
              <Text style={styles.label}>Total Calories Burned: {totalCaloriesBurned !== null ? `${totalCaloriesBurned} kcal` : 'Loading...'}</Text>
              <Text style={styles.label}>Net Daily Calories: {netCalories !== null ? `${netCalories} kcal` : 'Loading...'}</Text>
            </View>
        ) : (
            <Text style={styles.infoText}>Please select a date to view your data.</Text>
        )}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  calendar: {
    marginBottom: 20,
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginTop: 20,
    color: '#555',
    textAlign: 'center',
  },
});

export default CalendarScreen;