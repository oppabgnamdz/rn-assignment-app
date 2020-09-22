import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, FlatList } from 'react-native'
import * as firebase from 'firebase'

const db = firebase.firestore();
const screenWidth = Dimensions.get('window').width;
export default function ListPost() {
    useEffect(() => {
        // const getData = async () => {
        //     const fakeData = []
        //     await db.collection("poster").get().then((querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //             fakeData.push({ id: doc.id, content: doc.data().content })
        //         });
        //     });
        //     setData(fakeData)
        // }
        // getData();
        // console.log(data)
    }, [])
    const [state, setState] = useState(true)
    const [data, setData] = useState([])
    const toggle1 = state ? { ...styles.touchable, backgroundColor: 'red' } : styles.touchable;
    const toggle2 = state ? styles.touchable : { ...styles.touchable, backgroundColor: 'red' };
    const buttonClick1 = () => {
        if (state) setState(!state)
    }
    const buttonClick2 = () => {
        if (!state) setState(!state)
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.control}>
                <TouchableOpacity onPress={buttonClick2} style={toggle1}><Text style={styles.textStyle}>Posts</Text></TouchableOpacity>
                <TouchableOpacity onPress={buttonClick1} style={toggle2}><Text style={styles.textStyle}>Fllowers</Text></TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', alignItems: 'center', },
    control: { width: screenWidth * 0.9, flexDirection: 'row', },
    touchable: { flex: 1, backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
    textStyle: { fontSize: 20, textAlign: 'center' }
})
