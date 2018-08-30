/**
 * DevExtreme (ui/tree_list/ui.tree_list.virtual_scrolling.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var gridCore = require("./ui.tree_list.core"),
    dataSourceAdapter = require("./ui.tree_list.data_source_adapter"),
    virtualScrollingModule = require("../grid_core/ui.grid_core.virtual_scrolling"),
    extend = require("../../core/utils/extend").extend;
var oldDefaultOptions = virtualScrollingModule.defaultOptions,
    originalDataControllerExtender = virtualScrollingModule.extenders.controllers.data,
    originalDataSourceAdapterExtender = virtualScrollingModule.extenders.dataSourceAdapter;
virtualScrollingModule.extenders.controllers.data = extend({}, originalDataControllerExtender, {
    _loadOnOptionChange: function() {
        var virtualScrollController = this._dataSource && this._dataSource._virtualScrollController;
        virtualScrollController && virtualScrollController.reset();
        this.callBase()
    }
});
virtualScrollingModule.extenders.dataSourceAdapter = extend({}, originalDataSourceAdapterExtender, {
    changeRowExpand: function() {
        var _this = this;
        return this.callBase.apply(this, arguments).done(function() {
            var viewportItemIndex = _this.getViewportItemIndex();
            viewportItemIndex >= 0 && _this.setViewportItemIndex(viewportItemIndex)
        })
    }
});
gridCore.registerModule("virtualScrolling", extend({}, virtualScrollingModule, {
    defaultOptions: function() {
        return extend(true, oldDefaultOptions(), {
            scrolling: {
                mode: "virtual"
            }
        })
    }
}));
dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
