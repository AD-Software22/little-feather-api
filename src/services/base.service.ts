import admin = require('firebase-admin')
import st = require('@google-cloud/storage')

export const deleteDocumentFromCollection = async (
  collection: admin.firestore.CollectionReference,
  field: string,
  value: string
) => {
  const querySnapshot = await collection.where(field, '==', value).get()

  const deletePromises = querySnapshot.docs.map((doc: any) => doc.ref.delete())

  await Promise.all(deletePromises)
}
export const getDocumentsByFieldAndValue = async (
  collection: admin.firestore.CollectionReference,
  fieldName: string,
  fieldValues: string[]
) => {
  try {
    if (fieldValues.length === 0) return null

    const querySnapshot = await collection
      .where(fieldName, 'in', fieldValues)
      .get()

    const documents: any = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      documents.push({
        id: doc.id,
        ...data,
      })
    })

    console.log('Documents retrieved successfully:', documents)
    return documents
  } catch (error) {
    console.error('Error getting documents:', error)
    return null
  }
}
export const deleteDocumentsByFieldAndValue = async (
  collection: admin.firestore.CollectionReference,
  field: string,
  fieldValues: string[]
) => {
  try {
    if (!fieldValues || fieldValues.length === 0) return null
    const querySnapshot = await collection
      .where(
        field === 'id' ? admin.firestore.FieldPath.documentId() : field,
        'in',
        fieldValues
      )
      .get()

    const deletePromises: any = []
    querySnapshot.forEach((doc) => {
      const deletePromise = doc.ref.delete()
      deletePromises.push(deletePromise)
    })

    await Promise.all(deletePromises)
  } catch (error) {
    console.error('Error deleting documents:', error)
  }
}
export const deleteUserFromFirebaseAuth = async (uid: string) => {
  await admin
    .auth()
    .deleteUser(uid)
    .then(() => {})
    .catch((error) => {
      console.error('Error deleting user:', error)
    })
}

export const deleteMediaFromStorage = async (mediaUrls: string[]) => {
  try {
    const storage = admin.storage()
    const deletePromises = mediaUrls.map((mediaUrl) => {
      const filePath = decodeURIComponent(
        new URL(mediaUrl).pathname.replace(
          '/v0/b/little-feather-dev.appspot.com/o/',
          ''
        )
      )
      return storage.bucket().file(filePath).delete()
    })

    Promise.all(deletePromises)
      .then(() => {
        console.log('All files deleted successfully')
      })
      .catch((error) => {
        console.error('Error deleting files:', error)
      })
  } catch (error) {
    console.log('Error deleting files:', error)
  }
}
