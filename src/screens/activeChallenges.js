import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { white } from '../../assets/globalStyles';

export default function ActiveChallenges() {
    return (
        <View style={styles.container}>
            <Text>Active Challenges</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: white,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
