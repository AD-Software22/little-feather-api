import * as admin from 'firebase-admin'

const userCollection = admin.firestore().collection('User')
const babyCollection = admin.firestore().collection('Baby')
const userBabyCollection = admin.firestore().collection('UserBaby')
const postCollection = admin.firestore().collection('Post')
const fileReferenceCollection = admin.firestore().collection('FileReference')
const familyTreeCollection = admin.firestore().collection('FamilyTree')
const monthByMonthCollection = admin.firestore().collection('MonthByMonth')
const yearMilestoneCollection = admin.firestore().collection('YearMilestone')

export {
  userCollection,
  babyCollection,
  userBabyCollection,
  postCollection,
  fileReferenceCollection,
  familyTreeCollection,
  monthByMonthCollection,
  yearMilestoneCollection,
}
