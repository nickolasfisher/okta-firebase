import React, { useState } from "react";

import { useOktaAuth } from "@okta/okta-react";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";

function Home() {
  const [img, setImg] = useState("");
  const { oktaAuth, authState } = useOktaAuth();

  const login = async () => oktaAuth.signInWithRedirect();
  const logout = async () => {
    oktaAuth.signOut("/");
    signOut();
  };

  const {
    REACT_APP_FIREBASE_APIKEY,
    REACT_APP_FIREBASE_AUTHDOMAIN,
    REACT_APP_FIREBASE_PROJECTID,
    REACT_APP_FIREBASE_STORAGEBUCKET,
    REACT_APP_FIREBASE_MESSAGINGSENDERID,
    REACT_APP_FIREBASE_APPID,
    REACT_APP_ENV,
  } = process.env;

  const firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_APIKEY,
    authDomain: REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: REACT_APP_FIREBASE_PROJECTID,
    storageBucket: REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: REACT_APP_FIREBASE_APPID,
  };

  const app = initializeApp(firebaseConfig);
  const functions = getFunctions(app);

  const auth = getAuth();

  if (REACT_APP_ENV === "development") {
    connectFunctionsEmulator(functions, "localhost", 5001);
  }

  const getImage = async () => {
    const getImageCall = httpsCallable(functions, "drawImage");
    const resp = await getImageCall();

    setImg(resp.data.image);
  };

  const exchangeOktaTokenForFirebaseToken = async () => {
    const exchangeToken = httpsCallable(
      functions,
      "exchangeOktaTokenForFirebaseToken"
    );

    const resp = await exchangeToken({
      accessToken: authState.accessToken.accessToken,
    });

    await signInWithCustomToken(auth, resp.data.firebaseToken);
  };

  if (authState?.isAuthenticated) {
    exchangeOktaTokenForFirebaseToken();
  }

  return (
    <div className="App">
      <main role="main" className="inner cover container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light ">
          <ul className="nav navbar-nav ml-auto navbar-right ms-auto">
            <li>
              {auth?.currentUser && (
                <button
                  className="btn btn-outline-secondary my-2 my-sm-0"
                  onClick={logout}
                >
                  Logout
                </button>
              )}

              {!auth?.currentUser && (
                <button className="btn btn-outline-secondary" onClick={login}>
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>

        <h1 className="cover-heading">
          Just a little mini discrete fractal maker
        </h1>

        {!auth?.currentUser && (
          <div>
            <p className="lead">
              In order to use this application you must be logged into your Okta
              account
            </p>
            <p className="lead">
              <button className="btn btn-primary" onClick={login}>
                Login
              </button>
            </p>
          </div>
        )}
        {auth?.currentUser && (
          <div>
            <p className="lead">
              Click the button below to create a little fractal
            </p>

            <button className="btn btn-primary" onClick={getImage}>
              Get Image
            </button>

            <br />
            <br />
            <br />
            {img && <img src={img} width="400" alt="your little fractal" />}
          </div>
        )}

        <footer
          className="bg-light text-center fixed-bottom"
          style={{
            width: "100%",
            padding: "0 15px",
          }}
        >
          <p>
            A Small demo using <a href="https://developer.okta.com/">Okta</a> to
            Secure an{" "}
            <a href="https://firebase.google.com/">
              Firebase hosted application{" "}
            </a>{" "}
            with a serverless{" "}
            <a href="https://firebase.google.com/docs/functions">function</a>
          </p>
          <p>
            By <a href="https://github.com/nickolasfisher">Nik Fisher</a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default Home;
