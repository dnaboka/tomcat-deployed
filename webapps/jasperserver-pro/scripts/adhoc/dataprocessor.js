/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* global console, alert, _ */

    ////////////////////////////////////////////////////////////////////////////////////////
//
//  2012-07-27  thorick
//
//  RULES OF THE dataprocessor
//
//  The following things are absolute and MUST be maintained throughout the dataprocessor.
//  Proper functioning of the dataprocessor relies on the following always being true so do not violate these.
//
//
//  o  The TreeNode from the Server is received as a JSON array which is then tranformed back into a tree structure
//
//  o  This original TreeNode tree structure MUST remain intact and not changed in any way.
//        All queries on the TreeNode expect it to the be rectangular structure representing the datagrid.
//        In particular DO NOT change the 'level' property of ANY TreeNode.  A node's level is fundamentally part of it.
//        DO NOT change any of the 'label' or other properties of a TreeNode.
//
//
//  On measure level hiding
//
//  In both OLAP and non-OLAP modes, when users select what level of data grouping that they wish to see
//  the measures level is hidden.
//  Internally, the measures level is present in the TreeNodes and must be taken into account of when
//  constructing chart data query results.
//
//  OLAP and non-OLAP are different in nature so each has it's own separate mechanism to effect measure hiding.
//  The data code is common between OLAP and non-OLAP save for the measure hiding mechanism used.
//
//
//  o  non-OLAP uses the 'groupMapping' to map a UI selected level to the actual Tree Node level.
//            (see function  'groupMapping')
//
//  o  OLAP hides the measures Dimension inside of a non-measure Dimension.
//            (see function 'getSimpleTreeForDimLevelRadio')
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function(exp, _){
    var AdhocDataProcessor = {
        debug: false,

        fn: {
            load:function(queryData) {
                var it = AdhocDataProcessor;
                it.data = queryData.data;
                it.metadata =  queryData.metadata;
                it.treeNodeAxes = queryData.treeNodes;

                it.fn.load_common();

                if (AdhocDataProcessor.debug) {
                    console.info('Data Processor State:');
                    console.info(it);
                }
            },
            load_common:function() {
                var it = AdhocDataProcessor;

                it.measureAxis = it.metadata.measureAxis;
                it.nonMeasureAxis = (it.measureAxis === 0 ? 1 : 0);

                if(it.metadata.axes.length) {
                    // OLAP will overwrite this
                    it.measureLevelNumber        = it.fn.getMeasureLevelNumber.call(it);

                    // OLAP must go first because it may redraw the metadata.axes
                    if (it.metadata.isOLAP) {
                        it.measureDimensionNumber = 0;    // to be determined
                        it.dimensionMappings = [];
                        it.dimensionAllMappings = new Array(2);   // says whether Dimension N has an ALL level or not
                        it.dimensionLevels = new Array(2);   // says at what level a Dimension begins with

                        it.rowDimensionMapping = it.fn.dimensionMapping(0);
                        it.dimensionMappings.push(it.rowDimensionMapping);

                        it.colDimensionMapping = it.fn.dimensionMapping(1);
                        it.dimensionMappings.push(it.colDimensionMapping);
                    }
                    it.lastRowNonMeasureLevel    = 0;  // to be calculated
                    it.lastColumnNonMeasureLevel = 0;  // to be calculated

                    // number of slider levels   numbered 0  through (number of slider levels - 1)
                    it.rowSliderLevelCount = (it.metadata.axes[0].length + 1) - (it.metadata.measureAxis === 0 ? 1 : 0);
                    it.colSliderLevelCount = (it.metadata.axes[1].length + 1) - (it.metadata.measureAxis === 1 ? 1 : 0);

                    // we need sequential group mapping that skips over the measures level
                    // sliders need this b/c they are not measures aware
                    it.rowGroupMapping = it.fn.groupMapping.call(it,0);
                    it.colGroupMapping = it.fn.groupMapping.call(it,1);
                }

                if(it.treeNodeAxes.length) {
                    it.fn.createTreeNodeStructure.call(it,it.treeNodeAxes[0]);
                    it.fn.createTreeNodeStructure.call(it,it.treeNodeAxes[1]);
                }
                // if we have actual data, then sanity check the metadata !
                if (it.data.length)  {
                    if (typeof it.measureAxis == 'undefined')  throw "AdhocDataProcessor.load_common  missing measureAxis metadata !";
                    if (it.measureAxis > 1 )  throw "AdhocDataProcessor.load_common  measureAxis > 1 !";
                    if (it.measureAxis < 0 )  throw "AdhocDataProcessor.load_common  measureAxis < 0 !";
                    if (typeof it.measureLevelNumber == 'undefined')  throw "AdhocDataProcessor.load_common  measureLevelNumber undetermined !";
                    if (it.measureLevelNumber <= 0)    throw "AdhocDataProcessor.load_common  measureLevelNumber <= 0 !";
                }
            },
            //
            // UI friendly mapping of available Dimensions and Levels
            //
            //   returns an array of 2  axes
            //
            //      each axis is an array of dimensions
            //      each dimension contains it's name and an array of available levels
            //      each level contains it's name and what number to present to the datamapper
            //          in order to get back that level of grouping.
            //          '0', if available is the ALL group for the dimension (it might not be available)
            //
            //
            //   when computing the level number for a given level
            //   we keep in mind that the query processor takes care of hiding the measure dimension
            //   thus we should skip over the measures dimension if we encounter it.
            //
            getOLAPDimensionInfo:function() {
                var it = AdhocDataProcessor;
                var olapAxes = new Array(2);

                // each axis
                for (var i=0; i<2; i++) {
                    var olapAxis = [];
                    var dimMappingArray = it.dimensionMappings[i];   // dimMapping array of dimension objects including Measures
                    var hasMeasures = (it.measureAxis === i);

                    if (dimMappingArray.length <= 0) {
                        // empty axis  null array entry
                    }
                    else {
                        // each dimension on this axis
                        var dimensionAllMapping = it.dimensionAllMappings[i];
                        for (var j=0; j<dimMappingArray.length; j++) {
                            var dimMapping = dimMappingArray[j];

                            if (hasMeasures && (dimMapping.length > 0 )  && (dimMapping[0].dimension === "Measures"))
                                continue;  // Skip measure dimension.   Measures are invisible to the sliders

                            var hasAll = false;
                            if (dimensionAllMapping[j] === true)  hasAll = true;
                            var dim = {};
                            dim.levels = [];


                            // If there is an All level for a dimension we must include in the allowed
                            // level groups
                            var currLevel = 0;
                            if (hasAll) {
                                dim.levels.push({
                                    label: "(All)",
                                    levelName: "(All)",
                                    levelNumber: currLevel
                                });
                            }

                            currLevel = 1;
                            // each level in this dimension
                            for (var k=0; k<dimMapping.length; k++) {


                                var levelMapping = dimMapping[k];
                                dim.dimension = levelMapping.dimension;
                                //
                                // http://bugzilla.jaspersoft.com/show_bug.cgi?id=29423
                                //
                                // 2012-10-05  thorick
                                // rather hacky workaround
                                // it's possible that we have (All) as the ONLY level in this dimension
                                // in this case there is a level mapping for it and we need to ignore it
                                // when a Dimension has levels in addition to (All), (All) will not be here
                                // it's a bit hacky.
                                if (levelMapping.name && levelMapping.name === "(All)") continue;

                                dim.levels.push({
                                    label: levelMapping.label,
                                    levelName: levelMapping.name,
                                    levelNumber: currLevel
                                });
                                currLevel++
                            }
                            olapAxis.push(dim);
                        }
                    }
                    olapAxes[i] = olapAxis;
                }
                if (AdhocDataProcessor.debug) {
                    console.log("AdhocDataProcessor.getOLAPDimensionInfo: 4098h  olapAxes");
                    console.log(olapAxes);
                }
                return olapAxes;
            },


            //
            // this is for non-OLAP only
            // OLAP hides the Measures level in its own way
            // and uses another way to determine the Measure level
            //
            getMeasureLevelNumber: function() {
                var levels = this.metadata.axes[this.metadata.measureAxis];
                for (var i=0; i < levels.length; i++) {
                    if (levels[i].label == 'Measures') {
                        return (i+1);
                    }
                }
            },

            //
            //  this mapping skips over any measures levels
            //  the element position in the groupMapping corresponds to a slider setting
            //  the value of at a position is the group level number
            //
            groupMapping: function(axisIndex) {
                var it = AdhocDataProcessor;
                var i, groupMapping = [0]; //   top level 'All'
                var nextAssignedIndex = 1;
                var axis = it.metadata.axes[axisIndex];    // iterate over the groups, the first group is '1'

                for (i=0; i < axis.length; i++) {
                    if (axis[i].label != 'Measures')  {
                        groupMapping[nextAssignedIndex++] = (i+1);
                    }
                }
                return groupMapping;
            },

            //
            //  Dimension mapping for treeNodes
            //
            //  if this is NOT an OLAP result (metadata.isOLAP == false)
            //  theh  we skip mapping any dimensions as they will not be used
            //  else  we keep an ordered map of dimensions and levels
            //
            //  Strictly speaking for non-OLAP on the server each level is
            //  it's own dimension.  On the client we will skip referring to
            //  dimensions for all non-OLAP query results.
            //
            //
            //  here we look out for the Measure Dimension and what zero based Dimension
            //  number it is..  if it is Dimension #3, then the number is 2
            //
            //  we also look out for the Measure Level (the TreeNode level) where
            //  the TreeNode root level == 0
            //
            //
            dimensionMapping: function(axisIndex) {
                var it = AdhocDataProcessor;
                if (!it.metadata.isOLAP)  return null;
                var axis = it.metadata.axes[axisIndex];

                var levelNumber = 1;           //  '0' is the root dimension level so our real levels start at '1'
                var dims = [];
                var dimensionAllMapping = [];
                if (it.metadata.axes[axisIndex].length <= 0)  return dims;   // empty axis

                var dimNumber = 0;
                var dimHasAll = false;
                var prevDim = axis[0].dimension;
                var currDim = prevDim;
                if (!prevDim)  alert("dataprocessor.js  ERROR ! 0983jhrn   null dimension in axis "+axisIndex);
                var dim = [];        // holds levels for Dimension
                var newAxis = [];    // redrawn axis that reflects any changes we make here
                var dimensionLevelArray = [];   // holds start levels for dimensions in this axis
                var dimensionStartLevel = levelNumber;

                for (var i=0; i < axis.length; i++) {
                    currDim = axis[i].dimension;
                    if (currDim === 'Measures') {
                        it.measureDimensionNumber = dimNumber;
                        it.measureLevelNumber     = levelNumber;
                    }
                    if (currDim !== prevDim)  {
                        // done with previous dimension
                        if (dimHasAll) {
                            dimensionAllMapping.push(true);
                        }
                        else {
                            dimensionAllMapping.push(false);
                        }
                        dimensionLevelArray.push(
                            {
                                dimension:  prevDim,
                                startLevel: dimensionStartLevel,
                                endLevel:   levelNumber - 1
                            }
                        );
                        dims.push(dim);
                        dimNumber++;
                        dim = [];
                        dimHasAll = false;
                        prevDim = currDim;

                        dimensionStartLevel = levelNumber;
                    }
                    //  do not register the ALL level, it is considered to be at the same level as the first level
                    //   of detail as it is in the non-OLAP case
                    //
                    //  the exception to this is if 'All' is the ONLY level present for the dimension
                    //  in which case we must register it so that there is metadata for the dimension
                    if (axis[i].label === '(All)' ||  axis[i].label === '(ALL)')  {
                        dimHasAll = true;
                        if (i < (axis.length-1)) {       // we're not the last level
                            if (currDim === axis[i+1].dimension)  continue;   // All is not the only level in this dimension so skip registration
                        }
                    }
                    var dimLevel =  {
                        dimension: axis[i].dimension,
                        label: axis[i].label,
                        name: axis[i].name,
                        levelNumber: levelNumber
                    };
                    dim.push(dimLevel);
                    newAxis.push(dimLevel);

                    levelNumber++;  // setup for next level
                }
                if (dimHasAll) {
                    dimensionAllMapping.push(true);
                }
                else {
                    dimensionAllMapping.push(false);
                }
                dims.push(dim);
                dimensionLevelArray.push(
                    {
                        dimension: currDim,
                        startLevel: dimensionStartLevel,
                        endLevel:   levelNumber - 1
                    }
                );

                // now we have to go back and rewrite the metadata.axes reflecting
                // that we've removed any (All) levels
                // we've conciously chosen not to try and use 'splice' for in place removal
                it.metadata.axes[axisIndex] = newAxis;

                it.dimensionAllMappings[axisIndex] = dimensionAllMapping;
                it.dimensionLevels[axisIndex] = dimensionLevelArray;
                if (AdhocDataProcessor.debug) {
                    console.log("AdhocDataProcessor.dimensionMapping:49e8h  dimensions for axis "+axisIndex);
                    console.log(dims);
                }
                return dims;
            },

            createTreeNodeStructure: function(rootTreeNode) {
                var parent = rootTreeNode;
                parent.parent = null;   //  we're the root
                if (parent.children) {
                    this.fn.connectParentNode.call(this, parent, parent.children);
                }
                else {
                    parent.children = [];
                }
            },
            connectParentNode: function(parent, childrenArray) {
                var i,child, grandChildren;
                for (i=0; i < childrenArray.length; i++) {
                    child = childrenArray[i];
                    child.parent = parent;
                    if (child.children) {
                        grandChildren = child.children;
                        if (grandChildren.length) {
                            this.fn.connectParentNode.call(this, child, grandChildren);
                        }
                    }
                    else {
                        child.children = [];    // empty kids
                    }
                }
            },
            getDataStyle:function(){
                var it = AdhocDataProcessor;
                if (it.metadata.axes[it.nonMeasureAxis].length === 0) {
                    return 0;    // style 0   measures and groups on the same axis ONLY;
                }
                else if ((it.metadata.axes[it.nonMeasureAxis].length > 0) &&
                    (it.metadata.axes[it.measureAxis].length > 1)) {
                    return 2;    //  style 2   crosstab groups on both axes
                }
                return 1;  // style 1   measures on one axis and groups on the other
            },
            //
            //  for non-OLAP results we consider the entire axis to be a single dimension (with measures folded in as well)
            //  so we set up the dimLevels search array to consist of a single 'dimension' spanning the entire axis
            //
            getNodeListForSliderLevel: function(axisIndex, sliderLevel) {
                var it = AdhocDataProcessor;
                var totalLevels = it.metadata.axes[axisIndex].length;
                var dimLevels = [];
                dimLevels.push(
                    {
                        startLevel: 0,              // startLevel == root
                        endLevel:   sliderLevel,    // endLevel = slider
                        leafLevel:  totalLevels     // end at leaf level
                    }
                );
                var nodeList = it.fn.getNodeListForDimLevels(axisIndex, dimLevels);
                if (AdhocDataProcessor.debug) {
                    console.log("AdhocDataProcessor.getNodeListForSliderLevel: 4088h  nodeList for axisIndex=" +
                        axisIndex + " sliderLevel=" + sliderLevel);
                    console.log(nodeList);
                }
                return nodeList;
            },
            //
            //  entry point to get NodeList for Dimension Level Radio Buttons
            //  use this API ONLY for OLAP results
            //  as OLAP Measure Dimension restrictions apply here
            //  DO NOT use this for non-OLAP results
            //  or you may profoundly disappointed.
            //
            //  Radio Button Dimension input consists of an Object for each Dimension (in axis dimension order)
            //  Each Object for each Dimension contains a number specifying the grouping level (starting with 0 == dimension total)
            //
            //
            getNodeListForDimLevelRadio: function(axisIndex, radioDims)  {
                var it = AdhocDataProcessor;
                if (!it.metadata.isOLAP)
                    throw "dataprocessor.getNodeListForDimLevelRadio called RadioButton method for non-OLAP query !";
                if (radioDims === null)
                    throw "dataprocessor.getNodeListForDimLevelRadio.js  y5g59i8y  NULL radioLevel input !";


                var dims          = it.dimensionMappings[axisIndex];
                if (!dims)
                    throw "dataprocessor.getNodeListForDimLevelRadio.js 0oi098  no dimensionMappings for axis "+axisIndex;

                if (dims.length <= 0)   return it.fn.getEmptyAxisResult();

                if (radioDims.length > dims.length)
                    throw "dataprocessor.getNodeListForDimLevelRadio.js  98hu for axis: "+
                        axisIndex+", number of input dimensionss from radio buttons: "+
                        radioDims.length+", exceeds the number of dimensions in the chart data: "+dims.length;

                //
                //  do any adjustment of the radio dimensions if there are not enough of them
                //  to fill out the axis.
                //  the default for any missing radio dimensions is 'ALL'
                //
                if ((radioDims.length + (axisIndex == it.metadata.measureAxis ? 1 : 0)) < dims.length )  {
                    if (AdhocDataProcessor.debug) {
                        console.log("AdhocDataProcessor.getNodeListForDimLevelRadio.js "+
                            "need to add  Radio Dimensions padding");
                    }

                    // start filling in where radio dimensions leaves off, ignore Measures Dimension if any
                    var radioDimLen = radioDims.length;
                    for (var j=radioDimLen; j < dims.length ; j++) {
                        var currDim = dims[j];
                        if (currDim.dimension === 'Measures')  continue;

                        radioDims.push(
                            { level : (currDim.length)}
                        );
                    }
                }


                var dimLevels = [];
                // convert the 'radio button' settings to an internal Dimension Level structure
                //
                //  radioLevels is an array of  dimension objects each of which contain that dimensions
                //  detail level number.  level 0   means show totals (ALL)
                //
                //  if there are not enough dimensions to fully represent an axis
                //  then the missing dimensions are appended as show totals (level == 0);
                //
                //  each Dimension Level entry consists of properties:
                //     startLevel  the actual beginning level number of the Dimension
                //     endLevel    the actual detail level number desired (mapped from 0-n to actual level)
                //     leafLevel   the actual LAST level number of this Dimension
                //
                //
                //
                var currAxis = it.metadata.axes[axisIndex];

                var totalDimCount = dims.length;
                var dimCount      = 0;    // current dimension number
                var currLevel     = 0;    // current *treeNode* level number

                var skipForMeasures = false;
                var dim0 = dims[0];
                var measuresFirst   = (dim0[0].dimension === 'Measures');

                var measuresOffSet  = 0;  // to accomodate  off-by-one due to hidden measures dimension
                if (measuresFirst)  {
                    measuresOffSet = 1;   // we have to skip past Measures dimension that radio button UI doesn't see
                }

                // special case axis is measures dimension only
                if (measuresFirst && radioDims.length === 0)  {
                    dimLevels.push(
                        {
                            startLevel: 0,    // startLevel == treeNode level immediately BEFORE our Dimension
                            endLevel:   1,    // endLevel == slider position, for Dimension totals == startLevel
                            leafLevel:  1     // leafLevel ==  treeNode level of the last level in our Dimension
                        }
                    );
                }
                else {
                    // process all specified radio button levels
                    // append 'ALL' to any tail Dimensions not listed (except the Measures Dimension)

                    for (var rDim = 0; rDim < radioDims.length; rDim++) {
                        var currDim = dims[rDim+measuresOffSet];
                        if (currDim === null)  throw "dataprocessor.getNodeListForDimLevelRadio.js 98hn8 metadata  no dimension for number "+rDim;
                        dimCount++;

                        // if we have not already handled measures, always check ahead to see if the next
                        // Dimension is Measures, if it is, subsume it into the current Dimension criteria
                        if (it.metadata.measureAxis === axisIndex) {
                            if (measuresOffSet <= 0) {
                                //
                                // rDim + 2   b/c  radioDims don't know about the presence of the measures dimension
                                // so it's '+1' because rDim is a zero based index
                                // and     '+1' because we account for the presence of the measures dimension
                                //     ==  '+2'
                                //
                                if ((rDim + 2) > dims.length) {
                                    throw "dataprocessor.getNodeListForDimLevelRadio.js  43098h  we were expecting dimensions to be at least "+
                                        (rDim+2)+" in length, instead it is "+dims.length;
                                }
                                // only check ahead if we are within bounds, this should ALWAYS be possible
                                var levels = dims[rDim+1];

                                if (levels[0].dimension === 'Measures') {
                                    skipForMeasures = true;    // skip past Measures and include them in current
                                    measuresOffSet = 1;
                                }
                            }
                        }

                        var currDimTotalLevelCount = currDim.length;
                        var startLevel = currLevel;
                        var endLevel   = currLevel + radioDims[rDim].level;   // currDim.level == 0   means root or ALL for this level
                        var leafLevel = currLevel + currDimTotalLevelCount;    //  the last level number in this dimension

                        // for OLAP queries we have a special dimension level mapping consideration
                        // Measures is a separate Dimension  but from the UI detail selection perspective it is invisible
                        // for OLAP we absorb the Measure Dimension and it's level into a non-Measure Dimension
                        // if the Measures Dimension is first then it's levels become part of offsetting the next Dimension
                        // else the Measures Dimension is absorbed into the previous Dimension
                        //
                        if (measuresFirst || skipForMeasures)  {

                            // if this is a leaf level query
                            // then we must preserve the leaf level condition:  endLevel === leafLevel
                            // else  leave the endLevel alone to preserve the intended grouping level
                            //
                            // or if we know that the measures dimension was the first dimension
                            // then we must increment the endLevel
                            //
                            if ((endLevel === leafLevel) || measuresFirst)  {
                                endLevel++;
                            }
                            leafLevel++;
                            measuresFirst = false;     // turn off the special case handling now
                            skipForMeasures = false;
                        }
                        dimLevels.push(
                            {
                                startLevel: startLevel,   // startLevel == treeNode level immediately BEFORE our Dimension
                                endLevel:   endLevel,     // endLevel == slider position, for Dimension totals == startLevel
                                leafLevel:  leafLevel     // leafLevel ==  treeNode level of the last level in our Dimension
                            }
                        );
                        currLevel = leafLevel;     // start level of the next Dimension is our leaf level
                    }
                }
                var nodeList = it.fn.getNodeListForDimLevels(axisIndex, dimLevels);
                if (AdhocDataProcessor.debug) {
                    console.log("AdhocDataProcessor.getNodeListForDimLevelRadio: 39uh  nodeList for axis=" +
                        axisIndex + " radioDims, dimLevels ");
                    console.log(radioDims);
                    console.log(dimLevels);
                    console.log(nodeList);
                }
                return nodeList;
            },

            //
            //  Approach 3  (compared to approach 2)
            //
            //  More easily understood
            //  Less memory
            //  Faster execution
            //
            //
            //  No need to separate out measures to force an order
            //  Just take the order that the user chose in the UI
            //  when they placed the measures level
            //  All we need to do is to retrieve the
            //  correct set of Nodes in the order that they occurred in the original source treeNode
            //
            getNodeListForDimLevels: function(axisIndex, dimLevels) {
                var it = AdhocDataProcessor;

                if (it.metadata.axes[0].length === 0  &&  it.metadata.axes[1].length === 0)  {
                    return null; // no query results
                }
                var totalLevels = it.metadata.axes[axisIndex].length;

                if (totalLevels > 0)  {
                    var nodeList = it.fn.getNodeListForDimensionLevelsMeasure(axisIndex, dimLevels);

                    return nodeList;
                }
                return it.fn.getEmptyAxisResult();
            },

            //
            //
            //  set up a single level tree query for non-OLAP slider selection
            //  this is equivalent to querying against a single dimension which encompasses
            //  all available levels
            //
            getNodeListForSliderLevelGroupMeasure: function(axisIndex, sliderLevel) {
                var it = AdhocDataProcessor;

                var totalLevels = it.metadata.axes[axisIndex].length;

                if (totalLevels > 0)  {
                    var searchLevels = [];
                    searchLevels.push(
                        {
                            startLevel: 0,              // startLevel == root
                            endLevel: sliderLevel,    // endLevel = slider
                            leafLevel: totalLevels     // end at leaf level
                        }
                    );
                    return it.fn.getNodeListForDimensionLevelsMeasure(axisIndex, searchLevels);
                }

                // this axis is not active, return a default  axisCoordinate == 0   Node
                return it.fn.getEmptyAxisResult();
            },
            getEmptyAxisResult: function() {
                var it = AdhocDataProcessor;

                if (!it.emptyAxisResult) {
                    var defaultNode = {
                        isAll: false,
                        label: "(empty axis)",
                        level: 0,
                        axisCoordinate: 0
                    }
                    it.emptyAxisResult = [];
                    it.emptyAxisResult.push(defaultNode);
                }
                return it.emptyAxisResult;
            },
            //
            //  return the subtotal groups for a given measure and slider level (level ignoring the measures level)
            //
            //
            //  o   get the node list of the dimension level array whose subtotals we are looking for
            //
            //  o   if a level is the leaf level
            //          then every node is a subtotal
            //
            //  o   if the level is NOT the leaf level
            //          then find each child ALL node, these are subtotal candidates
            //
            //  o   follow the ALL chain all the way down to the leaf level corresponding to the
            //          measure whose subtotals are we seeking.
            //
            //  2012-09-04  thorick
            //              For non-Leaf results the algorithm currently returns all nodes at the
            //              level one step beyond that which we are seeking subtotals for
            //              and the qualifies the list selecting only those that qualify.
            //
            //              A more efficient algorithm could do the qualification as the tree
            //              is being traversed, such an algorithm would throw out non-qualifying
            //              tree branches as they are found thus eliminating the 'go back and check' step\
            //              that the current code does.
            //
            //              Thus, if you are looking for the subtotals of level 'n'
            //              you would search down to level n+1 (as we currently do),
            //              but along the way you would stop searching along any branches
            //              in which you encounter an 'All' node BEFORE reaching level n+1
            //              and you would disregard any non-All nodes at level n+1
            //
            //
            getNodeListForDimensionLevelsMeasure: function(axisIndex, dimLevels) {
                var it = AdhocDataProcessor;
                var isMeasureAxis = false;
                if (axisIndex === it.metadata.measureAxis) isMeasureAxis = true;


                var groupMapping = axisIndex === 0 ? it.rowGroupMapping : it.colGroupMapping;

                //    if   the measures are not at the leaf level
                //    then we need to iterate on the NEXT non-measure level after the chosen level
                //
                //
                //  note if the axis has measures at the leaf treeNode level and the slider is positioned
                //  at it's leaf level, then we want the leaf level measure treeNodes (the slider does not know about measure levels)
                //

                var  what = this;
                var root     = it.treeNodeAxes[axisIndex];
                var qualifiedChildren = [];
                qualifiedChildren.push(root);

                //
                // go through the DimensionLevel list and process each Dimension in turn
                // the result children from the previous Dimension become the starting children
                // for the next Dimension
                // and so on until we've processed all Dimensions
                //
                for (var dimIndex=0; dimIndex < dimLevels.length; dimIndex++) {
                    var startLevel = dimLevels[dimIndex].startLevel;
                    var endLevel   = dimLevels[dimIndex].endLevel;
                    var localLeafLevel = dimLevels[dimIndex].leafLevel;

                    if (AdhocDataProcessor.debug) {
                        console.log("AdhocDataProcessor.getNodeListForDimensionLevelsMeasure: 93287h  begin qualifying nodes for " +
                            "dim=" + dimIndex + " startlevel=" + startLevel + ", endLevel=" + endLevel +
                            "localLeafLevel=" + localLeafLevel);
                    }

                    var isLeafLevel = false;

                    // we can only have a leaf level query as a possibility if:
                    // for non-OLAP
                    //      we are processing the LAST dimension in our searchLevels list.
                    // for OLAP
                    //      the endLevel of our desired totals level == localLeafLevel of our Dimension

                    if (!it.metadata.isOLAP) {
                        if (dimIndex >= (dimLevels.length -1)) {
                            if (axisIndex === 0) {
                                if (endLevel >= (it.rowSliderLevelCount-1))
                                    isLeafLevel = true;
                            }
                            else {
                                if (endLevel >= (it.colSliderLevelCount-1))
                                    isLeafLevel = true;
                            }
                        }
                    }
                    else {
                        // for OLAP our computation leaf level is the level boundary of our dimension
                        if (endLevel === localLeafLevel)   isLeafLevel = true;
                    }

                    var nodeList = [];    // hold our intermediate node level list findings

                    //
                    // leaf level processing can only happen in the last dimension as
                    // the treeNode leaf level is the lowest level
                    //
                    if (isLeafLevel)  {
                        // get the list of measure filtered Leaf Nodes

                        // for OLAP we have already folded the measures level into the DimLevel query parameters
                        var targetLevel = localLeafLevel;

                        if (!it.metadata.isOLAP) {
                            if (dimIndex === (dimLevels.length - 1)) {
                                targetLevel = it.metadata.axes[axisIndex].length;   // for non-OLAP includes any measures level
                            }
                        }
                        it.fn.getNodeListForActualLevel(axisIndex, qualifiedChildren, targetLevel, nodeList);


                        if (AdhocDataProcessor.debug) {
                            console.log("AdhocDataProcessor.getNodeListForDimensionLevelsMeasure: we9iuhf  LeafLevel nodeList for targetLevel=" +
                                targetLevel);
                            console.log(nodeList);
                        }

                        // 2 leaf level cases:
                        //   1.  leaf level is measures level
                        //         exclude the leaf if it's parent is ALL
                        //
                        //   2.  leaf level is NOT measures level
                        //         exclude the leaf if it is ALL
                        //
                        //

                        //  excludeParentAll == true
                        //        we are getting nodes for the leafLevel of the Tree
                        //        this is the measure axis AND the measures are at our leaf level
                        var filteredNodeList = [];

                        //  this is the level limit beyond which we stop recursively
                        //  checking parents up the tree branch for 'isAll'.
                        //  since this is a leaf level query we don't want any higher level subtotals
                        //  in the leaf dimension included in our results.
                        //  for OLAP:      it's no ALL nodes within our Leaf Dimension
                        //  for non-OLAP:  it's no ALL nodes ANYWHERE in the tree, except for the root (level 0)
                        //
                        var parentNodeLevelCheck = 0;
                        if (it.metadata.isOLAP)  parentNodeLevelCheck = startLevel;

                        for (var i=0; i < nodeList.length; i++) {
                            var node = nodeList[i];

                            if (node.isAll ===  true)
                                continue;

                            var parentNode = node.parent;
                            while (parentNode != null) {
                                if (parentNode.level <= parentNodeLevelCheck) {

                                    // reached up to the root without encountering any ALL level in our leaf Dimension,
                                    //    so we're really a leaf subtotal and not a higher level subtotal
                                    filteredNodeList.push(node);
                                    break;
                                }
                                if (parentNode.isAll === true)
                                    break;

                                parentNode = parentNode.parent;    // guaranteed to be there
                            }
                        }
                        qualifiedChildren = filteredNodeList;
                        if (AdhocDataProcessor.debug) {
                            console.log("AdhocDataProcessor.getNodeListForDimensionLevelsMeasure:  er83   qualifiedChildren");
                            console.log(qualifiedChildren);
                        }
                    }
                    else {   //  processing for NOT isLeafLevel
                        var targetLevel = groupMapping[endLevel+1];   // non-OLAP measures level compensation
                        if (it.metadata.isOLAP)  {
                            targetLevel = endLevel+1;                 //  OLAP start and end levels already account for the Measures Level
                        }


                        if (dimLevels.length === 1 && targetLevel === 0)  {
                            nodeList.push(root);        // special case root for single dimension only we're done here
                        }
                        else {
                            // next level
                            if (qualifiedChildren) {
                                it.fn.getNodeListForActualLevel(axisIndex, qualifiedChildren, targetLevel, nodeList);
                            }
                        }

                        //
                        //  we have the list of nodes for the next level PAST where we want to show
                        //      start with any 'ALL' nodes within this next level (these are subtotals for higher groups).
                        //
                        //  of the remaining set, weed out any 'ALL' nodes that have 'ALL' nodes as parents as this indicates
                        //  that such nodes are subtotals for levels OTHER than the one that we seek.
                        //
                        //  of the remaining set trace down the 'ALL' descendants to dimension leaf level.
                        //
                        //
                        var leafNodeList = [];
                        for (var i=0; i < nodeList.length; i++)  {
                            var node = nodeList[i];
                            var recurse = false;

                            // note: if we pass the level > 0 test, then we are guaranteed to have a parent
                            if (node.level <= 0) {
                                throw  "dataprocessor.getNodeListForDimensionLevelsMeasure  leaf  node.level is unexpectedly less or equal to zero !";
                            }
                            if (node.level !== 0 && (node.isAll === true))  recurse = true;   // chase NON-root NON-ALL (only)
                            if (recurse) {
                                if (!node.parent)  throw "AdhocDataProcessor.getNodeListForDimensionLevelsMeasure Unexpected missing node.parent in axis "+axisIndex;
                                var parentCheckNode = node.parent;

                                if (isMeasureAxis) {
                                    if ((node.parent.level == it.measureLevelNumber)  &&       //  our parent is Measure Level, so check the next level above
                                        it.measureLevelNumber > 1)                             //  unless the Measures level is *the first* level, in which case it's parent is root !

                                    {
                                        if (!node.parent.parent)  throw "AdhocDataProcessor.getNodeListForDimensionLevelsMeasure Unexpected missing node.parent.parent in axis "+axisIndex;
                                        parentCheckNode = node.parent.parent;     // if the parent level is the measures level, then parent is guaranteed to have a parent
                                    }
                                }
                                if (parentCheckNode.level > startLevel)
                                {
                                    // if our parent is 'ALL'  then do not add this leaf b/c it's a subtotal for a higher level than our target
                                    if (parentCheckNode.isAll === true)   recurse = false;
                                }
                            }
                            if (recurse)  {
                                //  process this level subtotal: chase down 'All' children to leaf
                                if (node.level === localLeafLevel) {
                                    leafNodeList.push(node);
                                }
                                else {
                                    it.fn.chaseAllNodesToLeafToList(node.parent, node,localLeafLevel, leafNodeList);
                                }
                            }
                        }
                        qualifiedChildren = leafNodeList;
                        if (AdhocDataProcessor.debug) {
                            console.log("AdhocDataProcessor.getNodeListForDimensionLevelsMeasure: 3w948h  non-LeafLevel qualified children    X");
                            console.log(qualifiedChildren);
                        }
                    }
                }
                return qualifiedChildren;
            },
            //
            //  starting with the input children list
            //
            //  get the list of child nodes at the specified targetLevel number
            //  if we encounter the measures level on the way down
            //  then we must include ONLY the child measure nodes for the measure we are looking for
            //
            getNodeListForActualLevel: function(axisIndex, children, targetLevel, nodeList) {
                var it = AdhocDataProcessor;
                for (var i=0; i < children.length; i++ )  {
                    var child = children[i];

                    if (child.level == targetLevel) {
                        nodeList.push(child);
                    }
                    else {
                        if (child.children) {
                            it.fn.getNodeListForActualLevel(axisIndex, child.children, targetLevel, nodeList);
                        }
                    }
                }
            },
            //
            //
            //  called from tree processing that is not iterating on leaf level subtotal groups
            //
            //  chase 'All' tree branches down to the target limit 'leafLevelNumber'
            //     include measure if there is one.
            //
            chaseAllNodesToLeafToList: function(topParent, node, leafLevelNumber, addToArray) {
                var it = AdhocDataProcessor;
                if (node.level < leafLevelNumber) {
                    if ('children' in node)  {
                        if (node.children.length > 0) {
                            for (var i=0; i < node.children.length; i++) {
                                var child = node.children[i];
                                var recurse = false;

                                // ALL measure levels allowed through
                                if (child.isAll === false) {
                                    if (child.level == it.measureLevelNumber) {
                                        recurse = true;
                                    }
                                }
                                else {
                                    recurse = true;
                                }
                                if (recurse) {
                                    var leaf =  it.fn.chaseAllNodesToLeafToList(topParent, child, leafLevelNumber, addToArray);
                                    if (leaf.level === leafLevelNumber) {
                                        addToArray.push(leaf);
                                    }
                                }
                            }
                        }
                    }
                }
                return node;
            },

            recurseLeafArrayFromSimpleNode: function(simpleNode, result)  {
                var it = AdhocDataProcessor;
                if (simpleNode.children.length > 0)  {
                    var children = simpleNode.children;
                    for (var i=0; i < children.length; i++) {
                        it.fn.recurseLeafArrayFromSimpleNode(children[i], result);
                    }
                }
                else {
                    result.push(simpleNode);
                }
            },
            getDataFromRowColumn: function (rowLeaf, columnLeaf) {
                if (!rowLeaf)                      throw "dataprocessor.getDataFromRowColumn   NULL row object !";
                if (rowLeaf.axisCoordinate < 0)    throw "dataprocessor.getDataFromRowColumn   row Coordinate < 0 !";
                if (!columnLeaf)                   throw "dataprocessor.getDataFromRowColumn   NULL column object !";
                if (columnLeaf.axisCoordinate < 0) throw "dataprocessor.getDataFromRowColumn   column Coordinate < 0 !";

                //if (AdhocDataProcessor.debug) {
                //    console.log("AdhocDataProcessor.getDataFromRowColumn  rowNode, colNode: ");
                //    console.log(rowLeaf);
                //    console.log(columnLeaf);
                //}

                return AdhocDataProcessor.data[rowLeaf.axisCoordinate][columnLeaf.axisCoordinate];
            },
            //
            //   UNIT TESTS:  highchart.unittests2.js
            //
            //    unitTest.checkObj22LabelGen00();
            //    unitTest.checkObj22LabelGen01();
            //
            getLabelNameArray: function(axisIndex, leafNode)  {
                var it = AdhocDataProcessor;
                var result = [];
                if (leafNode === null)  return result;

                var currNode = leafNode;

                if (it.metadata.isOLAP)  {
                    // for OLAP we only display one level *per dimension*
                    //
                    // first determine what level and in what dimension our target node is at
                    // then march up the dimension hierarchy.
                    //
                    var nodeLevelNumber = leafNode.level;
                    var dimLevels = it.dimensionLevels[axisIndex];

                    // starting at root  go down the dimensions until we find the dimension that brackets our level
                    var dimIndex = 0;
                    if (dimLevels) {
                        for (var i=0; i < dimLevels.length; i++)  {
                            dimIndex = i;

                            if (currNode.level >= dimLevels[i].startLevel) {
                                if (currNode.level <= dimLevels[i].endLevel) {
                                    // now that we have the correct dimension, find the lowest level of detail and use that
                                    while (currNode.parent) {
                                        if (!currNode.isAll) {
                                            result.push(currNode.label);
                                            break;
                                        }
                                        if (currNode.parent) {
                                            currNode = currNode.parent;
                                            if (currNode.level < dimLevels[i].startLevel) {
                                                break;
                                            }
                                        }
                                        else {
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    // search back through each dimension on the axis
                    for (var i=dimIndex-1; i>=0; i--)  {
                        var startLevel = dimLevels[i].startLevel;
                        var endLevel   = dimLevels[i].endLevel;
                        currNode = leafNode;
                        while (currNode.parent)  {
                            // we want the first non-ALL leaf node within the next Dimension
                            // with the highest level number
                            currNode = currNode.parent;
                            if (currNode.level <= endLevel) {
                                if (currNode.level >= startLevel)  {
                                    if (currNode.level > 0   &&  !currNode.isAll) {
                                        result.push(currNode.label);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    while (currNode.parent != null)  {
                        if (currNode.isAll !== true)  {
                            result.push(currNode.label);
                        }
                        currNode = currNode.parent;
                    }
                    if (currNode.level > 0) {
                        result.push(currNode.label);
                    }
                }
                if (result.length <= 0)  result.push("Totals");
                return result;
            },
            isOLAP: function() {
                var it = AdhocDataProcessor;
                return it.metadata.isOLAP;
            },
            isMeasuresLastOnAxis: function(axisIndex)  {
                var it = AdhocDataProcessor;
                if (axisIndex !== it.measureAxis)  return false;

                if (it.fn.isOLAP())  {
                    var dimMapping = it.dimensionMappings[axisIndex];
                    if (dimMapping.length <= 0)  return false;
                    var lastDim = dimMapping[dimMapping.length-1];
                    var lastDimFirstLevel = lastDim[0];
                    if (lastDimFirstLevel.dimension === "Measures")  return true;
                    return false;
                }

                var axis = it.metadata.axes[axisIndex];
                if (axis[(axis.length)-1].label === "Measures")  return true;
                return false;
            },
            doPathsMatch: function(left, right) {
                while (left.parent) {
                    if (left.parent.level === 0) {
                        if (right.parent.level === 0) {
                            return true;
                        }
                        return false;
                    }
                    if (!right.parent)  return false;
                    left = left.parent;
                    right = right.parent;
                    if (left.level !== right.level) return false;
                    if (left.label !== right.label) return false;
                }
                if (!right.parent) return true;
                return false;
            },

            getLevelsWithoutMeasures: function(levels) {
                return _.filter(levels, function(level) {
                    return level.dimension != "Measures";
                });
            },

            getLevelIndex: function(levels, level) {
                for (var i = 0; i < levels.length; i++) {
                    if (levels[i].name === level.name) {
                        return i;
                    }
                }

                throw "Specified level was not found.";
            },

            levelsToLevelNumbers: function(levels, axis) {
                var me = AdhocDataProcessor.fn;

                var levelNumbers = [];

                if (me.isOLAP()) {
                    var olapDimensionInfo = me.getOLAPDimensionInfo();

                    levelNumbers = me._getOlapLevelNumbers(levels, olapDimensionInfo[axis]);
                } else {
                    levelNumbers = me._getNonOlapDataProcessorLevelNumber(levels, AdhocDataProcessor.metadata.axes[axis]);
                }

                return levelNumbers;
            },

            _getOlapLevelNumbers: function(selectedLevels, axisDimensionsInfo) {
                var me = AdhocDataProcessor.fn;

                return _.map(selectedLevels, function(level) {
                    var dimension = _.find(axisDimensionsInfo, function(dimension) {
                        return dimension.dimension === level.dimension;
                    });

                    return {level: me._getOlapDataProcessorLevelNumber(level, dimension)};
                });
            },

            _getOlapDataProcessorLevelNumber: function(level, dimension) {
                for (var i = 0; i < dimension.levels.length; i++) {
                    if (dimension.levels[i].levelName === level.name) {
                        return dimension.levels[i].levelNumber;
                    }
                }

                throw "No olap info found for specified level = " + level.name;
            },

            _getNonOlapDataProcessorLevelNumber: function(selectedLevels, allLevels) {
                var me = AdhocDataProcessor.fn;

                if (selectedLevels.length === 0) {
                    return 0;
                } else {

                    var levels = me.getLevelsWithoutMeasures(allLevels);

                    // The slider position will be level index + 1 because of grand total on the position 0.
                    return me.getLevelIndex(levels, selectedLevels[0]) + 1;
                }
            }
        }
    };

    exp.AdhocDataProcessor = {
        load: AdhocDataProcessor.fn.load,
        levelsToLevelNumbers: AdhocDataProcessor.fn.levelsToLevelNumbers,
        getLevelIndex: AdhocDataProcessor.fn.getLevelIndex,
        getLevelsWithoutMeasures: AdhocDataProcessor.fn.getLevelsWithoutMeasures,
        getOLAPDimensionInfo: AdhocDataProcessor.fn.getOLAPDimensionInfo,
        getDataFromRowColumn: AdhocDataProcessor.fn.getDataFromRowColumn,
        getLabelNameArray: AdhocDataProcessor.fn.getLabelNameArray,
        isMeasuresLastOnAxis: AdhocDataProcessor.fn.isMeasuresLastOnAxis,
        getDataStyle: AdhocDataProcessor.fn.getDataStyle,
        getNodeListForDimLevelRadio: AdhocDataProcessor.fn.getNodeListForDimLevelRadio,
        getNodeListForSliderLevel: AdhocDataProcessor.fn.getNodeListForSliderLevel,
        getColumnSliderLevelCount: function() {
            return AdhocDataProcessor.colSliderLevelCount;
        },
        getRowSliderLevelCount: function() {
            return AdhocDataProcessor.rowSliderLevelCount;
        }
    }
})(this, _);
