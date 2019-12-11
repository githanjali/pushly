
/**
 * @class Global Constants
 */
export default class GlobalConstants {
    /**
     * @constructor
     */
    constructor() {
        // Pushly cloud url
        this.pushlyCloudUrl = 'https://pushly.500apps.com';
        
        // Pushly server url
        this.serverUrl = this.pushlyCloudUrl + '/pushly';
        
        // Pushly popup html
        this.pushlyPopupHtml = `<div style="background: #333; position: fixed;left:69px; width: 16%;"><div style="margin: 0 auto; width: 70%; color: #f0f0f0; padding: 15px;"><img src="https://pushly.s3.ap-south-1.amazonaws.com/pushly-logo+copy.png" style="width:62px;float:left;"><p style="font-size: small;">
        Welcome to pushly
       </p> <a id = "_push_banner_allow" style="background: #ccc; color: #333; text-decoration: none; padding: 0px 10px; border-radius: 3px; display: inline-block; border: 1px solid #aaa; border-bottom: 2px solid #aaa; cursor: pointer;">
       Allow
       </a> &nbsp; <a id = "_push_banner_deny" style="background: #ccc; color: #333; text-decoration: none; padding: 0px 10px; border-radius: 3px; display: inline-block; border: 1px solid #aaa; border-bottom: 2px solid #aaa; cursor: pointer;">
       Decline</a><p style="font-size: small;">pushly wants to send notifications</p></div></div>`;
    }
} (() => {
    window._pushGlobal = new GlobalConstants();
})();
