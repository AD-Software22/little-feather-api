import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

const serviceAccount = require('./firebase-secret.json');

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'babyapp-dbbc5.appspot.com', // Replace with your actual storage bucket name
};

admin.initializeApp(firebaseConfig);

export default router;
