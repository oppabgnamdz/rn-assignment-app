import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, Platform, Dimensions, Keyboard, TouchableOpacity, Alert } from 'react-native'
import * as firebase from 'firebase'
const screenWidth = Dimensions.get('window').width;
// const db = firebase.firestore();
export default function Post({ route, navigation }) {
    const [areaText, setAreaText] = useState('');
    const emailAddress = route.params.emailAddress;
    async function sendPushNotification(expoPushToken) {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Original Title',
            body: areaText,
            data: { data: 'goes here' },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

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
    async function confirm() {
        const arr = []

        if (areaText.length == 0) return Alert.alert('Nội dung không để trống')
        const time = new Date();
        function convert() {
            const date = time.getDate().toString() + "/" + time.getMonth().toString() + "/" + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()
            return date
        }
        console.log(time.toString())
        const db = firebase.firestore()
        await db.collection("poster").add({
            content: areaText,
            time: Date.parse(time),
            dateTime: convert(),
            user: emailAddress,
            likes: [],
            comments: []
        })
            .then(function (docRef) {
                Alert.alert("Thêm thành công")
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
        const pushData = async () => {
            await db.collection("notifications").get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data().listDevice);
                    doc.data().listDevice.map((a) => {
                        arr.push(a)
                    })
                });
            });
            console.log(arr)
            arr.map((a) => {
                sendPushNotification(a)
            })
        }
        pushData();
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
                    onPress={

                        async () => {
                           confirm();
                        }}
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


