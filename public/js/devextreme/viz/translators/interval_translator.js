/**
 * DevExtreme (viz/translators/interval_translator.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var typeUtils = require("../../core/utils/type"),
    isNumber = typeUtils.isNumeric,
    isDefined = typeUtils.isDefined,
    dateUtils = require("../../core/utils/date"),
    addInterval = dateUtils.addInterval,
    dateToMilliseconds = dateUtils.dateToMilliseconds,
    floor = Math.floor,
    adjust = require("../../core/utils/math").adjust;
module.exports = {
    _intervalize: function(value, interval) {
        if (!isDefined(value)) {
            return
        }
        if ("datetime" === this._businessRange.dataType) {
            if (isNumber(value)) {
                value = new Date(value)
            } else {
                value = new Date(value.getTime())
            }
            value = dateUtils.correctDateWithUnitBeginning(value, interval)
        } else {
            value = adjust(floor(adjust(value / interval)) * interval, interval)
        }
        return value
    },
    translate: function(bp, direction, interval) {
        var that = this,
            specialValue = that.translateSpecialCase(bp);
        if (isDefined(specialValue)) {
            return specialValue
        }
        interval = interval || that._options.interval;
        if (!that.isValid(bp, interval)) {
            return null
        }
        return that.to(bp, direction, interval)
    },
    untranslate: function(pos, direction, enableOutOfCanvas) {
        var canvasOptions = this._canvasOptions,
            startPoint = canvasOptions.startPoint;
        if (!enableOutOfCanvas && (pos < startPoint || pos > canvasOptions.endPoint) || !isDefined(canvasOptions.rangeMin) || !isDefined(canvasOptions.rangeMax)) {
            return null
        }
        return this.from(pos, direction)
    },
    getInterval: function() {
        return Math.round(this._canvasOptions.ratioOfCanvasRange * (this._businessRange.interval || Math.abs(this._canvasOptions.rangeMax - this._canvasOptions.rangeMin)))
    },
    _getValue: function() {},
    zoom: function() {},
    getMinScale: function() {},
    getScale: function() {},
    isValid: function(value, interval) {
        var that = this,
            co = that._canvasOptions,
            rangeMin = co.rangeMin,
            rangeMax = co.rangeMax;
        interval = interval || that._options.interval;
        if (null === value || isNaN(value)) {
            return false
        }
        value = "datetime" === that._businessRange.dataType && isNumber(value) ? new Date(value) : value;
        if (interval !== that._options.interval) {
            rangeMin = that._intervalize(rangeMin, interval);
            rangeMax = that._intervalize(rangeMax, interval)
        }
        if (value.valueOf() < rangeMin || value.valueOf() >= addInterval(rangeMax, interval)) {
            return false
        }
        return true
    },
    _parse: function(value) {
        return "datetime" === this._businessRange.dataType ? isNumber(value) ? new Date(value) : value : Number(value)
    },
    to: function(bp, direction, interval) {
        var that = this;
        interval = interval || that._options.interval;
        var v1 = that._intervalize(bp, interval),
            v2 = addInterval(v1, interval),
            res = that._to(v1),
            p2 = that._to(v2);
        if (!direction) {
            res = floor((res + p2) / 2)
        } else {
            if (direction > 0) {
                res = p2
            }
        }
        return res
    },
    _to: function(value) {
        var co = this._canvasOptions,
            rMin = co.rangeMinVisible,
            rMax = co.rangeMaxVisible,
            offset = value - rMin;
        if (value < rMin) {
            offset = 0
        } else {
            if (value > rMax) {
                offset = addInterval(rMax, this._options.interval) - rMin
            }
        }
        return this._conversionValue(this._calculateProjection(offset * this._canvasOptions.ratioOfCanvasRange))
    },
    from: function(position, direction) {
        var value, that = this,
            origInterval = that._options.interval,
            interval = origInterval,
            co = that._canvasOptions,
            rMin = co.rangeMinVisible,
            rMax = co.rangeMaxVisible;
        if ("datetime" === that._businessRange.dataType) {
            interval = dateToMilliseconds(origInterval)
        }
        value = that._calculateUnProjection((position - that._canvasOptions.startPoint) / that._canvasOptions.ratioOfCanvasRange);
        value = that._intervalize(addInterval(value, interval / 2, direction > 0), origInterval);
        if (value < rMin) {
            value = rMin
        } else {
            if (value > rMax) {
                value = rMax
            }
        }
        return value
    },
    _add: function() {
        return NaN
    },
    isValueProlonged: true
};
