
/**
 * @class PushlyServerFirebase
 */
export default class PushlyServerFirebase {
    /**
     * @constructor
     */
    constructor() {

    }

    /**
     * Initialization method
     * @param {Object} scope 
     */
    init(scope = PushlyServerFirebase) {
        if (!((window.localStorage.getItem('_scb')) || (window.sessionStorage.getItem('_scb')))) {
            scope.getPushlySideApproval();
        }
    }

    /**
     * To show popup to get pushly side approval from the user when service worker file is not present in user domain
     */
    static getPushlySideApproval() {
        // Popup Html content
        var c = `${window._pushGlobal.pushlyPopupHtml}`;
        
        // Get all elements inside body tag
        var b = document.getElementsByTagName("BODY")[0];
        
        // Create a div element inside body tag
        var a = document.createElement("div");
        
        // Set id of div element added
        a.setAttribute("id", "myConsent");
        
        // Add style to div element added
        a.setAttribute("style", "z-index: 10; overflow-x: overlay; overflow-y: overlay; top: 0; position: absolute; left: 0;");
        
        // Add div element to body tag
        b.appendChild(a);
        
        // Add popup Html to div elememt added
        document.getElementById("myConsent").innerHTML = c;
        
        // Add event listener when allow button is clicked
        document.getElementById("_push_banner_allow").addEventListener("click", function () {
            // Send permission status
            PushlyServerFirebase.isPushPermissionGranted(true);
            // Hide popup
            document.getElementById("myConsent").style.display = "none";
        });
        
        // Add event listener when decline button is clicked
        document.getElementById("_push_banner_deny").addEventListener("click", function () {
            // Send permission status
            PushlyServerFirebase.isPushPermissionGranted(false);
            // Hide popup
            document.getElementById("myConsent").style.display = "none";
        });
    }

    /**
     * To return permission status
     * @param {Boolean} status true or false
     */
    static isPushPermissionGranted(status) {
        return PushlyServerFirebase.checkPermissionStatus(status)
    }

    /**
     * To check permission status
     * @param {Boolean} status 
     */
    static checkPermissionStatus(status) {
        if (status) {
            return PushlyServerFirebase.openChildWindow();
        }
        return PushlyServerFirebase.setDenySession();
    }

    /**
     * Open child window to include sw file
     */
    static openChildWindow() {
        // Set localstorage for child window
        window.localStorage.setItem('_scb', 1);
        
        // Open child window
        window._pushchildWindow = window.open(`${window._pushGlobal.serverUrl}/sw/` + window._push.apiKey, "Ratting", "width=550,height=500,left=150,top=200,toolbar=0,status=0,")
    }

    /**
     * Close child window
     * @param {String} message 
     */
    static closeChildWindow(message) {
        if (message == 'close') {
            // Close window
            window.close();
        }
    }

    /**
     * To set session storage when user deny permission
     */
    static setDenySession() {
        // Set session storage when user declines permission 
        window.sessionStorage.setItem('_scb', 1);
    }
}
