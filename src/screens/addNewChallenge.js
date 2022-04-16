import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';
import {
    StyleSheet, Text, TextInput, View, Button, Picker
} from 'react-native';
import app from '../../firebase';
import {
    primaryColor, white, black, accentColor
} from '../utils/globalStyles';
// import { challengeTypes } from '../../src/utils/challengeTypes';

export default function AddNewChallenge() {
    const [selectedLanguage, setSelectedLanguage] = useState();
    const navigation = useNavigation();

    const [state, setState] = useState({
        type: '',
        emailError: false,
        password: '',
        passwordError: false,
        firstName: '',
        lastName: '',
        emailAlreadyUsedError: false,
        emptyFieldError: '',
        signUpSuccessful: false
    });

    function handleChange(e, name) {
        setState({
            ...state,
            [name]: e,
            emailError: false,
            passwordError: false,
            emailAlreadyUsedError: false,
            emptyFieldError: false
        });
    }

    async function onSubmit() {
        let emailError = false;
        let passwordError = false;
        let emptyFieldError = false;

        if (state.email === '' || state.password === '' || state.firstName === '' || state.lastName === '') {
            emptyFieldError = true;
            setState({
                ...state,
                emptyFieldError
            });
            return;
        }
        // Validate Email address
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i;
        if (!emailRegex.test(state.email)) {
            emailError = true;
        }
        if (state.password.length < 6) {
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
            // Insert a user into the User's database
            const db = getDatabase(app);
            const usersRef = ref(db, 'users/');
            push(usersRef, {
                email: state.email,
                firstName: state.firstName,
                lastName: state.lastName,
                password: state.password,
                profilePic: ''
            });
            setState({
                ...state,
                signUpSuccessful: true,
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.inputFormContainer}>
            <View style={styles.headerWrapper}>
                <Text style={styles.headerText}>Create a New Public Challenge</Text>
            </View>
            {state.signUpSuccessful
                ? (
                    <View style={styles.accountCreatedContainer}>
                        <Text style={styles.accountCreated}>Account successfully created.</Text>
                        <View style={styles.backToSignInButtonWrapper}>
                            <Button
                                style={styles.backToSignInButton}
                                title='Back to sign in page'
                                accessibilityLabel='Back to sign in button'
                                color={white}
                                onPress={() => navigation.goBack()}
                            />
                        </View>
                    </View>
                )
                : (
                    <View style={styles.signInFields}>
                        <Picker
                            selectedValue={selectedLanguage}
                            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                            style={styles.pickerStyle}
                        >
                            <Picker.Item label="--- Select ---" value="" />
                            {/* There is a bug related to mapping with a picker unfortunately: */}
                            {/* https://github.com/GeekyAnts/NativeBase/issues/983 */}
                            {/* {challengeKeys.map((type) => { */}
                            {/*    console.log(challengeTypes[type]) */}
                            {/*    return <Picker.Item label={challengeTypes[type].name}
                             * value={challengeTypes[type].id} key={challengeTypes[type].id} /> */}
                            {/*    })}; */}
                        </Picker>
                        {/* </View> */}
                        <View style={styles.textInputWrapper}>
                            <TextInput
                                style={styles.textInput}
                                placeholder='First Name'
                                value={state.firstName}
                                onChangeText={(e) => handleChange(e, 'firstName')}
                            />
                        </View>
                        <View style={styles.textInputWrapper}>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Last Name'
                                value={state.lastName}
                                onChangeText={(e) => handleChange(e, 'lastName')}
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
                        {state.emptyFieldError
                            ? <Text>Please fill out all fields.</Text>
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
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerWrapper: {
        marginTop: 100,
        marginBottom: 100
    },
    headerText: {
        fontSize: 40,
        textAlign: 'center'
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
    },
    accountCreated: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 20
    },
    backToSignInButtonWrapper: {
        margin: 5,
        width: 200,
        backgroundColor: accentColor,
    },
    accountCreatedContainer: {
        alignItems: 'center'
    },
    pickerStyle: {
        width: '100%'
    }
});
