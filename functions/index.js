const functions = require("firebase-functions");

const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./{yourPrivateKey.json}");

const { generateImage } = require("./generator");

const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const OktaJwtVerifier = require("@okta/jwt-verifier");

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: '{yourOktaIssuer}'
});

exports.exchangeOktaTokenForFirebaseToken = functions.https.onCall(
  async (data, context) => {
    const accessToken = data.accessToken;
    const jwt = await oktaJwtVerifier.verifyAccessToken(
      accessToken,
      "api://default"
    );

    const oktaUid = jwt.claims.uid;
    const firebaseToken = await firebaseApp.auth().createCustomToken(oktaUid);

    return { firebaseToken };
  }
);

exports.drawImage = functions.https.onCall((data, context) => {
  if (!context.auth)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );

  const canvas = generateImage();

  return {
    image: canvas.toDataURL(),
  };
});
