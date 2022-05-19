import React, {
    useEffect, useState
} from 'react';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity
} from 'react-native';
// import {
//    getStorage, ref as refStorage, getDownloadURL
// } from 'firebase/storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    getDatabase, ref, onValue, query, orderByChild, push
} from 'firebase/database';
// import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import {
    white, black, accentColor, secondaryColorDarker, secondaryColorLighter
} from '../utils/globalStyles';
import app from '../../firebase';

export default function Chat({ route }) {
    const { user, challenge } = route.params ? route.params : {};
    // console.log(user);
    // console.log(Object.keys(user)[0]);
    const userObject = Object.values(user)[0];
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState();
    // const [profilePic, setProfilePic] = useState();

    // Retrieve profile pic from Firestore
    // function getProfileImage(imagePath) {
    //    const storage = getStorage(app);
    //    return getDownloadURL(refStorage(storage, imagePath))
    //        .then((url) => {
    //            return url;
    //        })
    //        .catch((error) => {
    //            console.log(error);
    //        });
    // }

    useEffect(() => {
        // async function getImage() {
        //    if (user) {
        //        const profileImagePath = await getProfileImage(Object.values(user)[0].profilePic);
        //        setProfilePic(profileImagePath);
        //    }
        // }
        // getImage();

        const db = getDatabase(app);
        const messagesRef = ref(db, 'messages/');
        const mes = query(messagesRef, orderByChild('date'));
        onValue(mes, (snapshot0) => {
            const list = [];
            snapshot0.forEach((childSnapshot0) => {

                const mes = childSnapshot0.val();
                if (mes.challengeId === challenge.id) {
                    list.push(mes);
                }
            });
            setMessages(list);

        });
    }, []);
    const onSend = () => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}Z`;
        const db = getDatabase(app);
        const messagesRef = ref(db, 'messages/');
        const mes = {
            content,
            userFirstName: userObject.firstName,
            userId: Object.keys(user)[0],
            date: formattedDate,
            challengeId: challenge.id,
            profilePic: userObject.profilePic
        };

        push(messagesRef, mes);
        messages.push(mes);
        setMessages([...messages]);
        setContent('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.backButtonWrapper}>
                <TouchableOpacity style={styles.row} onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back-outline' color={white} size={30} />
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>

            {
                messages.map((message, i) => {
                    return (
                        <View
                            key={i}
                            style={message.userId === Object.keys(user)[0]
                                ? styles.chatWrapperAccent
                                : styles.chatWrapperWhite}
                        >
                            {/* <View> */}
                            {/*    {message.profilePic === '' */}
                            {/*        ? <View style={styles.imageContainer} /> */}
                            {/*        : ( */}
                            {/*            <Avatar */}
                            {/*                rounded */}
                            {/*                source={{ */}
                            {/*                    uri: message.profilePic */}
                            {/*                }} */}
                            {/*            /> */}
                            {/*        )} */}
                            {/* </View> */}
                            <Text style={message.userId === Object.keys(user)[0]
                                ? styles.usernameWhite
                                : styles.usernameAccent}
                            >
                                {message.userFirstName}
                            </Text>
                            <Text style={styles.content}>{message.content}</Text>
                        </View>
                    );
                })
            }

            <View style={styles.bottomContainer}>
                <TextInput
                    style={styles.input}
                    value={content}
                    onChangeText={(e) => {
                        setContent(e);
                    }}
                />

                <View style={styles.sendButtonWrapper}>
                    <TouchableOpacity style={styles.row} onPress={() => onSend()}>
                        {/* <Ionicons name='arrow-back-outline' color={white} size={30} /> */}
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: white,
        justifyContent: 'flex-start',
        paddingTop: '15%',
        padding: 20
    },
    bottomContainer: {
        height: 100,
        flexDirection: 'row',
        backgroundColor: white,
        justifyContent: 'center',
        padding: 20
    },
    sendButtonWrapper: {
        margin: 5,
        width: 100,
        backgroundColor: black,
        borderRadius: 30,
        alignSelf: 'center',
        padding: 8,
        alignItems: 'center',
        height: 45
    },
    backButtonWrapper: {
        margin: 5,
        width: 150,
        backgroundColor: black,
        borderRadius: 30,
        alignSelf: 'center',
        padding: 8,
        alignItems: 'center'
    },
    backButtonText: {
        fontSize: 20,
        alignSelf: 'center',
        color: white,
        paddingLeft: 10
    },
    sendButtonText: {
        fontSize: 20,
        alignSelf: 'center',
        color: white,
        textAlignVertical: 'center'
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    input: {
        backgroundColor: secondaryColorDarker,
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
        flexDirection: 'row',
        marginTop: 11
    },
    chatWrapperAccent: {
        flexDirection: 'row',
        backgroundColor: accentColor,
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    chatWrapperWhite: {
        flexDirection: 'row',
        backgroundColor: secondaryColorLighter,
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    usernameWhite: {
        color: white,
        marginRight: 10
    },
    usernameAccent: {
        color: accentColor,
        marginRight: 10
    },
    content: {
        color: black
    },
    // imageContainer: {
    //    borderWidth: 1,
    //    borderColor: secondaryColor,
    //    backgroundColor: secondaryColor,
    //    borderRadius: 35,
    //    height: 35,
    //    width: 35,
    //    alignSelf: 'center',
    //    justifyContent: 'center',
    // },
});
