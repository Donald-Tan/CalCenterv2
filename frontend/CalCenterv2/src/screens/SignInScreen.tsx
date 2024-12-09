import React, { useState, useContext } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import { AuthContext } from '@/App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password
            });

            if (response.data.success) {
                // Stores returned data from JSON response
                const { userID, firstName, lastName, email, dateOfBirth } = response.data.user;
                console.log(userID);
                await AsyncStorage.setItem('user', JSON.stringify({ userID, firstName, lastName, email, dateOfBirth }));

                Alert.alert('Success', 'You are now signed in!');
                signIn();
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Please try again');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Enter your email"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter your password"
            />

            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.signUpPrompt}>
                <Text style={styles.promptText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 70,
        backgroundColor: '#f8f8f8',
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingLeft: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#1abc9c',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    signUpPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    promptText: {
        fontSize: 16,
        color: '#333',
        marginRight: 8,
    },
    signUpText: {
        fontSize: 16,
        color: '#1abc9c',
        fontWeight: 'bold',
    },
});

export default SignInScreen;