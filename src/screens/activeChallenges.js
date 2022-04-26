import React from 'react';
import { StyleSheet, View, Text,Button } from 'react-native';
import { white } from '../utils/globalStyles';

export default function ActiveChallenges() {
    return (
        <View style={styles.container}>
        <Button
                      style={styles.backToSignInButton}
                      title='Back'
                      color={white}
                      onPress={() => navigation.goBack()}
                       />
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
     buttonWrapper: {
            width: '80%',
            alignSelf: 'center',
            marginTop: 20,
            borderWidth: 1,
            borderRadius: 20
        }
});
