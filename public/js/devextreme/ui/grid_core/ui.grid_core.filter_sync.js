/**
 * DevExtreme (ui/grid_core/ui.grid_core.filter_sync.js)
 * Version: 18.1.5
 * Build date: Fri Jul 27 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _type = require("../../core/utils/type");
var modules = require("./ui.grid_core.modules"),
    utils = require("../filter_builder/utils"),
    errors = require("../widget/ui.errors"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    filterUtils = require("../shared/filtering"),
    customOperations = require("./ui.grid_core.filter_custom_operations");
var FILTER_ROW_OPERATIONS = ["=", "<>", "<", "<=", ">", ">=", "notcontains", "contains", "startswith", "endswith", "between"];

function getColumnIdentifier(column) {
    return column.name || column.dataField
}

function checkForErrors(columns) {
    columns.forEach(function(column) {
        var identifier = getColumnIdentifier(column);
        if (!(0, _type.isDefined)(identifier) && column.allowFiltering) {
            throw new errors.Error("E1049", column.caption)
        }
    })
}
var FilterSyncController = modules.Controller.inherit(function() {
    var getEmptyFilterValues = function() {
        return {
            filterType: "include",
            filterValues: void 0
        }
    };
    var canSyncHeaderFilterWithFilterRow = function(column) {
        return !filterUtils.getGroupInterval(column) && !(column.headerFilter && column.headerFilter.dataSource)
    };
    var getHeaderFilterFromCondition = function(headerFilterCondition, column) {
        if (!headerFilterCondition) {
            return getEmptyFilterValues()
        }
        var filterType, selectedFilterOperation = headerFilterCondition[1],
            value = headerFilterCondition[2],
            hasArrayValue = Array.isArray(value);
        if (!hasArrayValue) {
            if (!canSyncHeaderFilterWithFilterRow(column)) {
                return getEmptyFilterValues()
            }
        }
        switch (selectedFilterOperation) {
            case "anyof":
            case "=":
                filterType = "include";
                break;
            case "noneof":
            case "<>":
                filterType = "exclude";
                break;
            default:
                return getEmptyFilterValues()
        }
        return {
            filterType: filterType,
            filterValues: hasArrayValue ? value : [value]
        }
    };
    var getConditionFromFilterRow = function(column) {
        var value = column.filterValue;
        if ((0, _type.isDefined)(value)) {
            var operation = column.selectedFilterOperation || column.defaultFilterOperation || utils.getDefaultOperation(column),
                filter = [getColumnIdentifier(column), operation, column.filterValue];
            return filter
        } else {
            return null
        }
    };
    var getConditionFromHeaderFilter = function(column) {
        var selectedOperation, value, filterValues = column.filterValues;
        if (!filterValues) {
            return null
        }
        if (canSyncHeaderFilterWithFilterRow(column) && 1 === column.filterValues.length && !Array.isArray(filterValues[0])) {
            "exclude" === column.filterType ? selectedOperation = "<>" : selectedOperation = "=";
            value = filterValues[0]
        } else {
            "exclude" === column.filterType ? selectedOperation = "noneof" : selectedOperation = "anyof";
            value = filterValues
        }
        return [getColumnIdentifier(column), selectedOperation, value]
    };
    var updateHeaderFilterCondition = function(columnsController, column, headerFilterCondition) {
        var headerFilter = getHeaderFilterFromCondition(headerFilterCondition, column);
        columnsController.columnOption(getColumnIdentifier(column), headerFilter)
    };
    var updateFilterRowCondition = function(columnsController, column, condition) {
        var filterRowOptions, selectedFilterOperation = condition && condition[1];
        if (FILTER_ROW_OPERATIONS.indexOf(selectedFilterOperation) >= 0) {
            filterRowOptions = {
                filterValue: condition[2],
                selectedFilterOperation: selectedFilterOperation
            }
        } else {
            filterRowOptions = {
                filterValue: void 0,
                selectedFilterOperation: void 0
            }
        }
        columnsController.columnOption(getColumnIdentifier(column), filterRowOptions)
    };
    return {
        syncFilterValue: function() {
            var that = this,
                columnsController = that.getController("columns"),
                columns = columnsController.getFilteringColumns();
            this._skipSyncColumnOptions = true;
            columns.forEach(function(column) {
                var filterConditions = utils.getMatchedConditions(that.option("filterValue"), getColumnIdentifier(column));
                if (1 === filterConditions.length) {
                    var filterCondition = filterConditions[0];
                    updateHeaderFilterCondition(columnsController, column, filterCondition);
                    updateFilterRowCondition(columnsController, column, filterCondition)
                } else {
                    (0, _type.isDefined)(column.filterValues) && updateHeaderFilterCondition(columnsController, column);
                    (0, _type.isDefined)(column.filterValue) && updateFilterRowCondition(columnsController, column)
                }
            });
            this._skipSyncColumnOptions = false
        },
        _initSync: function() {
            var columns = this.getController("columns").getColumns();
            checkForErrors(columns);
            if (!this.option("filterValue")) {
                var filteringColumns = this.getController("columns").getFilteringColumns(),
                    filterValue = this.getFilterValueFromColumns(filteringColumns);
                this.option("filterValue", filterValue)
            }
            this.syncFilterValue()
        },
        init: function() {
            var _this = this;
            var dataController = this.getController("data");
            if (dataController.isFilterSyncActive()) {
                if (this.getController("columns").isAllDataTypesDefined()) {
                    this._initSync()
                } else {
                    dataController.dataSourceChanged.add(function() {
                        return _this._initSync()
                    })
                }
            }
        },
        _getSyncFilterRow: function(filterValue, column) {
            var filter = getConditionFromFilterRow(column);
            if ((0, _type.isDefined)(filter)) {
                return utils.syncFilters(filterValue, filter)
            } else {
                return utils.removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column))
            }
        },
        _getSyncHeaderFilter: function(filterValue, column) {
            var filter = getConditionFromHeaderFilter(column);
            if (filter) {
                return utils.syncFilters(filterValue, filter)
            } else {
                return utils.removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column))
            }
        },
        getFilterValueFromColumns: function(columns) {
            if (!this.getController("data").isFilterSyncActive()) {
                return null
            }
            var filterValue = ["and"];
            columns && columns.forEach(function(column) {
                var headerFilter = getConditionFromHeaderFilter(column),
                    filterRow = getConditionFromFilterRow(column);
                headerFilter && utils.addItem(headerFilter, filterValue);
                filterRow && utils.addItem(filterRow, filterValue)
            });
            return utils.getNormalizedFilter(filterValue, columns)
        },
        syncFilterRow: function(column, value) {
            this.option("filterValue", this._getSyncFilterRow(this.option("filterValue"), column))
        },
        syncHeaderFilter: function(column) {
            this.option("filterValue", this._getSyncHeaderFilter(this.option("filterValue"), column))
        },
        getCustomFilterOperations: function() {
            var filterBuilderCustomOperations = this.option("filterBuilder.customOperations") || [];
            return [customOperations.anyOf(this.component), customOperations.noneOf(this.component)].concat(filterBuilderCustomOperations)
        },
        publicMethods: function() {
            return ["getCustomFilterOperations"]
        }
    }
}());
var DataControllerFilterSyncExtender = {
    isFilterSyncActive: function() {
        var filterSyncEnabledValue = this.option("filterSyncEnabled");
        return "auto" === filterSyncEnabledValue ? this.option("filterPanel.visible") : filterSyncEnabledValue
    },
    skipCalculateColumnFilters: function() {
        return (0, _type.isDefined)(this.option("filterValue")) && this.isFilterSyncActive()
    },
    _calculateAdditionalFilter: function() {
        var that = this;
        if (false === that.option("filterPanel.filterEnabled")) {
            return that.callBase()
        }
        var filters = [that.callBase()],
            columns = that.getController("columns").getFilteringColumns(),
            filterValue = that.option("filterValue");
        if (that.isFilterSyncActive()) {
            var currentColumn = that.getController("headerFilter").getCurrentColumn();
            if (currentColumn && filterValue) {
                filterValue = utils.removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(currentColumn))
            }
        }
        var customOperations = that.getController("filterSync").getCustomFilterOperations(),
            calculatedFilterValue = utils.getFilterExpression(filterValue, columns, customOperations, "filterBuilder");
        if (calculatedFilterValue) {
            filters.push(calculatedFilterValue)
        }
        return gridCoreUtils.combineFilters(filters)
    },
    _parseColumnPropertyName: function(fullName) {
        var matched = fullName.match(/.*\.(.*)/);
        return matched[1]
    },
    optionChanged: function(args) {
        switch (args.name) {
            case "filterValue":
                this._applyFilter();
                this.isFilterSyncActive() && this.getController("filterSync").syncFilterValue();
                args.handled = true;
                break;
            case "filterSyncEnabled":
                args.handled = true;
                break;
            case "columns":
                if (this.isFilterSyncActive()) {
                    var column = this.getController("columns").getColumnByPath(args.fullName),
                        filterSyncController = this.getController("filterSync");
                    if (column && !filterSyncController._skipSyncColumnOptions) {
                        var propertyName = this._parseColumnPropertyName(args.fullName);
                        filterSyncController._skipSyncColumnOptions = true;
                        if (["filterValues", "filterType"].indexOf(propertyName) > -1) {
                            filterSyncController.syncHeaderFilter(column)
                        } else {
                            if (["filterValue", "selectedFilterOperation"].indexOf(propertyName) > -1) {
                                filterSyncController.syncFilterRow(column, column.filterValue)
                            }
                        }
                        filterSyncController._skipSyncColumnOptions = false
                    }
                }
                break;
            default:
                this.callBase(args)
        }
    }
};
var ColumnHeadersViewFilterSyncExtender = {
    _isHeaderFilterEmpty: function(column) {
        if (this.getController("data").isFilterSyncActive()) {
            return !utils.filterHasField(this.option("filterValue"), getColumnIdentifier(column))
        }
        return this.callBase(column)
    },
    _needUpdateFilterIndicators: function() {
        return !this.getController("data").isFilterSyncActive()
    },
    optionChanged: function(args) {
        if ("filterValue" === args.name) {
            this._updateHeaderFilterIndicators()
        } else {
            this.callBase(args)
        }
    }
};
module.exports = {
    defaultOptions: function() {
        return {
            filterValue: null,
            filterSyncEnabled: "auto"
        }
    },
    controllers: {
        filterSync: FilterSyncController
    },
    extenders: {
        controllers: {
            data: DataControllerFilterSyncExtender
        },
        views: {
            columnHeadersView: ColumnHeadersViewFilterSyncExtender
        }
    }
};
