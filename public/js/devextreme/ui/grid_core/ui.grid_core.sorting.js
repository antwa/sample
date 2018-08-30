/**
 * DevExtreme (ui/grid_core/ui.grid_core.sorting.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    clickEvent = require("../../events/click"),
    isDefined = require("../../core/utils/type").isDefined,
    map = require("../../core/utils/iterator").map,
    extend = require("../../core/utils/extend").extend,
    sortingMixin = require("../grid_core/ui.grid_core.sorting_mixin"),
    messageLocalization = require("../../localization/message"),
    eventUtils = require("../../events/utils");
var COLUMN_HEADERS_VIEW_NAMESPACE = "dxDataGridColumnHeadersView";
var ColumnHeadersViewSortingExtender = extend({}, sortingMixin, {
    _createRow: function(row) {
        var that = this,
            $row = that.callBase(row);
        if ("header" === row.rowType) {
            eventsEngine.on($row, eventUtils.addNamespace(clickEvent.name, COLUMN_HEADERS_VIEW_NAMESPACE), "td", that.createAction(function(e) {
                if ($(e.event.currentTarget).parent().get(0) !== $row.get(0)) {
                    return
                }
                var keyName = null,
                    event = e.event,
                    $cellElementFromEvent = $(event.currentTarget),
                    rowIndex = $cellElementFromEvent.parent().index(),
                    columnIndex = map(that.getCellElements(rowIndex), function($cellElement, index) {
                        if ($cellElement === $cellElementFromEvent.get(0)) {
                            return index
                        }
                    })[0],
                    visibleColumns = that._columnsController.getVisibleColumns(rowIndex),
                    column = visibleColumns[columnIndex],
                    editingController = that.getController("editing"),
                    editingMode = that.option("editing.mode"),
                    isCellEditing = editingController && editingController.isEditing() && ("batch" === editingMode || "cell" === editingMode);
                if (isCellEditing || !that._isSortableElement($(event.target))) {
                    return
                }
                if (column && !isDefined(column.groupIndex) && !column.command) {
                    if (event.shiftKey) {
                        keyName = "shift"
                    } else {
                        if (event.ctrlKey) {
                            keyName = "ctrl"
                        }
                    }
                    setTimeout(function() {
                        that._columnsController.changeSortOrder(column.index, keyName)
                    })
                }
            }))
        }
        return $row
    },
    _renderCellContent: function($cell, options) {
        var that = this,
            column = options.column;
        if (!column.command && "header" === options.rowType) {
            that._applyColumnState({
                name: "sort",
                rootElement: $cell,
                column: column,
                showColumnLines: that.option("showColumnLines")
            })
        }
        that.callBase($cell, options)
    },
    _columnOptionChanged: function(e) {
        var changeTypes = e.changeTypes;
        if (1 === changeTypes.length && changeTypes.sorting) {
            this._updateIndicators("sort");
            return
        }
        this.callBase(e)
    },
    optionChanged: function(args) {
        var that = this;
        switch (args.name) {
            case "sorting":
                that._invalidate();
                args.handled = true;
                break;
            default:
                that.callBase(args)
        }
    }
});
var HeaderPanelSortingExtender = extend({}, sortingMixin, {
    _createGroupPanelItem: function($rootElement, groupColumn) {
        var that = this,
            $item = that.callBase.apply(that, arguments);
        eventsEngine.on($item, eventUtils.addNamespace(clickEvent.name, "dxDataGridHeaderPanel"), that.createAction(function() {
            setTimeout(function() {
                that.getController("columns").changeSortOrder(groupColumn.index)
            })
        }));
        that._applyColumnState({
            name: "sort",
            rootElement: $item,
            column: {
                alignment: that.option("rtlEnabled") ? "right" : "left",
                allowSorting: groupColumn.allowSorting,
                sortOrder: "desc" === groupColumn.sortOrder ? "desc" : "asc"
            },
            showColumnLines: true
        });
        return $item
    },
    optionChanged: function(args) {
        var that = this;
        switch (args.name) {
            case "sorting":
                that._invalidate();
                args.handled = true;
                break;
            default:
                that.callBase(args)
        }
    }
});
module.exports = {
    defaultOptions: function() {
        return {
            sorting: {
                mode: "single",
                ascendingText: messageLocalization.format("dxDataGrid-sortingAscendingText"),
                descendingText: messageLocalization.format("dxDataGrid-sortingDescendingText"),
                clearText: messageLocalization.format("dxDataGrid-sortingClearText")
            }
        }
    },
    extenders: {
        views: {
            columnHeadersView: ColumnHeadersViewSortingExtender,
            headerPanel: HeaderPanelSortingExtender
        }
    }
};
