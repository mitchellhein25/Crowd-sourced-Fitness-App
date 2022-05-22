import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, Button, FlatList, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    getDatabase, ref, onValue, query, orderByChild, equalTo
} from 'firebase/database';
import Ionicons from '@expo/vector-icons/Ionicons';
import app from '../../firebase';
import { challengeTypes } from '../utils/challengeTypes';
// import { challengeBadges } from '../utils/challengeBadges';
import { white, primaryColor, secondaryColorDarker } from '../utils/globalStyles';

export default function ChallengeSearch({ user }) {
    const navigation = useNavigation();
    const [state, setState] = useState({
        id: user ? Object.keys(user)[0] : 'no user logged in',
        list: [],
        showList: false
    });

    const getList = () => {
        const db = getDatabase(app);
        const challengesRef = ref(db, 'challenges/');
        const challenge = query(challengesRef);
        const list = [];
        onValue(challenge, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const goalUsersRef = ref(db, 'goalUsers/');
                // Get if the user is active in the challenge
                const challengeUsersRef = ref(db, 'challengeUsers/');
                const challengeUserRecords = query(challengeUsersRef, orderByChild('userIdentifier'), equalTo(state.id));
                const challengeUserRecordsJson = challengeUserRecords.toJSON();

                // Get the goals for the challenge
                const challengeGoalsRef = ref(db, 'challengeGoals/');
                const challengeGoals = query(challengeGoalsRef, orderByChild('challengeIdentifier'), equalTo(childSnapshot.key));
                const goalsList = [];
                onValue(challengeGoals, (snapshot2) => {
                    snapshot2.forEach((childSnapshot2) => {
                        const goalRef = ref(db, `goals/${childSnapshot2.val().goalsIdentifier}/description`);
                        onValue(goalRef, (snapshot3) => {
                            const goalDesc = snapshot3.val();
                            const goalId = childSnapshot2.val().goalsIdentifier;
                            let completed = false;

                            // If the user is in the challenge, get if they have completed the goals
                            if (challengeUserRecordsJson != null) {
                                const goalUser = query(goalUsersRef, orderByChild('goalIdentifier'), equalTo(childSnapshot2.val().goalsIdentifier));
                                onValue(goalUser, (snapshotGoal) => {
                                    snapshotGoal.forEach((childSnapshotGoal) => {
                                        if (childSnapshotGoal.val().userIdentifier === state.id) {
                                            completed = childSnapshotGoal.val().completed;
                                        }
                                    });
                                });
                            }
                            goalsList.push([goalDesc, completed, goalId]);
                        });
                    });
                });
                const challengeTagsRef = ref(db, 'challengeTags/');
                const challengeTags = query(challengeTagsRef, orderByChild('challengeIdentifier'), equalTo(childSnapshot.key));
                const tagsList = [];
                onValue(challengeTags, (snapshot4) => {
                    snapshot4.forEach((childSnapshot4) => {
                        const tagRef = ref(db, `tags/${childSnapshot4.val().tagsIdentifier}/description`);
                        onValue(tagRef, (snapshot5) => {
                            tagsList.push(`#${snapshot5.val()}`);
                        });
                    });
                });
                const challengeBadgesRef = ref(db, 'challengeBadges/');
                const challengeBadges = query(challengeBadgesRef, orderByChild('challengeIdentifier'), equalTo(childSnapshot.key));
                const badgesList = [];
                onValue(challengeBadges, (snapshot6) => {
                    snapshot6.forEach((childSnapshot7) => {
                        const badgeRef = ref(db, `badges/${childSnapshot7.val().badgesIdentifier}/description`);
                        onValue(badgeRef, (snapshot8) => {
                            badgesList.push(snapshot8.val());
                        });
                    });
                });
                list.push({
                    id: childSnapshot.key,
                    description: childSnapshot.val().description,
                    date: childSnapshot.val().date,
                    type: childSnapshot.val().type,
                    goals: goalsList,
                    tags: tagsList,
                    badges: badgesList,
                });
            });
        });
        return list;
    };

    useEffect(() => {
        navigation.addListener('focus', () => {
            setState({
                ...state,
                list: getList()
            });
        });
    }, [state.showList]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Find a Challenge</Text>
            <View style={styles.addNewButtonWrapper}>
                <Button
                    title='Create a New Public Challenge'
                    color={white}
                    accessibilityLabel='Create a New Public Challenge button'
                    onPress={() => navigation.navigate('Add New Challenge', {})}
                />
            </View>
            {state.showList
                ? (
                    <FlatList
                        data={state.list}
                        keyExtractor={(key) => {
                            return key.id;
                        }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.listItemWrapper}
                                key={item.id}
                                onPress={() => navigation.navigate('Challenge Detail', { challenge: item, userId: state.id, user })}
                            >
                                <Text style={styles.description}>{item.description}</Text>
                                <Text style={styles.item}>
                                    <Text style={styles.bold}>Type:&nbsp;</Text>
                                    {challengeTypes.find((x) => x.id === item.type).item}
                                </Text>
                                <Text style={styles.item}>
                                    <Text style={styles.bold}>Goals:&nbsp;</Text>
                                    {item.goals.map((goal, index) => {
                                        return (
                                            <Text key={goal[2]}>
                                                {goal[0]}
                                                {index < item.goals.length - 1 ? ', ' : ''}
                                            </Text>
                                        );
                                    })}
                                </Text>
                                <Text style={styles.item}>
                                    <Text style={styles.bold}>Tags:&nbsp;</Text>
                                    {item.tags.map((tag, index) => {
                                        return (
                                            <Text key={tag}>
                                                {tag}
                                                {index < item.tags.length - 1 ? ', ' : ''}
                                            </Text>
                                        );
                                    })}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <TouchableOpacity
                        style={styles.loadButton}
                        onPress={() => {
                            setState({
                                ...state, showList: true
                            });
                        }}
                    >
                        <Text style={styles.button}>Show Available Challenges</Text>
                        <Ionicons name='arrow-down-outline' color={primaryColor} size={30} style={styles.icon} />
                    </TouchableOpacity>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        marginBottom: 20,
        fontWeight: '500'
    },
    container: {
        flex: 1,
        backgroundColor: white,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '15%'
    },
    addNewButtonWrapper: {
        backgroundColor: primaryColor,
        borderRadius: 30,
        padding: 10,
        marginBottom: 20
    },
    listItemWrapper: {
        padding: 20,
        paddingLeft: 10,
        margin: 10,
        backgroundColor: secondaryColorDarker,
        borderRadius: 10,
        shadowRadius: 1,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 1,
            height: 1
        },
    },
    description: {
        fontSize: 20,
        fontWeight: '500',
        shadowOpacity: 0,
        marginBottom: 10,
        color: white
    },
    bold: {
        fontWeight: '600'
    },
    item: {
        color: white
    },
    icon: {
        alignSelf: 'center'
    },
    loadButton: {
        flex: 1,
        padding: 20
    },
    button: {
        color: primaryColor
    }
});
