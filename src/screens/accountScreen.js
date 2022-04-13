import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { primaryColor } from '../../assets/globalStyles';

export default function AccountScreen({ user }) {

    const [state] = useState({
        email: user ? Object.values(user)[0].email : 'no user logged in',
        firstName: user ? Object.values(user)[0].firstName : 'no user logged in',
        lastName: user ? Object.values(user)[0].lastName : 'no user logged in',
        password: user ? Object.values(user)[0].password : 'no user logged in',
        id: user ? Object.keys(user)[0] : 'no user logged in',
    });

    return (
        <View style={styles.container}>
            <Text>Account</Text>
            <Text>
                {state.firstName}
&nbsp;
                {state.lastName}
            </Text>
            <Text>
                Password:&nbsp;
                {'*'.repeat(state.password.length)}
            </Text>
            <Text>
                Email:&nbsp;
                {state.email}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: primaryColor
    },
});
