import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import {
    StyleSheet, Text, TextInput, View, Button
} from 'react-native';
import app from '../../firebase';
import {
    white, black, accentColor
} from '../utils/globalStyles';
import { challengeTypes } from '../utils/challengeTypes';

export default function AddNewChallenge() {
    const navigation = useNavigation();
    const [state, setState] = useState({
        type: '',
        description: '',
        goalInput: '',
        goals: []
    });

    function handleChange(e, name) {
        setState({
            ...state,
            [name]: e,
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

    const getPickerItem = (item) => {
        return (
            <Picker.Item
                label={challengeTypes[item].name}
                value={challengeTypes[item].id}
                key={challengeTypes[item].id}
            />
        );
    };

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
                        <Text style={styles.labelText}>Type:</Text>
                        <Picker
                            selectedValue={state.type}
                            onValueChange={(e) => handleChange(e, 'type')}
                            style={styles.pickerStyle}
                        >
                            <Picker.Item label='--- Select ---' value='' />
                            {getPickerItem('WeightLifting')}
                            {getPickerItem('Running')}
                            {getPickerItem('HIIT')}
                            {getPickerItem('Yoga')}
                            {getPickerItem('Cycling')}
                            {getPickerItem('Rowing')}
                            {getPickerItem('Nutrition')}
                            {getPickerItem('Weightloss')}
                            {/* There is a bug related to mapping with a picker unfortunately: */}
                            {/* https://github.com/GeekyAnts/NativeBase/issues/983 */}
                            {/* {challengeKeys.map((type) => { */}
                            {/*    console.log(challengeTypes[type]) */}
                            {/*    return <Picker.Item label={challengeTypes[type].name}
                             * value={challengeTypes[type].id} key={challengeTypes[type].id} /> */}
                            {/*    })}; */}
                        </Picker>
                        <View style={styles.inputLabelWrapper}>
                            <Text style={styles.labelText}>Description:</Text>
                            <View style={styles.descriptionInputWrapper}>
                                <TextInput
                                    style={styles.descriptionTextInput}
                                    value={state.description}
                                    onChangeText={(e) => handleChange(e, 'description')}
                                />
                            </View>
                        </View>
                        <View style={styles.inputLabelWrapper}>
                            <Text style={styles.labelText}>Goals:</Text>
                            <View style={styles.goalInputWrapper}>
                                <TextInput
                                    style={styles.goalTextInput}
                                    value={state.goalInput}
                                    onChangeText={(e) => handleChange(e, 'goalInput')}
                                />
                                <View style={styles.goalButtonWrapper}>
                                    <Button
                                        title='Add Goal'
                                        accessibilityLabel='Add goal button'
                                        color={black}
                                        onPress={() => {
                                            const goals = state.goals;
                                            if (state.goalInput !== '') {
                                                goals.push(state.goalInput);
                                            }
                                            setState({
                                                ...state,
                                                goals,
                                                goalInput: ''
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                            <View>
                                {state.goals.map((goal) => {
                                    return (<Text style={styles.goalText}>{goal}</Text>);
                                })}
                            </View>
                        </View>
                        <View style={styles.signInButtonWrapper}>
                            <Button
                                title='Create Challenge'
                                accessibilityLabel='Create Challenge button'
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
        marginTop: 100
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
        backgroundColor: white
    },
    descriptionTextInput: {
        display: 'flex',
        textAlign: 'left',
        alignContent: 'flex-start',
        padding: 0,
        height: '100%',
        width: '100%',
        borderWidth: 2,
        borderRadius: 5,
        fontSize: 15
    },
    goalTextInput: {
        display: 'flex',
        textAlign: 'left',
        padding: 0,
        height: '100%',
        width: '60%',
        borderWidth: 2,
        borderRadius: 5,
        fontSize: 15,
    },
    descriptionInputWrapper: {
        backgroundColor: white,
        width: '90%',
        height: 80,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 5,
        borderRadius: 5,
    },
    goalInputWrapper: {
        backgroundColor: white,
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 5,
        borderRadius: 5,
        flexDirection: 'row'
    },
    inputLabelWrapper: {
        width: '100%',
        alignItems: 'center',
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
    goalButtonWrapper: {
        width: '30%',
        height: 40
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
        flex: 1
    },
    accountCreatedContainer: {
        alignItems: 'center'
    },
    pickerStyle: {
        width: '100%',
        backgroundColor: white,
        margin: 0,
        padding: 0
    },
    labelText: {
        fontSize: 25,
        margin: 0,
        paddingLeft: 20,
        textAlign: 'left',
        width: '100%'
    },
    goalText: {
        fontSize: 20
    }
});
