import React from 'react';
import {
    StyleSheet, View, Text
} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { challengeTypes } from '../utils/challengeTypes';
import { challengeBadges } from '../utils/challengeBadges';
import { white } from '../utils/globalStyles';

export default function ChallengeDetail({ route }) {
    // const navigation = useNavigation();
    const { challenge } = route.params ? route.params : {};

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
});
