/**
 * DevExtreme (integration/knockout/variable_wrapper_utils.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var ko = require("knockout"),
    variableWrapper = require("../../core/utils/variable_wrapper");
variableWrapper.inject({
    isWrapped: ko.isObservable,
    isWritableWrapped: ko.isWritableObservable,
    wrap: ko.observable,
    unwrap: function(value) {
        if (ko.isObservable(value)) {
            return ko.utils.unwrapObservable(value)
        }
        return this.callBase(value)
    },
    assign: function(variable, value) {
        if (ko.isObservable(variable)) {
            variable(value)
        } else {
            this.callBase(variable, value)
        }
    }
});
