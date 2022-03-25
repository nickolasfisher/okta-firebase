# Deploy a Node application to Firebase

This repository shows you how to build a React application secured by Okta and deploy it to Firebase.  It also shows you how to set up Functions in Firebase to exchange and Okta accessToken for a Firebase token and then call a secured route using Firebase auth.

**Prerequisites:**

- [Node.js](https://nodejs.org/en/)
- [Firebase Account](https://firebase.google.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Okta CLI](https://cli.okta.com)
> [Okta](https://developer.okta.com/) has Authentication and User Management APIs that reduce development time with instant-on, scalable user infrastructure. Okta's intuitive API and expert support make it easy for developers to authenticate, manage and secure users and roles in any application.
- [Visual Studio Code](https://code.visualstudio.com/)

* [Getting Started](#getting-started)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

To pull this example, first create an empty github repo.  Next run the following commands:

```bash
git clone --bare https://github.com/nickolasfisher/okta-azure-static-web-app.git
cd okta-firebase
npm i
cd functions
```

### Create an OIDC Application in Okta

Create a free developer account with the following command using the [Okta CLI](https://cli.okta.com):

```shell
okta register
```
If you already have a developer account, use `okta login` to integrate it with the Okta CLI. 
Create a client application in Okta with the following command:

```shell
okta apps create
```

You will be prompted to select the following options:
- Application name: Okta Firebase Demo
- Type of Application: **2: SPA**
- Callback: `http://localhost:5000/login/callback`
- Post Logout Redirect URI: `http://localhost:5000`

The application configuration will be printed in the terminal.  Note your `issuer` and your `clientId`.

Replace all instances of {yourOktaIssuer} with the issuer from above.

Replace all instances of {yourClientId} with the clientId from above.  

### Create your Firebase Project

> Navigate to your [Firebase console](https://console.firebase.google.com/u/0/).
> Click **Add Project** and follow the steps there

In your Project page

> Click **Authentication**
> Click **Get Started**

> Navigate To Project Settings (the settings wheel next to *Project Overview*)
> Click **Add App** and follow the steps
> Once you are done you will be shown a sample `firebaseConfig`  Add these values to .env in their appropiate spot

> Navigate To Project Settings (the settings wheel next to *Project Overview*)
> Click **Service Accounts** and follow the steps
> Click **Generate new private key**
> Copy this key to your `functions` folder
> Replace `{yourPrivateKey.json}` with your file name

### Deploy your application

**In VS Code**

> Run the command `firebase init`
> Select `Functions: Configure a Cloud Functions directory and its files` and `Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys`
> Select `Use an existing project` and select the project you created above

Functions will start to init

> Select JavaScript for the language
> Select no for EsLint
> Select no for each time it asks you to overwrite a file
> Select Y to install dependencies

Next Hosting will start

> Type in `build` as your public directory
> Select `yes` to configure your app as a single-page app
> Select `no` to set up automatic builds

Next run the command `firebase deploy` and your application should deploy your project.  The CLI will give you a URL to navigate to.

### Configure your Okta application with your new Firebase domain

In your Okta admin panle
Naviagte to *Security -> API*
Click on **Trusted Origins**
Add your Firebase domain to this list

Navigate to your Okta application
Click **Edit** and add {yourFirebaseDomain}/login/callback to the *Sign-in Redirect URIs* and {yourFirebaseDomain} to *Sign-out redirect URIs*
Click **Save**

## Links

This example uses the following open source libraries from Okta:

* [Okta with NodeJs](https://developer.okta.com/code/nodejs/)
* [Okta with React](https://developer.okta.com/code/react/)
* [Okta JWT Verifier](https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier)
* [Okta CLI](https://github.com/okta/okta-cli)

## Help

Please post any questions as comments on the [blog post][blog], or visit our [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).

[blog]: https://developer.okta.com/blog/2021/xyz
