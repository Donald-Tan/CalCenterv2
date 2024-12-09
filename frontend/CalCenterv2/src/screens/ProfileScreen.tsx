import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [user, setUser] = useState({
    userID: '',
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: ''
  });

  const [age, setAge] = useState(null);
  // dateOfBirth will only be of type Date, so this should be defined or else we get an error
  const ageCalc = (dateOfBirth: Date) => {
    const today = new Date();
    const birthday = new Date(dateOfBirth);

    let age = today.getFullYear() - birthday.getFullYear();

    // Check if birthday has happened yet this year
    if (today.getMonth() < birthday.getMonth() ||
        (today.getMonth() === birthday.getMonth() && today.getDate() <= birthday.getDate())) {
      age = age - 1;
    }
    return age;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUser(parsedData);

          const dateOfBirth = parsedData.dateOfBirth;
          const simpleAge = ageCalc(dateOfBirth);
          // @ts-ignore to setAge
          setAge(simpleAge);
        }
      } catch (error) {
        Alert.alert('Error', 'Could not fetch user data');
      }
    };
    fetchUserData();
  }, []);

  // @ts-ignore
  return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} // Placeholder image
              style={styles.avatar}
          />
          <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                  style={styles.input}
                  value={user.firstName}
                  editable={false}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                  style={styles.input}
                  value={user.lastName}
                  editable={false}
              />
            </View>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
              style={styles.input}
              value={user.email}
              editable={false}
              keyboardType="email-address"
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
              style={styles.input}
              value={age !== null ? age.toString() : ''}
              editable={false}
              keyboardType="numeric"
          />
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#1abc9c', // Teal green border
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },
});

export default ProfileScreen;
