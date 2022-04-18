import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, Button, FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    getDatabase, ref, onValue, query, orderByChild
} from 'firebase/database';
import app from '../../firebase';
// import { challengeTypes } from '../utils/challengeTypes';
import { white, primaryColor, black } from '../utils/globalStyles';

export default function ChallengeSearch() {
    const navigation = useNavigation();
    const [state, setState] = useState({
        challengeList: []
    });

    useEffect(() => {
        const db = getDatabase(app);
        const challengesRef = ref(db, 'challenges/');
        const challenge = query(challengesRef, orderByChild('date'));
        const list = [];
        onValue(challenge, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                list.push({
                    id: childSnapshot.key,
                    description: childSnapshot.val().description,
                    date: childSnapshot.val().date,
                    type: childSnapshot.val().type,
                });
            });
        });
        setState({
            ...state,
            challengeList: list
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.addNewButtonWrapper}>
                <Button
                    title='Create a New Public Challenge'
                    color={white}
                    accessibilityLabel='Create a New Public Challenge button'
                    onPress={() => navigation.navigate('Add New Challenge', {})}
                />
            </View>
            <FlatList
                data={state.challengeList}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.item}>{item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
        shadowColor: black,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.75,
        shadowRadius: 3
    }
});
