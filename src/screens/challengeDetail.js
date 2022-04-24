import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, Button
} from 'react-native';
import {
    getDatabase, ref, get, equalTo, query, orderByChild, push
} from 'firebase/database';
import app from '../../firebase';
// import { useNavigation } from '@react-navigation/native';
import { challengeTypes } from '../utils/challengeTypes';
import { challengeBadges } from '../utils/challengeBadges';
import { white, black } from '../utils/globalStyles';

export default function ChallengeDetail({ route }) {
    // const navigation = useNavigation();
    const [state, setState] = useState({
        isActiveForUser: false
    });
    const { challenge, userId } = route.params ? route.params : {};
    const db = getDatabase(app);

    const getIfActive = async () => {
        const challengeUsersRef = ref(db, 'challengeUsers/');
        const challengeUserRecords = await get(query(challengeUsersRef, orderByChild('userIdentifier'), equalTo(userId)));
        const challengeUserRecordsJson = challengeUserRecords.toJSON();
        Object.keys(challengeUserRecordsJson).forEach((key) => {
            if (challengeUserRecordsJson[key].challengeIdentifier === challenge.id) {
                setState({
                    ...state,
                    isActiveForUser: true
                });
            }
        });
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
                    <Text style={styles.item}>
                        You are actively participating in this challenge!
                    </Text>
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
        width: '80%',
        alignSelf: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 20
    }
});
