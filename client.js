
/**
 * @class ClientInfo
 */
export default class ClientInfo {

  /**
   * @constructor
   */
  constructor() {
    // Browser array
    this.dataBrowser = [{
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    }, {
      string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    }, {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    }, {
      prop: window.opera,
      identity: "Opera"
    }, {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    }, {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    }, {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    }, {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    }, { // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    }, {
      // For IE11
      string: navigator.userAgent,
      match: /Trident.*rv[ :]*11\./,
      identity: "Explorer"
    }, {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
    }, {
      string: navigator.userAgent,
      match: /Mobile Safari\/([\d.]+)/,
      identity: "Mobile Safari",
      versionSearch: "/AppleWebKit\/([\d.]+)/",
    }, {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    }, { // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }];
    // OS array
    this.dataOS = [{
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    }, {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    }, {
      string: navigator.userAgent,
      match: /Android\s([0-9\.]*)/,
      subString: "Android",
      identity: "Android"
    }, {
      string: navigator.userAgent,
      subString: "iPhone",
      identity: "iPhone/iPod"
    }, {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }

    ];
  }

  /**
    * Get visitor information
    */
  getVistorInfo() {
    // Stores visitor information
    var visitorInfo = {};
    
    // Get browser
    visitorInfo.browser = this.searchString(this.dataBrowser)
      || "An unknown browser";
    
    // Get browser version
    visitorInfo.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || this.searchMobileVersion(navigator.userAgent)
      || "An unknown version";
    
    // Get browser metadata like nAgent, nVersion[Number],majorVersion[String]
    visitorInfo.nVersion = navigator.appVersion;
    visitorInfo.nAgent = navigator.userAgent;
    visitorInfo.majorVersion = visitorInfo.version;
    
    // Get OS
    visitorInfo.OS = this.searchString(this.dataOS) || "An unknown OS";
    
    // Get device type 
    visitorInfo.deviceType = this.getPlatformType();
    return visitorInfo
  }

  /**
   * Get browser version of all browsers except safari
   * @param {String} dataString 
   */
  searchVersion(dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1)
      return;
    return parseFloat(dataString.substring(index
      + this.versionSearchString.length + 1));
  }

  /**
   * Get browser and OS
   * @param {Object} data 
   */
  searchString(data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      var match = data[i].match;
      this.versionSearchString = data[i].versionSearch
        || data[i].identity;

      if (match && dataString.match(match))
        return data[i].identity;

      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      } else if (dataProp)
        return data[i].identity;
    }
  }

  /**
   * Get version of safari browser
   * @param {String} dataString 
   */
  searchMobileVersion(dataString) {

    try {
      match = dataString.match(/Mobile Safari\/([\d.]+)/);
      if (match)
        return parseFloat(match[1]);
    } catch (e) {
      console.log('Version Error', e);
    }

  }

  /**
   * To get the user device type
   */
  getPlatformType() {
    // Store device type
    let deviceType = '';
    if (navigator.userAgent.match(/mobile/i)) {
      return deviceType = 'Mobile';
    } else if (navigator.userAgent.match(/iPad|Android|Touch/i)) {
      return deviceType = 'Tablet';
    } else {
      return deviceType = 'Desktop';
    }
  }

  /**
   * To check whether the service worker file is included in user domain or not
   * @param {callback} success 
   * @param {callback} failure 
   */
  detectFirebase(success, failure) {
    if (!(window.location.protocol == 'https:')) {
      return failure();
    }
    var url = (window.location.origin == `${window._pushGlobal.pushlyCloudUrl}`) ? window.location.origin + '/pushly/firebase-messaging-sw.js' : window.location.origin + '/firebase-messaging-sw.js'
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");// Code for IE6, IE5
    request.open('GET', url, false);
    request.send(); // There will be a 'pause' here until the response to come. The object request will be actually modified

    if (request.status === 200) {
      return success();
    }
    return failure();
  }
}
