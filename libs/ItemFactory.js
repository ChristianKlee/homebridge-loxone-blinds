"use strict";
var exports = module.exports = {};
exports.AbstractItem = require('../items/AbstractItem.js');
//Important: name the exports identical to Loxone type to have an automatic match
exports.Jalousie = require('../items/BlindsItem.js');

exports.Factory = function(LoxPlatform, homebridge) {
    this.platform = LoxPlatform;
    this.log = this.platform.log;
    this.homebridge = homebridge;
    this.itemList = {};
    this.catList = {};
    this.roomList = {};
    //this.uniqueIds = [];
};

//TODO: we could also get this information from the websocket, avoiding the need of an extra request.

exports.Factory.prototype.sitemapUrl = function() {
    var serverString = this.platform.host;
    var serverPort = this.platform.port;
    if (this.platform.username && this.platform.password) {
        serverString = encodeURIComponent(this.platform.username) + ":" + encodeURIComponent(this.platform.password) + "@" + serverString + ":" + serverPort;
    }

    return this.platform.protocol + "://" + serverString + "/data/LoxApp3.json";
};

exports.Factory.prototype.parseSitemap = function(jsonSitemap) {

    //this is the function that gets called by index.js
    //first, parse the Loxone JSON that holds all controls
    exports.Factory.prototype.traverseSitemap(jsonSitemap, this);
    //now convert these controls in accessories
    var accessoryList = [];

    for (var key in this.itemList) {
        if (this.itemList.hasOwnProperty(key)) {
            //process additional attributes
            this.itemList[key] = exports.Factory.prototype.checkCustomAttrs(this, key, this.platform, this.catList);

            if (!(this.itemList[key].type in exports)){
                continue;
            }

            var accessory = new exports[this.itemList[key].type](this.itemList[key], this.platform, this.homebridge);

            if (accessoryList.length > 99) {
                // https://github.com/nfarina/homebridge/issues/509
            } else {
                accessoryList.push(accessory);
            }

        }
    }

    this.log('Platform - Total accessory count ' + accessoryList.length);
    return accessoryList;
};


exports.Factory.prototype.checkCustomAttrs = function(factory, itemId, platform, catList) {
    var item = factory.itemList[itemId];
    item.manufacturer = "Loxone";
    return item;
};


exports.Factory.prototype.traverseSitemap = function(jsonSitmap, factory) {

    //this function will simply add every control and subControl to the itemList, holding all its information
    //it will also store category information, as we will use this to decide on correct Item Type
    for (var sectionKey in jsonSitmap) {
        if (jsonSitmap.hasOwnProperty(sectionKey)) {
            if (sectionKey === "cats") {
                var cats = jsonSitmap[sectionKey];
                for (var catUuid in cats) {
                    if (cats.hasOwnProperty(catUuid)) {
                        factory.catList[catUuid] = cats[catUuid];
                    }
                }
            } else if (sectionKey === "controls") {
                var controls = jsonSitmap[sectionKey];
                for (var controlUuid in controls) {
                    if (controls.hasOwnProperty(controlUuid)) {
                        var control = controls[controlUuid]

                        factory.itemList[controlUuid] = control;

                        // Check if the control has any subControls like LightController(V2)
                        if (control.subControls) {
                            for (var subControlUuid in control.subControls) {
                                if (control.subControls.hasOwnProperty(subControlUuid)) {
                                    var subControl = control.subControls[subControlUuid];
                                    subControl.parentType = control.type;

                                    factory.itemList[subControlUuid] = subControl;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};