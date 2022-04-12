import React, { useState } from 'react';
// The AsyncStorage warning is reference in App.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {
    StyleSheet, Text, TextInput, View, Button
} from 'react-native';
import app from '../../firebase';
import {
    primaryColor, white, black
} from '../../assets/globalStyles';

export default function SignUpScreen() {
    const [state, setState] = useState({
        email: '',
        emailError: false,
        password: '',
        passwordError: false,
        emailAlreadyUsedError: false
    });

    const auth = getAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

    function handleChange(e, name) {
        setState({
            ...state,
            [name]: e,
            emailError: false,
            passwordError: false,
            emailAlreadyUsedError: false,
        });
    }

    async function onSubmit(e) {
        let emailError = false;
        let passwordError = false;

        e.preventDefault();
        // Validate Email address
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i;
        if (!emailRegex.test(state.email)) {
            emailError = true;
        }
        if (state.password === '' || state.password.length < 6) {
            passwordError = true;
        }

        setState({
            ...state,
            emailError,
            passwordError,
        });

        if (emailError || passwordError) {
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, state.email, state.password);
            console.log('sign Up successful');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setState({
                    ...state,
                    emailAlreadyUsedError: true,
                });
            } else {
                console.log(error);
            }
        }
    }

    return (
        <View style={styles.inputFormContainer}>
            <View style={styles.headerWrapper}>
                <Text style={styles.headerText}>Fitness Challenge App</Text>
            </View>
            <View style={styles.signInFields}>
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Email'
                        value={state.email}
                        onChangeText={(e) => handleChange(e, 'email')}
                    />
                </View>
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Password'
                        value={state.password}
                        onChangeText={(e) => handleChange(e, 'password')}
                    />
                </View>
                {state.emailError
                    ? <Text>Please enter a valid email address.</Text>
                    : null}
                {state.passwordError
                    ? <Text>Password must be at least 6 characters.</Text>
                    : null}
                {state.emailAlreadyUsedError
                    ? <Text>That email has already been used to create an account.</Text>
                    : null}
                <View style={styles.signInButtonWrapper}>
                    <Button
                        style={styles.signInButton}
                        title='Create Account'
                        accessibilityLabel='Create Account button'
                        color={white}
                        onPress={(e) => onSubmit(e)}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerWrapper: {
        marginTop: 100,
        marginBottom: 100
    },
    headerText: {
        fontSize: 40
    },
    inputFormContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: primaryColor
    },
    textInput: {
        textAlign: 'center',
        height: '100%',
        width: '100%',
        borderWidth: 2,
        borderRadius: 5,
    },
    textInputWrapper: {
        backgroundColor: white,
        width: '80%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
    },
    signInFields: {
        width: '100%',
        alignItems: 'center',
    },
    signInButtonWrapper: {
        margin: 5,
        width: 200,
        backgroundColor: black
    }
});
