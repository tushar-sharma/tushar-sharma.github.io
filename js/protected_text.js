const axios = require("axios");
const CryptoJS = require('crypto-js');

class ProtectedTextApi {
  constructor(site_id, passwd) {
    this.siteHash = CryptoJS.SHA512("/" + site_id).toString();
    this.pass = passwd;
    this.passHash = CryptoJS.SHA512(passwd).toString();
    this.endpoint = "https://www.protectedtext.com".concat("/", site_id);

    this.siteObj = {};
    this.dbversion = 0;
  }

  async loadTabs() {
    this.siteObj = (await axios.get(this.endpoint.concat('?action=getJSON'))).data;
    this.dbversion = this.siteObj['currentDBVersion'];
    this.rawtext = CryptoJS.AES.decrypt(this.siteObj['eContent'], this.pass).toString(CryptoJS.enc.Utf8);

    // Remove SHA2-512 HASH added after user's content
    this.rawtext = this.rawtext.substring(0, (this.rawtext.length - 128));
    return this.rawtext;
  }

  // Add other methods as needed: save, deleteSite, view, getWritePermissionProof
}

const site_id = "{{ site_id }}";
const password = "{{ password }}";

const protectedText = new ProtectedTextApi(site_id, password);
const decryptedContent = await protectedText.loadTabs();

decryptedContent;
