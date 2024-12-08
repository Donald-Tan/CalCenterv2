import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [calories, setCalories] = useState(null);
  const [exerciseCalculation, setExerciseCalculation] = useState(null);

  const handleDayPress = (day) => {
    const date = new Date(day.timestamp); // Needs to be a Date object for formatting
    const formattedDate = format(date, 'MM/dd/yyyy');
    setSelectedDate(formattedDate);

    // Constants to show functionality
    setCalories(2000);
    setExerciseCalculation(500); // Maybe represents calories burned?
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
      />

      {selectedDate ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.label}>Selected Date: {selectedDate}</Text>
          <Text style={styles.label}>Caloric Intake: {calories !== null ? `${calories} kcal` : 'Loading...'}</Text>
          <Text style={styles.label}>Exercise Calculation: {exerciseCalculation !== null ? `${exerciseCalculation} kcal` : 'Loading...'}</Text>
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
