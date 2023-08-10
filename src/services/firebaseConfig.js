const admin = require('firebase-admin');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};
// initilializing firebase Admin SDK with service acc config
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://localeats-55552.appspot.com', // firebase bucket storage url
});

const bucket = admin.storage().bucket(); // getting a ref to the firebase storage bucket

// to upload an image to firebase storage
async function uploadImage(reqFile, fileName) {
  const fileBuffer = Buffer.from(reqFile.buffer); // converting file buffer to a Buffer obj
  const fileExtension = fileName.split('.').pop().toLowerCase(); // getting the file extension
  const allowedExtensions = ['jpeg', 'jpg', 'png']; // allowed image extensions

  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error(
      'Unsupported file format. Only JPEG, JPG, and PNG images are allowed.'
    );
  }

  const file = bucket.file(fileName);

  await file.save(fileBuffer);

  await file.makePublic();
  const publicUrl = file.publicUrl(); // getting the public url of the uploaded file
  return publicUrl;
}

// only delete the image from the bucket on firebase storage
async function deleteImage(fileName) {
  bucket
    .file(fileName)
    .delete()

    .then(() => {
      // eslint-disable-next-line prettier/prettier
      console.log('File deleted successfully');
    })
    .catch((error) => {
      // eslint-disable-next-line prettier/prettier
      console.log('An error occurred!');
    });
}

// to update an image in firebase storage
async function updateImage(reqFile, oldfileName, newFileName) {
  await deleteImage(oldfileName); // deleting old image

  const publicUrl = await uploadImage(reqFile, newFileName); // uploading new image
  return publicUrl;
}

module.exports = {
  uploadImage,
  updateImage,
  deleteImage,
};
