import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function header() {
const back = () => {
navigation.goBack()
}
return (
<View Style = {styles.header}>
<MaterialCommunityIcons name = 'skip-backward' size ={28} onPress = {back} style = {styles.icon}/>

<View>
<Text style ={styles.headerText}></Text>
</View>
</View>
);
}

const styles = StyleSheet.create({
header:{
width: "100%",
height: "100%",
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
backgroundColor: 'grey',
},
headerText: {
fontSize:20,
color: '#333',
letterSpacing: 1,

}


})