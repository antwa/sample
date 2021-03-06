/**
 * DevExtreme (ui/grid_core/ui.grid_core.filter_panel.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _type = require("../../core/utils/type");
var $ = require("../../core/renderer"),
    modules = require("./ui.grid_core.modules"),
    gridUtils = require("./ui.grid_core.utils"),
    eventsEngine = require("../../events/core/events_engine"),
    messageLocalization = require("../../localization/message"),
    CheckBox = require("../check_box"),
    utils = require("../filter_builder/utils"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    inflector = require("../../core/utils/inflector");
var FILTER_PANEL_CLASS = "filter-panel",
    FILTER_PANEL_TEXT_CLASS = FILTER_PANEL_CLASS + "-text",
    FILTER_PANEL_CHECKBOX_CLASS = FILTER_PANEL_CLASS + "-checkbox",
    FILTER_PANEL_CLEAR_FILTER_CLASS = FILTER_PANEL_CLASS + "-clear-filter",
    FILTER_PANEL_LEFT_CONTAINER = FILTER_PANEL_CLASS + "-left";
var FILTER_PANEL_TARGET = "filterPanel";
var FilterPanelView = modules.View.inherit({
    isVisible: function() {
        return this.option("filterPanel.visible") && this.getController("data").dataSource()
    },
    init: function() {
        var _this = this;
        this.getController("data").dataSourceChanged.add(function() {
            return _this.render()
        })
    },
    _renderCore: function() {
        var $leftContainer, that = this,
            $element = that.element();
        $element.empty().addClass(that.addWidgetPrefix(FILTER_PANEL_CLASS));
        $leftContainer = $("<div>").addClass(that.addWidgetPrefix(FILTER_PANEL_LEFT_CONTAINER)).appendTo($element);
        if (that.option("filterValue") || that._filterValueBuffer) {
            $leftContainer.append(that._getCheckElement()).append(that._getFilterElement()).append(that._getTextElement());
            $element.append(that._getRemoveButtonElement())
        } else {
            $leftContainer.append(that._getFilterElement()).append(that._getTextElement())
        }
    },
    _getCheckElement: function() {
        var that = this,
            $element = $("<div>").addClass(this.addWidgetPrefix(FILTER_PANEL_CHECKBOX_CLASS));
        that._createComponent($element, CheckBox, {
            value: that.option("filterPanel.filterEnabled"),
            onValueChanged: function(e) {
                that.option("filterPanel.filterEnabled", e.value)
            }
        });
        $element.attr("title", this.option("filterPanel.texts.filterEnabledHint"));
        return $element
    },
    _getFilterElement: function() {
        var that = this,
            $element = $("<div>").addClass("dx-icon-filter");
        eventsEngine.on($element, "click", function() {
            that.option("filterBuilderPopup.visible", true)
        });
        return $element
    },
    _getTextElement: function() {
        var filterText, that = this,
            $textElement = $("<div>").addClass(that.addWidgetPrefix(FILTER_PANEL_TEXT_CLASS)),
            filterValue = that.option("filterValue");
        if (filterValue) {
            when(that.getFilterText(filterValue, that.getController("filterSync").getCustomFilterOperations())).done(function(filterText) {
                var customizeText = that.option("filterPanel.customizeText");
                if (customizeText) {
                    var customText = customizeText({
                        component: that.component,
                        filterValue: filterValue,
                        text: filterText
                    });
                    if ("string" === typeof customText) {
                        filterText = customText
                    }
                }
                $textElement.text(filterText)
            })
        } else {
            filterText = that.option("filterPanel.texts.createFilter");
            $textElement.text(filterText)
        }
        eventsEngine.on($textElement, "click", function() {
            that.option("filterBuilderPopup.visible", true)
        });
        return $textElement
    },
    _getRemoveButtonElement: function() {
        var that = this,
            $element = $("<div>").addClass(this.addWidgetPrefix(FILTER_PANEL_CLEAR_FILTER_CLASS)).text(this.option("filterPanel.texts.clearFilter"));
        eventsEngine.on($element, "click", function() {
            that.option("filterValue", null)
        });
        return $element
    },
    optionChanged: function(args) {
        switch (args.name) {
            case "filterValue":
                this._invalidate();
                this.option("filterPanel.filterEnabled", true);
                args.handled = true;
                break;
            case "filterPanel":
                this._invalidate();
                args.handled = true;
                break;
            default:
                this.callBase(args)
        }
    },
    _getConditionText: function(fieldText, operationText, valueText) {
        var result = "[" + fieldText + "] " + operationText;
        if ((0, _type.isDefined)(valueText)) {
            result += valueText
        }
        return result
    },
    getConditionText: function(filterValue, options) {
        var operationText, that = this,
            operation = filterValue[1],
            deferred = new Deferred,
            customOperation = utils.getCustomOperation(options.customOperations, operation),
            field = utils.getField(filterValue[0], options.columns),
            fieldText = field.caption || "",
            value = filterValue[2];
        if (customOperation) {
            operationText = customOperation.caption || inflector.captionize(customOperation.name)
        } else {
            if (null === value) {
                operationText = utils.getCaptionByOperation("=" === operation ? "isblank" : "isnotblank", options.filterOperationDescriptions)
            } else {
                operationText = utils.getCaptionByOperation(operation, options.filterOperationDescriptions)
            }
        }
        if ((0, _type.isDefined)(value) || customOperation && customOperation.customizeText) {
            var displayValue = gridUtils.getDisplayValue(field, value);
            when(utils.getCurrentValueText(field, displayValue, customOperation, FILTER_PANEL_TARGET)).done(function(data) {
                var valueText = Array.isArray(data) ? "('" + data.join("', '") + "')" : " '" + data + "'";
                deferred.resolve(that._getConditionText(fieldText, operationText, valueText))
            })
        } else {
            deferred.resolve(that._getConditionText(fieldText, operationText))
        }
        return deferred
    },
    getGroupText: function(filterValue, options, isInnerGroup) {
        var that = this,
            result = new Deferred,
            textParts = [],
            groupValue = utils.getGroupValue(filterValue);
        filterValue.forEach(function(item) {
            if (utils.isCondition(item)) {
                textParts.push(that.getConditionText(item, options))
            } else {
                if (utils.isGroup(item)) {
                    textParts.push(that.getGroupText(item, options, true))
                }
            }
        });
        when.apply(this, textParts).done(function() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key]
            }
            var text = void 0;
            if ("!" === groupValue[0]) {
                var groupText = options.groupOperationDescriptions["not" + groupValue.substring(1, 2).toUpperCase() + groupValue.substring(2)].split(" ");
                text = groupText[0] + " " + args[0]
            } else {
                text = args.join(" " + options.groupOperationDescriptions[groupValue] + " ")
            }
            if (isInnerGroup) {
                text = "(" + text + ")"
            }
            result.resolve(text)
        });
        return result
    },
    getFilterText: function(filterValue, customOperations) {
        var that = this,
            options = {
                customOperations: customOperations,
                columns: that.getController("columns").getFilteringColumns(),
                filterOperationDescriptions: that.option("filterBuilder.filterOperationDescriptions"),
                groupOperationDescriptions: that.option("filterBuilder.groupOperationDescriptions")
            };
        return utils.isCondition(filterValue) ? that.getConditionText(filterValue, options) : that.getGroupText(filterValue, options)
    }
});
module.exports = {
    defaultOptions: function() {
        return {
            filterPanel: {
                visible: false,
                filterEnabled: true,
                texts: {
                    createFilter: messageLocalization.format("dxDataGrid-filterPanelCreateFilter"),
                    clearFilter: messageLocalization.format("dxDataGrid-filterPanelClearFilter"),
                    filterEnabledHint: messageLocalization.format("dxDataGrid-filterPanelFilterEnabledHint")
                }
            }
        }
    },
    views: {
        filterPanelView: FilterPanelView
    },
    extenders: {
        controllers: {
            data: {
                optionChanged: function(args) {
                    switch (args.name) {
                        case "filterPanel":
                            this._applyFilter();
                            args.handled = true;
                            break;
                        default:
                            this.callBase(args)
                    }
                }
            }
        }
    }
};
