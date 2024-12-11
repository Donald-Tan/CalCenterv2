import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

interface Activity {
    ActivityID: number;
    ActivityName: string;
    CaloriesPerHour: number;
}

interface LoggedActivity {
    ActivityID: number;
    Duration: number;
    Date: string;
}

const CalorieLossScreen = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [exerciseDuration, setExerciseDuration] = useState('');
    const [loggedActivities, setLoggedActivities] = useState<LoggedActivity[]>([]);
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

        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:3000/activities');
                setActivities(response.data.activities);
            } catch (error) {
                console.error('Error fetching activities:', error);
                Alert.alert('Error', 'Failed to fetch activities. Please try again.');
            }
        };

        fetchUserData().then(fetchActivities);
    }, []);

    useEffect(() => {
        if (user.userID) {
            const fetchLoggedActivities = async () => {
                try {
                    const response = await axios.get('http://localhost:3000/activity-logs', {
                        params: {
                            userID: user.userID,
                            date: formattedDate
                        }
                    });
                    setLoggedActivities(response.data.loggedActivities);
                } catch (error) {
                    console.error('Error fetching logged activities:', error);
                    Alert.alert('Error', 'Failed to fetch logged activities. Please try again.');
                }
            };
            fetchLoggedActivities();
        }
    }, [user.userID]);

    const handleAddActivity = async () => {
        if (!selectedActivity || !exerciseDuration) {
            Alert.alert('Error', 'Please select an activity AND enter a duration.');
            return;
        }

        const duration = parseFloat(exerciseDuration);
        if (isNaN(duration) || duration <= 0) {
            Alert.alert('Error', 'Please enter a valid duration.');
            return;
        }

        try {
            await axios.post('http://localhost:3000/activity-logs', {
                UserID: user.userID,
                ActivityID: selectedActivity.ActivityID,
                Date: formattedDate,
                Duration: duration
            });

            // Update local state w/ server response
            setLoggedActivities(prev => [
                ...prev,
                { ActivityID: selectedActivity.ActivityID, Duration: duration, Date: new Date().toISOString().split('T')[0] }
            ]);

            setSelectedActivity(null);
            setExerciseDuration('');
        } catch (error) {
            console.error('Error adding activity to log:', error);
            Alert.alert('Error', 'Failed to log the activity. Please try again.');
        }
    };

    // Function to get the calories burned for a logged activity
    const getCaloriesBurned = (activityID: number, duration: number): number => {
        const activity = activities.find(a => a.ActivityID === activityID);
        if (!activity) return 0;
        return activity.CaloriesPerHour * duration;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log Activities</Text>

            <FlatList
                data={activities}
                keyExtractor={(item) => item.ActivityID.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.activityItem,
                            selectedActivity?.ActivityID === item.ActivityID && styles.selectedItem,
                        ]}
                        onPress={() => setSelectedActivity(item)}
                    >
                        <Text style={styles.activityText}>
                            {item.ActivityName} ({item.CaloriesPerHour} kcal/hr)
                        </Text>
                    </TouchableOpacity>
                )}
                style={styles.list}
                ListHeaderComponent={<Text style={styles.sectionTitle}>Activities</Text>}
            />

            {selectedActivity && (
                <View style={styles.inputContainer}>
                    <Text style={styles.sectionTitle}>Selected Activity: {selectedActivity.ActivityName}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter duration in hours"
                        value={exerciseDuration}
                        onChangeText={setExerciseDuration}
                        keyboardType="numeric"
                    />
                    <Button title="Log Activity" onPress={handleAddActivity} />
                </View>
            )}

            <FlatList
                data={loggedActivities}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                    const caloriesBurned = getCaloriesBurned(item.ActivityID, item.Duration);
                    const activity = activities.find(a => a.ActivityID === item.ActivityID);
                    return (
                        <Text style={styles.itemText}>
                            {activity ? activity.ActivityName : "Unknown Activity"}
                            ({item.Duration} hr): {caloriesBurned} kcal
                        </Text>
                    );
                }}
                style={styles.list}
                ListHeaderComponent={<Text style={styles.sectionTitle}>Logged Activities</Text>}
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
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    list: {
        marginBottom: 20,
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
    inputContainer: {
        marginBottom: 20,
    },
    activityItem: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
    },
    selectedItem: {
        backgroundColor: '#d0f0c0',
    },
    activityText: {
        fontSize: 18,
    },
});

export default CalorieLossScreen;