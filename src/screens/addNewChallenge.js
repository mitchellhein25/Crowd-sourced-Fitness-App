import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import SelectBox from 'react-native-multi-selectbox';
import TagInput from 'react-native-tags-input';
import { xorBy } from 'lodash';
import {
    StyleSheet, Text, TextInput, View, Button
} from 'react-native';
import app from '../../firebase';
import {
    white, black, primaryColor
} from '../utils/globalStyles';
import { challengeTypes } from '../utils/challengeTypes';
import { challengeBadges } from '../utils/challengeBadges';

export default function AddNewChallenge() {
    const navigation = useNavigation();
    const [state, setState] = useState({
        description: '',
        goalsInput: '',
        goals: [],
        tags: {
            tag: '',
            tagsArray: []
        },
        successfulCreation: false,
        emptyFieldError: false
    });
    const [badges, setBadges] = useState([]);
    const [type, setType] = useState({});

    function handleChange(e, name) {
        setState({
            ...state,
            [name]: e,
            emptyFieldError: false
        });
    }

    function pushToRelationshipTable(name, challengeKey, db) {
        let list;
        switch (name) {
        case 'tags':
            list = state.tags.tagsArray;
            break;
        case 'goals':
            list = state.goals;
            break;
        case 'badges':
            list = badges;
            break;
        default:
            break;
        }
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        const reference = ref(db, `${name}/`);
        list.forEach((item) => {
            let itemVal = item;
            if (name === 'badges') {
                itemVal = item.id;
            }
            const link = push(reference, {
                description: itemVal,
            });
            const key = link.key;
            const relationshipRef = ref(db, `challenge${capitalizedName}/`);
            push(relationshipRef, {
                challengeIdentifier: challengeKey,
                [`${name}Identifier`]: key,
            });
        });
    }

    async function onSubmit() {

        if (state.tags.tagsArray === [] || state.goals === [] || badges === []
            || state.description === '' || type === {}) {
            state.emptyFieldError = true;
            return;
        }

        try {
            // Insert a challenge into the Challenges database
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}Z`;
            const db = getDatabase(app);
            const challengesRef = ref(db, 'challenges/');
            const challenge = push(challengesRef, {
                description: state.description,
                type: type.id,
                date: formattedDate
            });
            const challengeKey = challenge.key;
            pushToRelationshipTable('goals', challengeKey, db);
            pushToRelationshipTable('tags', challengeKey, db);
            pushToRelationshipTable('badges', challengeKey, db);
            setState({
                ...state,
                successfulCreation: true,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function addGoal() {
        const goal = state.goals;
        if (state.goalsInput !== '') {
            goal.push(state.goalsInput);
        }
        await setState({
            ...state,
            goals: goal,
            goalsInput: ''
        });
    }

    function onMultiChange() {
        return (item) => setBadges(xorBy(badges, [item], 'id'));
    }

    function onChange() {
        return (val) => setType(val);
    }

    return (
        // <KeyboardAvoidingView behavior='height' style={styles.container}>
        <View style={styles.inputFormContainer}>
            <View style={styles.headerWrapper}>
                <Text style={styles.headerText}>Create a New Public Challenge</Text>
            </View>
            {state.successfulCreation
                ? (
                    <View style={styles.accountCreatedContainer}>
                        <Text style={styles.accountCreated}>
                            Challenge successfully created.
                        </Text>
                        <View style={styles.backToLastButtonWrapper}>
                            <Button
                                style={styles.backToLastButton}
                                title='Back to Challenge Search Page.'
                                accessibilityLabel='Back to Challenge Search Page button'
                                color={black}
                                onPress={() => navigation.goBack()}
                            />
                        </View>
                    </View>
                )
                : (
                    <View style={styles.signInFields}>
                        <Text style={styles.labelText}>Type:</Text>
                        <SelectBox
                            labelStyle={styles.selectBoxLabelStyle}
                            options={challengeTypes}
                            value={type}
                            onChange={onChange()}
                            hideInputFilter={false}
                            width='90%'
                        />
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
                                    style={styles.goalInput}
                                    value={state.goalsInput}
                                    onChangeText={(e) => handleChange(e, 'goalsInput')}
                                />
                                <View style={styles.goalButtonWrapper}>
                                    <Button
                                        title='Add Goal'
                                        accessibilityLabel='Add goal button'
                                        color={black}
                                        onPress={() => { addGoal(); }}
                                    />
                                </View>
                            </View>
                            <View>
                                {state.goals.map((goal, index) => {
                                    return (
                                        <Text style={styles.goalText} key={index}>
                                            {goal}
                                        </Text>
                                    );
                                })}
                            </View>
                        </View>
                        <View style={styles.inputLabelWrapper}>
                            <Text style={styles.labelText}>Badges:</Text>
                            <SelectBox
                                style={styles.badgeSelectBox}
                                labelStyle={styles.selectBoxLabelStyle}
                                options={challengeBadges}
                                selectedValues={badges}
                                onMultiSelect={onMultiChange()}
                                onTapClose={onMultiChange()}
                                width='90%'
                                isMulti
                            />
                        </View>
                        <View style={styles.inputLabelWrapper}>
                            <Text style={styles.labelText}>Tags:</Text>
                            <View style={styles.tagInputWrapper}>
                                <TagInput
                                    updateState={(e) => { setState({ ...state, tags: e }); }}
                                    tags={state.tags}
                                    label='Press space to add a tag'
                                    labelStyle={styles.tagInputLabelStyle}
                                    inputContainerStyle={styles.tagInputContainerStyle}
                                    autoCorrect={false}
                                    tagStyle={styles.tag}
                                />
                            </View>
                        </View>
                        {state.emptyFieldError
                            ? <Text style={styles.errorText}>Please fill out all fields.</Text>
                            : null }
                        <View style={styles.createChallengeButtonWrapper}>
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
        // </KeyboardAvoidingView>
    );
}

const lightGreyColor = '#f2f2f2';
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
    goalInput: {
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
    tagInputWrapper: {
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tag: {
        backgroundColor: white
    },
    inputLabelWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    signInFields: {
        width: '100%',
        alignItems: 'center',
    },
    createChallengeButtonWrapper: {
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
    accountCreatedContainer: {
        alignItems: 'center'
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
    },
    selectBoxLabelStyle: {
        display: 'none'
    },
    tagInputLabelStyle: {
        color: black,
        paddingBottom: 10
    },
    tagInputContainerStyle: {
        backgroundColor: lightGreyColor
    },
    errorText: {
        color: primaryColor
    }
});
