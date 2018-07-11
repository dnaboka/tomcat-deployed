/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

var AdHocTable = {
    render_mode: 'table',
    state: {},
    FETCH_MORE_ROWS: "fetchMoreRows",
    ALMOST_IN_VIEW_OFFSET: 100,
    MINIMUM_COL_WIDTH: 0,
    DEFAULT_GROUP_LABEL_OVERLAY_LEN: 200,
    digitRegex: /\d+/,
    /*
     * UI Variables
     */
    columnHeaderRow:null,
    theRows:null,
    theCols:null,
    lastRow:null,
    existingRowCount:null,
    hoverColumn:-1,

    reset: function() {
        this.groupOverlays = [];
        this.columnResizers = {};
        this.columnOverlays = {};
        this.summaryOverlays = {};
        this.groupLabelOverlays = [];
        this.draggingColumnSizer = false;
        this.draggingColumnOverlay = false;
        this.draggingGroupOverlay = false;
        this.fetchingRows = false;
        this.draggingMoveOverColumnIndex = -1;
        this.draggingMoveOverGroupIndex = -1;
    },
    setMode : function(mode) {
        this.mode = mode;
    },
    getMode: function() {
        return this.mode;
    },

    init: function(){
        this.Rendering.infinitiveHorizontalScroll = _.bind(_.throttle(this.Rendering.infinitiveHorizontalScroll, 250), this.Rendering);
    },

    initAll: function(){
        adhocDesigner.overlayParent = isSupportsTouch() ? $("mainTableContainer").down() : $("mainTableContainer");
        adhocDesigner.enableXtabPivot(false);
        AdHocTable.theRows = $('canvasTable').rows;
        AdHocTable.existingRowCount = AdHocTable.theRows.length;
        AdHocTable.columnHeaderRow = $("columnHeaderRow");
        AdHocTable.state.endOfFile = false;
        AdHocTable.shouldFetchMoreRows() && AdHocTable.fetchMoreRows();
        AdHocTable.initRowDependentDimensions();
        AdHocTable.initOverlays();
        AdHocTable.initKeyEvents();
        /*
         *  Setup table options icon
         */
        jQuery('#mainTableContainer > #tableOptions').remove();
        jQuery('#tableOptions').appendTo('#mainTableContainer').position({
            of: jQuery('#mainTableContainer .caption'),
            at: 'left top',
            my: 'left top',
            offset: '11 10'
        }).on('mouseover', function(evt) {
                var $this = jQuery(this);

                $this.addClass('over').css('z-index', 100000);

                actionModel.showDropDownMenu(evt, this, this.id + AdHocTable.ACTION_MODEL_CONTEXT_SUFFIX,
                    AdHocTable.GRID_SELECTOR_MENU_CLASS, localContext.state.actionmodel);
            });

        // set a listener to catch the close event on the menu and display the bottom-border on the menu icon
        jQuery('body').on("actionmodel-mouseout", function(){
            jQuery('#tableOptions').removeClass('over').css('z-index', 9);
        });
    },

    Rendering: {

        // a link to AdHocTable, i.e. to itself
        me: false,

        fullDataSet: false, // the pointer to the 'state' structure, which holds all data which came from the server

        data: {
            containerLeftOffset: 0, // the distance between the most-right visible area on the page to the most-left side of the container
            amountOfDisplayedCols: 0, // how many columns are displayed at this time on the page
            isFirstRender: 0, // this flag shows if container is empty or not (on a first call it's always empty)
            forceShowNCols: false // a serve variable to force render N columns
        },

        // this function must be called only once after page loaded
        init: function() {

            // reset some variables
            this.data.isFirstRender = true; // because we were called by render() function
            // make this offset a 1 pixel less to able to run the `infinitiveHorizontalScroll` function at least once
            this.data.containerLeftOffset = adhocDesigner.ui.canvas.scrollLeft() + adhocDesigner.ui.canvas.width() - 1;

            // if user added some field or removed it, the render() function will be called and this init() function as well.
            // in this case we need to display all the records which were on the page before user added some field
            if (this.data.amountOfDisplayedCols > 0) {
                this.data.forceShowNCols = this.data.amountOfDisplayedCols;
            }

            // now, reset this variable
            this.data.amountOfDisplayedCols = 0;

        },

        // a listener of the scroll event in the container
        infinitiveHorizontalScroll: function() {

            var debug = 0,

            // shortcut for function
                log = function(){console.log.apply(console, arguments);},

            // getting the distance between the most-right visible area on the page to the most-left side of the container
                x1 = adhocDesigner.ui.canvas.scrollLeft() + adhocDesigner.ui.canvas.width();

            // if scroll event happened and the distance remains the same, it means this is a vertical scroll
            if (this.data.containerLeftOffset == x1) {
                if (debug) log("there was no change to horizontal scroll - skipping this round....");
                return;
            }

            // get the position of the most right element in the container
            // 'x1' (which is defined above) is the old position which was before event has occurred
            // 'x2' is the new position which was before event has occurred
            var
                tr = adhocDesigner.ui.canvas.find("table tr:first"),
                th = tr.find("th:last");

            // in case when there is no any column at all - just exit the function
            if (th.length === 0) return;

            var x2 = th.position().left;

            // get the difference between these two positions
            var gap = x2 - x1, newGap, counter = 0;
            if (debug) log("gap is: ", gap);

            // the main loop to add some columns and decrease the gap
            while ( gap < 800 ) {
                this.partialRender();
                newGap = tr.find("th:last").position().left - x1;
                if (newGap == gap) {
                    if (debug) log("gap was not changed...");
                    break;
                }

                // usually it's more than enough to make 10 loops, if we did more - it means something bad is going on there....
                if (counter++ > 10) {
                    if (debug) log("something bad is going on...");
                    break;
                }
                gap = newGap;
                break;
            }

            // saving last horizontal scroll distance
            this.data.containerLeftOffset = x1;
        },


        // the response from the server contains all columns, which may be sometimes 5-6k
        // this function can get as many columns as you need from the whole response.
        // it keeps track which column were taken last, fo the only parameter you need to send to it is
        // how many columns you want to get this time
        addMoreDataToFullState: function(newData) {
            var debug = 0,

            // shortcut for function
                log = function(){console.log.apply(console, arguments);},

            // shotrcut to me
                me = this;

            if (debug) log("data to add to full dataset: ", newData);

            var i, object;

            object = newData.table.flattenedData;
            for (i = 0; i < object.length; i++) this.fullDataSet.table.flattenedData.push(object[i]);

            // replace state variables with new values
            _.each(["endOfFile", "hitMaxRows", "inDesignView", "isShowingFullData"], function(k) {
                me.fullDataSet[k] = newData[k];
            });

            if (debug) log("compiled full dataset: ", this.fullDataSet);
        },

        // the response from the serve contains all columns, which may be sometimes 5-6k
        // this function can get as many columns as you need from the whole response.
        // it keeps track which column were taken last, fo the only parameter you need to send to it is
        // how many columns you want to get this time
        getPartialDataFromFullState: function(stateObj, start, recordsPerCall) {
            var debug = 0,

            // shortcut for function
                log = function(){console.log.apply(console, arguments);};

            if (debug) log("getPartialDataFromFullState: SOURCE: ", stateObj);

            recordsPerCall = recordsPerCall || 0;

            var
                i,
                end = start + recordsPerCall,
                object,
                res = {
                    columns: [],
                    table: {
                        hasColumns: stateObj.table.hasColumns,
                        hasSummaryRow: stateObj.table.hasSummaryRow,
                        showTableTotals: stateObj.table.showTableTotals,
                        showTableDetails: stateObj.table.showTableDetails,
                        columns: [],
                        columnHeaderRow: {
                            members: []
                        },
                        summaryRow: {
                            members: []
                        },
                        flattenedData: []
                    }
                };

            if (debug) log("data getter: reading from: ", start, " up to ", end);

            object = stateObj.columns;
            for (i = start; i < end && i < object.length; i++) res.columns.push(object[i]);

            object = stateObj.table.columns;
            for (i = start; i < end && i < object.length; i++) res.table.columns.push(object[i]);

            object = stateObj.table.columnHeaderRow.members;
            for (i = start; i < end && i < object.length; i++) res.table.columnHeaderRow.members.push(object[i]);

            if (stateObj.table.summaryRow) {
                object = stateObj.table.summaryRow.members;
                for (i = start; i < end && i < object.length; i++) res.table.summaryRow.members.push(object[i]);
            }

            _.each(stateObj.table.flattenedData, function(object, k){
                var x = {
                    id: object.id,
                    isRow: object.isRow,
                    isFooter: object.isFooter,
                    isGroupMember: object.isGroupMember,
                    rowClass: object.rowClass,
                    formattedValue: object.formattedValue,
                    members: []
                };

                if (object.groupSummaryRow) {
                    x.groupSummaryRow = {
                        members: []
                    };
                }

                if (object.group) {
                    x.group = {
                        mask: (object.group && object.group.mask) || undefined,
                        numericType: (object.group && object.group.numericType) || undefined,
                        defaultDisplayName: (object.group && object.group.defaultDisplayName) || undefined,
                        currentDisplayName: (object.group && object.group.currentDisplayName) || undefined,
                        name: (object.group && object.group.name) || undefined
                    };
                }

                res.table.flattenedData.push(x);
            });

            _.each(stateObj.table.flattenedData, function(object, k){
                object = object.members;
                for (i = start; i < end && i < object.length; i++) {
                    res.table.flattenedData[k].members.push(object[i]);
                }
            });

            _.each(stateObj.table.flattenedData, function(object, k){
                if (!object.groupSummaryRow) return;

                object = object.groupSummaryRow.members;
                for (i = start; i < end && i < object.length; i++) {
                    res.table.flattenedData[k].groupSummaryRow.members.push(object[i]);
                }
            });

            if (debug) log("RESULT: ", res);

            return res;
        },

        // function which actually adds columns on the page (container)
        // this function will call each time when user scrolls right
        partialRender: function() {
            var debug = 0,

            // shortcut for function
                log = function(){console.log.apply(console, arguments);};

            // build the partial data according to our counter
            var perCall = 100;
            if (this.data.forceShowNCols) {
                // for some reasons we need to display more columns
                perCall = this.data.forceShowNCols;
                this.data.forceShowNCols = false;
            }
            var partialData = this.getPartialDataFromFullState(this.fullDataSet, this.data.amountOfDisplayedCols, perCall);


            // build the object used to render the HTML for AdHocTable for the template
            // it's done because we can't modify origin object 'state'
            var dataForRender = {
                columns: this.fullDataSet.columns,
                groups: this.fullDataSet.groups,
                partial: partialData,
                hasNoData: this.fullDataSet.hasNoData,
                endOfFile: this.fullDataSet.endOfFile,
                title: this.fullDataSet.title,
                titleBarShowing: this.fullDataSet.titleBarShowing
            };
            if (debug) log("dataForRender: ", dataForRender);


            // get actual HTML content from template
            var html = this.me.tableTemplate(dataForRender);
            // fix a bug in IE
            if (isIE9()) {
                // remove whitespace between tags because of the famous bug in IE9
                html = removeWhitespacesFromTable(html);
            }

            // form a return value for upper function
            var isDataPresent = !(dataForRender.partial.columns.length === 0 && dataForRender.groups.length === 0);


            // if this is the first render call, it make sense simply add everything to the container
            if (this.data.isFirstRender) {
                if (debug) log("doing full display: ", perCall, " records to display");
                // simple insert the html into container, since it's the first 'render' call
                adhocDesigner.ui.canvas.html(html);
                // alter first call flag
                this.data.isFirstRender = false;
                this.data.amountOfDisplayedCols = perCall;
                return isDataPresent;
            }

            if (debug) log("doing partial display: ", perCall, " records to display");

            // ok, it means this is the second or third or Xth call, so we need to add cells into existent rows

            var frag = jQuery(html);

            // get rows to copy from
            var destRows = adhocDesigner.ui.canvas.find("table tr");
            // get rows to copy to
            var rowsToInsert = frag.find("tr");
            var colsAdded = 0;

            // copy them
            _.each(destRows, function(tr, i){
                if (!rowsToInsert[i]) return;

                for (var td, k = 0, len = rowsToInsert[i].childNodes.length; k < len; k++) {
                    child = rowsToInsert[i].childNodes[0];
                    child.parentNode.removeChild(child);

                    if (child.hasAttribute && child.hasAttribute("colspan")) {
                        continue;
                    }
                    if (child.nodeName.toLowerCase() == "#text") {
                        continue;
                    }
                    destRows[i].appendChild(child);
                    if (i === 0) colsAdded++; // 0 is always a header of the table
                }
            });

            if (debug) log("Added: ", colsAdded, " columns");

            // update variable responsible for the column count
            this.data.amountOfDisplayedCols += colsAdded;

            return isDataPresent;
        },

        // this function adds more rows to the table
        // This can happen when user scroll down or when user selected full date set, and we need to load
        // a little bit more rows
        addMoreRows: function(moreRowsState) {

            var debug = 0,
                log = function(){console.log.apply(console, arguments);};

            adhocDesigner.registerTemplate(this.me, "tableRowsTemplate", "tableRowsTemplate");

            this.addMoreDataToFullState(moreRowsState);

            if (debug) log("add more rows: moreRowsState: ", moreRowsState);

            var partialData = this.getPartialDataFromFullState(moreRowsState, 0, this.data.amountOfDisplayedCols);

            if (debug) log("add more rows: partialData: ", partialData);

            // build the object used to render the HTML for AdHocTable for the template
            // it's done because we can't modify origin object 'state'
            var dataForRender = {
                columns: this.fullDataSet.columns,
                groups: this.fullDataSet.groups,
                partial: partialData,
                hasNoData: this.fullDataSet.hasNoData,
                endOfFile: this.fullDataSet.endOfFile,
                title: this.fullDataSet.title,
                titleBarShowing: this.fullDataSet.titleBarShowing
            };
            if (debug) log("add more rows: dataForRender: ", dataForRender);

            var html = this.me.tableRowsTemplate(dataForRender)
                .replace(/^[\s]*<tbody id="tableDetails" class="copyTo">/g, "")
                .replace(/<\/tbody>[\s]*/g, "");

            if (isIE9()) {
                // remove whitespace between tags because of the famous bug in IE9
                html = removeWhitespacesFromTable(html);
            }

            jQuery("#canvasTable > tbody.copyTo").append(html);

            this.me.initNewRows();
        }
    },

    render: function(){

        this.Rendering.me = this; // set the pointer to me
        this.Rendering.init();

        // make the link to the data set
        this.Rendering.fullDataSet = this.state;

        // call the render function
        var isDataPresent = this.Rendering.partialRender();

        // and after first render it make sense to call the 'infinitiveHorizontalScroll' handler to add as many rows as it possible to see on the screen
        this.Rendering.infinitiveHorizontalScroll();

        var title = jQuery('#titleCaption').children().eq(0);
        var titleWidth = title.width();
        var titleCaptionWidth = jQuery('#titleCaption').width();

        if(titleCaptionWidth > titleWidth) {
            title.width(titleCaptionWidth);
        }

        var hasMissingFields = this.state.unresolvedReferences && this.state.unresolvedReferences.length > 0;
        adhocDesigner.setNothingToDisplayVisibility(!isDataPresent || this.state.isShowingNoData || hasMissingFields);

        adhocDesigner.ui.canvas.unbind("scroll", this.Rendering.infinitiveHorizontalScroll).bind("scroll", this.Rendering.infinitiveHorizontalScroll);

        var nothingToDisplayPanel = jQuery('#nothingToDisplayMessage');
        if (this.state.isShowingNoData || hasMissingFields){
            // In case of no data or missing fields show the message, but missing fields message should be preferred
            var msg = hasMissingFields
                ? adhocDesigner.getMissingFieldsCanvasMessage(this.state)
                : adhocDesigner.getMessage("noDataMode");

            nothingToDisplayPanel.html(msg);
            this.hideDataTable();
        } else {
            nothingToDisplayPanel.html(this.nothingToDisplayMessage);
            this.showDataTable();
        }

        //this takes care of the small dot, when no field are selected in sample or full data mode
        if(!isDataPresent) {
            this.hideDataTable();
        }

        // return true because callers expects some value
        return isDataPresent;
    },

    hideDataTable: function () {
        jQuery('#columnHeaderRow').hide();
        jQuery('#canvasTable').css("border","none");
    },

    showDataTable: function () {
        jQuery('#columnHeaderRow').show();
        jQuery('#canvasTable').css("border-width","1px");
        jQuery('#canvasTable').css("border-style","solid");
    }
};

AdHocTable._getTableHeaders = function(){
    return $$("tr#columnHeaderRow.labels.column th.label");
}

AdHocTable.canSaveReport = function(){
    if($("canvasTableCols")){
        AdHocTable.theCols = $("canvasTableCols").getElementsByTagName("col");
        if(AdHocTable.theCols){
            return (AdHocTable.theCols.length > 0);
        }
    }
    return false;
}
/*
 * Used to deselect/deactivate all all overlays
 */
AdHocTable.deselectAllSelectedOverlays = function(){
    AdHocTable.deselectAllTableColumns();
    AdHocTable.deselectAllSummaryCells();
    AdHocTable.deselectAllColumnGroupRows();
}
/*
 * Used to remove a selected object using its overlay index
 */
AdHocTable.removeFromSelectObjects = function(overlayIndex){
    var foundObject;
    selObjects.each(function(object){
        if(object.index == overlayIndex){
            foundObject = object;
        }
    });
    selObjects = selObjects.without(foundObject);
};