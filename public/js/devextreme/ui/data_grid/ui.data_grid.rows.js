/**
 * DevExtreme (ui/data_grid/ui.data_grid.rows.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var gridCore = require("./ui.data_grid.core"),
    rowsViewModule = require("../grid_core/ui.grid_core.rows");
exports.RowsView = rowsViewModule.views.rowsView;
gridCore.registerModule("rows", rowsViewModule);
