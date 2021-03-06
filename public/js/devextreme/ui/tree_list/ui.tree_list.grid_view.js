/**
 * DevExtreme (ui/tree_list/ui.tree_list.grid_view.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var treeListCore = require("./ui.tree_list.core"),
    gridViewModule = require("../grid_core/ui.grid_core.grid_view");
var GridView = gridViewModule.views.gridView.inherit(function() {
    return {
        _getWidgetAriaLabel: function() {
            return "dxTreeList-ariaTreeList"
        },
        _getTableRoleName: function() {
            return "treegrid"
        }
    }
}());
treeListCore.registerModule("gridView", {
    defaultOptions: gridViewModule.defaultOptions,
    controllers: gridViewModule.controllers,
    views: {
        gridView: GridView
    },
    extenders: {
        controllers: {
            resizing: {
                _toggleBestFitMode: function(isBestFit) {
                    this.callBase(isBestFit);
                    if (!this.option("legacyRendering")) {
                        var $rowsTable = this._rowsView._getTableElement();
                        $rowsTable.find(".dx-treelist-cell-expandable").toggleClass(this.addWidgetPrefix("best-fit"), isBestFit)
                    }
                }
            }
        }
    }
});
