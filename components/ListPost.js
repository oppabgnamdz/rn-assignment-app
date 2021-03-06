import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, FlatList, Image } from 'react-native'
import * as firebase from 'firebase'

const db = firebase.firestore();
const screenWidth = Dimensions.get('window').width;
export default function ListPost({ route, navigation }) {
    const emailAddress = route.params.emailAddress;
    console.log(emailAddress + "list post")
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Login')
                    }}
                >
                    <Text style={{ fontSize: 20, marginLeft: 10 }}>Log out</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity

                    onPress={() => {
                        navigation.navigate('UserScreen', {
                            emailAddress: emailAddress,
                        })
                    }}
                >
                    <Image
                        style={{ width: 30, height: 30, marginHorizontal: 10 }}
                        source={require('./images/add.png')}
                    />
                </TouchableOpacity>
            ),

        })
        const getData = async () => {
            const fakeData = []
            const fakeDataFollowers = []

            await db.collection("poster").where("user", "==", emailAddress).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    fakeData.push({ id: doc.id, content: doc.data().content, time: doc.data().time, dateTime: doc.data().dateTime })
                });
            });
            await db.collection("notifications").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.data().listDevice.map(a => {
                        fakeDataFollowers.push(a)
                    })
                });
            });
            const sort = (data) => {
                data.sort((a, b) => {
                    return b.time - a.time
                })
            }
            sort(fakeData);
            sort(fakeDataFollowers)

            setData(fakeData)
            setDataFollowers(fakeDataFollowers)
        }
        getData();
    }, [])
    const [state, setState] = useState(true)
    const [data, setData] = useState([])
    const [dataFollowers, setDataFollowers] = useState([])
    const toggle1 = state ? { ...styles.touchable, backgroundColor: 'red' } : styles.touchable;
    const toggle2 = state ? styles.touchable : { ...styles.touchable, backgroundColor: 'red' };
    const buttonClick1 = () => {
        if (state) setState(!state)
    }
    const buttonClick2 = () => {
        if (!state) setState(!state)
    }
    const renderItem = ({ item }) => {
        return ((
            <Item content={item.content} dateTime={item.dateTime} />
        ))
    };
    const renderItemFollower = ({ item }) => {
        return ((
            <View style={styles.item}>
                <Text>{item}</Text>
            </View>
        ))
    };

    const Render = () => {
        if (state) {
            return (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            )
        } else {
            return (
                <FlatList
                    data={dataFollowers}
                    renderItem={renderItemFollower}
                    keyExtractor={item => item.id}
                />
            )
        }

    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.control}>
                <TouchableOpacity onPress={buttonClick2} style={toggle1}><Text style={styles.textStyle}>Posts</Text></TouchableOpacity>
                <TouchableOpacity onPress={buttonClick1} style={toggle2}><Text style={styles.textStyle}>Followers</Text></TouchableOpacity>
            </View>
            <View style={styles.listview}>
                <Render />
            </View>
        </SafeAreaView >
    )
}
const Item = ({ content, dateTime }) => {

    return (
        (
            <View style={styles.item}>
                <Text style={styles.title}>{content}</Text>
                <Text style={styles.time}>{dateTime}</Text>
            </View>
        )
    )
};



const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', alignItems: 'center', },
    control: { width: screenWidth * 0.9, flexDirection: 'row', },
    touchable: { flex: 1, backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
    textStyle: { fontSize: 20, textAlign: 'center' },
    listview: { marginTop: 10, marginHorizontal: 20, width: screenWidth * 0.9 },
    item: {
        backgroundColor: '#F345',
        padding: 10,
        marginVertical: 8,
        borderRadius: 20
    },
    title: {
        fontSize: 20,
    },
    time: { textAlign: 'right' }
})
