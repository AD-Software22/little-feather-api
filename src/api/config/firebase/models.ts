import * as admin from 'firebase-admin'

const userCollection = admin.firestore().collection('User')
const babyCollection = admin.firestore().collection('Baby')

export { userCollection, babyCollection }
