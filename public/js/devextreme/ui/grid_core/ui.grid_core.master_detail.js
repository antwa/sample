/**
 * DevExtreme (ui/grid_core/ui.grid_core.master_detail.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    grep = require("../../core/utils/common").grep,
    each = require("../../core/utils/iterator").each,
    isDefined = require("../../core/utils/type").isDefined;
var MASTER_DETAIL_CELL_CLASS = "dx-master-detail-cell",
    MASTER_DETAIL_ROW_CLASS = "dx-master-detail-row",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    ROW_LINES_CLASS = "dx-row-lines";
module.exports = {
    defaultOptions: function() {
        return {
            masterDetail: {
                enabled: false,
                autoExpandAll: false,
                template: null
            }
        }
    },
    extenders: {
        controllers: {
            columns: {
                _getExpandColumnsCore: function() {
                    var expandColumns = this.callBase();
                    if (this.option("masterDetail.enabled")) {
                        expandColumns.push({
                            cellTemplate: gridCoreUtils.getExpandCellTemplate()
                        })
                    }
                    return expandColumns
                }
            },
            data: function() {
                var initMasterDetail = function(that) {
                    that._expandedItems = [];
                    that._isExpandAll = that.option("masterDetail.autoExpandAll")
                };
                return {
                    init: function() {
                        var that = this;
                        initMasterDetail(that);
                        that.callBase()
                    },
                    expandAll: function(groupIndex) {
                        var that = this;
                        if (groupIndex < 0) {
                            that._isExpandAll = true;
                            that._expandedItems = [];
                            that.updateItems()
                        } else {
                            that.callBase.apply(that, arguments)
                        }
                    },
                    collapseAll: function(groupIndex) {
                        var that = this;
                        if (groupIndex < 0) {
                            that._isExpandAll = false;
                            that._expandedItems = [];
                            that.updateItems()
                        } else {
                            that.callBase.apply(that, arguments)
                        }
                    },
                    isRowExpanded: function(key) {
                        var that = this,
                            expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);
                        if (Array.isArray(key)) {
                            return that.callBase.apply(that, arguments)
                        } else {
                            return !!(that._isExpandAll ^ (expandIndex >= 0 && that._expandedItems[expandIndex].visible))
                        }
                    },
                    _getRowIndicesForExpand: function(key) {
                        var rowIndex = this.getRowIndexByKey(key);
                        return [rowIndex, rowIndex + 1]
                    },
                    _changeRowExpandCore: function(key) {
                        var expandIndex, that = this;
                        if (Array.isArray(key)) {
                            return that.callBase.apply(that, arguments)
                        } else {
                            expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);
                            if (expandIndex >= 0) {
                                var visible = that._expandedItems[expandIndex].visible;
                                that._expandedItems[expandIndex].visible = !visible
                            } else {
                                that._expandedItems.push({
                                    key: key,
                                    visible: true
                                })
                            }
                            that.updateItems({
                                changeType: "update",
                                rowIndices: that._getRowIndicesForExpand(key)
                            })
                        }
                    },
                    _processDataItem: function(data, options) {
                        var that = this,
                            dataItem = that.callBase.apply(that, arguments);
                        dataItem.isExpanded = that.isRowExpanded(dataItem.key);
                        if (void 0 === options.detailColumnIndex) {
                            options.detailColumnIndex = -1;
                            each(options.visibleColumns, function(index, column) {
                                if ("expand" === column.command && !isDefined(column.groupIndex)) {
                                    options.detailColumnIndex = index;
                                    return false
                                }
                            })
                        }
                        if (options.detailColumnIndex >= 0) {
                            dataItem.values[options.detailColumnIndex] = dataItem.isExpanded
                        }
                        return dataItem
                    },
                    _processItems: function(items, changeType) {
                        var expandIndex, that = this,
                            result = [];
                        items = that.callBase.apply(that, arguments);
                        if ("loadingAll" === changeType) {
                            return items
                        }
                        if ("refresh" === changeType) {
                            that._expandedItems = grep(that._expandedItems, function(item) {
                                return item.visible
                            })
                        }
                        each(items, function(index, item) {
                            result.push(item);
                            expandIndex = gridCoreUtils.getIndexByKey(item.key, that._expandedItems);
                            if ("data" === item.rowType && (item.isExpanded || expandIndex >= 0) && !item.inserted) {
                                result.push({
                                    visible: item.isExpanded,
                                    rowType: "detail",
                                    key: item.key,
                                    data: item.data,
                                    values: []
                                })
                            }
                        });
                        return result
                    },
                    optionChanged: function(args) {
                        var value, previousValue, isEnabledChanged, isAutoExpandAllChanged, that = this;
                        if ("masterDetail" === args.name) {
                            args.name = "dataSource";
                            switch (args.fullName) {
                                case "masterDetail":
                                    value = args.value || {};
                                    previousValue = args.previousValue || {};
                                    isEnabledChanged = value.enabled !== previousValue.enabled;
                                    isAutoExpandAllChanged = value.autoExpandAll !== previousValue.autoExpandAll;
                                    break;
                                case "masterDetail.enabled":
                                    isEnabledChanged = true;
                                    break;
                                case "masterDetail.autoExpandAll":
                                    isAutoExpandAllChanged = true
                            }
                            if (isEnabledChanged || isAutoExpandAllChanged) {
                                initMasterDetail(that)
                            }
                        }
                        that.callBase(args)
                    }
                }
            }()
        },
        views: {
            rowsView: function() {
                return {
                    _getCellTemplate: function(options) {
                        var template, that = this,
                            column = options.column,
                            editingController = that.getController("editing"),
                            isEditRow = editingController && editingController.isEditRow(options.rowIndex);
                        if ("detail" === column.command && !isEditRow) {
                            template = that.option("masterDetail.template") || {
                                allowRenderToDetachedContainer: false,
                                render: that._getDefaultTemplate(column)
                            }
                        } else {
                            template = that.callBase.apply(that, arguments)
                        }
                        return template
                    },
                    _cellPrepared: function($cell, options) {
                        var that = this,
                            component = that.component;
                        that.callBase.apply(that, arguments);
                        if ("detail" === options.rowType && "detail" === options.column.command) {
                            $cell.find("." + that.getWidgetContainerClass()).each(function() {
                                var dataGrid = $(this).parent().data("dxDataGrid");
                                if (dataGrid) {
                                    dataGrid.on("contentReady", function() {
                                        if (that._isFixedColumns) {
                                            var $rows = $(component.getRowElement(options.rowIndex));
                                            if ($rows && 2 === $rows.length && $rows.eq(0).height() !== $rows.eq(1).height()) {
                                                component.updateDimensions()
                                            }
                                        } else {
                                            var scrollable = component.getScrollable();
                                            scrollable && scrollable.update()
                                        }
                                    })
                                }
                            })
                        }
                    },
                    _isDetailRow: function(row) {
                        return row && row.rowType && 0 === row.rowType.indexOf("detail")
                    },
                    _createRow: function(row) {
                        var $row = this.callBase(row);
                        if (row && this._isDetailRow(row)) {
                            this.option("showRowLines") && $row.addClass(ROW_LINES_CLASS);
                            $row.addClass(MASTER_DETAIL_ROW_CLASS);
                            if (isDefined(row.visible)) {
                                $row.toggle(row.visible)
                            }
                        }
                        return $row
                    },
                    _getGroupCellOptions: function(options) {
                        var row = options.row,
                            groupColumns = this._columnsController.getGroupColumns(),
                            columnIndex = groupColumns.length + options.columnsCountBeforeGroups,
                            emptyCellsCount = columnIndex + Number(this.option("masterDetail.enabled"));
                        if (row && this._isDetailRow(row)) {
                            return {
                                columnIndex: columnIndex,
                                emptyCellsCount: emptyCellsCount,
                                colspan: options.columns.length - emptyCellsCount
                            }
                        }
                        return this.callBase(options)
                    },
                    _renderCells: function($row, options) {
                        var $detailCell, groupCellOptions, i, row = options.row;
                        if (row.rowType && this._isDetailRow(row)) {
                            groupCellOptions = this._getGroupCellOptions(options);
                            for (i = 0; i < groupCellOptions.emptyCellsCount; i++) {
                                this._renderCell($row, {
                                    value: null,
                                    row: row,
                                    rowIndex: row.rowIndex,
                                    column: options.columns[i]
                                })
                            }
                            $detailCell = this._renderCell($row, {
                                value: null,
                                row: row,
                                rowIndex: row.rowIndex,
                                column: {
                                    command: "detail"
                                },
                                columnIndex: groupCellOptions.columnIndex
                            });
                            $detailCell.addClass(CELL_FOCUS_DISABLED_CLASS).addClass(MASTER_DETAIL_CELL_CLASS).attr("colSpan", groupCellOptions.colspan)
                        } else {
                            this.callBase.apply(this, arguments)
                        }
                    }
                }
            }()
        }
    }
};
