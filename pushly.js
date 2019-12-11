import GlobalConstants from './globals.js';
import ClientInfo from './client.js';
import PushlyFirebase from './firebase.js';
import PushlyServerFirebase from './pushly-server-firebase.js';

/**
 * @class Pushly
 */
class Pushly {

    /**
     * @constructor
     */
    constructor() {
        // Store visitor information like OS, browser
        this.visitorInfo = {};

        // Store ClientInfo class instance
        this.client = {};
    }

    /**
     * Intialization method (starting point)
     */
    init() {

        // Get client info
        this.client = new ClientInfo();
        this.visitorInfo = this.client.getVistorInfo();

        // Initialize firebase
        var pushlyFirebase = new PushlyFirebase();
        var pushlyServerFirebase = new PushlyServerFirebase();

        // Call detectFirebase method to check whether service worker file is included or not
        this.client.detectFirebase(pushlyFirebase.init, pushlyServerFirebase.init)
    }


    /**
     * To set a flag in local storage when token is sent to server
     * set 1 in localstorage when token send to server
     * @param {Boolean} sent True or False
     */
    setTokenSentToServer(sent) {
        window.localStorage.setItem('sentToServer', sent ? '1' : '0');
    }

    /**
    * To send token to the server
    * @param {String} currentToken Firebase token
    */
    sendTokenToServer(currentToken) {
        if (!this.isTokenSentToServer()) {
            console.log('Sending token to server...');
            // Set localstorage
            this.setTokenSentToServer(true);

            // Send the current token to store in db .
            this.storeToken(currentToken);
        } else {
            console.log('Token already sent to server so won\'t send it again ' +
                'unless it changes');
        }
    }

    /**
    * To check whether the token is sent to server or not
    * If sent, get flag from localstorage
    */
    isTokenSentToServer() {
        return window.localStorage.getItem('sentToServer') === '1';
    }

    /**
     * To store user website details and token
     * @param {String} ipAddress User ip address
     * @param {String} token Firebase token
     */
    storeToken(token) {
        // Subscription token and visitor info 
        let details = {
            "api_key": window._push.apiKey,
            "nVersion": this.visitorInfo.nVersion,
            "nAgent": this.visitorInfo.nAgent,
            "browserName": this.visitorInfo.browser,
            "browser_version": this.visitorInfo.version,
            "majorVersion": this.visitorInfo.majorVersion,
            "operating_system": this.visitorInfo.OS,
            "device_type": this.visitorInfo.deviceType,
            "subscription": token
        }
        fetch(`${window._pushGlobal.serverUrl}/browser`, {
            method: "post",
            headers: {
                Accept: "application/json",
            },
            body: JSON.stringify(details)
        })
            .then((response) => {
                // Close child window if open    
                if (window.location.origin == `${window._pushGlobal.pushlyCloudUrl}`) {
                    // Call closeChildWindow method to close child window
                    PushlyServerFirebase.closeChildWindow("close");
                }
            })
            .catch(error => {
                console.log('Error:', error);
                // Close child window if open    
                if (window.location.origin == `${window._pushGlobal.pushlyCloudUrl}`) {
                    // Call closeChildWindow method to close child window
                    PushlyServerFirebase.closeChildWindow("close");
                }
            });
    }
}
(() => {
    window._Pushly = new Pushly()
    window._Pushly.init();
})();

