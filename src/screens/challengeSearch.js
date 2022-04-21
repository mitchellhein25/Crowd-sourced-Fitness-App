import React, { useState } from 'react';
import {
    StyleSheet, View, Text, Button, FlatList, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    getDatabase, ref, onValue, query, orderByChild, equalTo
} from 'firebase/database';
import app from '../../firebase';
import { challengeTypes } from '../utils/challengeTypes';
// import { challengeBadges } from '../utils/challengeBadges';
import { white, primaryColor, accentColor } from '../utils/globalStyles';

export default function ChallengeSearch({ user }) {
    const navigation = useNavigation();
    const [state] = useState({
        id: user ? Object.keys(user)[0] : 'no user logged in',
    });

    const getList = () => {
        const db = getDatabase(app);
        const challengesRef = ref(db, 'challenges/');
        const challenge = query(challengesRef);
        const list = [];
        onValue(challenge, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const challengeGoalsRef = ref(db, 'challengeGoals/');
                const challengeGoals = query(challengeGoalsRef, orderByChild('challengeIdentifier'), equalTo(childSnapshot.key));
                const goalsList = [];
                onValue(challengeGoals, (snapshot2) => {
                    snapshot2.forEach((childSnapshot2) => {
                        const goalRef = ref(db, `goals/${childSnapshot2.val().goalsIdentifier}/description`);
                        onValue(goalRef, (snapshot3) => {
                            goalsList.push(snapshot3.val());
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
        // setState({
        //    ...state,
        //    challengeList: list
        // });
    };

    // useEffect(() => {
    // }, []);

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
            <FlatList
                data={getList()}
                keyExtractor={(key) => {
                    return key.id;
                }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.listItemWrapper}
                        key={item.id}
                        onPress={() => navigation.navigate('Challenge Detail', { challenge: item, userId: state.id })}
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
                                        {goal}
                                        {index < item.goals.length - 1 ? ', ' : ''}
                                    </Text>
                                );
                            })}
                        </Text>
                        {/* <Text style={styles.item}> */}
                        {/*    Badges:&nbsp; */}
                        {/*    {item.badges.map((badge, index) => { */}
                        {/*        return ( */}
                        {/*            <Text key={badge}> */}
                        {/*                {challengeBadges.find((x) => x.id === badge).item} */}
                        {/*                {index < item.badges.length - 1 ? ', ' : ''} */}
                        {/*            </Text> */}
                        {/*        ); */}
                        {/*    })} */}
                        {/* </Text> */}
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
        // shadowColor: black,
        // shadowOffset: {
        //    width: 1,
        //    height: 1
        // },
        // shadowOpacity: 0.75,
        // shadowRadius: 3,
        marginBottom: 20
    },
    listItemWrapper: {
        padding: 20,
        paddingLeft: 10,
        margin: 10,
        backgroundColor: accentColor,
        // borderWidth: 1,
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
    }
});
