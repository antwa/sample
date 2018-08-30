/**
 * DevExtreme (core/utils/support.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var inArray = require("./array").inArray,
    domAdapter = require("../dom_adapter"),
    callOnce = require("./call_once"),
    windowUtils = require("./window"),
    navigator = windowUtils.getNavigator(),
    devices = require("../devices"),
    styleUtils = require("./style");
var transitionEndEventNames = {
    webkitTransition: "webkitTransitionEnd",
    MozTransition: "transitionend",
    OTransition: "oTransitionEnd",
    msTransition: "MsTransitionEnd",
    transition: "transitionend"
};
var supportProp = function(prop) {
    return !!styleUtils.styleProp(prop)
};
var isNativeScrollingSupported = function() {
    var realDevice = devices.real(),
        realPlatform = realDevice.platform,
        realVersion = realDevice.version,
        isObsoleteAndroid = realVersion && realVersion[0] < 4 && "android" === realPlatform,
        isNativeScrollDevice = !isObsoleteAndroid && inArray(realPlatform, ["ios", "android", "win"]) > -1 || realDevice.mac;
    return isNativeScrollDevice
};
var inputType = function(type) {
    if ("text" === type) {
        return true
    }
    var input = domAdapter.createElement("input");
    try {
        input.setAttribute("type", type);
        input.value = "wrongValue";
        return !input.value
    } catch (e) {
        return false
    }
};
var touchEvents = windowUtils.hasProperty("ontouchstart") && !windowUtils.hasProperty("callPhantom"),
    pointerEvents = !!navigator.pointerEnabled || !!navigator.msPointerEnabled,
    touchPointersPresent = !!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints;
exports.touchEvents = touchEvents;
exports.pointerEvents = pointerEvents;
exports.touch = touchEvents || pointerEvents && touchPointersPresent;
exports.transition = callOnce(function() {
    return supportProp("transition")
});
exports.transitionEndEventName = callOnce(function() {
    return transitionEndEventNames[styleUtils.styleProp("transition")]
});
exports.animation = callOnce(function() {
    return supportProp("animation")
});
exports.nativeScrolling = isNativeScrollingSupported();
exports.styleProp = styleUtils.styleProp;
exports.stylePropPrefix = styleUtils.stylePropPrefix;
exports.supportProp = supportProp;
exports.inputType = inputType;