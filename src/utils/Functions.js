import firestore from '@react-native-firebase/firestore'

export const addUser = async (newUser)  => {
    const existingUser = await firestore().collection('Users').doc(newUser?.uid).get()
    if (!existingUser?._data?._id){
        await firestore().collection('Users').doc(newUser.uid).set({
            _id: newUser?.uid,
            displayName: newUser?.displayName,
            email: newUser?.email,
            currentStage: 'AddInfo'
        }, {merge: true})
    }
}

export const updateUser = async (newUser)  => {
    console.log('updated', newUser)
    await firestore().collection('Users').doc(newUser._id).set({
        ...newUser
    }, {merge: true})
}