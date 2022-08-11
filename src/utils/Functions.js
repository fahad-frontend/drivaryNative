import firestore from '@react-native-firebase/firestore'

export const addUser = async (newUser)  => {
    const existingUser = await firestore().collection('Users').doc(newUser?.uid).get()
    if (!existingUser?._data?._id){
        await firestore().collection('Users').doc(newUser.uid).set({
            _id: newUser?.uid,
            name: newUser?.displayName,
            email: newUser?.email,
            currentStage: 'AddInfo'
        }, {merge: true})
    }
}

export const updateUser = async (newUser)  => {
    await firestore().collection('Users').doc(newUser.uid).set({
        ...newUser
    }, {merge: true})
}