import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
    StyleSheet, View, Text, Button, Image, TextInput
} from 'react-native';
import {
    getDatabase, ref as refDatabase, update
} from 'firebase/database';
import {
    getStorage, ref as refStorage, uploadBytes, getDownloadURL
} from 'firebase/storage';
import app from '../../firebase';
import {
    primaryColor, secondaryColor, white
} from '../utils/globalStyles';

export default function AccountScreen({ user }) {

    const [state, setState] = useState({
        email: user ? Object.values(user)[0].email : 'no user logged in',
        firstName: user ? Object.values(user)[0].firstName : 'no user logged in',
        lastName: user ? Object.values(user)[0].lastName : 'no user logged in',
        password: user ? Object.values(user)[0].password : 'no user logged in',
        id: user ? Object.keys(user)[0] : 'no user logged in',
        profilePic: '',
        editFirstName: false,
        editLastName: false,
        editEmail: false,
        editPassword: false
    });

    useEffect(() => {
        async function getImage() {
            if (user) {
                const profileImagePath = await getProfileImage(Object.values(user)[0].profilePic);
                setState({
                    ...state,
                    profilePic: profileImagePath
                });
            }
        }
        getImage();

    }, []);

    // Retrieve profile pic from Firestore
    function getProfileImage(imagePath) {
        const storage = getStorage(app);
        return getDownloadURL(refStorage(storage, imagePath))
            .then((url) => {
                return url;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const pickImage = async () => {
        const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            const permissionRequest = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionRequest.granted) {
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // https://dev.to/emmbyiringiro/upload-image-with-expo-and-firebase-cloud-storage-3481
        // Convert image to blob for Firebase storage
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', result.uri, true);
            xhr.send(null);
        });

        await setState({
            ...state,
            profilePic: result.uri
        });
        try {
            // Save image to Firebase Storage
            const imgName = `img-${new Date().getTime()}`;
            const storage = getStorage(app);
            const imagesRef = refStorage(storage, `images/${imgName}`);
            let imagePath = '';
            await uploadBytes(imagesRef, blob).then((snapshot) => {
                imagePath = snapshot.metadata.fullPath;
            });
            // Save user to databse with new image
            const db = getDatabase(app);
            const userRef = refDatabase(db, `users/${state.id}`);
            update(userRef, {
                email: state.email,
                firstName: state.firstName,
                lastName: state.lastName,
                password: state.password,
                profilePic: imagePath
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e, name) => {
        setState({
            ...state,
            [name]: e,
        });
    };

    const updateAccountInfo = async (e, name) => {
        try {
            const db = getDatabase(app);
            const userRef = refDatabase(db, `users/${state.id}`);
            update(userRef, {
                email: state.email,
                firstName: state.firstName,
                lastName: state.lastName,
                password: state.password,
                profilePic: state.profilePic
            });
            setState({
                ...state,
                [name]: false,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Account</Text>
            </View>
            <View style={styles.accountInfoContainer}>
                <View style={styles.imageContainer}>
                    {state.profilePic !== ''
                        ? (
                            <Image
                                style={styles.image}
                                source={{
                                    uri: state.profilePic
                                }}
                            />
                        )
                        : (
                            <Button
                                style={styles.imageText}
                                title='Upload Picture'
                                accessibilityLabel='Upload profile pic button'
                                color={primaryColor}
                                onPress={pickImage}
                            />
                        )}
                </View>
                {state.profilePic !== ''
                    ? (
                        <Button
                            style={styles.imageText}
                            title='Change Picture'
                            accessibilityLabel='Change Picture button'
                            color={primaryColor}
                            onPress={pickImage}
                        />
                    ) : null}
                {state.editFirstName
                    ? (
                        <View style={styles.accountListItem}>
                            <TextInput
                                style={styles.textInput}
                                value={state.firstName}
                                onChangeText={(e) => handleChange(e, 'firstName')}
                            />
                            <Button
                                style={styles.editButton}
                                title='Save'
                                accessibilityLabel='Save first name button'
                                color={primaryColor}
                                onPress={(e) => updateAccountInfo(e, 'editFirstName')}
                            />
                        </View>
                    )
                    : (
                        <View style={styles.accountListItem}>
                            <Text style={styles.listItemText}>
                                {state.firstName}
                            </Text>
                            <Button
                                style={styles.editButton}
                                title='Edit'
                                accessibilityLabel='Edit first name button'
                                color={primaryColor}
                                onPress={() => {
                                    setState({
                                        ...state,
                                        editFirstName: !state.editFirstName
                                    });
                                }}
                            />
                        </View>
                    )}
                {state.editLastName
                    ? (
                        <View style={styles.accountListItem}>
                            <TextInput
                                style={styles.textInput}
                                value={state.lastName}
                                onChangeText={(e) => handleChange(e, 'lastName')}
                            />
                            <Button
                                style={styles.editButton}
                                title='Save'
                                accessibilityLabel='Save last name button'
                                color={primaryColor}
                                onPress={(e) => updateAccountInfo(e, 'editLastName')}
                            />
                        </View>
                    )
                    : (
                        <View style={styles.accountListItem}>
                            <Text style={styles.listItemText}>
                                {state.lastName}
                            </Text>
                            <Button
                                style={styles.editButton}
                                title='Edit'
                                accessibilityLabel='Edit last name button'
                                color={primaryColor}
                                onPress={() => {
                                    setState({
                                        ...state,
                                        editLastName: !state.editLastName
                                    });
                                }}
                            />
                        </View>
                    )}
                {state.editEmail
                    ? (
                        <View style={styles.accountListItem}>
                            <TextInput
                                style={styles.textInput}
                                value={state.email}
                                onChangeText={(e) => handleChange(e, 'email')}
                            />
                            <Button
                                style={styles.editButton}
                                title='Save'
                                accessibilityLabel='Save email button'
                                color={primaryColor}
                                onPress={(e) => updateAccountInfo(e, 'editEmail')}
                            />
                        </View>
                    )
                    : (
                        <View style={styles.accountListItem}>
                            <Text style={styles.listItemText}>
                                {state.email}
                            </Text>
                            <Button
                                style={styles.editButton}
                                title='Edit'
                                accessibilityLabel='Edit email button'
                                color={primaryColor}
                                onPress={() => {
                                    setState({
                                        ...state,
                                        editEmail: !state.editEmail
                                    });
                                }}
                            />
                        </View>
                    )}
                {state.editPassword
                    ? (
                        <View style={styles.accountListItem}>
                            <TextInput
                                style={styles.textInput}
                                value={state.password}
                                onChangeText={(e) => handleChange(e, 'password')}
                            />
                            <Button
                                style={styles.editButton}
                                title='Save'
                                accessibilityLabel='Save password button'
                                color={primaryColor}
                                onPress={(e) => updateAccountInfo(e, 'editPassword')}
                            />
                        </View>
                    )
                    : (
                        <View style={styles.accountListItem}>
                            <Text style={styles.listItemText}>
                                {'*'.repeat(state.password.length)}
                            </Text>
                            <Button
                                style={styles.password}
                                title='Edit'
                                accessibilityLabel='Edit password button'
                                color={primaryColor}
                                onPress={() => {
                                    setState({
                                        ...state,
                                        editPassword: !state.editPassword
                                    });
                                }}
                            />
                        </View>
                    )}
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
        alignItems: 'center',
        paddingLeft: 30
    },
    listItemText: {
        fontSize: 15,
    },
    textInput: {
        color: primaryColor,
        borderWidth: 1,
        padding: '5%',
        borderRadius: 20,
        borderColor: secondaryColor,
    },
    // listItemTitle: {
    //    fontWeight: '700',
    //    fontSize: 15
    // },
    imageContainer: {
        borderWidth: 1,
        borderColor: secondaryColor,
        borderRadius: 150,
        height: 150,
        width: 150,
        alignSelf: 'center',
        marginBottom: '5%',
        justifyContent: 'center',
    },
    imageText: {
        alignSelf: 'center',
        color: primaryColor,
    },
    image: {
        borderRadius: 150,
        height: 150,
        width: 150,
        resizeMode: 'cover'
    }
});
