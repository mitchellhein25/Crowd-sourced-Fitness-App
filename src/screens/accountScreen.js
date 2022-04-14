import React, { useState } from 'react';
import {
    StyleSheet, View, Text, Button, Image
} from 'react-native';
import {
    secondaryColorLighter, primaryColor, secondaryColor, white
} from '../../assets/globalStyles';

export default function AccountScreen({ user }) {

    let profilePic = null;
    if (user) {
        if (user.profilePic) {
            profilePic = user.profilePic;
        }
    }

    const [state] = useState({
        email: user ? Object.values(user)[0].email : 'no user logged in',
        firstName: user ? Object.values(user)[0].firstName : 'no user logged in',
        lastName: user ? Object.values(user)[0].lastName : 'no user logged in',
        password: user ? Object.values(user)[0].password : 'no user logged in',
        id: user ? Object.keys(user)[0] : 'no user logged in',
        profilePic,
    });

    const link = 'https://reactnative.dev/img/tiny_logo.png';

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Account</Text>
            </View>
            <View style={styles.accountInfoContainer}>
                <View style={styles.imageContainer}>
                    {state.profilePic
                        ? (
                            <Image
                                source={{
                                    uri: link
                                }}
                            />
                        )
                        : (
                            <Text style={styles.imageText}>
                                Upload Profile Pic
                            </Text>
                        )}
                </View>
                <View style={styles.accountListItem}>
                    <Text style={styles.listItemText}>
                        {state.firstName}
&nbsp;
                        {state.lastName}
                    </Text>
                    <Button
                        style={styles.editButton}
                        title='Edit'
                        accessibilityLabel='Edit name button'
                        color={primaryColor}
                    />
                </View>
                <View style={styles.accountListItem}>
                    <Text style={styles.listItemText}>
                        {state.email}
                    </Text>
                    <Button
                        style={styles.editButton}
                        title='Edit'
                        accessibilityLabel='Edit name button'
                        color={primaryColor}
                    />
                </View>
                <View style={styles.accountListItem}>
                    <Text style={styles.listItemText}>
                        <Text style={styles.listItemTitle}>Password:&nbsp;</Text>
                        {'*'.repeat(state.password.length)}
                    </Text>
                    <Button
                        style={styles.editButton}
                        title='Edit'
                        accessibilityLabel='Edit name button'
                        color={primaryColor}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: white,
        paddingTop: '20%',
    },
    header: {
        fontSize: 30
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '10%'
    },
    accountInfoContainer: {
        width: '100%'
    },
    accountListItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '3%',
        borderColor: secondaryColor,
        borderStyle: 'solid',
        borderTopWidth: 1,
        alignItems: 'center'
    },
    listItemText: {
        fontSize: 15,
    },
    listItemTitle: {
        fontWeight: '700',
        fontSize: 15
    },
    imageContainer: {
        borderRadius: 150,
        borderColor: secondaryColor,
        borderWidth: 1,
        backgroundColor: secondaryColorLighter,
        height: 150,
        width: 150,
        alignSelf: 'center',
        marginBottom: '5%',
        justifyContent: 'center'
    },
    imageText: {
        alignSelf: 'center',
        color: primaryColor
    }
});
