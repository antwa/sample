/**
 * DevExtreme (ui/grid_core/ui.grid_core.column_state_mixin.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    extend = require("../../core/utils/extend").extend,
    getDefaultAlignment = require("../../core/utils/position").getDefaultAlignment,
    commonUtils = require("../../core/utils/common");
var COLUMN_INDICATORS_CLASS = "dx-column-indicators",
    GROUP_PANEL_ITEM_CLASS = "dx-group-panel-item";
module.exports = {
    _applyColumnState: function(options) {
        var that = this,
            rtlEnabled = this.option("rtlEnabled"),
            columnAlignment = that._getColumnAlignment(options.column.alignment, rtlEnabled),
            parameters = extend(true, {
                columnAlignment: columnAlignment
            }, options),
            isGroupPanelItem = parameters.rootElement.hasClass(GROUP_PANEL_ITEM_CLASS),
            $indicatorsContainer = that._createIndicatorContainer(parameters, isGroupPanelItem),
            $span = $("<span>").addClass(that._getIndicatorClassName(options.name)),
            getIndicatorAlignment = function() {
                if (rtlEnabled) {
                    return "left" === columnAlignment ? "right" : "left"
                }
                return columnAlignment
            };
        parameters.container = $indicatorsContainer;
        parameters.indicator = $span;
        that._renderIndicator(parameters);
        $indicatorsContainer[(isGroupPanelItem || !options.showColumnLines) && "left" === getIndicatorAlignment() ? "appendTo" : "prependTo"](options.rootElement);
        return $span
    },
    _getIndicatorClassName: commonUtils.noop,
    _getColumnAlignment: function(alignment, rtlEnabled) {
        rtlEnabled = rtlEnabled || this.option("rtlEnabled");
        return alignment && "center" !== alignment ? alignment : getDefaultAlignment(rtlEnabled)
    },
    _createIndicatorContainer: function(options, ignoreIndicatorAlignment) {
        var $indicatorsContainer = this._getIndicatorContainer(options.rootElement),
            indicatorAlignment = "left" === options.columnAlignment ? "right" : "left";
        if (!$indicatorsContainer.length) {
            $indicatorsContainer = $("<div>").addClass(COLUMN_INDICATORS_CLASS)
        }
        return $indicatorsContainer.css("float", options.showColumnLines && !ignoreIndicatorAlignment ? indicatorAlignment : null)
    },
    _getIndicatorContainer: function($cell) {
        return $cell && $cell.find("." + COLUMN_INDICATORS_CLASS)
    },
    _getIndicatorElements: function($cell) {
        var $indicatorContainer = this._getIndicatorContainer($cell);
        return $indicatorContainer && $indicatorContainer.children()
    },
    _renderIndicator: function(options) {
        var $container = options.container,
            $indicator = options.indicator;
        $container && $indicator && $container.append($indicator)
    },
    _updateIndicators: function(indicatorName) {
        var rowOptions, $cell, i, that = this,
            columns = that.getColumns(),
            $cells = that.getColumnElements();
        if (!$cells || !$cells.length) {
            return
        }
        for (i = 0; i < columns.length; i++) {
            $cell = $cells.eq(i);
            that._updateIndicator($cell, columns[i], indicatorName);
            rowOptions = $cell.parent().data("options");
            if (rowOptions && rowOptions.cells) {
                rowOptions.cells[$cell.index()].column = columns[i]
            }
        }
    },
    _updateIndicator: function($cell, column, indicatorName) {
        if (!column.command) {
            return this._applyColumnState({
                name: indicatorName,
                rootElement: $cell,
                column: column,
                showColumnLines: this.option("showColumnLines")
            })
        }
    }
};
