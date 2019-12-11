const Firebase = require('firebase/app');
require('firebase/messaging');
import PushlyServerFirebase from './pushly-server-firebase.js';

/**
 * @class PushlyFirebase
 */
export default class PushlyFirebase {

    /**
     * @constructor
     */
    constructor() {
        // Store firebase details 
        this.firebaseDetails = (window._pushfcm.apiKey == '' || window._pushfcm.authDomain == '' || window._pushfcm.databaseURL == '' || window._pushfcm.projectId == '' || window._pushfcm.messagingSenderId == '' || window._pushfcm.appId == '') ? {
            apiKey: "AIzaSyCHOfzwaG8QdWZQPbsD38gZQDbNmWyk3oA",
            authDomain: "apptitans.firebaseapp.com",
            databaseURL: "https://apptitans.firebaseio.com",
            projectId: "apptitans",
            storageBucket: "",
            messagingSenderId: "721913454836",
            appId: "1:721913454836:web:68de7e40f92c5197"
        } : window._pushfcm;

        // Initialize app in fcm
        Firebase.initializeApp(this.firebaseDetails);
    }

    /**
     * Initialization method
     */
    init() {
        // Class instance to call static methods
        let scope = PushlyFirebase;
        
        // Path to register service worker
        let serviceworkerRegistrationPath = (window.location.origin == `${window._pushGlobal.pushlyCloudUrl}`) ? '/pushly/firebase-messaging-sw.js' : '/firebase-messaging-sw.js';

        // Register service worker path in fcm
        navigator.serviceWorker.register(serviceworkerRegistrationPath)
            .then((registration) => {
                Firebase.messaging().useServiceWorker(registration);
            });

        // Request permission to get token.....
        scope.getClientSideApproval();

        // To get refresh token
        Firebase.messaging().onTokenRefresh(() => {
            Firebase.messaging().getToken().then((refreshedToken) => {
                console.log('Token refreshed.');

                // Indicate that the new Instance ID token has not yet been sent to the
                // app server.
                window._Pushly.setTokenSentToServer(false);

                // [START_EXCLUDE]
                // Display new Instance ID token and clear UI of all previous messages.
                scope.getFirebaseToken();
                // [END_EXCLUDE]

            }).catch((err) => {
                console.log('Unable to retrieve refreshed token ', err);
            });
        });
    }

    /**
     * To get Instance ID token. Initially this makes a network call, once retrieved subsequent calls to getToken    will return from cache.
     * @param {Object} scope Pushly instance
     */
    static getFirebaseToken(scope = window._Pushly) {
        // [START get_token]
        Firebase.messaging().getToken().then((currentToken) => {
            if (currentToken) {
                return scope.sendTokenToServer(currentToken);
            }
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            // Set token flag to false.
            scope.setTokenSentToServer(false);
            //Request permission
            return PushlyFirebase.getClientSideApproval();
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            scope.setTokenSentToServer(false);
        });
        // [END get_token]

    }

    /**
     * To get approval from the user to start service worker
     * @param {Object} scope Current instance
     */
    static getClientSideApproval(scope = PushlyFirebase) {
        Firebase.messaging().requestPermission()
            .then(function () {
                console.log('Have permission...');
                return scope.getFirebaseToken();
            })
            .catch(function (err) {
                console.log('error occured......', err);

                //Close child window if open
                if (window.location.origin == `${window._pushGlobal.pushlyCloudUrl}`) {
                    // Call closeChildWindow method to close child window
                    PushlyServerFirebase.closeChildWindow("close");
                }
            });
    }
} 
