/**
 * DevExtreme (events/pointer.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var support = require("../core/utils/support"),
    each = require("../core/utils/iterator").each,
    devices = require("../core/devices"),
    domAdapter = require("../core/dom_adapter"),
    registerEvent = require("./core/event_registrator"),
    TouchStrategy = require("./pointer/touch"),
    MsPointerStrategy = require("./pointer/mspointer"),
    MouseStrategy = require("./pointer/mouse"),
    eventsEngine = require("../events/core/events_engine"),
    MouseAndTouchStrategy = require("./pointer/mouse_and_touch");
var EventStrategy = function() {
    if (support.pointerEvents) {
        return MsPointerStrategy
    }
    var device = devices.real();
    if (support.touch && !(device.tablet || device.phone)) {
        return MouseAndTouchStrategy
    }
    if (support.touch) {
        return TouchStrategy
    }
    return MouseStrategy
}();
each(EventStrategy.map, function(pointerEvent, originalEvents) {
    var eventStrategy = new EventStrategy(pointerEvent, originalEvents);
    if (pointerEvent === eventsEngine.passiveListenerEvents.eventName) {
        eventStrategy.setup = function(element, data, namespaces, handler) {
            domAdapter.listen(element, eventsEngine.passiveListenerEvents.nativeEventName, handler, {
                passive: false
            });
            return true
        }
    }
    registerEvent(pointerEvent, eventStrategy)
});
module.exports = {
    down: "dxpointerdown",
    up: "dxpointerup",
    move: "dxpointermove",
    cancel: "dxpointercancel",
    enter: "dxpointerenter",
    leave: "dxpointerleave",
    over: "dxpointerover",
    out: "dxpointerout"
};
