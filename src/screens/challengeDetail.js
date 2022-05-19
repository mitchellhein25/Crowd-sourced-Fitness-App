import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, Button, Pressable, TouchableOpacity, Image
} from 'react-native';
import {
    getDatabase, ref, get, equalTo, query, orderByChild, push
} from 'firebase/database';
import Ionicons from '@expo/vector-icons/Ionicons';
import app from '../../firebase';
import { challengeTypes } from '../utils/challengeTypes';
import { challengeBadges } from '../utils/challengeBadges';
import {
    white, black, red, green
} from '../utils/globalStyles';

export default function ChallengeDetail({ route, navigation }) {
    const [state, setState] = useState({
        isActiveForUser: false,
    });
    const { challenge, userId, user } = route.params ? route.params : {};
    const db = getDatabase(app);

    const getIfActive = async () => {
        const challengeUsersRef = ref(db, 'challengeUsers/');
        const challengeUserRecords = await get(query(challengeUsersRef, orderByChild('userIdentifier'), equalTo(userId)));
        const challengeUserRecordsJson = challengeUserRecords.toJSON();
        if (challengeUserRecordsJson != null) {
            Object.keys(challengeUserRecordsJson).forEach((key) => {
                if (challengeUserRecordsJson[key].challengeIdentifier === challenge.id) {
                    setState({
                        ...state,
                        isActiveForUser: true
                    });
                }
            });
        }
    };

    const toChat = () => {

        navigation.navigate('Chat Screen', { user, challenge });
    };

    const addToActive = () => {
        try {
            const challengeUsersRef = ref(db, 'challengeUsers/');
            push(challengeUsersRef, {
                challengeIdentifier: challenge.id,
                userIdentifier: userId
            });
            setState({
                ...state,
                isActiveForUser: true
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getCompletedGoals = (challengeGoals) => {
        let goalsCompleted = 0;
        for (let i = 0; i < challengeGoals.length; i += 1) {
            if (challengeGoals[i].completed === true) {
                goalsCompleted += 1;
            }
        }
        return goalsCompleted;
    };

    useEffect(() => {
        getIfActive();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.backButtonWrapper}>
                <TouchableOpacity style={styles.row} onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back-outline' color={white} size={30} />
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.description}>{challenge.description}</Text>
            <Text style={styles.item}>
                <Text style={styles.bold}>Type:</Text>
                <Text style={styles.detail}>
                    {'\n'}
                    {challengeTypes.find((x) => x.id === challenge.type).item}
                </Text>
            </Text>
            <Text style={styles.item}>
                <Text style={styles.bold}>Goals</Text>
                {'\n'}
                <Text style={styles.completedGoals}>
                    Completed:
                    { getCompletedGoals(challenge.goals) }
                    /
                    { challenge.goals.length }
                </Text>
                {challenge.goals.map((goal) => {
                    return (
                        <Text style={styles.detail} key={goal}>
                            {'\n'}
                            {goal.description}
                            <Pressable style={styles.markGoalCompletePressable}>
                                <Text style={(goal.completed === true)
                                    ? styles.completeButton2
                                    : styles.completeButton1}
                                >
                                    Complete
                                </Text>
                            </Pressable>
                        </Text>
                    );
                })}
            </Text>
            <Text style={styles.item}>
                <Text style={styles.bold}>Badges:</Text>
                {challenge.badges.map((badge) => {
                    return (
                        <Text style={styles.detail} key={badge}>
                            {'\n'}
                            {challengeBadges.find((x) => x.id === badge).item}
                            <Image
                                style={styles.badgeImage}
                                source={challengeBadges.find((x) => x.id === badge).image}
                            />
                        </Text>
                    );
                })}
            </Text>
            <Text style={styles.item}>
                <Text style={styles.bold}>Tags:</Text>
                {challenge.tags.map((tag) => {
                    return (
                        <Text style={styles.detail} key={tag}>
                            {'\n'}
                            {tag}
                        </Text>
                    );
                })}
            </Text>
            {state.isActiveForUser
                ? (
                    <View style={styles.activeRow}>
                        <Text style={styles.active}>
                            You are actively participating in this challenge!
                        </Text>
                    </View>
                )
                : (
                    <View style={styles.buttonWrapper}>
                        <Button
                            title='Join this Challenge'
                            color={black}
                            accessibilityLabel='Join this Challenge button'
                            onPress={() => { addToActive(); }}
                        />
                    </View>
                )}
            {state.isActiveForUser
                ? (
                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity style={styles.row} onPress={() => { toChat(); }}>
                            <Ionicons name='chatbubble-ellipses-outline' color={white} size={30} />
                            <Text style={styles.buttonText}>Chat</Text>
                        </TouchableOpacity>
                    </View>
                )
                : null}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: white,
        justifyContent: 'flex-start',
        paddingTop: '15%',
        padding: 20
    },
    description: {
        fontSize: 30,
        fontWeight: '500',
    },
    bold: {
        fontWeight: '500',
    },
    item: {
        fontSize: 20,
        textAlign: 'left',
        alignItems: 'flex-start',
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    detail: {
        fontSize: 22,
    },
    completeButton1: {
        color: red,
        fontSize: 18
    },
    completeButton2: {
        color: green,
        fontSize: 18
    },
    completedGoals: {
        fontSize: 20
    }
});
