import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, FlatList, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    getDatabase, ref, onValue, query, orderByChild, equalTo, orderByKey
} from 'firebase/database';
import Ionicons from '@expo/vector-icons/Ionicons';
import app from '../../firebase';
import { challengeTypes } from '../utils/challengeTypes';
import { white, primaryColor, secondaryColorDarker } from '../utils/globalStyles';

export default function ActiveChallenges({ user }) {
    const navigation = useNavigation();
    const [state, setState] = useState({
        id: user ? Object.keys(user)[0] : 'no user logged in',
        list: [],
        showList: false
    });

    const getList = () => {
        const db = getDatabase(app);
        const challengeUsersRef = ref(db, 'challengeUsers/');
        const userChallenges = query(challengeUsersRef, orderByChild('userIdentifier'), equalTo(state.id));
        const challengesList = [];
        onValue(userChallenges, (snapshot0) => {
            snapshot0.forEach((childSnapshot0) => {
                const challengesRef = ref(db, 'challenges/');
                const challengeIdentifier = childSnapshot0.val().challengeIdentifier;
                const challenges = query(challengesRef, orderByKey(), equalTo(challengeIdentifier));
                onValue(challenges, (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        const challengeGoalsRef = ref(db, 'challengeGoals/');
                        const challengeGoals = query(challengeGoalsRef, orderByChild('challengeIdentifier'), equalTo(childSnapshot.key));
                        const goalsList = [];
                        onValue(challengeGoals, (snapshot2) => {
                            snapshot2.forEach((childSnapshot2) => {
                                const goalUsersRef = ref(db, 'goalUsers/');
                                const goalUsers = query(goalUsersRef, orderByChild('goalIdentifier'), equalTo(childSnapshot2.val().goalsIdentifier));
                                onValue(goalUsers, (snapshot3) => {
                                    snapshot3.forEach((childSnapshot3) => {
                                        if (childSnapshot3.val().userIdentifier === state.id) {
                                            const goalVariables = {
                                                completed: childSnapshot3.val().completed
                                            };
                                            const goalRef = ref(db, `goals/${childSnapshot3.val().goalIdentifier}/description`);
                                            onValue(goalRef, (snapshot3) => {
                                                goalVariables.description = snapshot3.val();
                                                goalsList.push(goalVariables);
                                            });
                                        }
                                    });
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
                        let alreadyInArray = false;
                        challengesList.forEach((challenge) => {
                            if (challenge.id === childSnapshot.key) {
                                alreadyInArray = true;
                            }
                        });
                        if (alreadyInArray === false) {
                            challengesList.push({
                                id: childSnapshot.key,
                                description: childSnapshot.val().description,
                                date: childSnapshot.val().date,
                                type: childSnapshot.val().type,
                                goals: goalsList,
                                tags: tagsList,
                                badges: badgesList,
                            });
                        }
                    });
                });
            });
        });
        return challengesList;
    };

    useEffect(() => {
        setState({
            ...state,
            list: getList()
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Active Challenges</Text>
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
                                {/* <Text style={styles.item}> */}
                                {/*    Created: */}
                                {/*    {item.date} */}
                                {/* </Text> */}
                                <Text style={styles.item}>
                                    <Text style={styles.bold}>Goals:&nbsp;</Text>
                                    {item.goals.map((goal, index) => {
                                        return (
                                            <Text key={goal}>
                                                {goal.description}
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
                    <TouchableOpacity onPress={() => setState({ ...state, showList: true })}>
                        <Text style={styles.button}>Show Active Challenges</Text>
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
    button: {
        color: primaryColor
    }
});
