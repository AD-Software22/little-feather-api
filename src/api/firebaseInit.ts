import express from 'express'
import admin from 'firebase-admin'
require('dotenv').config()

const router = express.Router()
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS ?? '') ?? ''
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
}

admin.initializeApp(firebaseConfig)

export default router
