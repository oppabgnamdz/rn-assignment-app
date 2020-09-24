import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import * as firebase from 'firebase'
import { AntDesign } from '@expo/vector-icons';

const db = firebase.firestore();
const widthScreen = Dimensions.get('window').width;

const fakeData = [
    {
        id: "1",
        user: 'Nam dep troai',
        dateTime: ' 22-12-2012',
        content: "nam ngnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsu ngocs",
        totalLike: 100,
        totalComment: 10

    },
    {
        id: "5",
        user: 'Nam dep troai',
        dateTime: ' 22-12-2012',
        content: "nam ngnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsu ngocs",
        totalLike: 100,
        totalComment: 10

    },
    {
        id: "6",
        user: 'Nam dep troai',
        dateTime: ' 22-12-2012',
        content: "nam ngnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsnam ngu ngocsu ngocs",
        totalLike: 100,
        totalComment: 10

    },
    {
        id: "7",
        user: 'Nam xau trai',
        dateTime: ' 22-10-2020',
        content: "Toi la sinh vien",
        totalLike: 95,
        totalComment: 56

    },
    {
        id: "3",
        user: 'Viet nam',
        dateTime: ' 12-12-2019',
        content: "youtube.com",
        totalLike: 23,
        totalComment: 11

    },
]
export default function Home() {
    const renderItem = ({ item }) => {
        return ((
            <Item user={item.user} dateTime={item.dateTime} content={item.content} totalLike={item.totalLike} totalComment={item.totalComment} />
        ))
    };
    const [data, setData] = useState([])

    useEffect(() => {
        const request = async () => {
            let fake = []
            await db.collection("poster").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    fake.push({ id: doc.id, content: doc.data().content, time: doc.data().time, dateTime: doc.data().dateTime, user: doc.data().user })
                });
            });
            const sort = (data) => {
                data.sort((a, b) => {
                    return b.time - a.time
                })
            }
            sort(fake);
            setData(fake)
        }
        request();
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.social}>
                <TouchableOpacity onPress={() => { console.log('ahihi') }} style={styles.viewFollow}>
                    <Image
                        style={{ width: 30, height: 30, marginRight: 10 }}
                        source={require('../images/follow.png')}
                    />
                    <Text style={{ fontSize: 20 }}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { console.log('bhihi') }} style={styles.viewShare}>
                    <Image
                        style={{ width: 30, height: 30, marginRight: 10 }}
                        source={require('../images/share.png')}
                    />
                    <Text style={{ fontSize: 20 }}>Share</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.viewContent}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    )
}
const Item = ({ user, dateTime, content, totalLike, totalComment }) => {

    return (
        (
            <View style={styles.item}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }} >{user}</Text>
                <Text style={{ fontWeight: '100' }} >{dateTime}</Text>
                <Text >{content}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <AntDesign name="like1" size={24} color="blue" />
                        <Text style={{ marginLeft: 5, marginTop: 4 }} >{totalLike}</Text>
                    </View>
                    <Text style={{ marginTop: 4 }}  >{totalComment + " bình luận"}</Text>
                </View>
            </View>
        )
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

    },
    social: {
        width: widthScreen * 0.95,
        flexDirection: 'row',
        backgroundColor: 'lightgreen'

    },
    viewFollow: { flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', borderRightWidth: 1, },
    viewShare: { flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' },
    viewContent: { marginTop: 15, backgroundColor: 'white', width: widthScreen, alignItems: 'center' },
    item: {
        width: widthScreen * 0.95,
        marginTop: 10,
        borderTopWidth: 5,
        borderTopColor: 'pink',
        paddingHorizontal: 10

    }
})
