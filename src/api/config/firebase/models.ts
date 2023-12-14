import * as admin from 'firebase-admin'

const userCollection = admin.firestore().collection('User')
const babyCollection = admin.firestore().collection('Baby')
const userBabyCollection = admin.firestore().collection('UserBaby')
const postCollection = admin.firestore().collection('Post')
const fileReferenceCollection = admin.firestore().collection('FileReference')

export { userCollection, babyCollection, userBabyCollection, postCollection, fileReferenceCollection }
