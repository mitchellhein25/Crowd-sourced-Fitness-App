import React, { useState } from 'react';
// import { getDatabase, ref, push } from 'firebase/database';
// The AsyncStorage warning is reference in App.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getReactNativePersistence } from 'firebase/compat/auth/react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
    StyleSheet, Text, TextInput, View, Button
} from 'react-native';
import app from '../../firebase';
import {
    primaryColor, white, black
} from '../../assets/globalStyles';

export default function LandingPage({ navigation }) {
    const [state, setState] = useState({
        email: '',
        emailError: false,
        password: '',
        passwordError: false,
        signedIn: false,
        userNotFoundError: false,
        wrongPasswordError: false
    });

    // const auth = getAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
    const auth = getAuth(app);

    function handleChange(e, name) {
        setState({
            ...state,
            [name]: e,
            emailError: false,
            passwordError: false,
            userNotFoundError: false,
            wrongPasswordError: false
        });
    }

    async function onSubmit(e) {
        let emailError = false;
        let passwordError = false;

        // e.preventDefault();
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
            await signInWithEmailAndPassword(auth, state.email, state.password);
            console.log('sign in successful');

            navigation.navigate('Main App View', {});
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setState({
                    ...state,
                    userNotFoundError: true,
                });
            } else if (error.code === 'auth/wrong-password') {
                setState({
                    ...state,
                    wrongPasswordError: true,
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
                    : null }
                {state.passwordError
                    ? <Text>Password must be at least 6 characters.</Text>
                    : null }
                {state.userNotFoundError
                    ? <Text>There are no existing users with that email.</Text>
                    : null }
                {state.wrongPasswordError
                    ? <Text>That is the incorrect password for that email.</Text>
                    : null }
                <View style={styles.signInButtonWrapper}>
                    <Button
                        style={styles.signInButton}
                        title='Sign In'
                        accessibilityLabel='Sign in button'
                        color={white}
                        onPress={(e) => onSubmit(e)}
                    />
                </View>
                <View style={styles.signUpWrapper}>
                    <Text style={styles.signUpPreText}>
                        Don&apos;t already have an account?
                    </Text>
                    <View style={styles.signUpButtonWrapper}>
                        <Button
                            style={styles.signUpButton}
                            title='Sign Up'
                            accessibilityLabel='Sign up button'
                            color={black}
                            onPress={() => navigation.navigate('Sign-Up Screen', {})}
                        />
                    </View>
                </View>
            </View>
            <Button
                style={styles.signUpButton}
                title='Skip sign in'
                accessibilityLabel='Skip sign in button'
                color={black}
                onPress={() => navigation.navigate('Main App View', {})}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerWrapper: {
        marginBottom: 100
    },
    headerText: {
        fontSize: 40
    },
    inputFormContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    signUpButtonWrapper: {
        margin: 5,
        width: 200,
        backgroundColor: white,
    },
    signUpWrapper: {
        marginTop: 100,
        alignItems: 'center'
    },
    signUpPreText: {
        color: white,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10
    },
    signUpButton: {
        width: 200,
    }
});
