import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";


const db = admin.firestore();
const postsCollection = db.collection("posts");
const commentsCollection = db.collection("comments");
const filesCollection = db.collection("files");

export async function getAllPosts(): Promise<any[]> {
  try {
    const snapshot = await postsCollection.get();
    const posts: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      posts.push(data);
    });
    return posts;
  } catch (error) {
    console.error("Error fetching posts from Firestore:", error);
    throw new Error("Internal server error");
  }
}

export async function getPostsCommentsAndFiles(): Promise<any[]> {
  try {
    const postsQuerySnapshot = await postsCollection.orderBy("date", "desc").get();
    const postsWithCommentsAndFiles = [];

    for (const postDoc of postsQuerySnapshot.docs) {
      const post = postDoc.data();
      const postId = postDoc.id;

      const commentsSnapshot = await commentsCollection.where("postId", "==", postId).get();
      const comments = commentsSnapshot.docs.map((doc) => doc.data());

      const filesSnapshot = await filesCollection.where("postId", "==", postId).get();
      const files = filesSnapshot.docs.map((doc) => doc.data());

      const postWithCommentsAndFiles = {
        ...post,
        commentsList: comments,
        files,
      };

      postsWithCommentsAndFiles.push(postWithCommentsAndFiles);
    }

    return postsWithCommentsAndFiles;
  } catch (error) {
    console.error('Error fetching posts with comments and files from Firestore:', error);
    throw new Error('Internal server error');
  }
}


export async function addPostToDatabase(caption:any, imageFiles:any) {
  try {
    // Create the post data
    const post = {
      caption: caption,
      name: 'Bekon',
      likes: 0,
      comments: 0,
      shares: 0,
      profilePic: '',
      date: admin.firestore.Timestamp.fromDate(new Date()),
    };

    // Add the post to the posts collection
    const addedPost = await postsCollection.add(post);

    for (const imageFile of imageFiles) {
      if (imageFile) {
        const uploadedImageRef = await uploadImage(imageFile);
        const image = {
          firebaseURL: uploadedImageRef.imageContainerUrl,
          firebaseFullURL: uploadedImageRef.imageUrl,
          postId: addedPost.id,
          mediaType: 'image',
          type: 'post',
        };
        await filesCollection.add(image);
      }
    }
  } catch (error) {
    console.error('Error adding post: ', error);
    throw error;
  }
}

const uploadImage = async (imageFile:any) => {
  const imageFileName = uuidv4();

  // Create a storage reference with the generated filename
  const storage = admin.storage().bucket(); // Use the correct Firebase Storage bucket reference
  const imageContainerUrl = `postImages/${imageFileName}`;
  const imageFileRef = storage.file(imageContainerUrl);

  // Upload the image to Firebase Storage
  await imageFileRef.save(imageFile.buffer, {
    metadata: {
      contentType: imageFile.mimetype,
    },
  });

  // Get the download URL of the uploaded image with a 1-hour expiration time (adjust as needed)
  const expiration = Date.now() + 60 * 60 * 1000; // 1 hour from now
  const imageUrl = await imageFileRef.getSignedUrl({
    action: 'read',
    expires: expiration,
  });

  return { imageContainerUrl, imageUrl };
}
