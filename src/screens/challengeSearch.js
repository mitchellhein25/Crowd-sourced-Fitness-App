import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { white } from '../../assets/globalStyles';

export default function ChallengeSearch() {
    return (
        <View style={styles.container}>
            <Text>Challenge Search</Text>
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
