/* eslint-disable no-empty-pattern */
import React, {
    useEffect,
    useCallback,
    useState,
    useLayoutEffect
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Button,
    TextInput
} from 'react-native';
import {
    getDatabase,
    ref,
    onValue,
    query,
    orderByChild,
    equalTo,
    orderByKey,
    push
} from 'firebase/database';
import { Avatar } from 'react-native-elements';
import { signOut } from 'firebase/auth';
import { GiftedChat } from 'react-native-gifted-chat';
import { useNavigation } from '@react-navigation/native';
import { white, black } from '../utils/globalStyles';
import app, { auth, db } from '../../firebase';

function Chat({ route }) {
    const { user, userId } = route.params ? route.params : {};
    const u = Object.values(user)[0];
    console.log('user', user);
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState();
    const signOutNow = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigation.replace('Login');
        }).catch((error) => {
            // An error happened.
        });
    };
    useLayoutEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerLeft: () => (
                // eslint-disable-next-line react-native/no-inline-styles
                <
                View style = {
                    { marginLeft: 20 }
                } >
                <
                Avatar rounded source = {
                    {
                        uri: auth ? .currentUser ? .photoURL,
                    }
                }
                /> < /
                View >
            ),
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => ( <
                TouchableOpacity
                // eslint-disable-next-line react-native/no-inline-styles
                style = {
                    {
                        marginRight: 10
                    }
                }
                onPress = { signOutNow } >
                <
                Text > logout < /Text> < /
                TouchableOpacity >
            )
        });
    }, [navigation]);

    useEffect(() => {
        const db = getDatabase(app);
        const messagesRef = ref(db, 'messages/');
        const mes = query(messagesRef, orderByChild('date'));
        const challengesList = [];
        onValue(mes, (snapshot0) => {
            const list = [];
            snapshot0.forEach((childSnapshot0) => {

                const v = childSnapshot0.val();
                list.push(v);
            });
            //            let keys = Object.keys(snapshot0);
            //            let list = keys.map((key)=>snapshot0[key])
            setMessages(list);
            console.log('list2222', list);
        });
        // setMessages(messages);
    }, []);
    const onSend = () => {
        // Insert a challenge into the Challenges database
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}Z`;
        const db = getDatabase(app);
        const messagesRef = ref(db, 'messages/');
        //        setContent(JSON.stringify(user));
        const mes = {
            content,
            user: u.email,
            username: u.firstName,
            date: formattedDate
        };

        const message = push(messagesRef, mes);

        messages.push(mes);
        setMessages([...messages]);
        setContent('');
    };

    return ( <
        View style = { styles.container } >
        <
        View style = { styles.backButtonWrapper } >
        <
        Button style = { styles.backToSignInButton }
        title = 'Go Back'
        color = { white }
        onPress = {
            () => navigation.goBack()
        }
        />

        <
        /View>

        {
            messages.map((message, i) => {
                return ( <
                    View key = { i }
                    style = { styles.chatWrapper } >
                    <
                    Text style = { styles.username } > { message.username } < /Text> <
                    Text style = { styles.content } > { message.content } < /Text> < /
                    View >
                );
            })
        }

        <
        View style = { styles.bottomContainer } >
        <
        TextInput style = { styles.goalInput }
        value = { content }
        onChangeText = {
            (e) => {
                setContent(e);
            }
        }
        />

        <
        View style = { styles.sendButtonWrapper } >
        <
        Button style = { styles.sendButton }
        title = 'Send'
        color = { white }
        onPress = {
            () => onSend()
        }
        />

        <
        /View>

        <
        /View>

        <
        /View>

    );
}

export default Chat;
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
        justifyContent: 'flex-start',
        paddingTop: '15%',
        padding: 20
    },
    sendButtonWrapper: {
        height: 40,
        width: 100,
        backgroundColor: black,
        color: white
    },
    backButtonWrapper: {
        margin: 50,
        width: 200,
        backgroundColor: black
    },
    goalInput: {
        backgroundColor: '#aaaaaa',
        flex: 1,
        height: 40,

        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 5,
        borderRadius: 5,
        flexDirection: 'row'
    },
    chatWrapper: {

        flexDirection: 'row',
        backgroundColor: '#ddddff',
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    username: {
        color: '#666666',
        marginRight: 10
    },
    content: {
        color: '#000000'
    },

});