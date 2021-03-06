/**
 * DevExtreme (ui/data_grid/ui.data_grid.data_controller.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var gridCore = require("./ui.data_grid.core"),
    errors = require("../widget/ui.errors"),
    dataSourceAdapterProvider = require("./ui.data_grid.data_source_adapter"),
    dataControllerModule = require("../grid_core/ui.grid_core.data_controller");
exports.DataController = dataControllerModule.controllers.data.inherit(function() {
    return {
        _getDataSourceAdapter: function() {
            return dataSourceAdapterProvider
        },
        _getSpecificDataSourceOption: function() {
            var dataSource = this.option("dataSource");
            if (dataSource && !Array.isArray(dataSource) && this.option("keyExpr")) {
                errors.log("W1011")
            }
            return this.callBase()
        }
    }
}());
gridCore.registerModule("data", {
    defaultOptions: dataControllerModule.defaultOptions,
    controllers: {
        data: exports.DataController
    }
});
