// services/userService.js

const admin = require('firebase-admin');

// Function to add a user
export const addUser = async (uid:any, userData:any) => {
  try {
    const userRef = admin.firestore().collection('users');
    const newUserDoc = await userRef.add({
      uid: uid,
      ...userData,
    });
    return newUserDoc;
  } catch (error) {
    throw error;
  }
};

// Function to get a user by UID
export const getUserByUID = async (uid:any) => {
  try {
    const usersRef = admin.firestore().collection('users');
    const querySnapshot = await usersRef.where('uid', '==', uid).get();

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0].data();
      return userDoc;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};
