import React from 'react';
import {
    StyleSheet, View, Text, Button
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { white, primaryColor, black } from '../utils/globalStyles';

export default function ChallengeSearch() {
    const navigation = useNavigation();

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
            <Text>Challenge Search</Text>
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
