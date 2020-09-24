import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, Platform, Dimensions, Keyboard, TouchableOpacity, Alert } from 'react-native'
import * as firebase from 'firebase'
const screenWidth = Dimensions.get('window').width;
// const db = firebase.firestore();
export default function Post({ route, navigation }) {
    const [areaText, setAreaText] = useState('');
    const emailAddress = route.params.emailAddress;
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('ListPost', { emailAddress: emailAddress })
                    }}
                >
                    <Text style={{ fontSize: 20, marginLeft: 10 }}>Cancel</Text>
                </TouchableOpacity>
            ),
        })

    }, [])
    const areaContent = (e) => {
        setAreaText(e)
    }
    const confirm = () => {
        if (areaText.length == 0) return Alert.alert('Nội dung không để trống')
        const time = new Date();
        function convert() {
            const date = time.getDate().toString() + "/" + time.getMonth().toString() + "/" + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()
            return date
        }
        console.log(time.toString())
        const db = firebase.firestore()
        db.collection("poster").add({
            content: areaText,
            time: Date.parse(time),
            dateTime: convert(),
            user: emailAddress,
            likes: []
        })
            .then(function (docRef) {
                Alert.alert("Thêm thành công")
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }
    return (
        <View style={Platform.OS == 'ios' ? { ...styles.container, marginTop: 50 } : styles.container}>
            <View style={styles.area}>
                <TextInput
                    onChangeText={areaContent}
                    autoCompleteType='email'
                    placeholder='Điền nội dung vào đây'
                    style={styles.textInput}
                    multiline={true}
                    returnKeyType='done'
                    onSubmitEditing={Keyboard.dismiss}
                    enablesReturnKeyAutomatically={true}


                />
                <TouchableOpacity
                    style={styles.confirm}
                    onPress={confirm}
                >
                    <Text style={{ textAlign: 'center' }}>
                        Xác nhận
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 10,
    },
    area: {

    },
    textInput: { height: 200, color: 'black', borderRadius: 10, paddingLeft: 10, width: screenWidth * 0.9, paddingRight: 10, backgroundColor: 'lightblue' },
    confirm: { alignSelf: 'flex-end', marginTop: 20, borderRadius: 20, fontSize: 20, width: 100, color: 'black', backgroundColor: '#80f28d', height: 40, padding: 6, justifyContent: 'center' },
});
