import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, FlatList, Alert, TextInput, Keyboard, KeyboardAvoidingView } from 'react-native'
import * as firebase from 'firebase'
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const widthScreen = Dimensions.get('window').width;
export default function Home({ route }) {
    const userName = route.params.user
    const [isModalVisible, setModalVisible] = useState(false);
    const [contentPost, setContentPost] = useState('')
    const [userPost, setUserPost] = useState('')
    const [inputComment, setInputComment] = useState('')
    const [dataComments, setDataComments] = useState([])
    console.log(isModalVisible);
    const toggleModal = (content, user, c) => {
        const sync = async () => {
            const db = firebase.firestore();
            await db.collection("poster").where("content", "==", content).where("user", "==", user)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        const cloneData = doc.data().comments
                        setDataComments(cloneData);

                    });
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });
            setContentPost(content)
            setUserPost(user)
            if (c == 2) return
            setModalVisible(!isModalVisible);

        }
        sync();


    };
    const renderComments = ({ item }) => {
        return ((
            <ItemComment comments={item.text} UserComment={item.UserComment} />
        ))
    }
    const ItemComment = ({ comments, UserComment }) => {
        let name = UserComment
        if (UserComment.indexOf("@") !== -1) {
            name = UserComment.substring(0, UserComment.indexOf("@"))
        }
        return (
            <View style={{ flex: 1, width: widthScreen * 0.87, marginLeft: 5, justifyContent: 'center', borderRadius: 7, padding: 10, backgroundColor: 'lightgray', borderColor: 'red', marginBottom: 20, borderWidth: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
                <Text>{comments}</Text>
            </View>
        )
    }
    const renderItem = ({ item }) => {
        return ((
            <Item comments={item.comments} likes={item.likes} user={item.user} dateTime={item.dateTime} content={item.content} />
        ))
    };
    const Item = ({ likes, user, dateTime, content, comments }) => {
        const [allLike, setAllLike] = useState(likes.length);
        let color = 'black'
        if (likes.length > 0) {
            likes.map(item => {
                if (item == userName) {
                    color = 'red'
                }
            })
        }
        const getlRealLike = (params) => {
            if (params == 'red') {
                setAllLike(allLike - 1)
            } else {
                setAllLike(allLike + 1)
            }
        }

        return (
            (
                <View style={styles.item}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }} >{user}</Text>
                    <Text style={{ fontWeight: '100' }} >{dateTime}</Text>
                    <Text style={{ marginTop: 20 }} >{content}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderBottomWidth: 0.3, paddingBottom: 10, borderBottomColor: 'lightgray' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <AntDesign name="like1" size={24} color='blue' />
                            <Text style={{ marginLeft: 5, marginTop: 4 }} >{allLike}</Text>
                        </View>
                        <Text style={{ marginTop: 4 }}  >{comments.length + " bình luận"}</Text>
                    </View>
                    <View style={styles.interactive}>
                        <Like onClick={getlRealLike} status={userName} content={content} user={user} color={color} />
                        <TouchableOpacity onPress={() => toggleModal(content, user)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome5 name="comments" size={24} color='black' />
                            <Text style={{ marginLeft: 5, marginTop: 4 }} >Comment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity

                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <AntDesign name="sharealt" size={24} color='black' />
                            <Text style={{ marginLeft: 5, marginTop: 4 }} >Share</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )
        )
    };

    const [data, setData] = useState([])
    useEffect(() => {
        const request = async () => {
            let fake = []
            const db = firebase.firestore();

            await db.collection("poster").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    fake.push({
                        id: doc.id, content: doc.data().content,
                        time: doc.data().time, dateTime: doc.data().dateTime, user: doc.data().user,
                        likes: doc.data().likes, comments: doc.data().comments
                    })
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
    }, [isModalVisible])
    return (
        <View style={styles.container}>
            <View style={styles.social}>
                <TouchableOpacity style={styles.viewFollow}>
                    <Image
                        style={{ width: 30, height: 30, marginRight: 10 }}
                        source={require('../images/follow.png')}
                    />
                    <Text style={{ fontSize: 20 }}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewShare}>
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
            <Modal
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                animationIn='slideInUp'
                coverScreen={true}
                animationInTiming={1000}
                backdropOpacity={0.5}
                onBackdropPress={() => setModalVisible(false)}
                onSwipeComplete={() => setModalVisible(false)}
                onBackButtonPress={() => {
                    setModalVisible(false)
                }}
                isVisible={isModalVisible}>
                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{
                        width: widthScreen * 0.9, backgroundColor: 'lightblue', borderRadius: 15,
                        justifyContent: 'space-between', flexDirection: 'column', alignItems: 'flex-start',
                        height: "80%"
                    }}
                >
                    <View style={{ backgroundColor: 'lightblue', flex: 0.93, justifyContent: 'center', alignItems: 'center' }}>
                        <FlatList
                            data={dataComments}
                            renderItem={renderComments}
                            keyExtractor={item => item.text}

                        />
                    </View>
                    <View style={{ borderWidth: 2, backgroundColor: 'white', flex: 0.07, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <TextInput
                            onChangeText={(e) => {
                                setInputComment(e)
                            }}
                            placeholderTextColor='red'
                            placeholder="Viết bình luận"
                            style={styles.textInput}
                        />
                        <Ionicons onPress={() => {
                            const sync = async () => {
                                const db = firebase.firestore();
                                await db.collection("poster").where("content", "==", contentPost).where("user", "==", userPost)
                                    .get()
                                    .then(function (querySnapshot) {
                                        querySnapshot.forEach(function (doc) {
                                            // doc.data() is never undefined for query doc snapshots
                                            db.collection("poster").doc(doc.id).update({
                                                comments: firebase.firestore.FieldValue.arrayUnion({ UserComment: userName, text: inputComment })
                                            })
                                        });
                                    })
                                    .catch(function (error) {
                                        console.error("Error adding document: ", error);
                                    });
                                toggleModal(contentPost, userPost, 2);
                            }
                            sync();


                        }} style={{ marginRight: 20 }} name="ios-send" size={24} color="black" />
                    </View>
                </KeyboardAvoidingView>

            </Modal>
        </View >
    )

}


const Like = (props) => {
    const { content, user, color, onClick } = props
    const [state, setState] = useState(color)
    function _pressLike() {
        const db = firebase.firestore();
        if (state == 'black') {

            db.collection("poster").where("content", "==", content).where("user", "==", user)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots

                        db.collection("poster").doc(doc.id).update({
                            likes: firebase.firestore.FieldValue.arrayUnion(props.status)
                        })
                    });
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });
            setState('red')
            onClick('black')

        } else {
            db.collection("poster").where("content", "==", content).where("user", "==", user)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots

                        db.collection("poster").doc(doc.id).update({
                            likes: firebase.firestore.FieldValue.arrayRemove(props.status)
                        })
                    });
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });
            setState('black')
            onClick('red')
        }
    }
    return (
        <TouchableOpacity
            onPress={_pressLike}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <AntDesign name="like2" size={24} color={state} />

            <Text style={{ marginLeft: 5, marginTop: 4, color: state }} >Like</Text>
        </TouchableOpacity>
    )
}

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
    viewContent: { marginTop: 15, backgroundColor: 'white', width: widthScreen, alignItems: 'center', marginBottom: 40 },
    item: {
        width: widthScreen * 0.95,
        marginTop: 10,
        borderTopWidth: 5,
        borderTopColor: 'pink',
        paddingHorizontal: 10

    },
    interactive: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 7
    },
    textInput: { paddingLeft: 20, paddingRight: 10, width: '100%' },
})
