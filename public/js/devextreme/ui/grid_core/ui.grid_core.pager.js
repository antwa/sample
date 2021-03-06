/**
 * DevExtreme (ui/grid_core/ui.grid_core.pager.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var modules = require("./ui.grid_core.modules"),
    Pager = require("../pager"),
    inArray = require("../../core/utils/array").inArray,
    isDefined = require("../../core/utils/type").isDefined,
    hasWindow = require("../../core/utils/window").hasWindow();
var PAGER_CLASS = "pager",
    MAX_PAGES_COUNT = 10;
var PagerView = modules.View.inherit({
    init: function() {
        var that = this,
            dataController = that.getController("data");
        that._isVisible = false;
        dataController.changed.add(function(e) {
            if (!e || "update" !== e.changeType) {
                that.render()
            }
        })
    },
    _getPager: function() {
        var $element = this.element();
        return $element && $element.data("dxPager")
    },
    _renderCore: function() {
        var that = this,
            $element = that.element().addClass(that.addWidgetPrefix(PAGER_CLASS)),
            pagerOptions = that.option("pager") || {},
            dataController = that.getController("data"),
            options = {
                maxPagesCount: MAX_PAGES_COUNT,
                pageIndex: 1 + (parseInt(dataController.pageIndex()) || 0),
                pageCount: dataController.pageCount(),
                pageSize: dataController.pageSize(),
                showPageSizes: pagerOptions.showPageSizeSelector,
                showInfo: pagerOptions.showInfo,
                pagesNavigatorVisible: pagerOptions.visible,
                showNavigationButtons: pagerOptions.showNavigationButtons,
                pageSizes: that.getPageSizes(),
                totalCount: dataController.totalCount(),
                hasKnownLastPage: dataController.hasKnownLastPage(),
                pageIndexChanged: function(pageIndex) {
                    if (dataController.pageIndex() !== pageIndex - 1) {
                        setTimeout(function() {
                            dataController.pageIndex(pageIndex - 1)
                        })
                    }
                },
                pageSizeChanged: function(pageSize) {
                    setTimeout(function() {
                        dataController.pageSize(pageSize)
                    })
                }
            };
        if (isDefined(pagerOptions.infoText)) {
            options.infoText = pagerOptions.infoText
        }
        that._createComponent($element, Pager, options)
    },
    getPageSizes: function() {
        var that = this,
            dataController = that.getController("data"),
            pagerOptions = that.option("pager"),
            allowedPageSizes = pagerOptions && pagerOptions.allowedPageSizes,
            pageSize = dataController.pageSize();
        if (!isDefined(that._pageSizes) || inArray(pageSize, that._pageSizes) === -1) {
            that._pageSizes = [];
            if (pagerOptions) {
                if (Array.isArray(allowedPageSizes)) {
                    that._pageSizes = allowedPageSizes
                } else {
                    if (allowedPageSizes && pageSize > 1) {
                        that._pageSizes = [Math.floor(pageSize / 2), pageSize, 2 * pageSize]
                    }
                }
            }
        }
        return that._pageSizes
    },
    isVisible: function() {
        var that = this,
            dataController = that.getController("data"),
            pagerOptions = that.option("pager"),
            pagerVisible = pagerOptions && pagerOptions.visible,
            scrolling = that.option("scrolling");
        if (that._isVisible) {
            return true
        }
        if ("auto" === pagerVisible) {
            if (scrolling && ("virtual" === scrolling.mode || "infinite" === scrolling.mode)) {
                pagerVisible = false
            } else {
                pagerVisible = dataController.pageCount() > 1 || dataController.isLoaded() && !dataController.hasKnownLastPage()
            }
        }
        that._isVisible = pagerVisible;
        return pagerVisible
    },
    getHeight: function() {
        return this.getElementHeight()
    },
    optionChanged: function(args) {
        var that = this,
            name = args.name,
            isPager = "pager" === name,
            isPaging = "paging" === name,
            isDataSource = "dataSource" === name,
            isScrolling = "scrolling" === name,
            dataController = that.getController("data");
        if (isPager || isPaging || isScrolling || isDataSource) {
            args.handled = true;
            if (dataController.skipProcessingPagingChange(args.fullName)) {
                return
            }
            if (isPager || isPaging) {
                that._pageSizes = null
            }
            if (isPager || isPaging || isScrolling) {
                that._isVisible = false
            }
            if (!isDataSource) {
                that._invalidate();
                if (hasWindow && isPager && that.component) {
                    that.component.resize()
                }
            }
        }
    }
});
module.exports = {
    defaultOptions: function() {
        return {
            pager: {
                visible: "auto",
                showPageSizeSelector: false,
                allowedPageSizes: "auto"
            }
        }
    },
    views: {
        pagerView: PagerView
    }
};
