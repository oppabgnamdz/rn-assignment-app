import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Button, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import Modal from 'react-native-modal';
import * as firebase from 'firebase'
import * as Facebook from 'expo-facebook';
import Post from './Post'
import UserScreen from './UserScreen/UserScreen'

export default function Login({ navigation }) {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
        'display': 'popup'
    });
    const [isModalVisible, setModalVisible] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const toggleModal = () => {
        setModalVisible(!isModalVisible);

    };
    const inputEmailAdress = (e) => {
        setEmailAddress(e)
    }
    const inputPassword = (e) => {
        setPassword(e)
    }
    const _signIn = () => {
        const db = firebase.firestore()
        const check = [];
        const loginAdmin = async () => {
            await db.collection("AdminUsers").where("UserName", "==", emailAddress).where("Password", "==", password)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshotsßß
                        navigation.navigate('Post', {
                            emailAddress: emailAddress,
                            password: password
                        })
                        check.push({ id: doc.id, data: doc.data() })
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);

                });
            if (check.length == 0) {
                firebase.auth().signInWithEmailAndPassword(emailAddress, password).
                    then(() => {
                        navigation.navigate(UserScreen)
                    })

                    .catch(function (error) {
                        Alert.alert('Thông tin đăng nhập không đúng')
                    });
            }
        }
        loginAdmin();



    }
    const modalSignUp = () => {
        if (emailAddress.includes('@') && password.length >= 6) {
            firebase.auth().createUserWithEmailAndPassword(emailAddress, password)
                .then(() => {
                    Alert.alert('Đăng ký thành công')
                    toggleModal();
                    setEmailAddress('')
                    setPassword('')

                }).catch(error => {
                    try {
                        if (error.code === 'auth/email-already-in-use') {
                            Alert.alert('Tài khoản đã tồn tại')
                        }

                        if (error.code === 'auth/invalid-email') {
                            Alert.alert('Tài khoản không hợp lệ')
                        }
                    } catch (e) {
                        console.log(e)
                    }




                })
        } else {
            Alert.alert('Điều kiện đăng ký không hợp lệ')

        }


    }
    const signInFacebook = () => {
        async function logIn() {
            try {
                await Facebook.initializeAsync({ appId: '348594869837335' });
                const {
                    type,
                    token,
                    expires,
                    permissions,
                    declinedPermissions,
                } = await Facebook.logInWithReadPermissionsAsync({
                    permissions: ['public_profile'],
                });
                if (type === 'success') {
                    // Get the user's name using Facebook's Graph API
                    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                    // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
                    navigation.navigate(UserScreen)
                } else {
                    // type === 'cancel'
                }
            } catch ({ message }) {
                alert(`Facebook Login Error: ${message}`);
            }
        }
        logIn();
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* view welcome */}
                <View style={styles.welcome}>
                    <Text style={{ fontSize: 20 }}>WELCOME</Text>
                </View>
                {/* view camera  */}
                <View style={styles.camera}>
                    <Image
                        style={{ width: 50, height: 50 }}
                        source={require('./images/camera.png')}
                    />
                    <Text style={{ fontSize: 15 }}>Your Photo</Text>
                </View>
                {/* view form */}
                <View style={{ marginTop: 20 }}>
                    <View style={styles.viewTextInPut}>
                        <Image
                            style={{ height: 30, width: 40, opacity: 0.7 }}
                            source={require('./images/email.png')}
                        />
                        <TextInput onChangeText={inputEmailAdress} style={styles.textInput} placeholder='Email-address' />
                    </View>
                    <View style={{ marginTop: 10, ...styles.viewTextInPut }}>
                        <Image
                            style={{ height: 40, width: 40, opacity: 0.7 }}
                            source={require('./images/padlock.png')}
                        />
                        <TextInput onChangeText={inputPassword} style={styles.textInput} placeholder='Password' keyboardType='default' secureTextEntry={true} />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity
                            onPress={_signIn}
                            style={styles.signIn}
                            styleDisabled={{ color: 'red' }}
                        >
                            <Text style={{ textAlign: 'center' }}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                    {/* view sign in sign up nomal  */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 }}>
                        <Text onPress={toggleModal}>Don't have an account?</Text>
                        <Text onPress={toggleModal} style={{ color: '#0b933b' }}>Sign up</Text>
                        <Modal
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            animationIn='slideInUp'
                            coverScreen={true}
                            animationInTiming={2000}
                            backdropOpacity={0.5}
                            onBackdropPress={() => setModalVisible(false)}
                            onSwipeComplete={() => setModalVisible(false)}
                            onBackButtonPress={() => {
                                setModalVisible(false)
                            }}
                            isVisible={isModalVisible}>
                            <View style={{ height: 300, width: '80%', backgroundColor: 'lightblue', borderRadius: 15, justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                <View style={styles.viewTextInPut}>
                                    <Image
                                        style={{ height: 30, width: 40, opacity: 0.7 }}
                                        source={require('./images/email.png')}
                                    />
                                    <TextInput onChangeText={inputEmailAdress} style={styles.textInput} placeholder='Email-address' placeholderTextColor="#000" />
                                </View>
                                <View style={{ marginTop: 10, ...styles.viewTextInPut }}>
                                    <Image
                                        style={{ height: 40, width: 40, opacity: 0.7 }}
                                        source={require('./images/padlock.png')}
                                    />
                                    <TextInput onChangeText={inputPassword} style={styles.textInput} placeholder='Password' placeholderTextColor="red" keyboardType='default' secureTextEntry={true} />
                                </View>

                                <TouchableOpacity
                                    onPress={modalSignUp}
                                    style={styles.modalSignUp}
                                    styleDisabled={{ color: 'red' }}
                                >
                                    <Text style={{ textAlign: 'center' }}>Sign up</Text>
                                </TouchableOpacity>

                            </View>
                        </Modal>

                    </View>
                    {/* sign in with facebook  */}
                    <View style={styles.facebookLogin}>
                        <TouchableOpacity
                            onPress={signInFacebook}
                            style={{ padding: 20 }} >
                            <Text style={{ color: 'white' }}>Đăng nhập bằng facebook</Text>
                        </TouchableOpacity>
                    </View>



                </View>
            </ScrollView>
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', alignItems: 'center', },
    welcome: { flex: 0.2, height: 50, justifyContent: 'center', alignItems: 'center' },
    camera: { backgroundColor: '#eff1f9', alignItems: 'center', padding: 20, borderRadius: 100 },
    viewTextInPut: { height: 50, flexDirection: "row", alignItems: 'center', borderColor: 'gray', borderWidth: 1, width: 250, padding: 10 },
    textInput: { height: 40, paddingLeft: 10, width: 200, paddingRight: 10 },
    signIn: { fontSize: 20, color: 'black', backgroundColor: '#80f28d', height: 40, padding: 6, justifyContent: 'center' },
    modalSignUp: { fontSize: 20, color: 'black', backgroundColor: '#80f28d', height: 40, width: '70%', borderRadius: 5, padding: 6, justifyContent: 'center', marginTop: 10 },
    facebookLogin: {
        marginTop: 20,
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#1d7fe8',
        borderRadius: 10


    }
})
