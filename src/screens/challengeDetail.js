import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, Button, Image, TouchableOpacity
} from 'react-native';
import {
    getDatabase, ref, get, equalTo, query, orderByChild, push
} from 'firebase/database';
import Ionicons from '@expo/vector-icons/Ionicons';
import app from '../../firebase';
import { challengeTypes } from '../utils/challengeTypes';
import { challengeBadges } from '../utils/challengeBadges';
import { white, black, primaryColor } from '../utils/globalStyles';

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
                <Text style={styles.bold}>Goals:</Text>
                {challenge.goals.map((goal) => {
                    return (
                        <Text style={styles.detail} key={goal}>
                            {'\n'}
                            {goal}
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
        fontSize: 25,
        textAlign: 'left',
        alignItems: 'flex-start',
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    detail: {
        fontSize: 22,
    },
    buttonWrapper: {
        width: 150,
        alignSelf: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 30,
        padding: 8,
        alignItems: 'center',
        backgroundColor: black
    },
    backButtonWrapper: {
        margin: 5,
        width: 150,
        backgroundColor: black,
        borderRadius: 30,
        alignSelf: 'center',
        padding: 8,
        alignItems: 'center'
    },
    badgeImage: {
        height: 50,
        width: 50
    },
    buttonText: {
        fontSize: 20,
        alignSelf: 'center',
        paddingLeft: 10,
        color: white
    },
    backButtonText: {
        fontSize: 20,
        alignSelf: 'center',
        color: white,
        paddingLeft: 10
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    active: {
        fontSize: 18,
        color: primaryColor,
        marginTop: 15,
        width: '100%',
        textAlign: 'center'
    },
    activeRow: {
        display: 'flex',
        flexDirection: 'row',
        width: '50%',
        alignSelf: 'center',
    },
});
