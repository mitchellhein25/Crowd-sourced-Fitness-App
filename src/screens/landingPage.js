import React, { useState } from 'react';
import {
    getDatabase, ref, get, equalTo, query, orderByChild
} from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
    StyleSheet, Text, TextInput, View, Button
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import app from '../../firebase';
import {
    primaryColor, white, black, secondaryColorDarker
} from '../utils/globalStyles';

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

    const auth = getAuth(app);
    const db = getDatabase();

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

    async function onSubmit() {
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
            // Sign user in with Firebase Auth
            await signInWithEmailAndPassword(auth, state.email, state.password);
            // If successful, look the user up in the user database
            const usersRef = ref(db, 'users/');
            const user = await get(query(usersRef, orderByChild('email'), equalTo(state.email)));
            const userObject = user.toJSON();
            navigation.navigate('Main App View', { user: userObject });
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
                <Ionicons name='barbell-outline' color={black} size={200} style={styles.icon} />
            </View>
            <View style={styles.signInFields}>
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Email'
                        placeholderTextColor={secondaryColorDarker}
                        value={state.email}
                        onChangeText={(e) => handleChange(e, 'email')}
                    />
                </View>
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Password'
                        placeholderTextColor={secondaryColorDarker}
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
            {/* <Button */}
            {/*    style={styles.signUpButton} */}
            {/*    title='Skip sign in' */}
            {/*    accessibilityLabel='Skip sign in button' */}
            {/*    color={black} */}
            {/*    onPress={() => navigation.navigate('Main App View', {})} */}
            {/* /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    headerWrapper: {
        // marginBottom: 100
    },
    headerText: {
        fontSize: 40
    },
    icon: {
        alignSelf: 'center'
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
