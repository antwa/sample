/**
 * DevExtreme (integration/jquery/use_jquery.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var jQuery = require("jquery");
var config = require("../../core/config");
var useJQuery = config().useJQuery;
if (jQuery && false !== useJQuery) {
    config({
        useJQuery: true
    })
}
module.exports = function() {
    return jQuery && config().useJQuery
};
