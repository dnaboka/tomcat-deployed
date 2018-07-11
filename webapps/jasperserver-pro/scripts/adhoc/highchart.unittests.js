/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

var HighChartUnitTests = function() {

    return this;
};


// testcase  obj2 simple tree
//   var testSimpleTreeColSlider0 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 0);
//
HighChartUnitTests.prototype.checkObj2SimpleTreeCol00 = function(inp) {
   if (inp.label != 'root')   alert("checkObj2SimpleTreeCol00: error  1");
   if (inp.level != 0) alert("checkObj2SimpleTreeCol00: error  2");
   var cs = inp.children;
   if (cs.length != 1)        alert("checkObj2SimpleTreeCol00: error  3");
   var c = cs[0];
   if (c.label != 'ALL')     alert("checkObj2SimpleTreeCol00: error  4");
   if (c.level != 1)     alert("checkObj2SimpleTreeCol00: error  5");
   cs = c.children;
   c = cs[0];
   if (cs.length != 1)        alert("checkObj2SimpleTreeCol00: error  6");
   if (c.label != 'ALL')     alert("checkObj2SimpleTreeCol00: error  7");
   if (c.axisCoordinate != 15)   alert("checkObj2SimpleTreeCol00: error  8");
   if (c.level != 2)            alert("checkObj2SimpleTreeCol00: error  9");
};


// testcase  obj2 simple tree
//   var testSimpleTreeRowSlider0 = this.DataProcessor.getSimpleTreeForSliderLevel(0, 0);
//
HighChartUnitTests.prototype.checkObj2SimpleTreeRow00 = function(inp) {
   if (inp.label != 'root')   alert("checkObj2SimpleTreeRow00: error  1");
   if (inp.level != 0) alert("checkObj2SimpleTreeRow00: error  2");

   var cs = inp.children;
   if (cs.length != 1)        alert("checkObj2SimpleTreeRow00: error  3");
   var c = cs[0];
   if (cs.length != 1)        alert("checkObj2SimpleTreeRow00: error  6");
   if (c.label != 'ALL')     alert("checkObj2SimpleTreeRow00: error  7");
   if (c.axisCoordinate != 3)   alert("checkObj2SimpleTreeRow00: error  8");
   if (c.measureName != 'Store Sales')    alert("checkObj2SimpleTreeRow00: error  9");
   if (c.level != 1)                        alert("checkObj2SimpleTreeRow00: error  10");

   cs = c.children;
   if (cs.length != 0)  alert("checkObj2SimpleTreeRow00: error  11");
};



// testcase  obj2 simple tree   1
//   var testSimpleTreeRowSlider0 = this.DataProcessor.getSimpleTreeForSliderLevel(0, 1);
//
HighChartUnitTests.prototype.checkObj2SimpleTreeRow01 = function(inp) {
   if (inp.label != 'root')   alert("checkObj2SimpleTreeRow01: error  1");
   if (inp.level != 0) alert("checkObj2SimpleTreeRow01: error  2");
   var cs0 = inp.children;

   if (cs0.length != 3)        alert("checkObj2SimpleTreeRow01: error  03");
   var c = cs0[0];
   if (c.label != 'Drink')     alert("checkObj2SimpleTreeRow01: error  04");
   if (c.level != 1)     alert("checkObj2SimpleTreeRow01: error  05");
   if (c.measureName != 'Store Sales')   alert("checkObj2SimpleTreeRow01: error  07");
   if (c.axisCoordinate != 0)      alert("checkObj2SimpleTreeRow01: error  09");
   var cs = c.children;
   if (cs.length != 0)  alert("checkObj2SimpleTreeRow01: error  10");

   c = cs0[1];
   if (c.label != 'Food')     alert("checkObj2SimpleTreeRow01: error  14");
   if (c.measureName != 'Store Sales')   alert("checkObj2SimpleTreeRow01: error  17");
   if (c.level != 1)             alert("checkObj2SimpleTreeRow01: error  18");
   if (c.axisCoordinate != 1)      alert("checkObj2SimpleTreeRow01: error  19");
   cs = c.children;
   if (cs.length != 0)  alert("checkObj2SimpleTreeRow01: error  20");

   c = cs0[2];
   if (c.label != 'Non-Consumable')     alert("checkObj2SimpleTreeRow01: error  24");
   if (c.level != 1)     alert("checkObj2SimpleTreeRow01: error  25");
   cs = c.children;
   if (cs.length != 0)  alert("checkObj2SimpleTreeRow01: error  26");
   if (c.measureName != 'Store Sales')   alert("checkObj2SimpleTreeRow01: error  27");
   if (c.axisCoordinate != 2)      alert("checkObj2SimpleTreeRow01: error  29");
};


// testcase  obj2 simple tree
//   var testSimpleTreeColSlider11 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 1);
//
HighChartUnitTests.prototype.checkObj2SimpleTreeCol11 = function(inp) {
   if (inp.label != 'root')   alert("checkObj2SimpleTreeCol11: error  1");
   if (inp.level != 0) alert("checkObj2SimpleTreeCol11: error  2");
   var cs0 = inp.children;

   if (cs0.length != 3)        alert("checkObj2SimpleTreeCol11: error  03");
   c = cs0[0];
   if (c.label != 'Canada')     alert("checkObj2SimpleTreeCol11: error  04");
   if (c.level != 1)     alert("checkObj2SimpleTreeCol11: error  05");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj2SimpleTreeCol11: error  06");
   c = cs[0];
   if (c.label != 'ALL')   alert("checkObj2SimpleTreeCol11: error  07");
   if (c.level != 2)             alert("checkObj2SimpleTreeCol11: error  08");
   if (c.axisCoordinate != 1)      alert("checkObj2SimpleTreeCol11: error  09");

   c = cs0[1];
   if (c.label != 'Mexico')     alert("checkObj2SimpleTreeCol11: error  14");
      if (c.level != 1)     alert("checkObj2SimpleTreeCol11: error  15");
      cs = c.children;
      if (cs.length != 1)      alert("checkObj2SimpleTreeCol11: error  16");
      c = cs[0];
      if (c.label != 'All')   alert("checkObj2SimpleTreeCol11: error  17");
      if (c.level != 2)             alert("checkObj2SimpleTreeCol11: error  18");
      if (c.axisCoordinate != 10)      alert("checkObj2SimpleTreeCol11: error  19");

   c = cs0[2];
   if (c.label != 'USA')     alert("checkObj2SimpleTreeCol11: error  24");
   if (c.level != 1)     alert("checkObj2SimpleTreeCol11: error  25");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj2SimpleTreeCol11: error  26");
   c = cs[0];
   if (c.label != 'ALL')   alert("checkObj2SimpleTreeCol11: error  27");
   if (c.level != 2)             alert("checkObj2SimpleTreeCol11: error  28");
   if (c.axisCoordinate != 14)      alert("checkObj2SimpleTreeCol11: error  29");
};


// testcase  obj2 simple tree
//   var testSimpleTreeColSlider12 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 2);
//
HighChartUnitTests.prototype.checkObj2SimpleTreeCol12 = function(inp) {
   if (inp.label != 'root')   alert("checkObj2SimpleTreeCol12: error  1");
   if (inp.level != 0) alert("checkObj2SimpleTreeCol12: error  2");
   var cs0 = inp.children;

   if (cs0.length != 3)        alert("checkObj2SimpleTreeCol12: error  03");
   c = cs0[0];
   if (c.label != 'Canada')     alert("checkObj2SimpleTreeCol12: error  04");
   if (c.level != 1)     alert("checkObj2SimpleTreeCol12: error  05");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj2SimpleTreeCol12: error  06");
   c = cs[0];
   if (c.label != 'BC')   alert("checkObj2SimpleTreeCol12: error  07");
   if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  08");
   if (c.axisCoordinate != 0)      alert("checkObj2SimpleTreeCol12: error  09");

   c = cs0[1];
   if (c.label != 'Mexico')     alert("checkObj2SimpleTreeCol12: error  14");
      if (c.level != 1)     alert("checkObj2SimpleTreeCol12: error  15");
      cs = c.children;
      if (cs.length != 8)      alert("checkObj2SimpleTreeCol12: error  16");
      c = cs[0];
      if (c.label != 'DF')   alert("checkObj2SimpleTreeCol12: error  17");
      if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  18");
      if (c.axisCoordinate != 2)      alert("checkObj2SimpleTreeCol12: error  19");
      c = cs[1];
      if (c.label != 'Guerrero')   alert("checkObj2SimpleTreeCol12: error  117");
      if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  118");
      if (c.axisCoordinate != 3)      alert("checkObj2SimpleTreeCol12: error  119");
      c = cs[2];
      if (c.label != 'Jalisco')   alert("checkObj2SimpleTreeCol12: error  217");
      if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  218");
      if (c.axisCoordinate != 4)      alert("checkObj2SimpleTreeCol12: error  219");
      c = cs[3];
      if (c.label != 'Mexico')   alert("checkObj2SimpleTreeCol12: error  317");
      if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  318");
      if (c.axisCoordinate != 5)      alert("checkObj2SimpleTreeCol12: error  319");
      c = cs[4];
      if (c.label != 'Sinaloa')   alert("checkObj2SimpleTreeCol12: error  417");
      if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  418");
      if (c.axisCoordinate != 6)      alert("checkObj2SimpleTreeCol12: error  419");
      c = cs[5];
      if (c.label != 'Veracruz')   alert("checkObj2SimpleTreeCol12: error  517");
      if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  518");
      if (c.axisCoordinate != 7)      alert("checkObj2SimpleTreeCol12: error  519");
      c = cs[6];
      if (c.label != 'Yucatan')   alert("checkObj2SimpleTreeCol12: error  617");
      if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  618");
      if (c.axisCoordinate != 8)      alert("checkObj2SimpleTreeCol12: error  619");
      c = cs[7];
      if (c.label != 'Zacatecas')   alert("checkObj2SimpleTreeCol12: error  717");
      if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  718");
      if (c.axisCoordinate != 9)      alert("checkObj2SimpleTreeCol12: error  719");

   c = cs0[2];
   if (c.label != 'USA')     alert("checkObj2SimpleTreeCol12: error  24");
   if (c.level != 1)     alert("checkObj2SimpleTreeCol12: error  25");
   cs = c.children;
   if (cs.length != 3)      alert("checkObj2SimpleTreeCol12: error  26");
   c = cs[0];
   if (c.label != 'CA')   alert("checkObj2SimpleTreeCol12: error  27");
   if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  28");
   if (c.axisCoordinate != 11)      alert("checkObj2SimpleTreeCol12: error  29");
   c = cs[1];
   if (c.label != 'OR')   alert("checkObj2SimpleTreeCol12: error  127");
   if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  128");
   if (c.axisCoordinate != 12)      alert("checkObj2SimpleTreeCol12: error  129");
   c = cs[2];
   if (c.label != 'WA')   alert("checkObj2SimpleTreeCol12: error  227");
   if (c.level != 2)             alert("checkObj2SimpleTreeCol12: error  228");
   if (c.axisCoordinate != 13)      alert("checkObj2SimpleTreeCol12: error  229");
};


// testcase  obj3 simple tree
//   var testSimpleTreeColSlider0 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 0);
//
HighChartUnitTests.prototype.check2middleMeasuresColSlider10  = function(inp) {
   if (inp.label != 'root')   alert("check2middleMeasuresColSlider10: error  1");
   if (inp.level != 0) alert("check2middleMeasuresColSlider10: error  2");
   var cs = inp.children;
   if (cs.length != 1)        alert("check2middleMeasuresColSlider10: error  3");
   var c = cs[0];
   if (c.label != 'ALL')     alert("check2middleMeasuresColSlider10: error  4");
   if (c.level != 1)     alert("check2middleMeasuresColSlider10: error  5");
   cs = c.children;
   if (cs.length != 2)           alert("check2middleMeasuresColSlider10: error  5.5");
   c = cs[0];

   if (c.children.length != 0)  alert("check2middleMeasuresColSlider10: error  6");
   if (c.label != 'All')     alert("check2middleMeasuresColSlider10: error  7");
   if (c.measureName != 'Store Sales')   alert("check2middleMeasuresColSlider10: error  7.5");
   if (c.axisCoordinate != 16)   alert("check2middleMeasuresColSlider10: error  8");
   if (c.level != 3)            alert("check2middleMeasuresColSlider10: error  9");

   c = cs[1];
   if (c.children.length != 0)  alert("check2middleMeasuresColSlider10: error  16");
   if (c.label != 'All')     alert("check2middleMeasuresColSlider10: error  17");
   if (c.measureName != 'Unit Sales')   alert("check2middleMeasuresColSlider10: error  17.5");
   if (c.axisCoordinate != 21)   alert("check2middleMeasuresColSlider10: error  18");
   if (c.level != 3)            alert("check2middleMeasuresColSlider10: error  19");
};


// testcase  obj3 simple tree
//   var testSimpleTreeColSlider0 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 1);
//
HighChartUnitTests.prototype.check2middleMeasuresColSlider11  = function(inp) {
  if (inp.label != 'root')   alert("check2middleMeasuresColSlider11: error  1");
   if (inp.level != 0) alert("check2middleMeasuresColSlider11: error  2");
   var cs0 = inp.children;

   if (cs0.length != 2)        alert("check2middleMeasuresColSlider11: error  03");
   c = cs0[0];
   if (c.label != 'Canada')     alert("check2middleMeasuresColSlider11: error  04");
   if (c.level != 1)     alert("check2middleMeasuresColSlider11: error  05");
   cs = c.children;
   if (cs.length != 2)      alert("check2middleMeasuresColSlider11: error  06");
   c = cs[0];
   if (c.label != 'All')   alert("check2middleMeasuresColSlider11: error  07");
   if (c.measureName != 'Store Sales')  alert("check2middleMeasuresColSlider11: error  07.5");
   if (c.level != 3)             alert("check2middleMeasuresColSlider11: error  08");
   if (c.axisCoordinate != 1)      alert("check2middleMeasuresColSlider11: error  09");
   c = cs[1];
   if (c.label != 'All')   alert("check2middleMeasuresColSlider11: error  09.5");
   if (c.measureName != 'Unit Sales')  alert("check2middleMeasuresColSlider11: error  09.75");
   if (c.level != 3)             alert("check2middleMeasuresColSlider11: error  09.76");
   if (c.axisCoordinate != 3)      alert("check2middleMeasuresColSlider11: error  09.77");

   c = cs0[1];
   if (c.label != 'USA')     alert("check2middleMeasuresColSlider11: error  24");
   if (c.level != 1)     alert("check2middleMeasuresColSlider11: error  25");
   cs = c.children;
   if (cs.length != 2)      alert("check2middleMeasuresColSlider11: error  26");
   c = cs[0];
   if (c.label != 'All')   alert("check2middleMeasuresColSlider11: error  27");
   if (c.measureName != 'Store Sales')  alert("check2middleMeasuresColSlider11: error  27.5");
   if (c.level != 3)             alert("check2middleMeasuresColSlider11: error  28");
   if (c.axisCoordinate != 7)      alert("check2middleMeasuresColSlider11: error  29");
   c = cs[1];
   if (c.label != 'All')   alert("check2middleMeasuresColSlider11: error  29.5");
   if (c.measureName != 'Unit Sales')  alert("check2middleMeasuresColSlider11: error  29.6");
   if (c.level != 3)             alert("check2middleMeasuresColSlider11: error  29.7");
   if (c.axisCoordinate != 11)      alert("check2middleMeasuresColSlider11: error  29.8");
};


// testcase  obj3 simple tree
//   var testSimpleTreeColSlider0 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 2);
//
HighChartUnitTests.prototype.check2middleMeasuresColSlider12  = function(inp) {
  if (inp.label != 'root')   alert("check2middleMeasuresColSlider12: error  1");
   if (inp.level != 0) alert("check2middleMeasuresColSlider12: error  2");
   var cs0 = inp.children;

   if (cs0.length != 2)        alert("check2middleMeasuresColSlider12: error  03");
   c = cs0[0];
   if (c.label != 'Canada')     alert("check2middleMeasuresColSlider12: error  04");
   if (c.level != 1)     alert("check2middleMeasuresColSlider12: error  05");
   cs = c.children;
   if (cs.length != 2)      alert("check2middleMeasuresColSlider12: error  06");
   c = cs[0];
   if (c.label != 'BC')   alert("check2middleMeasuresColSlider12: error  07");
   if (c.measureName != 'Store Sales')  alert("check2middleMeasuresColSlider12: error  07.5");
   if (c.level != 3)             alert("check2middleMeasuresColSlider12: error  08");
   if (c.axisCoordinate != 0)      alert("check2middleMeasuresColSlider12: error  09");
   c = cs[1];
   if (c.label != 'BC')   alert("check2middleMeasuresColSlider12: error  09.5");
   if (c.measureName != 'Unit Sales')  alert("check2middleMeasuresColSlider12: error  09.75");
   if (c.level != 3)             alert("check2middleMeasuresColSlider12: error  09.76");
   if (c.axisCoordinate != 2)      alert("check2middleMeasuresColSlider12: error  09.77");

   c = cs0[1];
   if (c.label != 'USA')     alert("check2middleMeasuresColSlider12: error  24");
   if (c.level != 1)     alert("check2middleMeasuresColSlider12: error  25");
   cs = c.children;
   if (cs.length != 6)      alert("check2middleMeasuresColSlider12: error  26");
   c = cs[0];
   if (c.label != 'CA')   alert("check2middleMeasuresColSlider12: error  27");
   if (c.measureName != 'Store Sales')  alert("check2middleMeasuresColSlider12: error  27.5");
   if (c.level != 3)             alert("check2middleMeasuresColSlider12: error  28");
   if (c.axisCoordinate != 4)      alert("check2middleMeasuresColSlider12: error  29");
   c = cs[1];
   if (c.label != 'CA')   alert("check2middleMeasuresColSlider12: error  29.5");
   if (c.measureName != 'Unit Sales')  alert("check2middleMeasuresColSlider12: error  29.6");
   if (c.level != 3)             alert("check2middleMeasuresColSlider12: error  29.7");
   if (c.axisCoordinate != 8)      alert("check2middleMeasuresColSlider12: error  29.8");

      c = cs[2];
      if (c.label != 'OR')   alert("check2middleMeasuresColSlider12: error  37");
      if (c.measureName != 'Store Sales')  alert("check2middleMeasuresColSlider12: error  37.5");
      if (c.level != 3)             alert("check2middleMeasuresColSlider12: error  38");
      if (c.axisCoordinate != 5)      alert("check2middleMeasuresColSlider12: error  39");
      c = cs[3];
      if (c.label != 'OR')   alert("check2middleMeasuresColSlider12: error  39.5");
      if (c.measureName != 'Unit Sales')  alert("check2middleMeasuresColSlider12: error  39.6");
      if (c.level != 3)             alert("check2middleMeasuresColSlider12: error  39.7");
      if (c.axisCoordinate != 9)      alert("check2middleMeasuresColSlider12: error  39.8");

       c = cs[4];
       if (c.label != 'WA')   alert("check2middleMeasuresColSlider12: error  47");
       if (c.measureName != 'Store Sales')  alert("check2middleMeasuresColSlider12: error  47.5");
       if (c.level != 3)             alert("check2middleMeasuresColSlider12: error  48");
       if (c.axisCoordinate != 6)      alert("check2middleMeasuresColSlider12: error  49");
       c = cs[5];
       if (c.label != 'WA')   alert("check2middleMeasuresColSlider12: error  49.5");
       if (c.measureName != 'Unit Sales')  alert("check2middleMeasuresColSlider12: error  49.6");
       if (c.level != 3)             alert("check2middleMeasuresColSlider12: error  49.7");
       if (c.axisCoordinate != 10)      alert("check2middleMeasuresColSlider12: error  49.8");
};


// testcase  obj4  simple tree
//   var testSimpleTreeColSlider10 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 0);
//
HighChartUnitTests.prototype.checkObj4Col10 = function(inp) {
   if (inp.label != 'root')   alert("checkObj4Col10: error  1");
   if (inp.level != 0) alert("checkObj4Col10: error  2");
   var cs0 = inp.children;

   if (cs0.length != 1)        alert("checkObj4Col10: error  03");
   var c = cs0[0];
   if (c.label != 'ALL')     alert("checkObj4Col10: error  04");
   if (c.level != 1)     alert("checkObj4Col10: error  05");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj4Col10: error  06");

   c = cs[0];
   if (c.label != 'All')     alert("checkObj4Col10: error  14");
      if (c.level != 2)     alert("checkObj4Col10: error  15");
      cs = c.children;
      if (cs.length != 3)      alert("checkObj4Col10: error  16");
      c = cs[0];
      if (c.label != 'All')   alert("checkObj4Col10: error  17");
      if (c.measureName  != 'Store Sales')  alert("checkObj4Col10: error  17.5");
      if (c.level != 3)             alert("checkObj4Col10: error  18");
      if (c.axisCoordinate != 24)      alert("checkObj4Col10: error  19");
      c = cs[1];
      if (c.label != 'All')   alert("checkObj4Col10: error  117");
      if (c.measureName  != 'Store Cost')  alert("checkObj4Col10: error  117.5");
      if (c.level != 3)             alert("checkObj4Col10: error  118");
      if (c.axisCoordinate != 25)      alert("checkObj4Col10: error  119");
      c = cs[2];
      if (c.label != 'All')   alert("checkObj4Col10: error  217");
      if (c.measureName  != 'Unit Sales')  alert("checkObj4Col10: error  217.5");
      if (c.level != 3)             alert("checkObj4Col10: error  218");
      if (c.axisCoordinate != 26)      alert("checkObj4Col10: error  219");
};




// testcase  obj4  simple tree
//   var testSimpleTreeColSlider11 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 1);
//
HighChartUnitTests.prototype.checkObj4Col11 = function(inp) {
   if (inp.label != 'root')   alert("checkObj4Col11: error  1");
   if (inp.level != 0) alert("checkObj4Col11: error  2");
   var cs0 = inp.children;

   if (cs0.length != 1)        alert("checkObj4Col11: error  03");
   var c = cs0[0];
   if (c.label != 'USA')     alert("checkObj4Col11: error  04");
   if (c.level != 1)     alert("checkObj4Col11: error  05");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj4Col11: error  06");

   c = cs[0];
   if (c.label != 'All')     alert("checkObj4Col11: error  14");
      if (c.level != 2)     alert("checkObj4Col11: error  15");
      cs = c.children;
      if (cs.length != 3)      alert("checkObj4Col11: error  16");
      c = cs[0];
      if (c.label != 'All')   alert("checkObj4Col11: error  17");
      if (c.measureName  != 'Store Sales')  alert("checkObj4Col11: error  17.5");
      if (c.level != 3)             alert("checkObj4Col11: error  18");
      if (c.axisCoordinate != 21)      alert("checkObj4Col11: error  19");
      c = cs[1];
      if (c.label != 'All')   alert("checkObj4Col11: error  117");
      if (c.measureName  != 'Store Cost')  alert("checkObj4Col11: error  117.5");
      if (c.level != 3)             alert("checkObj4Col11: error  118");
      if (c.axisCoordinate != 22)      alert("checkObj4Col11: error  119");
      c = cs[2];
      if (c.label != 'All')   alert("checkObj4Col11: error  217");
      if (c.measureName  != 'Unit Sales')  alert("checkObj4Col11: error  217.5");
      if (c.level != 3)             alert("checkObj4Col11: error  218");
      if (c.axisCoordinate != 23)      alert("checkObj4Col11: error  219");
};



// testcase  obj4  simple tree
//   var testSimpleTreeColSlider12 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 2);
//
HighChartUnitTests.prototype.checkObj4Col12 = function(inp) {
   if (inp.label != 'root')   alert("checkObj4Col12: error  1");
   if (inp.level != 0) alert("checkObj4Col12: error  2");
   var cs0 = inp.children;

   if (cs0.length != 1)        alert("checkObj4Col12: error  03");
   var c = cs0[0];
   if (c.label != 'USA')     alert("checkObj4Col12: error  04");
   if (c.level != 1)     alert("checkObj4Col12: error  05");
   var cs1 = c.children;
   if (cs1.length != 2)      alert("checkObj4Col12: error  06");

   c = cs1[0];
   if (c.label != 'CA')     alert("checkObj4Col12: error  14");
      if (c.level != 2)     alert("checkObj4Col12: error  15");
      cs = c.children;
      if (cs.length != 3)      alert("checkObj4Col12: error  16");
      c = cs[0];
      if (c.label != 'All')   alert("checkObj4Col12: error  17");
      if (c.measureName  != 'Store Sales')  alert("checkObj4Col12: error  17.5");
      if (c.level != 3)             alert("checkObj4Col12: error  18");
      if (c.axisCoordinate != 9)      alert("checkObj4Col12: error  19");
      c = cs[1];
      if (c.label != 'All')   alert("checkObj4Col12: error  117");
      if (c.measureName  != 'Store Cost')  alert("checkObj4Col12: error  117.5");
      if (c.level != 3)             alert("checkObj4Col12: error  118");
      if (c.axisCoordinate != 10)      alert("checkObj4Col12: error  119");
      c = cs[2];
      if (c.label != 'All')   alert("checkObj4Col12: error  217");
      if (c.measureName  != 'Unit Sales')  alert("checkObj4Col12: error  217.5");
      if (c.level != 3)             alert("checkObj4Col12: error  218");
      if (c.axisCoordinate != 11)      alert("checkObj4Col12: error  219");

   c = cs1[1];
   if (c.label != 'OR')     alert("checkObj4Col12: error  514");
      if (c.level != 2)     alert("checkObj4Col12: error  515");
      cs = c.children;
      if (cs.length != 3)      alert("checkObj4Col12: error  516");
      c = cs[0];
      if (c.label != 'All')   alert("checkObj4Col12: error  517");
      if (c.measureName  != 'Store Sales')  alert("checkObj4Col12: error  517.5");
      if (c.level != 3)             alert("checkObj4Col12: error  518");
      if (c.axisCoordinate != 18)      alert("checkObj4Col12: error  519");
      c = cs[1];
      if (c.label != 'All')   alert("checkObj4Col12: error  4117");
      if (c.measureName  != 'Store Cost')  alert("checkObj4Col12: error  4117.5");
      if (c.level != 3)             alert("checkObj4Col12: error  4118");
      if (c.axisCoordinate != 19)      alert("checkObj4Col12: error  4119");
      c = cs[2];
      if (c.label != 'All')   alert("checkObj4Col12: error  4217");
      if (c.measureName  != 'Unit Sales')  alert("checkObj4Col12: error  4217.5");
      if (c.level != 3)             alert("checkObj4Col12: error  4218");
      if (c.axisCoordinate != 20)      alert("checkObj4Col12: error  4219");
};



// testcase  obj4  simple tree
//   var testSimpleTreeColSlider14 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 4);
//
HighChartUnitTests.prototype.checkObj4Col14 = function(inp) {
   if (inp.label != 'root')   alert("checkObj4Col14: error  1");
   if (inp.level != 0) alert("checkObj4Col14: error  2");
   var cs0 = inp.children;

   if (cs0.length != 1)        alert("checkObj4Col14: error  03");
   var c = cs0[0];
   if (c.label != 'USA')     alert("checkObj4Col14: error  04");
   if (c.level != 1)     alert("checkObj4Col14: error  05");
   var cs1 = c.children;
   if (cs1.length != 2)      alert("checkObj4Col14: error  06");

   c = cs1[0];
   if (c.label != 'CA')     alert("checkObj4Col14: error  14");
      if (c.level != 2)     alert("checkObj4Col14: error  15");
      cs = c.children;
      if (cs.length != 9)      alert("checkObj4Col14: error  16");
      c = cs[0];
      if (c.label != 'Arcadia')   alert("checkObj4Col14: error  17");
      if (c.measureName  != 'Store Sales')  alert("checkObj4Col14: error  17.5");
      if (c.level != 3)             alert("checkObj4Col14: error  18");
      if (c.axisCoordinate != 0)      alert("checkObj4Col14: error  19");
      c = cs[1];
      if (c.label != 'Arcadia')   alert("checkObj4Col14: error  117");
      if (c.measureName  != 'Store Cost')  alert("checkObj4Col14: error  117.5");
      if (c.level != 3)             alert("checkObj4Col14: error  118");
      if (c.axisCoordinate != 1)      alert("checkObj4Col14: error  119");
      c = cs[2];
      if (c.label != 'Arcadia')   alert("checkObj4Col14: error  217");
      if (c.measureName  != 'Unit Sales')  alert("checkObj4Col14: error  217.5");
      if (c.level != 3)             alert("checkObj4Col14: error  218");
      if (c.axisCoordinate != 2)      alert("checkObj4Col14: error  219");
      c = cs[3];
      if (c.label != 'Colma')   alert("checkObj4Col14: error  317");
      if (c.measureName  != 'Store Sales')  alert("checkObj4Col14: error  317.5");
      if (c.level != 3)             alert("checkObj4Col14: error  318");
      if (c.axisCoordinate != 3)      alert("checkObj4Col14: error  319");
      c = cs[4];
      if (c.label != 'Colma')   alert("checkObj4Col14: error  1117");
      if (c.measureName  != 'Store Cost')  alert("checkObj4Col14: error  1117.5");
      if (c.level != 3)             alert("checkObj4Col14: error  1118");
      if (c.axisCoordinate != 4)      alert("checkObj4Col14: error  1119");
      c = cs[5];
      if (c.label != 'Colma')   alert("checkObj4Col14: error  1217");
      if (c.measureName  != 'Unit Sales')  alert("checkObj4Col14: error  1217.5");
      if (c.level != 3)             alert("checkObj4Col14: error  1218");
      if (c.axisCoordinate != 5)      alert("checkObj4Col14: error  1219");
      c = cs[6];
      if (c.label != 'Fremont')   alert("checkObj4Col14: error  417");
      if (c.measureName  != 'Store Sales')  alert("checkObj4Col14: error  417.5");
      if (c.level != 3)             alert("checkObj4Col14: error  418");
      if (c.axisCoordinate != 6)      alert("checkObj4Col14: error  419");
      c = cs[7];
      if (c.label != 'Fremont')   alert("checkObj4Col14: error  2117");
      if (c.measureName  != 'Store Cost')  alert("checkObj4Col14: error  2117.5");
      if (c.level != 3)             alert("checkObj4Col14: error  2118");
      if (c.axisCoordinate != 7)      alert("checkObj4Col14: error  2119");
      c = cs[8];
      if (c.label != 'Fremont')   alert("checkObj4Col14: error  3217");
      if (c.measureName  != 'Unit Sales')  alert("checkObj4Col14: error  3217.5");
      if (c.level != 3)             alert("checkObj4Col14: error  3218");
      if (c.axisCoordinate != 8)      alert("checkObj4Col14: error  3219");

   c = cs1[1];
   if (c.label != 'OR')     alert("checkObj4Col14: error  514");
      if (c.level != 2)     alert("checkObj4Col14: error  515");
      cs = c.children;
      if (cs.length != 6)      alert("checkObj4Col14: error  516");
      c = cs[0];
      if (c.label != 'Albany')   alert("checkObj4Col14: error  517");
      if (c.measureName  != 'Store Sales')  alert("checkObj4Col14: error  517.5");
      if (c.level != 3)             alert("checkObj4Col14: error  518");
      if (c.axisCoordinate != 12)      alert("checkObj4Col14: error  519");
      c = cs[1];
      if (c.label != 'Albany')   alert("checkObj4Col14: error  4117");
      if (c.measureName  != 'Store Cost')  alert("checkObj4Col14: error  4117.5");
      if (c.level != 3)             alert("checkObj4Col14: error  4118");
      if (c.axisCoordinate != 13)      alert("checkObj4Col14: error  4119");
      c = cs[2];
      if (c.label != 'Albany')   alert("checkObj4Col14: error  4217");
      if (c.measureName  != 'Unit Sales')  alert("checkObj4Col14: error  4217.5");
      if (c.level != 3)             alert("checkObj4Col14: error  4218");
      if (c.axisCoordinate != 14)      alert("checkObj4Col14: error  4219");
      c = cs[3];
      if (c.label != 'Salem')   alert("checkObj4Col14: error  617");
      if (c.measureName  != 'Store Sales')  alert("checkObj4Col14: error  617.5");
      if (c.level != 3)             alert("checkObj4Col14: error  618");
      if (c.axisCoordinate != 15)      alert("checkObj4Col14: error  619");
      c = cs[4];
      if (c.label != 'Salem')   alert("checkObj4Col14: error  5117");
      if (c.measureName  != 'Store Cost')  alert("checkObj4Col14: error  5117.5");
      if (c.level != 3)             alert("checkObj4Col14: error  5118");
      if (c.axisCoordinate != 16)      alert("checkObj4Col14: error  5119");
      c = cs[5];
      if (c.label != 'Salem')   alert("checkObj4Col14: error  5217");
      if (c.measureName  != 'Unit Sales')  alert("checkObj4Col14: error  5217.5");
      if (c.level != 3)             alert("checkObj4Col14: error  5218");
      if (c.axisCoordinate != 17)      alert("checkObj4Col14: error  5219");
};



// testcase  obj5 simple tree
//   var testSimpleTreeColSlider0 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 0);
//
HighChartUnitTests.prototype.checkObjCol10 = function(inp) {
   if (inp.label != 'root')   alert("checkObjCol10: error  1");
   if (inp.level != 0) alert("checkObjCol10: error  2");
   var cs = inp.children;
   if (cs.length != 1)        alert("checkObjCol10: error  3");
   var c = cs[0];
   if (c.label != 'ALL')     alert("checkObjCol10: error  4");
   if (c.axisCoordinate != 3)   alert("checkObjCol10: error  8");
   if (c.level != 1)     alert("checkObjCol10: error  5");
   cs = c.children;
   if (cs.length != 0)        alert("checkObjCol10: error  6");
};


// testcase  obj2 simple tree
//   var testSimpleTreeColSlider11 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 1);
//
HighChartUnitTests.prototype.checkObjCol11 = function(inp) {
   if (inp.label != 'root')   alert("checkObjCol11: error  1");
   if (inp.level != 0) alert("checkObjCol11: error  2");
   var cs0 = inp.children;

   if (cs0.length != 3)        alert("checkObjCol11: error  03");
   c = cs0[0];
   if (c.label != 'Canada')     alert("checkObjCol11: error  04");
   if (c.level != 1)     alert("checkObjCol11: error  05");
    if (c.axisCoordinate != 0)      alert("checkObjCol11: error  09");

   cs = c.children;
   if (cs.length != 0)      alert("checkObjCol11: error  06");

   c = cs0[1];
   if (c.label != 'Mexico')     alert("checkObjCol11: error  14");
      if (c.level != 1)     alert("checkObjCol11: error  15");
      cs = c.children;
      if (cs.length != 0)      alert("checkObjCol11: error  16");
      if (c.axisCoordinate != 1)      alert("checkObjCol11: error  19");

   c = cs0[2];
      if (c.label != 'USA')     alert("checkObjCol11: error  24");
         if (c.level != 1)     alert("checkObjCol11: error  25");
         cs = c.children;
         if (cs.length != 0)      alert("checkObjCol11: error  26");
         if (c.axisCoordinate != 2)      alert("checkObjCol11: error  29");
};


// testcase  obj20  OLAP  Col 0 0
//   var testSimpleTreeColSlider14 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 4);
//
HighChartUnitTests.prototype.checkObj20Col00 = function(inp) {
   if (inp.label != 'root')   alert("checkObj20Col00: error  1");
   if (inp.level != 0) alert("checkObj20Col00: error  2");
   var cs0 = inp.children;

   if (cs0.length != 1)        alert("checkObj20Col00: error  03");
   var c = cs0[0];
   if (c.label != 'ALL')     alert("checkObj20Col00: error  04");
   if (c.level != 1)     alert("checkObj20Col00: error  05");
   var cs1 = c.children;
   if (cs1.length != 1)      alert("checkObj20Col00: error  06");

   c = cs1[0];
   if (c.label != 'ALL')     alert("checkObj20Col00: error  14");
      if (c.level != 2)     alert("checkObj20Col00: error  15");
      cs = c.children;
      if (cs.length != 1)      alert("checkObj20Col00: error  16");
      c = cs[0];
      if (c.label != 'ALL')   alert("checkObj20Col00: error  17");
      if (c.level != 3)             alert("checkObj20Col00: error  18");
      if (c.axisCoordinate != 0)      alert("checkObj20Col00: error  19");
};


// testcase  obj20  OLAP  Col 1 0
//   var testSimpleTreeColSlider14 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 4);
//
HighChartUnitTests.prototype.checkObj20Col10 = function(inp) {
   if (inp.label != 'root')   alert("checkObj20Col10: error  01");
   if (inp.level != 0) alert("checkObj20Col10: error  02");
   var cs0 = inp.children;

   if (cs0.length != 3)        alert("checkObj20Col10: error  03");

   var c = cs0[0];
   if (c.label != 'Canada')     alert("checkObj20Col10: error  04");
   if (c.level != 1)     alert("checkObj20Col10: error  05");
   var cs1 = c.children;
   if (cs1.length != 1)      alert("checkObj20Col10: error  06");

   c = cs1[0];
   if (c.label != 'ALL')     alert("checkObj20Col10: error  14");
      if (c.level != 2)     alert("checkObj20Col10: error  15");
      cs = c.children;
      if (cs.length != 1)      alert("checkObj20Col10: error  16");
      c = cs[0];
      if (c.label != 'ALL')   alert("checkObj20Col10: error  17");
      if (c.level != 3)             alert("checkObj20Col10: error  18");
      if (c.axisCoordinate != 9)      alert("checkObj20Col10: error  19");

   var c = cs0[1];
   if (c.label != 'Mexico')     alert("checkObj20Col10: error  104");
   if (c.level != 1)     alert("checkObj20Col10: error  105");
   var cs1 = c.children;
   if (cs1.length != 1)      alert("checkObj20Col10: error  106");

   c = cs1[0];
   if (c.label != 'ALL')     alert("checkObj20Col10: error  114");
      if (c.level != 2)     alert("checkObj20Col10: error  115");
      cs = c.children;
      if (cs.length != 1)      alert("checkObj20Col10: error  116");
      c = cs[0];
      if (c.label != 'ALL')   alert("checkObj20Col10: error  117");
      if (c.level != 3)             alert("checkObj20Col10: error  118");
      if (c.axisCoordinate != 18)      alert("checkObj20Col10: error  119");

   var c = cs0[2];
   if (c.label != 'USA')     alert("checkObj20Col10: error  204");
   if (c.level != 1)     alert("checkObj20Col10: error  205");
   var cs1 = c.children;
   if (cs1.length != 1)      alert("checkObj20Col10: error 2 06");

   c = cs1[0];
   if (c.label != 'ALL')     alert("checkObj20Col10: error  214");
      if (c.level != 2)     alert("checkObj20Col10: error  215");
      cs = c.children;
      if (cs.length != 1)      alert("checkObj20Col10: error  216");
      c = cs[0];
      if (c.label != 'ALL')   alert("checkObj20Col10: error  217");
      if (c.level != 3)             alert("checkObj20Col10: error  218");
      if (c.axisCoordinate != 27)      alert("checkObj20Col10: error  219");

};




// testcase  obj20  OLAP  Col 0 1
//   var testSimpleTreeColSlider14 = this.DataProcessor.getSimpleTreeForSliderLevel(1, 4);
//
HighChartUnitTests.prototype.checkObj20Col01 = function(inp) {
   if (inp.label != 'root')   alert("checkObj20Col01: error  01");
   if (inp.level != 0) alert("checkObj20Col01: error  02");
   var cs0 = inp.children;

   if (cs0.length != 1)        alert("checkObj20Col01: error  03");

   var c = cs0[0];
   if (c.label != 'ALL')     alert("checkObj20Col01: error  04");
   if (c.level != 1)     alert("checkObj20Col01: error  05");
   var cs1 = c.children;
   if (cs1.length != 3)      alert("checkObj20Col01: error  06");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj20Col01: error  14");
   if (c.level != 2)     alert("checkObj20Col01: error  15");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj20Col01: error  16");
   c = cs[0];
   if (c.label != 'ALL')   alert("checkObj20Col01: error  17");
   if (c.level != 3)             alert("checkObj20Col01: error  18");
   if (c.axisCoordinate != 1)      alert("checkObj20Col01: error  19");

   var c = cs1[1];
   if (c.label != 'Food')     alert("checkObj20Col01: error  104");
   if (c.level != 2)     alert("checkObj20Col01: error  105");
   var cs = c.children;
   if (cs.length != 1)      alert("checkObj20Col01: error  106");
   c = cs[0];
   if (c.label != 'ALL')     alert("checkObj20Col01: error  114");
   if (c.level != 3)     alert("checkObj20Col01: error  115");
   if (c.axisCoordinate != 4)      alert("checkObj20Col01: error  119");

   var c = cs1[2];
   if (c.label != 'Non-Consumable')     alert("checkObj20Col01: error  2104");
   if (c.level != 2)     alert("checkObj20Col01: error  2105");
   var cs = c.children;
   if (cs.length != 1)      alert("checkObj20Col01: error  2106");
   c = cs[0];
   if (c.label != 'ALL')     alert("checkObj20Col01: error  2114");
   if (c.level != 3)     alert("checkObj20Col01: error  2115");
   if (c.axisCoordinate != 6)      alert("checkObj20Col01: error  2119");
};



// testcase  obj20  OLAP  Col 0 2

// test leaf level Product Department subtotals  under ALL Countries
//
//        var dimLevels = [];
//        dimLevels.push({ level: 0 });
//        dimLevels.push({ level: 2 });
//
//        var testObj20Col02 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
//        unitTest.checkObj20Col02(testObj20Col02);
//
//
HighChartUnitTests.prototype.checkObj20Col02 = function(inp) {
   if (inp.label != 'root')   alert("checkObj20Col02: error  01");
   if (inp.level != 0) alert("checkObj20Col02: error  02");
   var cs0 = inp.children;

   if (cs0.length != 1)        alert("checkObj20Col02: error  03");

   var c = cs0[0];
   if (c.label != 'ALL')     alert("checkObj20Col02: error  04");
   if (c.level != 1)     alert("checkObj20Col02: error  05");
   var cs1 = c.children;
   if (cs1.length != 3)      alert("checkObj20Col02: error  06");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj20Col02: error  14");
   if (c.level != 2)     alert("checkObj20Col02: error  15");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col02: error  16");
   c = cs[0];
   if (c.label != 'Alcoholic Beverages')   alert("checkObj20Col02: error  17");
   if (c.level != 3)             alert("checkObj20Col02: error  18");
   if (c.axisCoordinate != 2)      alert("checkObj20Col02: error  19");
   c = cs[1];
   if (c.label != 'Beverages')   alert("checkObj20Col02: error  17");
   if (c.level != 3)             alert("checkObj20Col02: error  18");
   if (c.axisCoordinate != 3)      alert("checkObj20Col02: error  19");


   var c = cs1[1];
   if (c.label != 'Food')     alert("checkObj20Col02: error  104");
   if (c.level != 2)     alert("checkObj20Col02: error  105");
   var cs = c.children;
   if (cs.length != 1)      alert("checkObj20Col02: error  106");
   c = cs[0];
   if (c.label != 'Baked Goods')     alert("checkObj20Col02: error  114");
   if (c.level != 3)     alert("checkObj20Col02: error  115");
   if (c.axisCoordinate != 5)      alert("checkObj20Col02: error  119");

   var c = cs1[2];
   if (c.label != 'Non-Consumable')     alert("checkObj20Col02: error  2104");
   if (c.level != 2)     alert("checkObj20Col02: error  2105");
   var cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col02: error  2106");
   c = cs[0];
   if (c.label != 'Carousel')     alert("checkObj20Col02: error  2114");
   if (c.level != 3)     alert("checkObj20Col02: error  2115");
   if (c.axisCoordinate != 7)      alert("checkObj20Col02: error  2119");
   c = cs[1];
   if (c.label != 'Checkout')     alert("checkObj20Col02: error  214");
   if (c.level != 3)     alert("checkObj20Col02: error  2115");
   if (c.axisCoordinate != 8)      alert("checkObj20Col02: error  219");
};


//
//     test fully expanded levels on all Dimensions
//        var dimLevels = [];
//        dimLevels.push({ level: 1 });
//        dimLevels.push({ level: 2 });
//
//        var testObj20Col12 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);


HighChartUnitTests.prototype.checkObj20Col12 = function(inp) {
   if (inp.label != 'root')   alert("checkObj20Col12: error  01");
   if (inp.level != 0) alert("checkObj20Col12: error  02");
   var cs0 = inp.children;

   if (cs0.length != 3)        alert("checkObj20Col12: error  03");

   var c = cs0[0];
   if (c.label != 'Canada')     alert("checkObj20Col12: error  04");
   if (c.level != 1)     alert("checkObj20Col12: error  05");
   var cs1 = c.children;
   if (cs1.length != 3)      alert("checkObj20Col12: error  06");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj20Col12: error  14");
   if (c.level != 2)     alert("checkObj20Col12: error  15");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  16");
   c = cs[0];
   if (c.label != 'Alcoholic Beverages')   alert("checkObj20Col12: error  17");
   if (c.level != 3)             alert("checkObj20Col12: error  18");
   if (c.axisCoordinate != 11)      alert("checkObj20Col12: error  19");
   c = cs[1];
   if (c.label != 'Beverages')   alert("checkObj20Col12: error  17");
   if (c.level != 3)             alert("checkObj20Col12: error  18");
   if (c.axisCoordinate != 12)      alert("checkObj20Col12: error  19");

   c = cs1[1];
   if (c.label != 'Food')     alert("checkObj20Col12: error  114");
   if (c.level != 2)     alert("checkObj20Col12: error  115");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj20Col12: error  116");
   c = cs[0];
   if (c.label != 'Baked Goods')   alert("checkObj20Col12: error  117");
   if (c.level != 3)             alert("checkObj20Col12: error  118");
   if (c.axisCoordinate != 14)      alert("checkObj20Col12: error  119");

   c = cs1[2];
   if (c.label != 'Non-Consumable')     alert("checkObj20Col12: error  1114");
   if (c.level != 2)     alert("checkObj20Col12: error  1115");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  1116");
   c = cs[0];
   if (c.label != 'Carousel')   alert("checkObj20Col12: error  1117");
   if (c.level != 3)             alert("checkObj20Col12: error  1118");
   if (c.axisCoordinate != 16)      alert("checkObj20Col12: error 1119");
   c = cs[1];
   if (c.label != 'Checkout')   alert("checkObj20Col12: error  11117");
   if (c.level != 3)             alert("checkObj20Col12: error  11118");
   if (c.axisCoordinate != 17)      alert("checkObj20Col12: error  11119");




   var c = cs0[1];
   if (c.label != 'Mexico')     alert("checkObj20Col12: error  2104");
   if (c.level != 1)     alert("checkObj20Col12: error  2105");
   var cs1 = c.children;
   if (cs1.length != 3)      alert("checkObj20Col12: error  2106");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj20Col12: error  214");
   if (c.level != 2)     alert("checkObj20Col12: error  215");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  216");
   c = cs[0];
   if (c.label != 'Alcoholic Beverages')   alert("checkObj20Col12: error  217");
   if (c.level != 3)             alert("checkObj20Col12: error  218");
   if (c.axisCoordinate != 20)      alert("checkObj20Col12: error  219");
   c = cs[1];
   if (c.label != 'Beverages')   alert("checkObj20Col12: error  217");
   if (c.level != 3)             alert("checkObj20Col12: error  218");
   if (c.axisCoordinate != 21)      alert("checkObj20Col12: error  219");

   c = cs1[1];
   if (c.label != 'Food')     alert("checkObj20Col12: error  2214");
   if (c.level != 2)     alert("checkObj20Col12: error  2215");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj20Col12: error  2216");
   c = cs[0];
   if (c.label != 'Baked Goods')   alert("checkObj20Col12: error  2217");
   if (c.level != 3)             alert("checkObj20Col12: error  2218");
   if (c.axisCoordinate != 23)      alert("checkObj20Col12: error  2219");

   c = cs1[2];
   if (c.label != 'Non-Consumable')     alert("checkObj20Col12: error  22214");
   if (c.level != 2)     alert("checkObj20Col12: error 22215");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  22216");
   c = cs[0];
   if (c.label != 'Carousel')   alert("checkObj20Col12: error  22217");
   if (c.level != 3)             alert("checkObj20Col12: error  22218");
   if (c.axisCoordinate != 25)      alert("checkObj20Col12: error  22219");
   c = cs[1];
   if (c.label != 'Checkout')   alert("checkObj20Col12: error  222217");
   if (c.level != 3)             alert("checkObj20Col12: error  222218");
   if (c.axisCoordinate != 26)      alert("checkObj20Col12: error  222219");



   var c = cs0[2];
   if (c.label != 'USA')     alert("checkObj20Col12: error  3104");
   if (c.level != 1)     alert("checkObj20Col12: error  3105");
   var cs1 = c.children;
   if (cs1.length != 3)      alert("checkObj20Col12: error  3106");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj20Col12: error  314");
   if (c.level != 2)     alert("checkObj20Col12: error  315");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  316");
   c = cs[0];
   if (c.label != 'Alcoholic Beverages')   alert("checkObj20Col12: error  317");
   if (c.level != 3)             alert("checkObj20Col12: error  318");
   if (c.axisCoordinate != 29)      alert("checkObj20Col12: error  319");
   c = cs[1];
   if (c.label != 'Beverages')   alert("checkObj20Col12: error  3317");
   if (c.level != 3)             alert("checkObj20Col12: error  3318");
   if (c.axisCoordinate != 30)      alert("checkObj20Col12: error  3319");

   c = cs1[1];
   if (c.label != 'Food')     alert("checkObj20Col12: error  3314");
   if (c.level != 2)     alert("checkObj20Col12: error 3315");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj20Col12: error  3316");
   c = cs[0];
   if (c.label != 'Baked Goods')   alert("checkObj20Col12: error  33317");
   if (c.level != 3)             alert("checkObj20Col12: error  33318");
   if (c.axisCoordinate != 32)      alert("checkObj20Col12: error  33319");

   c = cs1[2];
   if (c.label != 'Non-Consumable')     alert("checkObj20Col12: error  333314");
   if (c.level != 2)     alert("checkObj20Col12: error  333315");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  333316");
   c = cs[0];
   if (c.label != 'Carousel')   alert("checkObj20Col12: error  173");
   if (c.level != 3)             alert("checkObj20Col12: error  183");
   if (c.axisCoordinate != 34)      alert("checkObj20Col12: error  193");
   c = cs[1];
   if (c.label != 'Checkout')   alert("checkObj20Col12: error  1733");
   if (c.level != 3)             alert("checkObj20Col12: error  1833");
   if (c.axisCoordinate != 35)      alert("checkObj20Col12: error  1933");

};



//
//     test fully expanded levels on all Dimensions  with Measure
//        var dimLevels = [];
//        dimLevels.push({ level: 1 });
//        dimLevels.push({ level: 2 });
//
//        var testObj20Col12 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);


HighChartUnitTests.prototype.checkObj22Col12 = function(inp) {
   if (inp.label != 'root')   alert("checkObj20Col12: error  01");
   if (inp.level != 0) alert("checkObj20Col12: error  02");
   var cs0 = inp.children;

   if (cs0.length != 3)        alert("checkObj20Col12: error  03");

   var c = cs0[0];
   if (c.label != 'Canada')     alert("checkObj20Col12: error  04");
   if (c.level != 1)     alert("checkObj20Col12: error  05");
   var cs1 = c.children;
   if (cs1.length != 3)      alert("checkObj20Col12: error  06");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj20Col12: error  14");
   if (c.level != 2)     alert("checkObj20Col12: error  15");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  16");
   c = cs[0];
   if (c.label != 'Alcoholic Beverages')   alert("checkObj20Col12: error  17");
   if (c.level != 3)             alert("checkObj20Col12: error  18");
   if (c.axisCoordinate != 11)      alert("checkObj20Col12: error  19");
   c = cs[1];
   if (c.label != 'Beverages')   alert("checkObj20Col12: error  17");
   if (c.level != 3)             alert("checkObj20Col12: error  18");
   if (c.axisCoordinate != 12)      alert("checkObj20Col12: error  19");

   c = cs1[1];
   if (c.label != 'Food')     alert("checkObj20Col12: error  114");
   if (c.level != 2)     alert("checkObj20Col12: error  115");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj20Col12: error  116");
   c = cs[0];
   if (c.label != 'Baked Goods')   alert("checkObj20Col12: error  117");
   if (c.level != 3)             alert("checkObj20Col12: error  118");
   if (c.axisCoordinate != 14)      alert("checkObj20Col12: error  119");

   c = cs1[2];
   if (c.label != 'Non-Consumable')     alert("checkObj20Col12: error  1114");
   if (c.level != 2)     alert("checkObj20Col12: error  1115");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  1116");
   c = cs[0];
   if (c.label != 'Carousel')   alert("checkObj20Col12: error  1117");
   if (c.level != 3)             alert("checkObj20Col12: error  1118");
   if (c.axisCoordinate != 16)      alert("checkObj20Col12: error 1119");
   c = cs[1];
   if (c.label != 'Checkout')   alert("checkObj20Col12: error  11117");
   if (c.level != 3)             alert("checkObj20Col12: error  11118");
   if (c.axisCoordinate != 17)      alert("checkObj20Col12: error  11119");




   var c = cs0[1];
   if (c.label != 'Mexico')     alert("checkObj20Col12: error  2104");
   if (c.level != 1)     alert("checkObj20Col12: error  2105");
   var cs1 = c.children;
   if (cs1.length != 3)      alert("checkObj20Col12: error  2106");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj20Col12: error  214");
   if (c.level != 2)     alert("checkObj20Col12: error  215");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  216");
   c = cs[0];
   if (c.label != 'Alcoholic Beverages')   alert("checkObj20Col12: error  217");
   if (c.level != 3)             alert("checkObj20Col12: error  218");
   if (c.axisCoordinate != 20)      alert("checkObj20Col12: error  219");
   c = cs[1];
   if (c.label != 'Beverages')   alert("checkObj20Col12: error  217");
   if (c.level != 3)             alert("checkObj20Col12: error  218");
   if (c.axisCoordinate != 21)      alert("checkObj20Col12: error  219");

   c = cs1[1];
   if (c.label != 'Food')     alert("checkObj20Col12: error  2214");
   if (c.level != 2)     alert("checkObj20Col12: error  2215");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj20Col12: error  2216");
   c = cs[0];
   if (c.label != 'Baked Goods')   alert("checkObj20Col12: error  2217");
   if (c.level != 3)             alert("checkObj20Col12: error  2218");
   if (c.axisCoordinate != 23)      alert("checkObj20Col12: error  2219");

   c = cs1[2];
   if (c.label != 'Non-Consumable')     alert("checkObj20Col12: error  22214");
   if (c.level != 2)     alert("checkObj20Col12: error 22215");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  22216");
   c = cs[0];
   if (c.label != 'Carousel')   alert("checkObj20Col12: error  22217");
   if (c.level != 3)             alert("checkObj20Col12: error  22218");
   if (c.axisCoordinate != 25)      alert("checkObj20Col12: error  22219");
   c = cs[1];
   if (c.label != 'Checkout')   alert("checkObj20Col12: error  222217");
   if (c.level != 3)             alert("checkObj20Col12: error  222218");
   if (c.axisCoordinate != 26)      alert("checkObj20Col12: error  222219");



   var c = cs0[2];
   if (c.label != 'USA')     alert("checkObj20Col12: error  3104");
   if (c.level != 1)     alert("checkObj20Col12: error  3105");
   var cs1 = c.children;
   if (cs1.length != 3)      alert("checkObj20Col12: error  3106");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj20Col12: error  314");
   if (c.level != 2)     alert("checkObj20Col12: error  315");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  316");
   c = cs[0];
   if (c.label != 'Alcoholic Beverages')   alert("checkObj20Col12: error  317");
   if (c.level != 3)             alert("checkObj20Col12: error  318");
   if (c.axisCoordinate != 29)      alert("checkObj20Col12: error  319");
   c = cs[1];
   if (c.label != 'Beverages')   alert("checkObj20Col12: error  3317");
   if (c.level != 3)             alert("checkObj20Col12: error  3318");
   if (c.axisCoordinate != 30)      alert("checkObj20Col12: error  3319");

   c = cs1[1];
   if (c.label != 'Food')     alert("checkObj20Col12: error  3314");
   if (c.level != 2)     alert("checkObj20Col12: error 3315");
   cs = c.children;
   if (cs.length != 1)      alert("checkObj20Col12: error  3316");
   c = cs[0];
   if (c.label != 'Baked Goods')   alert("checkObj20Col12: error  33317");
   if (c.level != 3)             alert("checkObj20Col12: error  33318");
   if (c.axisCoordinate != 32)      alert("checkObj20Col12: error  33319");

   c = cs1[2];
   if (c.label != 'Non-Consumable')     alert("checkObj20Col12: error  333314");
   if (c.level != 2)     alert("checkObj20Col12: error  333315");
   cs = c.children;
   if (cs.length != 2)      alert("checkObj20Col12: error  333316");
   c = cs[0];
   if (c.label != 'Carousel')   alert("checkObj20Col12: error  173");
   if (c.level != 3)             alert("checkObj20Col12: error  183");
   if (c.axisCoordinate != 34)      alert("checkObj20Col12: error  193");
   c = cs[1];
   if (c.label != 'Checkout')   alert("checkObj20Col12: error  1733");
   if (c.level != 3)             alert("checkObj20Col12: error  1833");
   if (c.axisCoordinate != 35)      alert("checkObj20Col12: error  1933");

};



//        // test country no ALL level totals, 2 measures in the middle, Product Family Totals
//        var dimLevels = [];
//        dimLevels.push({ level: 1 });
//        dimLevels.push({ level: 0 });
//
//        var testObj23Col10 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);

HighChartUnitTests.prototype.checkObj23Col10 = function(inp) {
   if (inp.label != 'root')   alert("checkObj23Col10: error  01");
   if (inp.level != 0) alert("checkObj23Col10: error  02");
   var cs0 = inp.children;

   if (cs0.length != 3)        alert("checkObj23Col10: error  03");

   var c = cs0[0];
   if (c.label != 'Canada')     alert("checkObj23Col10: error  04");
   if (c.level != 1)     alert("checkObj23Col10: error  05");
   var cs1 = c.children;
   if (cs1.length != 2)      alert("checkObj23Col10: error  06");

   c = cs1[0];
   if (c.label != 'All Products')     alert("checkObj23Col10: error  14");
   if (c.level != 3)     alert("checkObj23Col10: error  15");
   if (c.measureName != 'Store Cost')    alert("checkObj23Col10: error  16");
   if (c.axisCoordinate != 0)      alert("checkObj23Col10: error  17");


   c = cs1[1];
   if (c.label != 'All Products')     alert("checkObj23Col10: error  18");
   if (c.level != 3)     alert("checkObj23Col10: error  19");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col10: error  20");
   if (c.axisCoordinate != 1)      alert("checkObj23Col10: error  21");


   c = cs0[1];
   if (c.label != 'Mexico')     alert("checkObj23Col10: error  204");
   if (c.level != 1)     alert("checkObj23Col10: error  205");
   var cs1 = c.children;
   if (cs1.length != 2)      alert("checkObj23Col10: error  206");

   c = cs1[0];
   if (c.label != 'All Products')     alert("checkObj23Col10: error  214");
   if (c.level != 3)     alert("checkObj23Col10: error  15");
   if (c.measureName != 'Store Cost')    alert("checkObj23Col10: error  216");
   if (c.axisCoordinate != 5)      alert("checkObj23Col10: error  217");

   c = cs1[1];
   if (c.label != 'All Products')     alert("checkObj23Col10: error  218");
   if (c.level != 3)     alert("checkObj23Col10: error  219");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col10: error  220");
   if (c.axisCoordinate != 9)      alert("checkObj23Col10: error  221");


   var c = cs0[2];
   if (c.label != 'USA')     alert("checkObj23Col10: error  04");
   if (c.level != 1)     alert("checkObj23Col10: error  05");
   var cs1 = c.children;
   if (cs1.length != 2)      alert("checkObj23Col10: error  06");

   c = cs1[0];
   if (c.label != 'All Products')     alert("checkObj23Col10: error  14");
   if (c.level != 3)     alert("checkObj23Col10: error  15");
   if (c.measureName != 'Store Cost')    alert("checkObj23Col10: error  16");
   if (c.axisCoordinate != 13)      alert("checkObj23Col10: error  17");

   c = cs1[1];
   if (c.label != 'All Products')     alert("checkObj23Col10: error  18");
   if (c.level != 3)     alert("checkObj23Col10: error  19");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col10: error  20");
   if (c.axisCoordinate != 17)      alert("checkObj23Col10: error  21");


};




//        // test country no ALL level totals, 2 measures in the middle, Product Family Details
//        var dimLevels = [];
//        dimLevels.push({ level: 1 });
//        dimLevels.push({ level: 1 });
//
//        var testObj23Col10 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);

HighChartUnitTests.prototype.checkObj23Col11 = function(inp) {
   if (inp.label != 'root')   alert("checkObj23Col11: error  01");
   if (inp.level != 0) alert("checkObj23Col11: error  02");
   var cs0 = inp.children;

   if (cs0.length != 3)        alert("checkObj23Col11: error  03");

   var c = cs0[0];
   if (c.label != 'Mexico')     alert("checkObj23Col11: error  04");
   if (c.level != 1)     alert("checkObj23Col11: error  05");
   var cs1 = c.children;
   if (cs1.length != 6)      alert("checkObj23Col11: error  06");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj23Col11: error  07");
   if (c.level != 3)     alert("checkObj23Col11: error  08");
   if (c.measureName != 'Store Cost')    alert("checkObj23Col11: error  09");
   if (c.axisCoordinate != 6)      alert("checkObj23Col11: error  010");


   c = cs1[1];
   if (c.label != 'Drink')     alert("checkObj23Col11: error  011");
   if (c.level != 3)     alert("checkObj23Col11: error  012");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col11: error  013");
   if (c.axisCoordinate != 10)      alert("checkObj23Col11: error  014");

   c = cs1[2];
   if (c.label != 'Food')     alert("checkObj23Col11: error  015");
   if (c.level != 3)     alert("checkObj23Col11: error  016");
   if (c.measureName != 'Store Cost')    alert("checkObj23Col11: error  017");
   if (c.axisCoordinate != 7)      alert("checkObj23Col11: error  018x");


   c = cs1[3];
   if (c.label != 'Food')     alert("checkObj23Col11: error  018");
   if (c.level != 3)     alert("checkObj23Col11: error  019");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col11: error  020");
   if (c.axisCoordinate != 11)      alert("checkObj23Col11: error  021");

   c = cs1[4];
   if (c.label != 'Non-Consumable')     alert("checkObj23Col11: error  022");
   if (c.level != 3)     alert("checkObj23Col11: error  023");
   if (c.measureName != 'Store Cost')    alert("checkObj23Col11: error  024");
   if (c.axisCoordinate != 8)      alert("checkObj23Col11: error  025");

   c = cs1[5];
   if (c.label != 'Non-Consumable')     alert("checkObj23Col11: error  026");
   if (c.level != 3)     alert("checkObj23Col11: error  19");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col11: error  027");
   if (c.axisCoordinate != 12)      alert("checkObj23Col11: error  028");



   var c = cs0[1];
   if (c.label != 'USA')     alert("checkObj23Col11: error  104");
   if (c.level != 1)     alert("checkObj23Col11: error  105");
   var cs1 = c.children;
   if (cs1.length != 6)      alert("checkObj23Col11: error  106");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj23Col11: error  107");
   if (c.level != 3)     alert("checkObj23Col11: error  108");
   if (c.measureName != 'Store Cost')    alert("checkObj23Col11: error  109");
   if (c.axisCoordinate != 14)      alert("checkObj23Col11: error  1010");


   c = cs1[1];
   if (c.label != 'Drink')     alert("checkObj23Col11: error  1011");
   if (c.level != 3)     alert("checkObj23Col11: error  1012");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col11: error  1013");
   if (c.axisCoordinate != 18)      alert("checkObj23Col11: error  1014");

   c = cs1[2];
   if (c.label != 'Food')     alert("checkObj23Col11: error  1015");
   if (c.level != 3)     alert("checkObj23Col11: error  1016");
   if (c.measureName != 'Store Cost')    alert("checkObj23Col11: error  1017");
   if (c.axisCoordinate != 15)      alert("checkObj23Col11: error  1018x");


   c = cs1[3];
   if (c.label != 'Food')     alert("checkObj23Col11: error  1018");
   if (c.level != 3)     alert("checkObj23Col11: error  1019");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col11: error  1020");
   if (c.axisCoordinate != 19)      alert("checkObj23Col11: error  1021");

   c = cs1[4];
   if (c.label != 'Non-Consumable')     alert("checkObj23Col11: error  1022");
   if (c.level != 3)     alert("checkObj23Col11: error  1023");
   if (c.measureName != 'Store Cost')    alert("checkObj23Col11: error  1024");
   if (c.axisCoordinate != 16)      alert("checkObj23Col11: error  1025");

   c = cs1[5];
   if (c.label != 'Non-Consumable')     alert("checkObj23Col11: error  1026");
   if (c.level != 3)     alert("checkObj23Col11: error  119");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col11: error  1027");
   if (c.axisCoordinate != 20)      alert("checkObj23Col11: error  1028");



   var c = cs0[2];
   if (c.label != 'Canada')     alert("checkObj23Col11: error  204");
   if (c.level != 1)     alert("checkObj23Col11: error  205");
   var cs1 = c.children;
   if (cs1.length != 3)      alert("checkObj23Col11: error  206");

   c = cs1[0];
   if (c.label != 'Drink')     alert("checkObj23Col11: error  2011");
   if (c.level != 3)     alert("checkObj23Col11: error  2012");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col11: error  2013");
   if (c.axisCoordinate != 2)      alert("checkObj23Col11: error  2014");

   c = cs1[1];
   if (c.label != 'Food')     alert("checkObj23Col11: error  2018");
   if (c.level != 3)     alert("checkObj23Col11: error  2019");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col11: error  2020");
   if (c.axisCoordinate != 3)      alert("checkObj23Col11: error  2021");

   c = cs1[2];
   if (c.label != 'Non-Consumable')     alert("checkObj23Col11: error  2026");
   if (c.level != 3)     alert("checkObj23Col11: error  219");
   if (c.measureName != 'Store Sales')    alert("checkObj23Col11: error  2027");
   if (c.axisCoordinate != 4)      alert("checkObj23Col11: error  2028");

};





HighChartUnitTests.prototype.TestTreeNode = function() {
    this.isAll = false;
    return this;
};

// a simple but non-sense dataset
HighChartUnitTests.prototype.obj1 = function () {

    // data
    var data = new Array(2);
    var r0 = new Array(2);
    r0[0] = 1;
    r0[1] = 2;
    var r1 = new Array(2);
    r1[0] = 3;
    r1[1] = 4;
    data[0] = r0;
    data[1] = r1;

    // measures array
  var mArray = new Array(1);
  m0 = new Object();
  m0.name = "store cost";
  mArray[0] = m0;


  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = new Array(3);

    var ax0 = new Object();
    ax0.label = "Country";
    var ax1 = new Object();
    ax1.label = "State";
    var ax2 = new Object();
    ax2.label = "City";
    mAx[0] = ax0;
    mAx[1] = ax1;
    mAx[2] = ax2;

    var mAy = new Array(1);

    var ay0 = new Object();
    ay0.label = "measures";
    mAy[0] = ay0;

    mdArray[0] = mAx;
    mdArray[1] = mAy;

    // measures array
    var msArray = new Array(1);
    //var ms0 = new Object();
    //ms0.name = "store cost";
    msArray[0] = "store cost";

    md.axes = mdArray;
    md.measureAxis = 1;
    md.measures = msArray;


    // treeNodes
    var mTArray = new Array(2);

    //var mTx0 = new Object();
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "rootx";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;

        var mTy0 = new this.TestTreeNode();
        mTy0.label = "rootx";
        mTy0.level = 0;
        mTy0.axisCoordinate = -1;

    mTArray[0] = mTy0;     // row
    mTArray[1] = mTx0;     // column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;

  return res;
};


// a basic fully expanded single measure-at-leaf crosstab:
//    2 column levels
//    2 row levels one of which is a single measure
//
HighChartUnitTests.prototype.obj2 = function () {

    ////////////////////////////////////////
    // data 4 rows and 16 columns
    var data = new Array(4);
    var r0 = new Array(16);
    r0[0] = 8669.84;
    r0[1] = 8669.84;
    r0[2] = 6392.12;
    r0[3] = 2;
    r0[4] = 1;
    r0[5] = 2;
    r0[6] = 1;
    r0[7] = 2;
    r0[8] = 1;
    r0[9] = 2;
    r0[10] = 1;
    r0[11] = 2;
    r0[12] = 1;
    r0[13] = 2;
    r0[14] = 1;
    r0[15] = 2;

    var r1 = new Array(16);
    r1[0] = 8669.84;
        r1[1] = 8669.84;
        r1[2] = 6392.12;
        r1[3] = 2;
        r1[4] = 1;
        r1[5] = 2;
        r1[6] = 1;
        r1[7] = 2;
        r1[8] = 1;
        r1[9] = 2;
        r1[10] = 1;
        r1[11] = 2;
        r1[12] = 1;
        r1[13] = 2;
        r1[14] = 1;
        r1[15] = 2;

    var r2 = new Array(16);
       r2[0] = 8669.84;
       r2[1] = 8669.84;
       r2[2] = 6392.12;
       r2[3] = 2;
       r2[4] = 1;
       r2[5] = 2;
       r2[6] = 1;
       r2[7] = 2;
       r2[8] = 1;
       r2[9] = 2;
       r2[10] = 1;
       r2[11] = 2;
       r2[12] = 1;
       r2[13] = 2;
       r2[14] = 1;
       r2[15] = 2;

     var r3 = new Array(16);
        r3[0] = 8669.84;
        r3[1] = 8669.84;
        r3[2] = 6392.12;
        r3[3] = 2;
        r3[4] = 1;
        r3[5] = 2;
        r3[6] = 1;
        r3[7] = 2;
        r3[8] = 1;
        r3[9] = 2;
        r3[10] = 1;
        r3[11] = 2;
        r3[12] = 1;
        r3[13] = 2;
        r3[14] = 1;
        r3[15] = 2;

    data[0] = r0;
    data[1] = r1;
    data[2] = r2;
    data[3] = r3;


    // measures array
  var mArray = new Array(1);
  m0 = new Object();
  m0.name = "Store Sales";
  mArray[0] = m0;


  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = new Array(2);

    var ax0 = new Object();
    ax0.label = "Customer Country";
    var ax1 = new Object();
    ax1.label = "Customer State";
    mAx[0] = ax0;
    mAx[1] = ax1;


    var mAy = new Array(2);

    var ay0 = new Object();
    ay0.label = "Product Family";
    mAy[0] = ay0;
    var ay1 = new Object();
    ay1.label = "Measures";
    mAy[1] = ay1;

    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column


    // measures array
    var msArray = new Array(1);
    //var ms0 = new Object();
    //ms0.name = "Store Sales";
    msArray[0] = "Store Sales";

    md.axes = mdArray;
    md.measureAxis = 0;
    md.measures = msArray;



    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);

    // row tree nodes

    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;

    // column level 1    Countries
    mTx0.children = new Array(4);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Canada";
    mTx10.level = 1;
    mTx10.axisCoordinate = -1;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "Mexico";
    mTx11.level = 1;
    mTx11.axisCoordinate = -1;
    mTx0.children[1] = mTx11;

    var mTx12 = new this.TestTreeNode();
    mTx12.label = "USA";
    mTx12.level = 1;
    mTx12.axisCoordinate = -1;
    mTx0.children[2] = mTx12;

    var mTx13 = new this.TestTreeNode();
    mTx13.label = "ALL";
    mTx13.level = 1;
    mTx13.axisCoordinate = -1;
    mTx13.isAll = true;
    mTx0.children[3] = mTx13;


    // column level 2  leaf
    // CANADA
    mTx10.children = new Array(2);
    var mTx200 = new this.TestTreeNode();
    mTx200.label = "BC";
    mTx200.level = 2;
    mTx200.axisCoordinate = 0;
    mTx10.children[0] = mTx200;


    var mTx201 = new this.TestTreeNode();
    mTx201.label = "ALL";
    mTx201.level = 2;
    mTx201.axisCoordinate = 1;
    mTx201.isAll = true;
    mTx10.children[1] = mTx201;


    // MEXICO
    mTx11.children = new Array(9);
    var mTx210 = new this.TestTreeNode();
    mTx210.label = "DF";
    mTx210.level = 2;
    mTx210.axisCoordinate = 2;
    mTx11.children[0] = mTx210;

    var mTx211 = new this.TestTreeNode();
    mTx211.label = "Guerrero";
    mTx211.level = 2;
    mTx211.axisCoordinate = 3;
    mTx11.children[1] = mTx211;

    var mTx212 = new this.TestTreeNode();
    mTx212.label = "Jalisco";
    mTx212.level = 2;
    mTx212.axisCoordinate = 4;
    mTx11.children[2] = mTx212;

    var mTx213 = new this.TestTreeNode();
    mTx213.label = "Mexico";
    mTx213.level = 2;
    mTx213.axisCoordinate = 5;
    mTx11.children[3] = mTx213;

    var mTx214 = new this.TestTreeNode();
    mTx214.label = "Sinaloa";
    mTx214.level = 2;
    mTx214.axisCoordinate = 6;
    mTx11.children[4] = mTx214;

    var mTx215 = new this.TestTreeNode();
    mTx215.label = "Veracruz";
    mTx215.level = 2;
    mTx215.axisCoordinate = 7;
    mTx11.children[5] = mTx215;

    var mTx216 = new this.TestTreeNode();
    mTx216.label = "Yucatan";
    mTx216.level = 2;
    mTx216.axisCoordinate = 8;
    mTx11.children[6] = mTx216;

    var mTx217 = new this.TestTreeNode();
    mTx217.label = "Zacatecas";
    mTx217.level = 2;
    mTx217.axisCoordinate = 9;
    mTx11.children[7] = mTx217;

    var mTx218 = new this.TestTreeNode();
    mTx218.label = "All";
    mTx218.level = 2;
    mTx218.axisCoordinate = 10;
    mTx218.isAll = true;
    mTx11.children[8] = mTx218;


    // USA
    mTx12.children = new Array(4);
    var mTx220 = new this.TestTreeNode();
    mTx220.label = "CA";
    mTx220.level = 2;
    mTx220.axisCoordinate = 11;
    mTx12.children[0] = mTx220;

    var mTx221 = new this.TestTreeNode();
    mTx221.label = "OR";
    mTx221.level = 2;
    mTx221.axisCoordinate = 12;
    mTx12.children[1] = mTx221;

    var mTx222 = new this.TestTreeNode();
    mTx222.label = "WA";
    mTx222.level = 2;
    mTx222.axisCoordinate = 13;
    mTx12.children[2] = mTx222;

    var mTx223 = new this.TestTreeNode();
    mTx223.label = "ALL";
    mTx223.level = 2;
    mTx223.axisCoordinate = 14;
    mTx223.isAll = true;
    mTx12.children[3] = mTx223;


    // ALL   Countries
    mTx13.children = new Array(1);
    var mTx230 = new this.TestTreeNode();    //  ALL States
    mTx230.label = "ALL";
    mTx230.level = 2;
    mTx230.axisCoordinate = 15;
    mTx230.isAll = true;
    mTx13.children[0] = mTx230;



   // row tree nodes
    var mTyArray = new Array(1);

    // row level 0
    var mTy0 = new this.TestTreeNode();
    mTy0.label = "All";
    mTy0.level = 0;
    mTy0.axisCoordinate = -1;
    mTy0.isAll = true;
    mTyArray[0] = mTy0;


    // row level 1
    mTy0.children = new Array(4);
    var mTy10 = new this.TestTreeNode();
    mTy10.label = "Drink";
    mTy10.level = 1;
    mTy10.axisCoordinate = -1;
    mTy0.children[0] = mTy10;

    var mTy11 = new this.TestTreeNode();
    mTy11.label = "Food";
    mTy11.level = 1;
    mTy11.axisCoordinate = -1;
    mTy0.children[1] = mTy11;

    var mTy12 = new this.TestTreeNode();
    mTy12.label = "Non-Consumable";
    mTy12.level = 1;
    mTy12.axisCoordinate = -1;
    mTy0.children[2] = mTy12;

    var mTy13 = new this.TestTreeNode();
    mTy13.label = "ALL";
    mTy13.level = 1;
    mTy13.axisCoordinate = -1;
    mTy13.isAll = true;
    mTy0.children[3] = mTy13;


    // row level 2
    mTy10.children = new Array(1);
    var mTy210 = new this.TestTreeNode();
    mTy210.label = "Store Sales";
    mTy210.level = 2;
    mTy210.axisCoordinate =0;
    mTy10.children[0] = mTy210;

    mTy11.children = new Array(1);
    var mTy211 = new this.TestTreeNode();
    mTy211.label = "Store Sales";
    mTy211.level = 2;
    mTy211.axisCoordinate =1;
    mTy11.children[0] = mTy211;

    mTy12.children = new Array(1);
    var mTy212 = new this.TestTreeNode();
    mTy212.label = "Store Sales";
    mTy212.level = 2;
    mTy212.axisCoordinate =2;
    mTy12.children[0] = mTy212;

    mTy13.children = new Array(1);
    var mTy213 = new this.TestTreeNode();
    mTy213.label = "Store Sales";
    mTy213.level = 2;
    mTy213.axisCoordinate =3;
    mTy13.children[0] = mTy213;

    // set the axis tree nodes
    mTArray[0] = mTy0;      //  row
    mTArray[1] = mTx0;      //  column

  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;

  return res;
};




// a basic fully expanded 2measures in the middle crosstab:
//    3 column levels  the middle of which is measures with 2 measure levels
//    1 row level
//
HighChartUnitTests.prototype.obj3 = function () {

    ////////////////////////////////////////
    // data 4 rows and 22 columns
    var data = new Array(4);
    var r0 = new Array(23);
    r0[0] = 8669.84;
    r0[1] = 8669.84;
    r0[2] = 6392.12;
    r0[3] = 2;
    r0[4] = 1;
    r0[5] = 2;
    r0[6] = 1;
    r0[7] = 2;
    r0[8] = 1;
    r0[9] = 2;
    r0[10] = 1;
    r0[11] = 2;
    r0[12] = 1;
    r0[13] = 2;
    r0[14] = 1;
    r0[15] = 2;
    r0[16] = 1;
    r0[17] = 2;
    r0[18] = 1;
    r0[19] = 2;
    r0[20] = 1;
    r0[21] = 2;


    var r1 = new Array(16);
    r1[0] = 8669.84;
        r1[1] = 8669.84;
        r1[2] = 6392.12;
        r1[3] = 2;
        r1[4] = 1;
        r1[5] = 2;
        r1[6] = 1;
        r1[7] = 2;
        r1[8] = 1;
        r1[9] = 2;
        r1[10] = 1;
        r1[11] = 2;
        r1[12] = 1;
        r1[13] = 2;
        r1[14] = 1;
        r1[15] = 2;
    r1[16] = 1;
    r1[17] = 2;
    r1[18] = 1;
    r1[19] = 2;
    r1[20] = 1;
    r1[21] = 2;


    var r2 = new Array(16);
       r2[0] = 8669.84;
       r2[1] = 8669.84;
       r2[2] = 6392.12;
       r2[3] = 2;
       r2[4] = 1;
       r2[5] = 2;
       r2[6] = 1;
       r2[7] = 2;
       r2[8] = 1;
       r2[9] = 2;
       r2[10] = 1;
       r2[11] = 2;
       r2[12] = 1;
       r2[13] = 2;
       r2[14] = 1;
       r2[15] = 2;
     r2[16] = 1;
     r2[17] = 2;
     r2[18] = 1;
     r2[19] = 2;
     r2[20] = 1;
     r2[21] = 2;


     var r3 = new Array(16);
        r3[0] = 8669.84;
        r3[1] = 8669.84;
        r3[2] = 6392.12;
        r3[3] = 2;
        r3[4] = 1;
        r3[5] = 2;
        r3[6] = 1;
        r3[7] = 2;
        r3[8] = 1;
        r3[9] = 2;
        r3[10] = 1;
        r3[11] = 2;
        r3[12] = 1;
        r3[13] = 2;
        r3[14] = 1;
        r3[15] = 2;
    r3[16] = 1;
    r3[17] = 2;
    r3[18] = 1;
    r3[19] = 2;
    r3[20] = 1;
    r3[21] = 2;


    data[0] = r0;
    data[1] = r1;
    data[2] = r2;
    data[3] = r3;


    // measures array
  var msArray = [];
  msArray.push("Store Sales");
  msArray.push("Unit Sales");

 // m0 = new Object();
  //m0.name = "Store Sales";
  ////msArray[0] = m0;
  //m1 = new Object();
 //m1.name = "Unit Sales";
  //msArray[1] = m1;


  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = new Array(3);

    var ax0 = new Object();
    ax0.label = "Customer Country";
    var ax1 = new Object();
    ax1.label = "Measures";
    var ax2 = new Object();
    ax2.label = "Customer State";
    mAx[0] = ax0;
    mAx[1] = ax1;
    mAx[2] = ax2;


    var mAy = new Array(1);

    var ay0 = new Object();
    ay0.label = "Product Family";
    mAy[0] = ay0;


    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column


    md.axes = mdArray;
    md.measureAxis = 1;
    md.measures = msArray;


    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);

    // row tree nodes
    //var mTxArray = new Array(1);

    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;
    //mTxArray[0] = mTx0;


    // column level 1    Countries
    mTx0.children = new Array(3);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Canada";
    mTx10.level = 1;
    mTx10.axisCoordinate = -1;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "USA";
    mTx11.level = 1;
    mTx11.axisCoordinate = -1;
    mTx0.children[1] = mTx11;

    var mTx12 = new this.TestTreeNode();
    mTx12.label = "ALL";
    mTx12.level = 1;
    mTx12.axisCoordinate = -1;
    mTx12.isAll = true;
    mTx0.children[2] = mTx12;


    // column level 2  Measures
    mTx10.children = new Array(2);   //  for CANADA
    var mTx200 = new this.TestTreeNode();
    mTx200.label = "Store Sales";
    mTx200.level = 2;
    mTx200.axisCoordinate = -1;
    mTx10.children[0] = mTx200;

    mTx200.children = new Array(2);
    var mTx300 = new this.TestTreeNode();
    mTx300.label = "BC"
    mTx300.level = 3;
    mTx300.axisCoordinate = 0;
    mTx200.children[0] = mTx300;

    var mTx301 = new this.TestTreeNode();
    mTx301.label = "All"
    mTx301.level = 3;
    mTx301.axisCoordinate = 1;
    mTx301.isAll = true;
    mTx200.children[1] = mTx301;


    var mTx201 = new this.TestTreeNode();
    mTx201.label = "Unit Sales";
    mTx201.level = 2;
    mTx201.axisCoordinate = -1;
    mTx10.children[1] = mTx201;

    mTx201.children = new Array(2);
    var mTx302 = new this.TestTreeNode();
    mTx302.label = "BC"
    mTx302.level = 3;
    mTx302.axisCoordinate = 2;
    mTx201.children[0] = mTx302;

    var mTx303 = new this.TestTreeNode();
    mTx303.label = "All"
    mTx303.level = 3;
    mTx303.axisCoordinate = 3;
    mTx303.isAll = true;
    mTx201.children[1] = mTx303;



    mTx11.children = new Array(2);  //   for USA
    var mTx210 = new this.TestTreeNode();
    mTx210.label = "Store Sales";
    mTx210.level = 2;
    mTx210.axisCoordinate = -1;
    mTx11.children[0] = mTx210;

    mTx210.children = new Array(4);
    var mTx310 = new this.TestTreeNode();
    mTx310.label = "CA"
    mTx310.level = 3;
    mTx310.axisCoordinate = 4;
    mTx210.children[0] = mTx310;

    var mTx311 = new this.TestTreeNode();
    mTx311.label = "OR"
    mTx311.level = 3;
    mTx311.axisCoordinate = 5;
    mTx210.children[1] = mTx311;

    var mTx312 = new this.TestTreeNode();
    mTx312.label = "WA"
    mTx312.level = 3;
    mTx312.axisCoordinate = 6;
    mTx210.children[2] = mTx312;


    var mTx313 = new this.TestTreeNode();
    mTx313.label = "All"
    mTx313.level = 3;
    mTx313.axisCoordinate = 7;
    mTx313.isAll = true;
    mTx210.children[3] = mTx313;



    var mTx211 = new this.TestTreeNode();
    mTx211.label = "Unit Sales";
    mTx211.level = 2;
    mTx211.axisCoordinate = -1;
    mTx11.children[1] = mTx211;



    mTx211.children = new Array(4);
    var mTx320 = new this.TestTreeNode();
    mTx320.label = "CA"
    mTx320.level = 3;
    mTx320.axisCoordinate = 8;
    mTx211.children[0] = mTx320;

    var mTx321 = new this.TestTreeNode();
    mTx321.label = "OR"
    mTx321.level = 3;
    mTx321.axisCoordinate = 9;
    mTx211.children[1] = mTx321;

    var mTx322 = new this.TestTreeNode();
    mTx322.label = "WA"
    mTx322.level = 3;
    mTx322.axisCoordinate = 10;
    mTx211.children[2] = mTx322;


    var mTx323 = new this.TestTreeNode();
    mTx323.label = "All"
    mTx323.level = 3;
    mTx323.axisCoordinate = 11;
    mTx323.isAll = true;
    mTx211.children[3] = mTx323;



    mTx12.children = new Array(2);  // for ALL Countries
    var mTx220 = new this.TestTreeNode();
    mTx220.label = "Store Sales";
    mTx220.level = 2;
    mTx220.axisCoordinate = -1;
    mTx12.children[0] = mTx220;

    mTx220.children = new Array(5);
    var mTx330 = new this.TestTreeNode();
    mTx330.label = "BC"
    mTx330.level = 3;
    mTx330.axisCoordinate = 12;
    mTx220.children[0] = mTx330;

    var mTx331 = new this.TestTreeNode();
    mTx331.label = "CA"
    mTx331.level = 3;
    mTx331.axisCoordinate = 13;
    mTx220.children[1] = mTx331;

    var mTx332 = new this.TestTreeNode();
    mTx332.label = "OR"
    mTx332.level = 3;
    mTx332.axisCoordinate = 14;
    mTx220.children[2] = mTx332;


    var mTx333 = new this.TestTreeNode();
    mTx333.label = "WA"
    mTx333.level = 3;
    mTx333.axisCoordinate = 15;
    mTx220.children[3] = mTx333;

    var mTx334 = new this.TestTreeNode();
    mTx334.label = "All"
    mTx334.level = 3;
    mTx334.axisCoordinate = 16;
    mTx334.isAll = true;
    mTx220.children[4] = mTx334;



    var mTx221 = new this.TestTreeNode();
    mTx221.label = "Unit Sales";
    mTx221.level = 2;
    mTx221.axisCoordinate = -1;
    mTx12.children[1] = mTx221;


    mTx221.children = new Array(5);
    var mTx340 = new this.TestTreeNode();
    mTx340.label = "BC"
    mTx340.level = 3;
    mTx340.axisCoordinate = 17;
    mTx221.children[0] = mTx340;

    var mTx341 = new this.TestTreeNode();
    mTx341.label = "CA"
    mTx341.level = 3;
    mTx341.axisCoordinate = 18;
    mTx221.children[1] = mTx341;

    var mTx342 = new this.TestTreeNode();
    mTx342.label = "OR"
    mTx342.level = 3;
    mTx342.axisCoordinate = 19;
    mTx221.children[2] = mTx342;


    var mTx343 = new this.TestTreeNode();
    mTx343.label = "WA"
    mTx343.level = 3;
    mTx343.axisCoordinate = 20;
    mTx221.children[3] = mTx343;

    var mTx344 = new this.TestTreeNode();
    mTx344.label = "All"
    mTx344.level = 3;
    mTx344.axisCoordinate = 21;
    mTx344.isAll = true;
    mTx221.children[4] = mTx344;



   // row tree nodes

    // row level 0
    var mTy0 = new this.TestTreeNode();
    mTy0.label = "All";
    mTy0.level = 0;
    mTy0.isAll = true;
    mTy0.axisCoordinate = -1;


    // row level 1
    mTy0.children = new Array(4);
    var mTy10 = new this.TestTreeNode();
    mTy10.label = "Drink";
    mTy10.level = 1;
    mTy10.axisCoordinate = -1;
    mTy0.children[0] = mTy10;

    var mTy11 = new this.TestTreeNode();
    mTy11.label = "Food";
    mTy11.level = 1;
    mTy11.axisCoordinate = -1;
    mTy0.children[1] = mTy11;

    var mTy12 = new this.TestTreeNode();
    mTy12.label = "Non-Consumable";
    mTy12.level = 1;
    mTy12.axisCoordinate = -1;
    mTy0.children[2] = mTy12;

    var mTy13 = new this.TestTreeNode();
    mTy13.label = "ALL";
    mTy13.level = 1;
    mTy13.axisCoordinate = -1;
    mTy13.isAll = true;
    mTy0.children[3] = mTy13;

    // set the axis tree nodes
    mTArray[0] = mTy0;      //  row
    mTArray[1] = mTx0;      //  column

  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;

  return res;
};





// a basic fully expanded 3measures at end of columns crosstab:
//    4 column levels
//    1 row level
//
HighChartUnitTests.prototype.obj4 = function () {

    ////////////////////////////////////////
    // data 4 rows and 27 columns
    var data = new Array(4);
    var r0 = new Array(23);
    r0[0] = 8669.84;
    r0[1] = 8669.84;
    r0[2] = 6392.12;
    r0[3] = 2;
    r0[4] = 1;
    r0[5] = 2;
    r0[6] = 1;
    r0[7] = 2;
    r0[8] = 1;
    r0[9] = 2;
    r0[10] = 1;
    r0[11] = 2;
    r0[12] = 1;
    r0[13] = 2;
    r0[14] = 1;
    r0[15] = 2;
    r0[16] = 1;
    r0[17] = 2;
    r0[18] = 1;
    r0[19] = 2;
    r0[20] = 1;
    r0[21] = 2;
    r0[22] = 1;
    r0[23] = 2;
    r0[24] = 24;
    r0[25] = 25;
    r0[26] = 26;

    var r1 = new Array(16);
    r1[0] = 8669.84;
        r1[1] = 8669.84;
        r1[2] = 6392.12;
        r1[3] = 2;
        r1[4] = 1;
        r1[5] = 2;
        r1[6] = 1;
        r1[7] = 2;
        r1[8] = 1;
        r1[9] = 2;
        r1[10] = 1;
        r1[11] = 2;
        r1[12] = 1;
        r1[13] = 2;
        r1[14] = 1;
        r1[15] = 2;
    r1[16] = 1;
    r1[17] = 2;
    r1[18] = 1;
    r1[19] = 2;
    r1[20] = 1;
    r1[21] = 2;
    r1[22] = 1;
    r1[23] = 2;
    r1[24] = 124;
    r1[25] = 125;
    r1[26] = 126;


    var r2 = new Array(16);
       r2[0] = 8669.84;
       r2[1] = 8669.84;
       r2[2] = 6392.12;
       r2[3] = 2;
       r2[4] = 1;
       r2[5] = 2;
       r2[6] = 1;
       r2[7] = 2;
       r2[8] = 1;
       r2[9] = 2;
       r2[10] = 1;
       r2[11] = 2;
       r2[12] = 1;
       r2[13] = 2;
       r2[14] = 1;
       r2[15] = 2;
     r2[16] = 1;
     r2[17] = 2;
     r2[18] = 1;
     r2[19] = 2;
     r2[20] = 1;
     r2[21] = 2;
    r2[22] = 1;
    r2[23] = 2;
    r2[24] = 224;
    r2[25] = 225;
    r2[26] = 226;


     var r3 = new Array(16);
        r3[0] = 8669.84;
        r3[1] = 8669.84;
        r3[2] = 6392.12;
        r3[3] = 2;
        r3[4] = 1;
        r3[5] = 2;
        r3[6] = 1;
        r3[7] = 2;
        r3[8] = 1;
        r3[9] = 2;
        r3[10] = 1;
        r3[11] = 2;
        r3[12] = 1;
        r3[13] = 2;
        r3[14] = 1;
        r3[15] = 2;
    r3[16] = 1;
    r3[17] = 2;
    r3[18] = 1;
    r3[19] = 2;
    r3[20] = 1;
    r3[21] = 2;
    r3[22] = 1;
    r3[23] = 2;
    r3[24] = 324;
    r3[25] = 325;
    r3[26] = 326;


    data[0] = r0;
    data[1] = r1;
    data[2] = r2;
    data[3] = r3;



    // measures array
  //var msArray = new Array(3);
  var msArray = [];
  msArray.push("Store Sales")
  msArray.push("Store Cost");
  msArray.push("Unit Sales");

  /*
  m0 = new Object();
  m0.name = "Store Sales";
  msArray[0] = m0;
  m1 = new Object();
 m1.name = "Store Cost";
  msArray[1] = m1;
  m2 = new Object();
 m2.name = "Unit Sales";
  msArray[2] = m2;
 */


  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = new Array(4);

    var ax0 = new Object();
    ax0.label = "Customer Country";
    var ax1 = new Object();
    ax1.label = "Customer State";
    var ax2 = new Object();
    ax2.label = "Customer City";
    var ax3 = new Object();
    ax3.label = "Measures";
    mAx[0] = ax0;
    mAx[1] = ax1;
    mAx[2] = ax2;
    mAx[3] = ax3;


    var mAy = new Array(1);

    var ay0 = new Object();
    ay0.label = "Product Family";
    mAy[0] = ay0;


    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column


    md.axes = mdArray;
    md.measureAxis = 1;
    md.measures = msArray;



    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);

    // row tree nodes

    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;


    // column level 1    Countries
    mTx0.children = new Array(2);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "USA";
    mTx10.level = 1;
    mTx10.axisCoordinate = -1;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();          //  Country ALL
    mTx11.label = "ALL";
    mTx11.level = 1;
    mTx11.axisCoordinate = -1;
    mTx11.isAll = true;
    mTx0.children[1] = mTx11;



    // column level 2  State
    mTx10.children = new Array(3);   //  States for USA
    var mTx200 = new this.TestTreeNode();
    mTx200.label = "CA";
    mTx200.level = 2;
    mTx200.axisCoordinate = -1;
    mTx10.children[0] = mTx200;

    var mTx201 = new this.TestTreeNode();
    mTx201.label = "OR"
    mTx201.level = 2;
    mTx201.axisCoordinate = 0;
    mTx10.children[1] = mTx201;

    var mTx202 = new this.TestTreeNode();
    mTx202.label = "All"
    mTx202.level = 2;
    mTx202.axisCoordinate = 1;
    mTx202.isAll = true;
    mTx10.children[2] = mTx202;



    mTx11.children = new Array(1);    //  ALL State for Country ALL
    var mTx210 = new this.TestTreeNode();
    mTx210.label = "All";
    mTx210.level = 2;
    mTx210.axisCoordinate = -1;
    mTx210.isAll = true;
    mTx11.children[0] = mTx210;


    //  COLUMN LEVEL 3   CITY
    mTx200.children = new Array(4);    //  for State CA
    var mTx301 = new this.TestTreeNode();
    mTx301.label = "Arcadia"
    mTx301.level = 3;
    mTx301.axisCoordinate = -1;
    mTx200.children[0] = mTx301;

    var mTx302 = new this.TestTreeNode();
    mTx302.label = "Colma"
    mTx302.level = 3;
    mTx302.axisCoordinate = -1;
    mTx200.children[1] = mTx302;

    var mTx303 = new this.TestTreeNode();
    mTx303.label = "Fremont"
    mTx303.level = 3;
    mTx303.axisCoordinate = -1;
    mTx200.children[2] = mTx303;

        var mTx304 = new this.TestTreeNode();
        mTx304.label = "All"
        mTx304.level = 3;
        mTx304.axisCoordinate = -1;
        mTx304.isAll = true;
        mTx200.children[3] = mTx304;


    mTx201.children = new Array(3);    //  for State OR
    var mTx311 = new this.TestTreeNode();
    mTx311.label = "Albany"
    mTx311.level = 3;
    mTx311.axisCoordinate = -1;
    mTx201.children[0] = mTx311;

    var mTx312 = new this.TestTreeNode();
    mTx312.label = "Salem"
    mTx312.level = 3;
    mTx312.axisCoordinate = -1;
    mTx201.children[1] = mTx312;

    var mTx313 = new this.TestTreeNode();
    mTx313.label = "All"
    mTx313.level = 3;
    mTx313.axisCoordinate = -1;
    mTx313.isAll = true;
    mTx201.children[2] = mTx313;

        mTx202.children = new Array(1)
        var mTx324 = new this.TestTreeNode();       //   USA   ALL STATES   ALL CITIES
        mTx324.label = "All"
        mTx324.level = 3;
        mTx324.axisCoordinate = -1;
        mTx324.isAll = true;
        mTx202.children[0] = mTx324;


   mTx210.children = new Array(1);       //  ALL Countries ALL States  ALL Cities
        var mTx334 = new this.TestTreeNode();       //
        mTx334.label = "All"
        mTx334.level = 3;
        mTx334.axisCoordinate = -1;
        mTx334.isAll = true;
        mTx210.children[0] = mTx334;


    //  Measures

    mTx301.children = new Array(3);  //   for Arcadia
    var mTx400 = new this.TestTreeNode();
    mTx400.label = "Store Sales";
    mTx400.level = 4;
    mTx400.axisCoordinate = 0;
    mTx301.children[0] = mTx400;

    var mTx401 = new this.TestTreeNode();
    mTx401.label = "Store Cost";
    mTx401.level = 4;
    mTx401.axisCoordinate = 1;
    mTx301.children[1] = mTx401;

    var mTx402 = new this.TestTreeNode();
    mTx402.label = "Unit Sales";
    mTx402.level = 4;
    mTx402.axisCoordinate = 2;
    mTx301.children[2] = mTx402;


    mTx302.children = new Array(3);  //   for Colma
    var mTx403 = new this.TestTreeNode();
    mTx403.label = "Store Sales";
    mTx403.level = 4;
    mTx403.axisCoordinate = 3;
    mTx302.children[0] = mTx403;

    var mTx404 = new this.TestTreeNode();
    mTx404.label = "Store Cost";
    mTx404.level = 4;
    mTx404.axisCoordinate = 4;
    mTx302.children[1] = mTx404;

    var mTx405 = new this.TestTreeNode();
    mTx405.label = "Unit Sales";
    mTx405.level = 4;
    mTx405.axisCoordinate = 5;
    mTx302.children[2] = mTx405;


    mTx303.children = new Array(3);  //   for Fremont
    var mTx406 = new this.TestTreeNode();
    mTx406.label = "Store Sales";
    mTx406.level = 4;
    mTx406.axisCoordinate = 6;
    mTx303.children[0] = mTx406;

    var mTx407 = new this.TestTreeNode();
    mTx407.label = "Store Cost";
    mTx407.level = 4;
    mTx407.axisCoordinate = 7;
    mTx303.children[1] = mTx407;

    var mTx408 = new this.TestTreeNode();
    mTx408.label = "Unit Sales";
    mTx408.level = 4;
    mTx408.axisCoordinate = 8;
    mTx303.children[2] = mTx408;

    mTx304.children = new Array(3);  //   for CA  ALL
    var mTx409 = new this.TestTreeNode();
    mTx409.label = "Store Sales";
    mTx409.level = 4;
    mTx409.axisCoordinate = 9;
    mTx304.children[0] = mTx409;

    var mTx410 = new this.TestTreeNode();
    mTx410.label = "Store Cost";
    mTx410.level = 4;
    mTx410.axisCoordinate = 10;
    mTx304.children[1] = mTx410;

    var mTx411 = new this.TestTreeNode();
    mTx411.label = "Unit Sales";
    mTx411.level = 4;
    mTx411.axisCoordinate = 11;
    mTx304.children[2] = mTx411;

    mTx311.children = new Array(3);  //   for Albany
    var mTx412 = new this.TestTreeNode();
    mTx412.label = "Store Sales";
    mTx412.level = 4;
    mTx412.axisCoordinate = 12;
    mTx311.children[0] = mTx412;

    var mTx413 = new this.TestTreeNode();
    mTx413.label = "Store Cost";
    mTx413.level = 4;
    mTx413.axisCoordinate = 13;
    mTx311.children[1] = mTx413;

    var mTx414 = new this.TestTreeNode();
    mTx414.label = "Unit Sales";
    mTx414.level = 4;
    mTx414.axisCoordinate = 14;
    mTx311.children[2] = mTx414;

    mTx312.children = new Array(3);  //   for Salem
    var mTx415 = new this.TestTreeNode();
    mTx415.label = "Store Sales";
    mTx415.level = 4;
    mTx415.axisCoordinate = 15;
    mTx312.children[0] = mTx415;

    var mTx416 = new this.TestTreeNode();
    mTx416.label = "Store Cost";
    mTx416.level = 4;
    mTx416.axisCoordinate = 16;
    mTx312.children[1] = mTx416;

    var mTx417 = new this.TestTreeNode();
    mTx417.label = "Unit Sales";
    mTx417.level = 4;
    mTx417.axisCoordinate = 17;
    mTx312.children[2] = mTx417;

    mTx313.children = new Array(3);  //   for OR  All
    var mTx418 = new this.TestTreeNode();
    mTx418.label = "Store Sales";
    mTx418.level = 4;
    mTx418.axisCoordinate = 18;
    mTx313.children[0] = mTx418;

    var mTx419 = new this.TestTreeNode();
    mTx419.label = "Store Cost";
    mTx419.level = 4;
    mTx419.axisCoordinate = 19;
    mTx313.children[1] = mTx419;

    var mTx420 = new this.TestTreeNode();
    mTx420.label = "Unit Sales";
    mTx420.level = 4;
    mTx420.axisCoordinate = 20;
    mTx313.children[2] = mTx420;

    mTx324.children = new Array(3);  //   for USA  all States  all Cities
    var mTx421 = new this.TestTreeNode();
    mTx421.label = "Store Sales";
    mTx421.level = 4;
    mTx421.axisCoordinate = 21;
    mTx324.children[0] = mTx421;

    var mTx422 = new this.TestTreeNode();
    mTx422.label = "Store Cost";
    mTx422.level = 4;
    mTx422.axisCoordinate = 22;
    mTx324.children[1] = mTx422;

    var mTx423 = new this.TestTreeNode();
    mTx423.label = "Unit Sales";
    mTx423.level = 4;
    mTx423.axisCoordinate = 23;
    mTx324.children[2] = mTx423;

    mTx334.children = new Array(3);  //   for all Countries  all States  all Cities
    var mTx424 = new this.TestTreeNode();
    mTx424.label = "Store Sales";
    mTx424.level = 4;
    mTx424.axisCoordinate = 24;
    mTx334.children[0] = mTx424;

    var mTx425 = new this.TestTreeNode();
    mTx425.label = "Store Cost";
    mTx425.level = 4;
    mTx425.axisCoordinate = 25;
    mTx334.children[1] = mTx425;

    var mTx426 = new this.TestTreeNode();
    mTx426.label = "Unit Sales";
    mTx426.level = 4;
    mTx426.axisCoordinate = 26;
    mTx334.children[2] = mTx426;



   // row tree nodes

    // row level 0
    var mTy0 = new this.TestTreeNode();
    mTy0.label = "All";
    mTy0.level = 0;
    mTy0.axisCoordinate = -1;
    mTy0.isAll = true;


    // row level 1
    mTy0.children = new Array(4);
    var mTy10 = new this.TestTreeNode();
    mTy10.label = "Drink";
    mTy10.level = 1;
    mTy10.axisCoordinate = 0;
    mTy0.children[0] = mTy10;

    var mTy11 = new this.TestTreeNode();
    mTy11.label = "Food";
    mTy11.level = 1;
    mTy11.axisCoordinate = 1;
    mTy0.children[1] = mTy11;

    var mTy12 = new this.TestTreeNode();
    mTy12.label = "Non-Consumable";
    mTy12.level = 1;
    mTy12.axisCoordinate = 2;
    mTy0.children[2] = mTy12;

    var mTy13 = new this.TestTreeNode();
    mTy13.label = "ALL";
    mTy13.level = 1;
    mTy13.axisCoordinate = 3;
    mTy13.isAll = true;
    mTy0.children[3] = mTy13;


    // set the axis tree nodes
    mTArray[0] = mTy0;      //  row
    mTArray[1] = mTx0;      //  column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;

  return res;
};



// most basic  single measure-at-leaf crosstab:
//    ROW   Product Family   Measures    this case is already tested in jsondata-case1
//    COLUMN   Customer Country     ONLY
//
HighChartUnitTests.prototype.obj5 = function () {

    ////////////////////////////////////////
    // data 4 rows and 4 columns
    var data = new Array(4);
    var r0 = new Array(16);
    r0[0] = 8669.84;
    r0[1] = 8669.84;
    r0[2] = 6392.12;
    r0[3] = 2;


    var r1 = new Array(16);
    r1[0] = 8669.84;
        r1[1] = 8669.84;
        r1[2] = 6392.12;
        r1[3] = 2;


    var r2 = new Array(16);
       r2[0] = 8669.84;
       r2[1] = 8669.84;
       r2[2] = 6392.12;
       r2[3] = 2;


     var r3 = new Array(16);
        r3[0] = 8669.84;
        r3[1] = 8669.84;
        r3[2] = 6392.12;
        r3[3] = 2;


    data[0] = r0;
    data[1] = r1;
    data[2] = r2;
    data[3] = r3;

    // measures array
  var mArray = [];
  mArray.push("Store Sales");

  //m0 = new Object();
  //m0.name = "Store Sales";
  //mArray[0] = m0;


  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = new Array(1);

    var ax0 = new Object();
    ax0.label = "Customer Country";
    mAx[0] = ax0;



    var mAy = new Array(2);

    var ay0 = new Object();
    ay0.label = "Product Family";
    mAy[0] = ay0;
    var ay1 = new Object();
    ay1.label = "Measures";
    mAy[1] = ay1;

    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column


    // measures array
    var msArray = [];
    msArray.push("Store Sales");

    //var ms0 = new Object();
    //ms0.name = "Store Sales";
    //msArray[0] = ms0;

    md.axes = mdArray;
    md.measureAxis = 0;
    md.measures = msArray;



    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);

    // row tree node

    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;


    // column level 1    Countries
    mTx0.children = new Array(4);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Canada";
    mTx10.level = 1;
    mTx10.axisCoordinate = 0;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "Mexico";
    mTx11.level = 1;
    mTx11.axisCoordinate = 1;
    mTx0.children[1] = mTx11;

    var mTx12 = new this.TestTreeNode();
    mTx12.label = "USA";
    mTx12.level = 1;
    mTx12.axisCoordinate = 2;
    mTx0.children[2] = mTx12;

    var mTx13 = new this.TestTreeNode();
    mTx13.label = "ALL";
    mTx13.level = 1;
    mTx13.axisCoordinate = 3;
    mTx13.isAll = true;
    mTx0.children[3] = mTx13;



   // row tree nodes
    var mTyArray = new Array(1);

    // row level 0
    var mTy0 = new this.TestTreeNode();
    mTy0.label = "All";
    mTy0.level = 0;
    mTy0.axisCoordinate = -1;
    mTy0.isAll = true;
    mTyArray[0] = mTy0;


    // row level 1
    mTy0.children = new Array(4);
    var mTy10 = new this.TestTreeNode();
    mTy10.label = "Drink";
    mTy10.level = 1;
    mTy10.axisCoordinate = -1;
    mTy0.children[0] = mTy10;

    var mTy11 = new this.TestTreeNode();
    mTy11.label = "Food";
    mTy11.level = 1;
    mTy11.axisCoordinate = -1;
    mTy0.children[1] = mTy11;

    var mTy12 = new this.TestTreeNode();
    mTy12.label = "Non-Consumable";
    mTy12.level = 1;
    mTy12.axisCoordinate = -1;
    mTy0.children[2] = mTy12;

    var mTy13 = new this.TestTreeNode();
    mTy13.label = "ALL";
    mTy13.level = 1;
    mTy13.axisCoordinate = -1;
    mTy13.isAll = true;
    mTy0.children[3] = mTy13;


    // row level 2
    mTy10.children = new Array(1);
    var mTy210 = new this.TestTreeNode();
    mTy210.label = "Store Sales";
    mTy210.level = 2;
    mTy210.axisCoordinate =0;
    mTy10.children[0] = mTy210;

    mTy11.children = new Array(1);
    var mTy211 = new this.TestTreeNode();
    mTy211.label = "Store Sales";
    mTy211.level = 2;
    mTy211.axisCoordinate =1;
    mTy11.children[0] = mTy211;

    mTy12.children = new Array(1);
    var mTy212 = new this.TestTreeNode();
    mTy212.label = "Store Sales";
    mTy212.level = 2;
    mTy212.axisCoordinate =2;
    mTy12.children[0] = mTy212;

    mTy13.children = new Array(1);
    var mTy213 = new this.TestTreeNode();
    mTy213.label = "Store Sales";
    mTy213.level = 2;
    mTy213.axisCoordinate =3;
    mTy13.children[0] = mTy213;

    // set the axis tree nodes
    mTArray[0] = mTy0;      //  row
    mTArray[1] = mTx0;      //  column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;

  return res;
};



//
//  ROW    Product Family
//  COLUMNS   Measures, Customer Country, Customer State
//  Measures:  Store Sales, Store Cost, Unit Sales
//
HighChartUnitTests.prototype.obj6 = function () {

    ////////////////////////////////////////
    // data 4 rows and 21 columns
    //var data = new Array(4);


        var data = new Array(4);
        var r0 = new Array(21);
        r0[0] = 8669.84;
        r0[1] = 8669.84;
        r0[2] = 6392.12;
        r0[3] = 2;
        r0[4] = 1;
        r0[5] = 2;
        r0[6] = 1;
        r0[7] = 2;
        r0[8] = 1;
        r0[9] = 2;
        r0[10] = 1;
        r0[11] = 2;
        r0[12] = 1;
        r0[13] = 2;
        r0[14] = 1;
        r0[15] = 2;
        r0[16] = 1;
        r0[17] = 2;
        r0[18] = 1;
        r0[19] = 2;
        r0[20] = 1;


        var r1 = new Array(21);
        r1[0] = 8669.84;
            r1[1] = 8669.84;
            r1[2] = 6392.12;
            r1[3] = 2;
            r1[4] = 1;
            r1[5] = 2;
            r1[6] = 1;
            r1[7] = 2;
            r1[8] = 1;
            r1[9] = 2;
            r1[10] = 1;
            r1[11] = 2;
            r1[12] = 1;
            r1[13] = 2;
            r1[14] = 1;
            r1[15] = 2;
        r1[16] = 1;
        r1[17] = 2;
        r1[18] = 1;
        r1[19] = 2;
        r1[20] = 1;



        var r2 = new Array(21);
           r2[0] = 8669.84;
           r2[1] = 8669.84;
           r2[2] = 6392.12;
           r2[3] = 2;
           r2[4] = 1;
           r2[5] = 2;
           r2[6] = 1;
           r2[7] = 2;
           r2[8] = 1;
           r2[9] = 2;
           r2[10] = 1;
           r2[11] = 2;
           r2[12] = 1;
           r2[13] = 2;
           r2[14] = 1;
           r2[15] = 2;
         r2[16] = 1;
         r2[17] = 2;
         r2[18] = 1;
         r2[19] = 2;
         r2[20] = 1;



         var r3 = new Array(21);
            r3[0] = 8669.84;
            r3[1] = 8669.84;
            r3[2] = 6392.12;
            r3[3] = 2;
            r3[4] = 1;
            r3[5] = 2;
            r3[6] = 1;
            r3[7] = 2;
            r3[8] = 1;
            r3[9] = 2;
            r3[10] = 1;
            r3[11] = 2;
            r3[12] = 1;
            r3[13] = 2;
            r3[14] = 1;
            r3[15] = 2;
        r3[16] = 1;
        r3[17] = 2;
        r3[18] = 1;
        r3[19] = 2;
        r3[20] = 1;


        data[0] = r0;
        data[1] = r1;
        data[2] = r2;
        data[3] = r3;

    // measures array
  var msArray = [];
  msArray.push("Store Sales");
  msArray.push("Store Cost");
  msArray.push("Unit Sales");

  /*
  m0 = new Object();
  m0.name = "Store Sales";
  msArray[0] = m0;
  m1 = new Object();
 m1.name = "Store Cost";
  msArray[1] = m1;
  m2 = new Object();
 m2.name = "Unit Sales";
  msArray[2] = m2;
  */

  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = new Array(3);

    var ax0 = new Object();
    ax0.label = "Measures";

    var ax1 = new Object();
    ax1.label = "Customer Country";

    var ax2 = new Object();
    ax2.label = "Customer State";

    mAx[0] = ax0;
    mAx[1] = ax1;
    mAx[2] = ax2;


    var mAy = new Array(1);

    var ay0 = new Object();
    ay0.label = "Product Family";
    mAy[0] = ay0;


    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column

    md.axes = mdArray;
    md.measureAxis = 1;
    md.measures = msArray;




    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);

    // row tree node

    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;


    // column level 1    Measures
    mTx0.children = new Array(3);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Store Sales";
    mTx10.level = 1;
    mTx10.axisCoordinate = 0;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "Store Cost";
    mTx11.level = 1;
    mTx11.axisCoordinate = 1;
    mTx0.children[1] = mTx11;

    var mTx12 = new this.TestTreeNode();
    mTx12.label = "Unit Sales";
    mTx12.level = 1;
    mTx12.axisCoordinate = 2;
    mTx0.children[2] = mTx12;



    // column level 2    Countries
    mTx10.children = new Array(3);    //  Store Sales
    var mTx20 = new this.TestTreeNode();
    mTx20.label = "Canada";
    mTx20.level = 2;
    mTx20.axisCoordinate = -1;
    mTx10.children[0] = mTx20;

    var mTx21 = new this.TestTreeNode();
    mTx21.label = "USA";
    mTx21.level = 2;
    mTx21.axisCoordinate = -1;
    mTx10.children[1] = mTx21;

    var mTx22 = new this.TestTreeNode();     // All Countries
    mTx22.label = "ALL";
    mTx22.level = 2;
    mTx22.axisCoordinate = -1;
    mTx22.isAll = true;
    mTx10.children[2] = mTx22;


    // column level 2    Countries
    mTx11.children = new Array(3);    //  Store Cost
    var mTx23 = new this.TestTreeNode();
    mTx23.label = "Canada";
    mTx23.level = 2;
    mTx23.axisCoordinate = -1;
    mTx11.children[0] = mTx23;

    var mTx24 = new this.TestTreeNode();
    mTx24.label = "USA";
    mTx24.level = 2;
    mTx24.axisCoordinate = -1;
    mTx11.children[1] = mTx24;

    var mTx25 = new this.TestTreeNode();        // All Countries
    mTx25.label = "ALL";
    mTx25.level = 2;
    mTx25.axisCoordinate = -1;
    mTx25.isAll = true;
    mTx11.children[2] = mTx25;



    // column level 2    Countries
    mTx12.children = new Array(3);    //  Unit Sales
    var mTx26 = new this.TestTreeNode();
    mTx26.label = "Canada";
    mTx26.level = 2;
    mTx26.axisCoordinate = -1;
    mTx12.children[0] = mTx26;

    var mTx27 = new this.TestTreeNode();
    mTx27.label = "USA";
    mTx27.level = 2;
    mTx27.axisCoordinate = -1;
    mTx12.children[1] = mTx27;

    var mTx28 = new this.TestTreeNode();         // All Countries
    mTx28.label = "ALL";
    mTx28.level = 2;
    mTx28.axisCoordinate = -1;
    mTx28.isAll = true;
    mTx12.children[2] = mTx28;


   /////////////////////////////////


    // column level 3   States
    mTx20.children = new Array(2);     //  Canada State Store Sales
    var mTx30 = new this.TestTreeNode();
    mTx30.label = "BC";
    mTx30.level = 3;
    mTx30.axisCoordinate = 0;
    mTx20.children[0] = mTx30;

    var mTx31 = new this.TestTreeNode();
    mTx31.label = "ALL";
    mTx31.level = 3;
    mTx31.axisCoordinate = 1;
    mTx31.isAll = true;
    mTx20.children[1] = mTx31;


    mTx21.children = new Array(4);     //  USA State Store Sales
    var mTx30 = new this.TestTreeNode();
    mTx30.label = "CA";
    mTx30.level = 3;
    mTx30.axisCoordinate = 2;
    mTx21.children[0] = mTx30;

    var mTx31 = new this.TestTreeNode();
    mTx31.label = "OR";
    mTx31.level = 3;
    mTx31.axisCoordinate = 3;
    mTx21.children[1] = mTx31;

    var mTx32 = new this.TestTreeNode();
    mTx32.label = "WA";
    mTx32.level = 3;
    mTx32.axisCoordinate = 4;
    mTx21.children[2] = mTx32;

    var mTx33 = new this.TestTreeNode();
    mTx33.label = "ALL";
    mTx33.level = 3;
    mTx33.axisCoordinate = 5;
    mTx33.isAll = true;
    mTx21.children[3] = mTx33;


    mTx22.children = new Array(1);
    var mTx34 = new this.TestTreeNode();        //  ALL Countries  ALL States    Store Sales
    mTx34.label = "ALL";
    mTx34.level = 3;
    mTx34.axisCoordinate = 6;
    mTx34.isAll = true;
    mTx22.children[0] = mTx34;


   ///////////////////////////////////


    mTx23.children = new Array(2);     //  Canada Store Cost
    var mTx35 = new this.TestTreeNode();
    mTx35.label = "BC";
    mTx35.level = 3;
    mTx35.axisCoordinate = 7;
    mTx23.children[0] = mTx35;

    var mTx36 = new this.TestTreeNode();
    mTx36.label = "ALL";
    mTx36.level = 3;
    mTx36.axisCoordinate = 8;
    mTx36.isAll = true;
    mTx23.children[1] = mTx36;


    mTx24.children = new Array(4);     //  USA Store Cost
    var mTx37 = new this.TestTreeNode();
    mTx37.label = "CA";
    mTx37.level = 3;
    mTx37.axisCoordinate = 9;
    mTx24.children[0] = mTx37;

    var mTx38 = new this.TestTreeNode();
    mTx38.label = "OR";
    mTx38.level = 3;
    mTx38.axisCoordinate = 10;
    mTx24.children[1] = mTx38;

    var mTx39 = new this.TestTreeNode();
    mTx39.label = "WA";
    mTx39.level = 3;
    mTx39.axisCoordinate = 11;
    mTx24.children[2] = mTx39;

    var mTx40 = new this.TestTreeNode();
    mTx40.label = "ALL";
    mTx40.level = 3;
    mTx40.axisCoordinate = 12;
    mTx40.isAll = true;
    mTx24.children[3] = mTx40;


    mTx25.children = new Array(1);
    var mTx41 = new this.TestTreeNode();        //  ALL Countries  ALL States    Store Cost
    mTx41.label = "ALL";
    mTx41.level = 3;
    mTx41.axisCoordinate = 13;
    mTx41.isAll = true;
    mTx25.children[0] = mTx41;




    mTx26.children = new Array(2);     //  Canada Unit Sales
    var mTx42 = new this.TestTreeNode();
    mTx42.label = "BC";
    mTx42.level = 3;
    mTx42.axisCoordinate = 14;
    mTx26.children[1] = mTx42;

    var mTx43 = new this.TestTreeNode();
    mTx43.label = "ALL";
    mTx43.level = 3;
    mTx43.axisCoordinate = 15;
    mTx43.isAll = true;
    mTx26.children[2] = mTx43;


    mTx27.children = new Array(4);     //  USA Unit Sales
    var mTx44 = new this.TestTreeNode();
    mTx44.label = "CA";
    mTx44.level = 3;
    mTx44.axisCoordinate = 16;
    mTx27.children[1] = mTx44;

    var mTx45 = new this.TestTreeNode();
    mTx45.label = "OR";
    mTx45.level = 3;
    mTx45.axisCoordinate = 17;
    mTx27.children[2] = mTx45;

    var mTx46 = new this.TestTreeNode();
    mTx46.label = "WA";
    mTx46.level = 3;
    mTx46.axisCoordinate = 18;
    mTx27.children[3] = mTx46;

    var mTx47 = new this.TestTreeNode();
    mTx47.label = "ALL";
    mTx47.level = 3;
    mTx47.axisCoordinate = 19;
    mTx47.isAll = true;
    mTx27.children[4] = mTx47;


    mTx28.children = new Array(1);
    var mTx48 = new this.TestTreeNode();        //  ALL Countries  ALL States   Unit Sales
    mTx48.label = "ALL";
    mTx48.level = 3;
    mTx48.axisCoordinate = 20;
    mTx48.isAll = true;
    mTx28.children[0] = mTx48;



   // row tree nodes
    var mTyArray = new Array(1);

    // row level 0
    var mTy0 = new this.TestTreeNode();
    mTy0.label = "All";
    mTy0.level = 0;
    mTy0.axisCoordinate = -1;
    mTy0.isAll = true;
    mTyArray[0] = mTy0;


    // row level 1
    mTy0.children = new Array(4);
    var mTy10 = new this.TestTreeNode();
    mTy10.label = "Drink";
    mTy10.level = 1;
    mTy10.axisCoordinate = 0;
    mTy0.children[0] = mTy10;

    var mTy11 = new this.TestTreeNode();
    mTy11.label = "Food";
    mTy11.level = 1;
    mTy11.axisCoordinate = 1;
    mTy0.children[1] = mTy11;

    var mTy12 = new this.TestTreeNode();
    mTy12.label = "Non-Consumable";
    mTy12.level = 1;
    mTy12.axisCoordinate = 2;
    mTy0.children[2] = mTy12;

    var mTy13 = new this.TestTreeNode();
    mTy13.label = "ALL";
    mTy13.level = 1;
    mTy13.axisCoordinate = 3;
    mTy13.isAll = true;
    mTy0.children[3] = mTy13;


    // set the axis tree nodes
    mTArray[0] = mTy0;      //  row
    mTArray[1] = mTx0;      //  column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;

  return res;
};




//
//  ROW    Customer Country, Customer State
//  COLUMNS   Measures ONLY
//  Measures:  Store Sales, Store Cost, Unit Sales
//
HighChartUnitTests.prototype.obj7 = function () {

    ////////////////////////////////////////
    // data 16 rows and 3 columns
    var data = new Array(16);


        //var data = new Array(3);
        var r0 = new Array(3);
        r0[0] = 100.84;
        r0[1] = 101.84;
        r0[2] = 102.12;


        var r1 = new Array(3);
        r1[0] = 8669.84;
            r1[1] = 8669.84;
            r1[2] = 6392.12;


        var r2 = new Array(3);
           r2[0] = 8669.84;
           r2[1] = 8669.84;
           r2[2] = 6392.12;


       var r3 = new Array(3);
            r3[0] = 8669.84;
            r3[1] = 8669.84;
            r3[2] = 6392.12;

                var r4 = new Array(3);
                r4[0] = 8669.84;
                r4[1] = 8669.84;
                r4[2] = 6392.12;

        var r5 = new Array(3);
        r5[0] = 8669.84;
        r5[1] = 8669.84;
        r5[2] = 6392.12;

        var r6 = new Array(3);
        r6[0] = 8669.84;
        r6[1] = 8669.84;
        r6[2] = 6392.12;

        var r7 = new Array(3);
        r7[0] = 8669.84;
        r7[1] = 8669.84;
        r7[2] = 6392.12;

        var r8 = new Array(3);
        r8[0] = 8669.84;
        r8[1] = 8669.84;
        r8[2] = 6392.12;

        var r9 = new Array(3);
        r9[0] = 8669.84;
        r9[1] = 8669.84;
        r9[2] = 6392.12;

        var r10 = new Array(3);
        r10[0] = 8669.84;
        r10[1] = 8669.84;
        r10[2] = 6392.12;

        var r11 = new Array(3);
        r11[0] = 8669.84;
        r11[1] = 8669.84;
        r11[2] = 6392.12;

        var r12 = new Array(3);
        r12[0] = 8669.84;
        r12[1] = 8669.84;
        r12[2] = 6392.12;

        var r13 = new Array(3);
        r13[0] = 8669.84;
        r13[1] = 8669.84;
        r13[2] = 6392.12;

        var r14 = new Array(3);
        r14[0] = 8669.84;
        r14[1] = 8669.84;
        r14[2] = 6392.12;

        var r15 = new Array(3);
        r15[0] = 150.84;
        r15[1] = 151.84;
        r15[2] = 152.12;




        data[0] = r0;
        data[1] = r1;
        data[2] = r2;
        data[3] = r3;
        data[4] = r4;
        data[5] = r5;
        data[6] = r6;
        data[7] = r7;
        data[8] = r8;
        data[9] = r9;
        data[10] = r10;
        data[11] = r11;
        data[12] = r12;
        data[13] = r13;
        data[14] = r14;
        data[15] = r15;




    // measures array
  var msArray = [];

  msArray.push("Store Sales");
  msArray.push("Store Cost");
  msArray.push("Unit Sales");

  /*
  m0 = new Object();
  m0.name = "Store Sales";
  msArray[0] = m0;
  m1 = new Object();
 m1.name = "Store Cost";
  msArray[1] = m1;
  m2 = new Object();
 m2.name = "Unit Sales";
  msArray[2] = m2;
  */

  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAy = new Array(2);
    var ay0 = new Object();
    ay0.label = "Customer Country";

    var ay1 = new Object();
    ay1.label = "Customer State";

    mAy[0] = ay0;
    mAy[1] = ay1;



    var mAx = new Array(1);

    var ax0 = new Object();
    ax0.label = "Measures";
    mAx[0] = ax0;


    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column

    md.axes = mdArray;
    md.measureAxis = 1;
    md.measures = msArray;




    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);

    // row tree node

    // column level 0
    var mTy0 = new this.TestTreeNode();
    mTy0.label = "All";
    mTy0.level = 0;
    mTy0.axisCoordinate = -1;
    mTy0.isAll = true;


    // column level 1    Countries
    mTy0.children = new Array(4);
    var mTy10 = new this.TestTreeNode();
    mTy10.label = "Canada";
    mTy10.level = 1;
    mTy10.axisCoordinate = -1;
    mTy0.children[0] = mTy10;

    var mTy11 = new this.TestTreeNode();
    mTy11.label = "Mexico";
    mTy11.level = 1;
    mTy11.axisCoordinate = -1;
    mTy0.children[1] = mTy11;

    var mTy12 = new this.TestTreeNode();
    mTy12.label = "USA";
    mTy12.level = 1;
    mTy12.axisCoordinate = -1;
    mTy0.children[2] = mTy12;

    var mTy13 = new this.TestTreeNode();
    mTy13.label = "ALL";
    mTy13.level = 1;
    mTy13.axisCoordinate = -1;
    mTy13.isAll = true;
    mTy0.children[3] = mTy13;


    // column level 2  leaf
    // CANADA
    mTy10.children = new Array(2);
    var mTy200 = new this.TestTreeNode();
    mTy200.label = "BC";
    mTy200.level = 2;
    mTy200.axisCoordinate = 0;
    mTy10.children[0] = mTy200;


    var mTy201 = new this.TestTreeNode();
    mTy201.label = "ALL";
    mTy201.level = 2;
    mTy201.axisCoordinate = 1;
    mTy201.isAll = true;
    mTy10.children[1] = mTy201;


    // MEXICO
    mTy11.children = new Array(9);
    var mTy210 = new this.TestTreeNode();
    mTy210.label = "DF";
    mTy210.level = 2;
    mTy210.axisCoordinate = 2;
    mTy11.children[0] = mTy210;

    var mTy211 = new this.TestTreeNode();
    mTy211.label = "Guerrero";
    mTy211.level = 2;
    mTy211.axisCoordinate = 3;
    mTy11.children[1] = mTy211;

    var mTy212 = new this.TestTreeNode();
    mTy212.label = "Jalisco";
    mTy212.level = 2;
    mTy212.axisCoordinate = 4;
    mTy11.children[2] = mTy212;

    var mTy213 = new this.TestTreeNode();
    mTy213.label = "Mexico";
    mTy213.level = 2;
    mTy213.axisCoordinate = 5;
    mTy11.children[3] = mTy213;

    var mTy214 = new this.TestTreeNode();
    mTy214.label = "Sinaloa";
    mTy214.level = 2;
    mTy214.axisCoordinate = 6;
    mTy11.children[4] = mTy214;

    var mTy215 = new this.TestTreeNode();
    mTy215.label = "Veracruz";
    mTy215.level = 2;
    mTy215.axisCoordinate = 7;
    mTy11.children[5] = mTy215;

    var mTy216 = new this.TestTreeNode();
    mTy216.label = "Yucatan";
    mTy216.level = 2;
    mTy216.axisCoordinate = 8;
    mTy11.children[6] = mTy216;

    var mTy217 = new this.TestTreeNode();
    mTy217.label = "Zacatecas";
    mTy217.level = 2;
    mTy217.axisCoordinate = 9;
    mTy11.children[7] = mTy217;

    var mTy218 = new this.TestTreeNode();
    mTy218.label = "All";
    mTy218.level = 2;
    mTy218.axisCoordinate = 10;
    mTy218.isAll = true;
    mTy11.children[8] = mTy218;


    // USA
    mTy12.children = new Array(4);
    var mTy220 = new this.TestTreeNode();
    mTy220.label = "CA";
    mTy220.level = 2;
    mTy220.axisCoordinate = 11;
    mTy12.children[0] = mTy220;

    var mTy221 = new this.TestTreeNode();
    mTy221.label = "OR";
    mTy221.level = 2;
    mTy221.axisCoordinate = 12;
    mTy12.children[1] = mTy221;

    var mTy222 = new this.TestTreeNode();
    mTy222.label = "WA";
    mTy222.level = 2;
    mTy222.axisCoordinate = 13;
    mTy12.children[2] = mTy222;

    var mTy223 = new this.TestTreeNode();
    mTy223.label = "ALL";
    mTy223.level = 2;
    mTy223.axisCoordinate = 14;
    mTy223.isAll = true;
    mTy12.children[3] = mTy223;


    // ALL   Countries
    mTy13.children = new Array(1);
    var mTy230 = new this.TestTreeNode();    //  ALL States
    mTy230.label = "ALL";
    mTy230.level = 2;
    mTy230.axisCoordinate = 15;
    mTy230.isAll = true;
    mTy13.children[0] = mTy230;






   // col tree nodes
    var mTxArray = new Array(1);

    // col level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;
    mTxArray[0] = mTx0;


   // column level 1    Measures
    mTx0.children = new Array(3);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Store Sales";
    mTx10.level = 1;
    mTx10.axisCoordinate = 0;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "Store Cost";
    mTx11.level = 1;
    mTx11.axisCoordinate = 1;
    mTx0.children[1] = mTx11;

    var mTx12 = new this.TestTreeNode();
    mTx12.label = "Unit Sales";
    mTx12.level = 1;
    mTx12.axisCoordinate = 2;
    mTx0.children[2] = mTx12;




    // set the axis tree nodes
    mTArray[0] = mTy0;      //  row
    mTArray[1] = mTx0;      //  column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;

  return res;
};




//
//  ROW       EMPTY
//  COLUMNS   Customer Country, Customer State, Measures,
//  Measures:  Store Sales, Store Cost
//
HighChartUnitTests.prototype.obj8 = function () {

    ////////////////////////////////////////
    // data 1 rows and 14 columns



        var data = new Array(1);
        var r0 = new Array(14);
        r0[0] = 98045.46;
        r0[1] = 39332.57;
        r0[2] = 98045.46;
        r0[3] = 39332.57;
        r0[4] = 154513.49;
        r0[5] = 61936.33;
        r0[6] = 128598.50;
        r0[7] = 51512.78;
        r0[8] = 267696.43;
        r0[9] = 107196.00;
        r0[10] = 550808.42;
        r0[11] = 220645.11;
        r0[12] = 648853.88;
        r0[13] = 259977.68;


        data[0] = r0;


    // measures array
  var msArray = [];
  msArray.push("Store Sales");
  msArray.push("Store Cost");


  /*
  m0 = new Object();
  m0.name = "Store Sales";
  msArray[0] = m0;
  m1 = new Object();
  m1.name = "Store Cost";
  msArray[1] = m1;
  */

  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = new Array(3);

    var ax0 = new Object();
    ax0.label = "Customer Country";

    var ax1 = new Object();
    ax1.label = "Customer State";

    var ax2 = new Object();
    ax2.label = "Measures";

    mAx[0] = ax0;
    mAx[1] = ax1;
    mAx[2] = ax2;


    var mAy = new Array(0);


    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column

    md.axes = mdArray;
    md.measureAxis = 1;
    md.measures = msArray;




    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);


    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.isAll = true;
    mTx0.axisCoordinate = -1;


    // column level 1    Measures
    mTx0.children = new Array(3);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Canada";
    mTx10.level = 1;
    mTx10.axisCoordinate = 0;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "USA";
    mTx11.level = 1;
    mTx11.axisCoordinate = 1;
    mTx0.children[1] = mTx11;

    var mTx12 = new this.TestTreeNode();
    mTx12.label = "All";
    mTx12.level = 1;
    mTx12.axisCoordinate = 2;
    mTx12.isAll = true;
    mTx0.children[2] = mTx12;



    // column level 2    Countries
    mTx10.children = new Array(3);    //  Canada States
    var mTx20 = new this.TestTreeNode();
    mTx20.label = "BC";
    mTx20.level = 2;
    mTx20.axisCoordinate = -1;
    mTx10.children[0] = mTx20;

    var mTx22 = new this.TestTreeNode();     // All Canada
    mTx22.label = "ALL";
    mTx22.level = 2;
    mTx22.axisCoordinate = -1;
    mTx22.isAll = true;
    mTx10.children[2] = mTx22;


    // column level 2    Countries
    mTx11.children = new Array(4);    //  USA States
    var mTx23 = new this.TestTreeNode();
    mTx23.label = "CA";
    mTx23.level = 2;
    mTx23.axisCoordinate = -1;
    mTx11.children[0] = mTx23;

    var mTx24 = new this.TestTreeNode();
    mTx24.label = "OR";
    mTx24.level = 2;
    mTx24.axisCoordinate = -1;
    mTx11.children[1] = mTx24;

    var mTx25 = new this.TestTreeNode();
    mTx25.label = "WA";
    mTx25.level = 2;
    mTx25.axisCoordinate = -1;
    mTx11.children[2] = mTx25;

    var mTx26 = new this.TestTreeNode();      // All USA
    mTx26.label = "All";
    mTx26.level = 2;
    mTx26.axisCoordinate = -1;
    mTx26.isAll = true;
    mTx11.children[3] = mTx26;


    mTx12.children = new Array(1);
    var mTx27 = new this.TestTreeNode();      // All Countries
    mTx27.label = "All";
    mTx27.level = 2;
    mTx27.axisCoordinate = -1;
    mTx27.isAll = true;
    mTx12.children[0] = mTx27;


   /////////////////////////////////


    // column level 3   States
    mTx20.children = new Array(2);     //  Canada State
    var mTx30 = new this.TestTreeNode();
    mTx30.label = "Store Sales";
    mTx30.level = 3;
    mTx30.axisCoordinate = 0;
    mTx20.children[0] = mTx30;

    var mTx31 = new this.TestTreeNode();
    mTx31.label = "Store Cost";
    mTx31.level = 3;
    mTx31.axisCoordinate = 1;
    mTx20.children[1] = mTx31;


    mTx22.children = new Array(2);     //  All Canada
    var mTx32 = new this.TestTreeNode();
    mTx32.label = "Store Sales";
    mTx32.level = 3;
    mTx32.axisCoordinate = 2;
    mTx22.children[0] = mTx32;

    var mTx33 = new this.TestTreeNode();
    mTx33.label = "Store Cost";
    mTx33.level = 3;
    mTx33.axisCoordinate = 3;
    mTx22.children[1] = mTx33;



   ///////////////////////////////////


    mTx23.children = new Array(2);     //  USA CA
    var mTx35 = new this.TestTreeNode();
    mTx35.label = "Store Sales";
    mTx35.level = 3;
    mTx35.axisCoordinate = 4;
    mTx23.children[0] = mTx35;

    var mTx36 = new this.TestTreeNode();
    mTx36.label = "Store Cost";
    mTx36.level = 3;
    mTx36.axisCoordinate = 5;
    mTx23.children[1] = mTx36;



    mTx24.children = new Array(2);     //  USA OR
    var mTx37 = new this.TestTreeNode();
    mTx37.label = "Store Sales";
    mTx37.level = 3;
    mTx37.axisCoordinate = 6;
    mTx24.children[0] = mTx37;

    var mTx38 = new this.TestTreeNode();
    mTx38.label = "Store Cost";
    mTx38.level = 3;
    mTx38.axisCoordinate = 7;
    mTx24.children[1] = mTx38;



    mTx25.children = new Array(2);
    var mTx41 = new this.TestTreeNode();        //  USA WA
    mTx41.label = "Store Sales";
    mTx41.level = 3;
    mTx41.axisCoordinate = 8;
    mTx25.children[0] = mTx41;

    var mTx42 = new this.TestTreeNode();
    mTx42.label = "Store Cost";
    mTx42.level = 3;
    mTx42.axisCoordinate = 9;
    mTx25.children[1] = mTx42;



    mTx26.children = new Array(2);     //  USA ALL
    var mTx43 = new this.TestTreeNode();
    mTx43.label = "Store Sales";
    mTx43.level = 3;
    mTx43.axisCoordinate = 10;
    mTx26.children[0] = mTx43;

    var mTx44 = new this.TestTreeNode();
    mTx44.label = "Store Cost";
    mTx44.level = 3;
    mTx44.axisCoordinate = 11;
    mTx26.children[1] = mTx44;


    mTx27.children = new Array(2);     //   ALL Countries   ALL States
    var mTx45 = new this.TestTreeNode();
    mTx45.label = "Store Sales";
    mTx45.level = 3;
    mTx45.axisCoordinate = 12;
    mTx27.children[0] = mTx45;

    var mTx46 = new this.TestTreeNode();
    mTx46.label = "Store Cost";
    mTx46.level = 3;
    mTx46.axisCoordinate = 13;
    mTx27.children[1] = mTx46;




   // row tree nodes
    var mTyArray = new Array(1);

    // row level 0
    var mTy0 = new this.TestTreeNode();
    mTy0.label = "All";
    mTy0.level = 0;
    mTy0.axisCoordinate = 0;
    mTy0.isAll = true;
    mTyArray[0] = mTy0;



    // set the axis tree nodes
    mTArray[0] = mTy0;      //  row
    mTArray[1] = mTx0;      //  column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;

  return res;
};




// most basic  OLAP crosstab:
//
//    COLUMN  DImension Customers
//                  Level  All
//                  Level  Customer Country
//            Dimension Product
//                  Level  All
//                  Level  Product Family
//                  Level  Product Department
//
//    ROW     Dimension Measures
//                  Level  Store Cost
//
//
HighChartUnitTests.prototype.obj20 = function () {

    ////////////////////////////////////////
    // data 1 rows 36 columns
    var data = new Array(1);

    var r0 = new Array(36);
    r0[0] = 8669.84;
    r0[1] = 8669.84;
    r0[2] = 6392.12;
    r0[3] = 2;
    r0[4] = 1;
    r0[5] = 2435;
    r0[6] = 14;
    r0[7] = 246;
    r0[8] = 165;
    r0[9] = 24325;
    r0[10] = 1436;
    r0[11] = 24;
    r0[12] = 123;
    r0[13] = 28;
    r0[14] = 11;
    r0[15] = 2465;
    r0[16] = 132;
    r0[17] = 233;
    r0[18] = 441;
    r0[19] = 255;
    r0[20] = 166;
    r0[21] = 277;
    r0[22] = 188;
    r0[23] = 299;
    r0[24] = 24344;
    r0[25] = 2544;
    r0[26] = 2655;
    r0[27] = 266;
    r0[28] = 156;
    r0[29] = 235;
    r0[30] = 16;
    r0[31] = 243;
    r0[32] = 15;
    r0[33] = 224;
    r0[34] = 2554;
    r0[35] = 2665;

    data[0] = r0;


    // measures array
  var mArray = [];
  mArray.push("Store Sales");



  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = [];

    var axa = new Object();
    axa.dimension = "Customer";
    axa.label = "(All)";
    mAx.push(axa);

    var ax0 = new Object();
    ax0.dimension = "Customer";
    ax0.label = "Customer Country";
    mAx.push(ax0);

    var ax1 = new Object();
    ax1.dimension = "Products";
    ax1.label = "Product Family";
    mAx.push(ax1);

    var ax2 = new Object();
    ax2.dimension = "Products";
    ax2.label = "Product Department";
    mAx.push(ax2);


    var mAy = [];

    var ay0 = new Object();
    ay0.dimension = "Measures"
    ay0.label = "Store Cost";
    mAy.push(ay0);


    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column


    // measures array
    var msArray = [];
    msArray.push("Store Sales");


    md.axes = mdArray;
    md.measureAxis = 0;
    md.measures = msArray;



    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);



    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;


    // column level 1    Countries
    mTx0.children = new Array(4);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Canada";
    mTx10.level = 1;
    mTx10.axisCoordinate = -1;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "Mexico";
    mTx11.level = 1;
    mTx11.axisCoordinate = -1;
    mTx0.children[1] = mTx11;

    var mTx12 = new this.TestTreeNode();
    mTx12.label = "USA";
    mTx12.level = 1;
    mTx12.axisCoordinate = -1;
    mTx0.children[2] = mTx12;

    var mTx13 = new this.TestTreeNode();
    mTx13.label = "ALL";
    mTx13.level = 1;
    mTx13.axisCoordinate = -1;
    mTx13.isAll = true;
    mTx0.children[3] = mTx13;


    // column level 2  Dimension Product    Level Product Family

    // Canada - Drink
    mTx10.children = new Array(4);
    var mTx20 = new this.TestTreeNode();
    mTx20.label = "Drink";
    mTx20.level = 2;
    mTx20.axisCoordinate = -1;
    mTx20.isAll = false;
    mTx10.children[0] = mTx20;

    // Canada - Food
    var mTx21 = new this.TestTreeNode();
    mTx21.label = "Food";
    mTx21.level = 2;
    mTx21.axisCoordinate = -1;
    mTx21.isAll = false;
    mTx10.children[1] = mTx21;

    // Canada - Non-Consumable
    var mTx22 = new this.TestTreeNode();
    mTx22.label = "Non-Consumable";
    mTx22.level = 2;
    mTx22.axisCoordinate = -1;
    mTx22.isAll = false;
    mTx10.children[2] = mTx22;

    // Canada - ALL Product Family
    var mTx23 = new this.TestTreeNode();
    mTx23.label = "ALL";
    mTx23.level = 2;
    mTx23.axisCoordinate = -1;
    mTx23.isAll = true;
    mTx10.children[3] = mTx23;


    // Mexico - Drink
    mTx11.children = new Array(4);
    var mTx24 = new this.TestTreeNode();
    mTx24.label = "Drink";
    mTx24.level = 2;
    mTx24.axisCoordinate = -1;
    mTx24.isAll = false;
    mTx11.children[0] = mTx24;

    // Mexico - Food
    var mTx25 = new this.TestTreeNode();
    mTx25.label = "Food";
    mTx25.level = 2;
    mTx25.axisCoordinate = -1;
    mTx25.isAll = false;
    mTx11.children[1] = mTx25;

    // Mexico - Non-Consumable
    var mTx26 = new this.TestTreeNode();
    mTx26.label = "Non-Consumable";
    mTx26.level = 2;
    mTx26.axisCoordinate = -1;
    mTx26.isAll = false;
    mTx11.children[2] = mTx26;

    // Mexico - ALL Product Family
    var mTx27 = new this.TestTreeNode();
    mTx27.label = "ALL";
    mTx27.level = 2;
    mTx27.axisCoordinate = -1;
    mTx27.isAll = true;
    mTx11.children[3] = mTx27;


    // USA - Drink
    mTx12.children = new Array(4);
    var mTx28 = new this.TestTreeNode();
    mTx28.label = "Drink";
    mTx28.level = 2;
    mTx28.axisCoordinate = -1;
    mTx28.isAll = false;
    mTx12.children[0] = mTx28;

    // USA - Food
    var mTx29 = new this.TestTreeNode();
    mTx29.label = "Food";
    mTx29.level = 2;
    mTx29.axisCoordinate = -1;
    mTx29.isAll = false;
    mTx12.children[1] = mTx29;

    // USA - Non-Consumable
    var mTx210 = new this.TestTreeNode();
    mTx210.label = "Non-Consumable";
    mTx210.level = 2;
    mTx210.axisCoordinate = -1;
    mTx210.isAll = false;
    mTx12.children[2] = mTx210;

    // USA - ALL Product Family
    var mTx211 = new this.TestTreeNode();
    mTx211.label = "ALL";
    mTx211.level = 2;
    mTx211.axisCoordinate = -1;
    mTx211.isAll = true;
    mTx12.children[3] = mTx211;

    // ALL - Drink
    mTx13.children = new Array(4);
    var mTx212 = new this.TestTreeNode();
    mTx212.label = "Drink";
    mTx212.level = 2;
    mTx212.axisCoordinate = -1;
    mTx212.isAll = false;
    mTx13.children[0] = mTx212;

    // ALL - Food
    var mTx213 = new this.TestTreeNode();
    mTx213.label = "Food";
    mTx213.level = 2;
    mTx213.axisCoordinate = -1;
    mTx213.isAll = false;
    mTx13.children[1] = mTx213;

    // ALL - Non-Consumable
    var mTx214 = new this.TestTreeNode();
    mTx214.label = "Non-Consumable";
    mTx214.level = 2;
    mTx214.axisCoordinate = -1;
    mTx214.isAll = false;
    mTx13.children[2] = mTx214;

    // ALL - ALL Product Family
    var mTx215 = new this.TestTreeNode();
    mTx215.label = "ALL";
    mTx215.level = 2;
    mTx215.axisCoordinate = -1;
    mTx215.isAll = true;
    mTx13.children[3] = mTx215;






    // leaf column level 3  Product Department

    // Canada  Drink
    mTx20.children = new Array(3);
    var mTx30 = new this.TestTreeNode();
    mTx30.label = "Alcoholic Beverages";
    mTx30.level = 3;
    mTx30.axisCoordinate = 11;
    mTx30.isAll = false;
    mTx20.children[0] = mTx30;

    var mTx31 = new this.TestTreeNode();
    mTx31.label = "Beverages";
    mTx31.level = 3;
    mTx31.axisCoordinate = 12;
    mTx31.isAll = false;
    mTx20.children[1] = mTx31;

    var mTx32 = new this.TestTreeNode();
    mTx32.label = "ALL";
    mTx32.level = 3;
    mTx32.axisCoordinate = 10;
    mTx32.isAll = true;
    mTx20.children[2] = mTx32;

    // Canada  Food
    mTx21.children = new Array(2);
    var mTx33 = new this.TestTreeNode();
    mTx33.label = "Baked Goods";
    mTx33.level = 3;
    mTx33.axisCoordinate = 14;
    mTx33.isAll = false;
    mTx21.children[0] = mTx33;

    var mTx34 = new this.TestTreeNode();
    mTx34.label = "ALL";
    mTx34.level = 3;
    mTx34.axisCoordinate = 13;
    mTx34.isAll = true;
    mTx21.children[1] = mTx34;

    // Canada  Non-Consumable
    mTx22.children = new Array(3);
    var mTx35 = new this.TestTreeNode();
    mTx35.label = "Carousel";
    mTx35.level = 3;
    mTx35.axisCoordinate = 16;
    mTx35.isAll = false;
    mTx22.children[0] = mTx35;

    var mTx36 = new this.TestTreeNode();
    mTx36.label = "Checkout";
    mTx36.level = 3;
    mTx36.axisCoordinate = 17;
    mTx36.isAll = false;
    mTx22.children[1] = mTx36;

    var mTx37 = new this.TestTreeNode();
    mTx37.label = "ALL";
    mTx37.level = 3;
    mTx37.axisCoordinate = 15;
    mTx37.isAll = true;
    mTx22.children[2] = mTx37;

    // Canada  ALL ALL
    mTx23.children = new Array(1);
    var mTx38 = new this.TestTreeNode();
    mTx38.label = "ALL";
    mTx38.level = 3;
    mTx38.axisCoordinate = 9;
    mTx38.isAll = true;
    mTx23.children[1] = mTx38;




    // Mexico  Drink
    mTx24.children = new Array(3);
    var mTx39 = new this.TestTreeNode();
    mTx39.label = "Alcoholic Beverages";
    mTx39.level = 3;
    mTx39.axisCoordinate = 20;
    mTx39.isAll = false;
    mTx24.children[0] = mTx39;

    var mTx310 = new this.TestTreeNode();
    mTx310.label = "Beverages";
    mTx310.level = 3;
    mTx310.axisCoordinate = 21;
    mTx310.isAll = false;
    mTx24.children[1] = mTx310;

    var mTx311 = new this.TestTreeNode();
    mTx311.label = "ALL";
    mTx311.level = 3;
    mTx311.axisCoordinate = 19;
    mTx311.isAll = true;
    mTx24.children[2] = mTx311;

    // Mexico  Food
    mTx25.children = new Array(2);
    var mTx312 = new this.TestTreeNode();
    mTx312.label = "Baked Goods";
    mTx312.level = 3;
    mTx312.axisCoordinate = 23;
    mTx312.isAll = false;
    mTx25.children[0] = mTx312;

    var mTx313 = new this.TestTreeNode();
    mTx313.label = "ALL";
    mTx313.level = 3;
    mTx313.axisCoordinate = 22;
    mTx313.isAll = true;
    mTx25.children[1] = mTx313;

    // Mexico  Non-Consumable
    mTx26.children = new Array(3);
    var mTx314 = new this.TestTreeNode();
    mTx314.label = "Carousel";
    mTx314.level = 3;
    mTx314.axisCoordinate = 25;
    mTx314.isAll = false;
    mTx26.children[0] = mTx314;

    var mTx315 = new this.TestTreeNode();
    mTx315.label = "Checkout";
    mTx315.level = 3;
    mTx315.axisCoordinate = 26;
    mTx315.isAll = false;
    mTx26.children[1] = mTx315;

    var mTx316 = new this.TestTreeNode();
    mTx316.label = "ALL";
    mTx316.level = 3;
    mTx316.axisCoordinate = 24;
    mTx316.isAll = true;
    mTx26.children[2] = mTx316;

    // Mexico  ALL ALL
    mTx27.children = new Array(1);
    var mTx317 = new this.TestTreeNode();
    mTx317.label = "ALL";
    mTx317.level = 3;
    mTx317.axisCoordinate = 18;
    mTx317.isAll = true;
    mTx27.children[1] = mTx317;




    // USA  Drink
    mTx28.children = new Array(3);
    var mTx318 = new this.TestTreeNode();
    mTx318.label = "Alcoholic Beverages";
    mTx318.level = 3;
    mTx318.axisCoordinate = 29;
    mTx318.isAll = false;
    mTx28.children[0] = mTx318;

    var mTx319 = new this.TestTreeNode();
    mTx319.label = "Beverages";
    mTx319.level = 3;
    mTx319.axisCoordinate = 30;
    mTx319.isAll = false;
    mTx28.children[1] = mTx319;

    var mTx320 = new this.TestTreeNode();
    mTx320.label = "ALL";
    mTx320.level = 3;
    mTx320.axisCoordinate = 28;
    mTx320.isAll = true;
    mTx28.children[2] = mTx320;


    // USA  Food
    mTx29.children = new Array(2);
    var mTx321 = new this.TestTreeNode();
    mTx321.label = "Baked Goods";
    mTx321.level = 3;
    mTx321.axisCoordinate = 32;
    mTx321.isAll = false;
    mTx29.children[0] = mTx321;

    var mTx322 = new this.TestTreeNode();
    mTx322.label = "ALL";
    mTx322.level = 3;
    mTx322.axisCoordinate = 31;
    mTx322.isAll = true;
    mTx29.children[1] = mTx322;

    // USA  Non-Consumable
    mTx210.children = new Array(3);
    var mTx323 = new this.TestTreeNode();
    mTx323.label = "Carousel";
    mTx323.level = 3;
    mTx323.axisCoordinate = 34;
    mTx323.isAll = false;
    mTx210.children[0] = mTx323;

    var mTx324 = new this.TestTreeNode();
    mTx324.label = "Checkout";
    mTx324.level = 3;
    mTx324.axisCoordinate = 35;
    mTx324.isAll = false;
    mTx210.children[1] = mTx324;

    var mTx325 = new this.TestTreeNode();
    mTx325.label = "ALL";
    mTx325.level = 3;
    mTx325.axisCoordinate = 33;
    mTx325.isAll = true;
    mTx210.children[2] = mTx325;


    // USA  ALL ALL
    mTx211.children = new Array(1);
    var mTx326 = new this.TestTreeNode();
    mTx326.label = "ALL";
    mTx326.level = 3;
    mTx326.axisCoordinate = 27;
    mTx326.isAll = true;
    mTx211.children[1] = mTx326;





    // ALL Countries  Drink
    mTx212.children = new Array(3);
    var mTx327 = new this.TestTreeNode();
    mTx327.label = "Alcoholic Beverages";
    mTx327.level = 3;
    mTx327.axisCoordinate = 2;
    mTx327.isAll = false;
    mTx212.children[0] = mTx327;

    var mTx328 = new this.TestTreeNode();
    mTx328.label = "Beverages";
    mTx328.level = 3;
    mTx328.axisCoordinate = 3;
    mTx328.isAll = false;
    mTx212.children[1] = mTx328;

    var mTx329 = new this.TestTreeNode();
    mTx329.label = "ALL";
    mTx329.level = 3;
    mTx329.axisCoordinate = 1;
    mTx329.isAll = true;
    mTx212.children[2] = mTx329;


    // ALL Countries  Food
    mTx213.children = new Array(2);
    var mTx330 = new this.TestTreeNode();
    mTx330.label = "Baked Goods";
    mTx330.level = 3;
    mTx330.axisCoordinate = 5;
    mTx330.isAll = false;
    mTx213.children[0] = mTx330;

    var mTx331 = new this.TestTreeNode();
    mTx331.label = "ALL";
    mTx331.level = 3;
    mTx331.axisCoordinate = 4;
    mTx331.isAll = true;
    mTx213.children[1] = mTx331;

    // ALL Countries  Non-Consumable
    mTx214.children = new Array(3);
    var mTx332 = new this.TestTreeNode();
    mTx332.label = "Carousel";
    mTx332.level = 3;
    mTx332.axisCoordinate = 7;
    mTx332.isAll = false;
    mTx214.children[0] = mTx332;

    var mTx333 = new this.TestTreeNode();
    mTx333.label = "Checkout";
    mTx333.level = 3;
    mTx333.axisCoordinate = 8;
    mTx333.isAll = false;
    mTx214.children[1] = mTx333;

    var mTx334 = new this.TestTreeNode();
    mTx334.label = "ALL";
    mTx334.level = 3;
    mTx334.axisCoordinate = 6;
    mTx334.isAll = true;
    mTx214.children[2] = mTx334;

    // ALL Countries  ALL ALL
    mTx215.children = new Array(1);
    var mTx335 = new this.TestTreeNode();
    mTx335.label = "ALL";
    mTx335.level = 3;
    mTx335.axisCoordinate = 0;
    mTx335.isAll = true;
    mTx215.children[1] = mTx335;



   // row tree nodes
    var mTyArray = new Array(1);

    // row level 0
    var mTy0 = new this.TestTreeNode();
    mTy0.label = "Store Cost";
    mTy0.level = 0;
    mTy0.axisCoordinate = 0;
    mTy0.isAll = false;
    mTyArray[0] = mTy0;



    // set the axis tree nodes
    mTArray[0] = mTy0;      //  row
    mTArray[1] = mTx0;      //  column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;
  res.metadata.isOLAP = true;

  return res;
};



/*

//
//  THIS TEST SEEMS TO OVERFLOW MY MACHINE
//
//   OLAP crosstab:
//
//    COLUMN  DImension Customers
//                  Level  All
//                  Level  Customer Country
//                  Level  Customer State
//            Dimension Product
//                  Level  Product Family      (no ALL level for Product)
//            Dimension Measures
//                  Store Cost
//                  Store Sales
//
//
HighChartUnitTests.prototype.obj21 = function () {

    ////////////////////////////////////////
    // data 1 rows 42 columns
    var data = new Array(1);

    var r0 = new Array(36);
    r0[0] = 8669.84;
    r0[1] = 8669.84;
    r0[2] = 6392.12;
    r0[3] = 2;
    r0[4] = 1;
    r0[5] = 2435;
    r0[6] = 14;
    r0[7] = 246;
    r0[8] = 165;
    r0[9] = 24325;
    r0[10] = 1436;
    r0[11] = 24;
    r0[12] = 123;
    r0[13] = 28;
    r0[14] = 11;
    r0[15] = 2465;
    r0[16] = 132;
    r0[17] = 233;
    r0[18] = 441;
    r0[19] = 255;
    r0[20] = 166;
    r0[21] = 277;
    r0[22] = 188;
    r0[23] = 299;
    r0[24] = 24344;
    r0[25] = 2544;
    r0[26] = 2655;
    r0[27] = 266;
    r0[28] = 156;
    r0[29] = 235;
    r0[30] = 16;
    r0[31] = 243;
    r0[32] = 15;
    r0[33] = 224;
    r0[34] = 2554;
    r0[35] = 2665;
    r0[36] = 2655;
    r0[37] = 266;
    r0[38] = 156;
    r0[39] = 235;
    r0[40] = 16;
    r0[41] = 243;
    data[0] = r0;


    // measures array
  var mArray = [];
  mArray.push("Store Sales");



  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = [];

    var ax0 = new Object();
    ax0.dimension = "Customer";
    ax0.label = "Customer Country";
    mAx.push(ax0);

    var ax1 = new Object();
    ax1.dimension = "Customer";
    ax1.label = "Customer State";
    mAx.push(ax1);

    var ax2 = new Object();
    ax2.dimension = "Products";
    ax2.label = "Product Family";
    mAx.push(ax2);

    var ax3 = new Object();
    ax3.dimension = "Measures";
    ax3.label = "Measures";
    mAx.push(ax3);



    var mAy = [];



    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column


    // measures array
    var msArray = [];
    msArray.push("Store Cost");
    msArray.push("Store Sales");


    md.axes = mdArray;
    md.measureAxis = 0;
    md.measures = msArray;



    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);



    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;


    // column level 1    Countries
    mTx0.children = new Array(4);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Canada";
    mTx10.level = 1;
    mTx10.axisCoordinate = -1;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "Mexico";
    mTx11.level = 1;
    mTx11.axisCoordinate = -1;
    mTx0.children[1] = mTx11;

    var mTx12 = new this.TestTreeNode();
    mTx12.label = "USA";
    mTx12.level = 1;
    mTx12.axisCoordinate = -1;
    mTx0.children[2] = mTx12;

    var mTx13 = new this.TestTreeNode();
    mTx13.label = "ALL";
    mTx13.level = 1;
    mTx13.axisCoordinate = -1;
    mTx13.isAll = true;
    mTx0.children[3] = mTx13;


    // column level 2  Dimension Customer    Level Customer State

    // Canada - ALL
    mTx10.children = new Array(2);
    var mTx20 = new this.TestTreeNode();
    mTx20.label = "ALL";
    mTx20.level = 2;
    mTx20.axisCoordinate = -1;
    mTx20.isAll = true;
    mTx10.children[0] = mTx20;

    // Canada - BC
    var mTx21 = new this.TestTreeNode();
    mTx21.label = "BC";
    mTx21.level = 2;
    mTx21.axisCoordinate = -1;
    mTx21.isAll = false;
    mTx10.children[1] = mTx21;




    // Mexico - ALL
    mTx11.children = new Array(2);
    var mTx24 = new this.TestTreeNode();
    mTx24.label = "ALL";
    mTx24.level = 2;
    mTx24.axisCoordinate = -1;
    mTx24.isAll = true;
    mTx11.children[0] = mTx24;

    // Mexico - DF
    var mTx25 = new this.TestTreeNode();
    mTx25.label = "DF";
    mTx25.level = 2;
    mTx25.axisCoordinate = -1;
    mTx25.isAll = false;
    mTx11.children[1] = mTx25;



    // USA - ALL
    mTx12.children = new Array(2);
    var mTx28 = new this.TestTreeNode();
    mTx28.label = "ALL";
    mTx28.level = 2;
    mTx28.axisCoordinate = -1;
    mTx28.isAll = true;
    mTx12.children[0] = mTx28;

    // USA - CA
    var mTx29 = new this.TestTreeNode();
    mTx29.label = "CA";
    mTx29.level = 2;
    mTx29.axisCoordinate = -1;
    mTx29.isAll = false;
    mTx12.children[1] = mTx29;




    // ALL - ALL
    mTx13.children = new Array(1);
    var mTx212 = new this.TestTreeNode();
    mTx212.label = "ALL";
    mTx212.level = 2;
    mTx212.axisCoordinate = -1;
    mTx212.isAll = true;
    mTx13.children[0] = mTx212;






    // leaf column level 3  Product Family  (no all level for Product Family)

    // Canada  ALL
    mTx20.children = new Array(3);
    var mTx30 = new this.TestTreeNode();
    mTx30.label = "Drink";
    mTx30.level = 3;
    mTx30.axisCoordinate = 11;
    mTx30.isAll = false;
    mTx20.children[0] = mTx30;

    var mTx31 = new this.TestTreeNode();
    mTx31.label = "Food";
    mTx31.level = 3;
    mTx31.axisCoordinate = 12;
    mTx31.isAll = false;
    mTx20.children[1] = mTx31;

    var mTx32 = new this.TestTreeNode();
    mTx32.label = "Non-Consumable";
    mTx32.level = 3;
    mTx32.axisCoordinate = 10;
    mTx32.isAll = false;
    mTx20.children[2] = mTx32;


    // Canada  BC
    mTx21.children = new Array(3);
    var mTx33 = new this.TestTreeNode();
    mTx33.label = "Drink";
    mTx33.level = 3;
    mTx33.axisCoordinate = 14;
    mTx33.isAll = false;
    mTx21.children[0] = mTx33;

    var mTx34 = new this.TestTreeNode();
    mTx34.label = "Food";
    mTx34.level = 3;
    mTx34.axisCoordinate = 13;
    mTx34.isAll = false;
    mTx21.children[1] = mTx34;

    var mTx35 = new this.TestTreeNode();
    mTx35.label = "Non-Consumable";
    mTx35.level = 3;
    mTx35.axisCoordinate = 16;
    mTx35.isAll = false;
    mTx21.children[2] = mTx35;


    // Mexico ALL
    mTx24.children = new Array(3);
    var mTx36 = new this.TestTreeNode();
    mTx36.label = "Drink";
    mTx36.level = 3;
    mTx36.axisCoordinate = 17;
    mTx36.isAll = false;
    mTx24.children[0] = mTx36;

    var mTx37 = new this.TestTreeNode();
    mTx37.label = "Food";
    mTx37.level = 3;
    mTx37.axisCoordinate = 15;
    mTx37.isAll = false;
    mTx24.children[1] = mTx37;

    var mTx38 = new this.TestTreeNode();
    mTx38.label = "Non-Consumable";
    mTx38.level = 3;
    mTx38.axisCoordinate = 9;
    mTx38.isAll = false;
    mTx24.children[2] = mTx38;



    // Mexico  DF
    mTx25.children = new Array(3);
    var mTx39 = new this.TestTreeNode();
    mTx39.label = "Drink";
    mTx39.level = 3;
    mTx39.axisCoordinate = 20;
    mTx39.isAll = false;
    mTx25.children[0] = mTx39;

    var mTx310 = new this.TestTreeNode();
    mTx310.label = "Food";
    mTx310.level = 3;
    mTx310.axisCoordinate = 21;
    mTx310.isAll = false;
    mTx25.children[1] = mTx310;

    var mTx311 = new this.TestTreeNode();
    mTx311.label = "Non-Consumable";
    mTx311.level = 3;
    mTx311.axisCoordinate = 19;
    mTx311.isAll = false;
    mTx25.children[2] = mTx311;



    // USA ALL
    mTx28.children = new Array(2);
    var mTx312 = new this.TestTreeNode();
    mTx312.label = "Drink";
    mTx312.level = 3;
    mTx312.axisCoordinate = 23;
    mTx312.isAll = false;
    mTx28.children[0] = mTx312;

    var mTx313 = new this.TestTreeNode();
    mTx313.label = "Food";
    mTx313.level = 3;
    mTx313.axisCoordinate = 22;
    mTx313.isAll = false;
    mTx28.children[1] = mTx313;

    var mTx314 = new this.TestTreeNode();
    mTx314.label = "Non-Consumable";
    mTx314.level = 3;
    mTx314.axisCoordinate = 25;
    mTx314.isAll = false;
    mTx28.children[2] = mTx314;



    //  USA   CA
    mTx29.children = new Array(3);
    var mTx315 = new this.TestTreeNode();
    mTx315.label = "Drink";
    mTx315.level = 3;
    mTx315.axisCoordinate = 26;
    mTx315.isAll = false;
    mTx29.children[0] = mTx315;

    var mTx316 = new this.TestTreeNode();
    mTx316.label = "Food";
    mTx316.level = 3;
    mTx316.axisCoordinate = 24;
    mTx316.isAll = false;
    mTx29.children[1] = mTx316;

    var mTx317 = new this.TestTreeNode();
    mTx317.label = "Non-Consumable";
    mTx317.level = 3;
    mTx317.axisCoordinate = 18;
    mTx317.isAll = false;
    mTx29.children[2] = mTx317;


    // ALL ALL
    mTx212.children = new Array(3);
    var mTx318 = new this.TestTreeNode();
    mTx318.label = "Drink";
    mTx318.level = 3;
    mTx318.axisCoordinate = 29;
    mTx318.isAll = false;
    mTx212.children[0] = mTx318;

    var mTx319 = new this.TestTreeNode();
    mTx319.label = "Food";
    mTx319.level = 3;
    mTx319.axisCoordinate = 30;
    mTx319.isAll = false;
    mTx212.children[1] = mTx319;

    var mTx320 = new this.TestTreeNode();
    mTx320.label = "Non-Consumable";
    mTx320.level = 3;
    mTx320.axisCoordinate = 28;
    mTx320.isAll = true;
    mTx212.children[2] = mTx320;





    // level 4   measures

    // Canada  ALL  Drink
    mTx30.children = new Array(2);
    var mTx40 = new this.TestTreeNode();
    mTx40.label = "Store Cost";
    mTx40.level = 4;
    mTx40.axisCoordinate = 6;
    mTx40.isAll = false;
    mTx30.children[0] = mTx30;

    var mTx41 = new this.TestTreeNode();
    mTx41.label = "Store Sales";
    mTx41.level = 4;
    mTx41.axisCoordinate = 7;
    mTx41.isAll = false;
    mTx30.children[1] = mTx41;


    // Canada  ALL  Food
    mTx31.children = new Array(2);
    var mTx42 = new this.TestTreeNode();
    mTx42.label = "Store Cost";
    mTx42.level = 4;
    mTx42.axisCoordinate = 8;
    mTx42.isAll = false;
    mTx31.children[0] = mTx42;

    var mTx43 = new this.TestTreeNode();
    mTx43.label = "Store Sales";
    mTx43.level = 4;
    mTx43.axisCoordinate = 9;
    mTx43.isAll = false;
    mTx31.children[1] = mTx43;


    // Canada  ALL  Non
    mTx32.children = new Array(2);
    var mTx44 = new this.TestTreeNode();
    mTx44.label = "Store Cost";
    mTx44.level = 4;
    mTx44.axisCoordinate = 10;
    mTx44.isAll = false;
    mTx32.children[0] = mTx44;

    var mTx45 = new this.TestTreeNode();
    mTx45.label = "Store Sales";
    mTx45.level = 4;
    mTx45.axisCoordinate = 11;
    mTx45.isAll = false;
    mTx32.children[1] = mTx45;



    // Canada  BC  Drink
    mTx33.children = new Array(2);
    var mTx46 = new this.TestTreeNode();
    mTx46.label = "Store Cost";
    mTx46.level = 4;
    mTx46.axisCoordinate = 12;
    mTx46.isAll = false;
    mTx33.children[0] = mTx46;

    var mTx47 = new this.TestTreeNode();
    mTx47.label = "Store Sales";
    mTx47.level = 4;
    mTx47.axisCoordinate = 13;
    mTx47.isAll = false;
    mTx33.children[1] = mTx47;


    // Canada  BC  Food
    mTx34.children = new Array(2);
    var mTx48 = new this.TestTreeNode();
    mTx48.label = "Store Cost";
    mTx48.level = 4;
    mTx48.axisCoordinate = 14;
    mTx48.isAll = false;
    mTx34.children[0] = mTx48;

    var mTx49 = new this.TestTreeNode();
    mTx49.label = "Store Sales";
    mTx49.level = 4;
    mTx49.axisCoordinate = 15;
    mTx49.isAll = false;
    mTx34.children[1] = mTx49;


    // Canada  BC  Non
    mTx35.children = new Array(2);
    var mTx410 = new this.TestTreeNode();
    mTx410.label = "Store Cost";
    mTx410.level = 4;
    mTx410.axisCoordinate = 16;
    mTx410.isAll = false;
    mTx35.children[0] = mTx410;

    var mTx411 = new this.TestTreeNode();
    mTx411.label = "Store Sales";
    mTx411.level = 4;
    mTx411.axisCoordinate = 17;
    mTx411.isAll = false;
    mTx35.children[1] = mTx411;


    // Mexico  ALL  Drink
    mTx36.children = new Array(2);
    var mTx412 = new this.TestTreeNode();
    mTx412.label = "Store Cost";
    mTx412.level = 4;
    mTx412.axisCoordinate = 18;
    mTx412.isAll = false;
    mTx36.children[0] = mTx412;

    var mTx413 = new this.TestTreeNode();
    mTx413.label = "Store Sales";
    mTx413.level = 4;
    mTx413.axisCoordinate = 19;
    mTx413.isAll = false;
    mTx36.children[1] = mTx413;


    // Mexido ALL Food
    mTx37.children = new Array(2);
    var mTx414 = new this.TestTreeNode();
    mTx414.label = "Store Cost";
    mTx414.level = 4;
    mTx414.axisCoordinate = 20;
    mTx414.isAll = false;
    mTx37.children[0] = mTx414;

    var mTx415 = new this.TestTreeNode();
    mTx415.label = "Store Sales";
    mTx415.level = 4;
    mTx415.axisCoordinate = 21;
    mTx415.isAll = false;
    mTx37.children[1] = mTx415;


    //  Mexico ALL  Non
    mTx38.children = new Array(2);
    var mTx416 = new this.TestTreeNode();
    mTx416.label = "Store Cost";
    mTx416.level = 4;
    mTx416.axisCoordinate = 22;
    mTx416.isAll = false;
    mTx38.children[0] = mTx416;

    var mTx417 = new this.TestTreeNode();
    mTx417.label = "Store Sales";
    mTx417.level = 4;
    mTx417.axisCoordinate = 23;
    mTx417.isAll = false;
    mTx38.children[1] = mTx417;



    // Mexico DF  Drink
    mTx39.children = new Array(2);
    var mTx418 = new this.TestTreeNode();
    mTx418.label = "Store Cost";
    mTx418.level = 4;
    mTx418.axisCoordinate = 24;
    mTx418.isAll = false;
    mTx39.children[0] = mTx418;

    var mTx419 = new this.TestTreeNode();
    mTx419.label = "Store Sales";
    mTx419.level = 4;
    mTx419.axisCoordinate = 25;
    mTx419.isAll = false;
    mTx39.children[1] = mTx419;


    // Mexico DF Food
    mTx310.children = new Array(2);
    var mTx420 = new this.TestTreeNode();
    mTx420.label = "Store Cost";
    mTx420.level = 4;
    mTx420.axisCoordinate = 26;
    mTx420.isAll = false;
    mTx310.children[0] = mTx420;


    var mTx421 = new this.TestTreeNode();
    mTx421.label = "Store Sales";
    mTx421.level = 4;
    mTx421.axisCoordinate = 27;
    mTx421.isAll = false;
    mTx310.children[1] = mTx421;


    // Mexico DF Non

    mTx311.children = new Array(2);
    var mTx422 = new this.TestTreeNode();
    mTx422.label = "Store Cost";
    mTx422.level = 4;
    mTx422.axisCoordinate = 28;
    mTx422.isAll = false;
    mTx311.children[0] = mTx422;

    var mTx423 = new this.TestTreeNode();
    mTx423.label = "Store Sales";
    mTx423.level = 4;
    mTx423.axisCoordinate = 29;
    mTx423.isAll = false;
    mTx311.children[1] = mTx423;



    // USA ALL Drink
    mTx312.children = new Array(2);
    var mTx424 = new this.TestTreeNode();
    mTx424.label = "Store Cost";
    mTx424.level = 4;
    mTx424.axisCoordinate = 30;
    mTx424.isAll = false;
    mTx312.children[0] = mTx424;

    var mTx425 = new this.TestTreeNode();
    mTx425.label = "Store Sales";
    mTx425.level = 4;
    mTx425.axisCoordinate = 31;
    mTx425.isAll = false;
    mTx312.children[1] = mTx425;


   // USA ALL Food
    mTx313.children = new Array(2);
    var mTx426 = new this.TestTreeNode();
    mTx426.label = "Store Cost";
    mTx426.level = 4;
    mTx426.axisCoordinate = 32;
    mTx426.isAll = false;
    mTx313.children[0] = mTx426;

    var mTx427 = new this.TestTreeNode();
    mTx427.label = "Store Sales";
    mTx427.level = 4;
    mTx427.axisCoordinate = 33;
    mTx427.isAll = false;
    mTx313.children[1] = mTx427;


    // USA ALL  non
    mTx314.children = new Array(2);
    var mTx428 = new this.TestTreeNode();
    mTx428.label = "Store Cost";
    mTx428.level = 4;
    mTx428.axisCoordinate = 34;
    mTx428.isAll = false;
    mTx314.children[0] = mTx428;

    var mTx429 = new this.TestTreeNode();
    mTx429.label = "Store Sales";
    mTx429.level = 4;
    mTx429.axisCoordinate = 35;
    mTx429.isAll = false;
    mTx314.children[1] = mTx429;


    // USA CA  Drink
    mTx315.children = new Array(2);
    var mTx430 = new this.TestTreeNode();
    mTx430.label = "Store Cost";
    mTx430.level = 4;
    mTx430.axisCoordinate = 36;
    mTx430.isAll = false;
    mTx315.children[0] = mTx430;

    var mTx431 = new this.TestTreeNode();
    mTx431.label = "Store Sales";
    mTx431.level = 4;
    mTx431.axisCoordinate = 37;
    mTx431.isAll = false;
    mTx315.children[1] = mTx431;


        // USA CA  Food
    mTx316.children = new Array(2);
    var mTx432 = new this.TestTreeNode();
    mTx432.label = "Store Cost";
    mTx432.level = 4;
    mTx432.axisCoordinate = 38;
    mTx432.isAll = false;
    mTx316.children[0] = mTx432;

    var mTx433 = new this.TestTreeNode();
    mTx433.label = "Store Sales";
    mTx433.level = 4;
    mTx433.axisCoordinate = 39;
    mTx433.isAll = false;
    mTx316.children[1] = mTx433;


        // USA CA  NON
    mTx317.children = new Array(2);
    var mTx434 = new this.TestTreeNode();
    mTx434.label = "Store Cost";
    mTx434.level = 4;
    mTx434.axisCoordinate = 40;
    mTx434.isAll = false;
    mTx317.children[0] = mTx434;

    var mTx435 = new this.TestTreeNode();
    mTx435.label = "Store Sales";
    mTx435.level = 4;
    mTx435.axisCoordinate = 41;
    mTx435.isAll = false;
    mTx317.children[1] = mTx435;



    // ALL ALL  Drink
    mTx318.children = new Array(2);
    var mTx436 = new this.TestTreeNode();
    mTx436.label = "Store Cost";
    mTx436.level = 4;
    mTx436.axisCoordinate = 0;
    mTx436.isAll = false;
    mTx318.children[0] = mTx436;

    var mTx437 = new this.TestTreeNode();
    mTx437.label = "Store Sales";
    mTx437.level = 4;
    mTx437.axisCoordinate = 1;
    mTx437.isAll = false;
    mTx318.children[1] = mTx437;


    // ALL ALL  Food
    mTx319.children = new Array(2);
    var mTx438 = new this.TestTreeNode();
    mTx438.label = "Store Cost";
    mTx438.level = 4;
    mTx438.axisCoordinate = 2;
    mTx438.isAll = false;
    mTx319.children[0] = mTx438;

    var mTx439 = new this.TestTreeNode();
    mTx439.label = "Store Sales";
    mTx439.level = 4;
    mTx439.axisCoordinate = 3;
    mTx439.isAll = false;
    mTx319.children[1] = mTx439;


    //  ALL ALL non
    mTx320.children = new Array(2);
    var mTx440 = new this.TestTreeNode();
    mTx440.label = "Store Cost";
    mTx440.level = 4;
    mTx440.axisCoordinate = 4;
    mTx440.isAll = false;
    mTx320.children[0] = mTx440;

    var mTx441 = new this.TestTreeNode();
    mTx441.label = "Store Sales";
    mTx441.level = 4;
    mTx441.axisCoordinate = 5;
    mTx441.isAll = false;
    mTx320.children[1] = mTx441;




   // row tree nodes
    var mTyArray = new Array(1);

    // row level 0
    var mTy0 = new this.TestTreeNode();
    mTy0.label = "empty row";
    mTy0.level = 0;
    mTy0.axisCoordinate = 0;
    mTy0.isAll = false;
    mTyArray[0] = mTy0;



    // set the axis tree nodes
    mTArray[0] = mTy0;      //  row
    mTArray[1] = mTx0;      //  column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;
  res.metadata.isOLAP = true;

  return res;
};

 */


// most basic  OLAP crosstab:
//
//  this is Obj20  with  measures added for Dimension
//
//    COLUMN  DImension Customers
//                  Level  All
//                  Level  Customer Country
//            Dimension Product
//                  Level  All
//                  Level  Product Family
//                  Level  Product Department
//            Dimension Measures
//                  Level  Store Cost
//
//
HighChartUnitTests.prototype.obj22 = function () {

    ////////////////////////////////////////
    // data 1 rows 36 columns
    var data = new Array(1);

    var r0 = new Array(36);
    r0[0] = 8669.84;
    r0[1] = 8669.84;
    r0[2] = 6392.12;
    r0[3] = 2;
    r0[4] = 1;
    r0[5] = 2435;
    r0[6] = 14;
    r0[7] = 246;
    r0[8] = 165;
    r0[9] = 24325;
    r0[10] = 1436;
    r0[11] = 24;
    r0[12] = 123;
    r0[13] = 28;
    r0[14] = 11;
    r0[15] = 2465;
    r0[16] = 132;
    r0[17] = 233;
    r0[18] = 441;
    r0[19] = 255;
    r0[20] = 166;
    r0[21] = 277;
    r0[22] = 188;
    r0[23] = 299;
    r0[24] = 24344;
    r0[25] = 2544;
    r0[26] = 2655;
    r0[27] = 266;
    r0[28] = 156;
    r0[29] = 235;
    r0[30] = 16;
    r0[31] = 243;
    r0[32] = 15;
    r0[33] = 224;
    r0[34] = 2554;
    r0[35] = 2665;

    data[0] = r0;


    // measures array
  var mArray = [];
  mArray.push("Store Sales");



  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = [];


    var axa = new Object();
    axa.dimension = "Customer";
    axa.label = "(All)";
    mAx.push(axa);

    var ax0 = new Object();
    ax0.dimension = "Customer";
    ax0.label = "Customer Country";
    mAx.push(ax0);

    var ax4 = new Object();
    ax4.dimension = "Products";
    ax4.label = "(All)";
    mAx.push(ax4);


    var ax1 = new Object();
    ax1.dimension = "Products";
    ax1.label = "Product Family";
    mAx.push(ax1);

    var ax2 = new Object();
    ax2.dimension = "Products";
    ax2.label = "Product Department";
    mAx.push(ax2);

    var ax3 = new Object();
    ax3.dimension = "Measures";
    ax3.label =  "Measures";
    mAx.push(ax3);



    var mAy = [];


    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column


    // measures array
    var msArray = [];
    msArray.push("Store Sales");


    md.axes = mdArray;
    md.measureAxis = 1;
    md.measures = msArray;



    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);



    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;


    // column level 1    Countries
    mTx0.children = new Array(4);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Canada";
    mTx10.level = 1;
    mTx10.axisCoordinate = -1;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "Mexico";
    mTx11.level = 1;
    mTx11.axisCoordinate = -1;
    mTx0.children[1] = mTx11;

    var mTx12 = new this.TestTreeNode();
    mTx12.label = "USA";
    mTx12.level = 1;
    mTx12.axisCoordinate = -1;
    mTx0.children[2] = mTx12;

    var mTx13 = new this.TestTreeNode();
    mTx13.label = "ALL";
    mTx13.level = 1;
    mTx13.axisCoordinate = -1;
    mTx13.isAll = true;
    mTx0.children[3] = mTx13;


    // column level 2  Dimension Product    Level Product Family

    // Canada - Drink
    mTx10.children = new Array(4);
    var mTx20 = new this.TestTreeNode();
    mTx20.label = "Drink";
    mTx20.level = 2;
    mTx20.axisCoordinate = -1;
    mTx20.isAll = false;
    mTx10.children[0] = mTx20;

    // Canada - Food
    var mTx21 = new this.TestTreeNode();
    mTx21.label = "Food";
    mTx21.level = 2;
    mTx21.axisCoordinate = -1;
    mTx21.isAll = false;
    mTx10.children[1] = mTx21;

    // Canada - Non-Consumable
    var mTx22 = new this.TestTreeNode();
    mTx22.label = "Non-Consumable";
    mTx22.level = 2;
    mTx22.axisCoordinate = -1;
    mTx22.isAll = false;
    mTx10.children[2] = mTx22;

    // Canada - ALL Product Family
    var mTx23 = new this.TestTreeNode();
    mTx23.label = "ALL";
    mTx23.level = 2;
    mTx23.axisCoordinate = -1;
    mTx23.isAll = true;
    mTx10.children[3] = mTx23;


    // Mexico - Drink
    mTx11.children = new Array(4);
    var mTx24 = new this.TestTreeNode();
    mTx24.label = "Drink";
    mTx24.level = 2;
    mTx24.axisCoordinate = -1;
    mTx24.isAll = false;
    mTx11.children[0] = mTx24;

    // Mexico - Food
    var mTx25 = new this.TestTreeNode();
    mTx25.label = "Food";
    mTx25.level = 2;
    mTx25.axisCoordinate = -1;
    mTx25.isAll = false;
    mTx11.children[1] = mTx25;

    // Mexico - Non-Consumable
    var mTx26 = new this.TestTreeNode();
    mTx26.label = "Non-Consumable";
    mTx26.level = 2;
    mTx26.axisCoordinate = -1;
    mTx26.isAll = false;
    mTx11.children[2] = mTx26;

    // Mexico - ALL Product Family
    var mTx27 = new this.TestTreeNode();
    mTx27.label = "ALL";
    mTx27.level = 2;
    mTx27.axisCoordinate = -1;
    mTx27.isAll = true;
    mTx11.children[3] = mTx27;


    // USA - Drink
    mTx12.children = new Array(4);
    var mTx28 = new this.TestTreeNode();
    mTx28.label = "Drink";
    mTx28.level = 2;
    mTx28.axisCoordinate = -1;
    mTx28.isAll = false;
    mTx12.children[0] = mTx28;

    // USA - Food
    var mTx29 = new this.TestTreeNode();
    mTx29.label = "Food";
    mTx29.level = 2;
    mTx29.axisCoordinate = -1;
    mTx29.isAll = false;
    mTx12.children[1] = mTx29;

    // USA - Non-Consumable
    var mTx210 = new this.TestTreeNode();
    mTx210.label = "Non-Consumable";
    mTx210.level = 2;
    mTx210.axisCoordinate = -1;
    mTx210.isAll = false;
    mTx12.children[2] = mTx210;

    // USA - ALL Product Family
    var mTx211 = new this.TestTreeNode();
    mTx211.label = "ALL";
    mTx211.level = 2;
    mTx211.axisCoordinate = -1;
    mTx211.isAll = true;
    mTx12.children[3] = mTx211;

    // ALL - Drink
    mTx13.children = new Array(4);
    var mTx212 = new this.TestTreeNode();
    mTx212.label = "Drink";
    mTx212.level = 2;
    mTx212.axisCoordinate = -1;
    mTx212.isAll = false;
    mTx13.children[0] = mTx212;

    // ALL - Food
    var mTx213 = new this.TestTreeNode();
    mTx213.label = "Food";
    mTx213.level = 2;
    mTx213.axisCoordinate = -1;
    mTx213.isAll = false;
    mTx13.children[1] = mTx213;

    // ALL - Non-Consumable
    var mTx214 = new this.TestTreeNode();
    mTx214.label = "Non-Consumable";
    mTx214.level = 2;
    mTx214.axisCoordinate = -1;
    mTx214.isAll = false;
    mTx13.children[2] = mTx214;

    // ALL - ALL Product Family
    var mTx215 = new this.TestTreeNode();
    mTx215.label = "ALL";
    mTx215.level = 2;
    mTx215.axisCoordinate = -1;
    mTx215.isAll = true;
    mTx13.children[3] = mTx215;






    // leaf column level 3  Product Department

    // Canada  Drink
    mTx20.children = new Array(3);
    var mTx30 = new this.TestTreeNode();
    mTx30.label = "Alcoholic Beverages";
    mTx30.level = 3;
    mTx30.axisCoordinate = -1;
    mTx30.isAll = false;
    mTx20.children[0] = mTx30;

    mTx30.children = new Array();
    var mTx30m = new this.TestTreeNode();
    mTx30m.label = "Store Sales";
    mTx30m.level = 4;
    mTx30m.axisCoordinate = 11;
    mTx30m.isAll = false;
    mTx30.children[0] = mTx30m;



    var mTx31 = new this.TestTreeNode();
    mTx31.label = "Beverages";
    mTx31.level = 3;
    mTx31.axisCoordinate = 12;
    mTx31.isAll = false;
    mTx20.children[1] = mTx31;

    mTx31.children = new Array();
    var mTx31m = new this.TestTreeNode();
    mTx31m.label = "Store Sales";
    mTx31m.level = 4;
    mTx31m.axisCoordinate = 12;
    mTx31m.isAll = false;
    mTx31.children[0] = mTx31m;




    var mTx32 = new this.TestTreeNode();
    mTx32.label = "ALL";
    mTx32.level = 3;
    mTx32.axisCoordinate = 10;
    mTx32.isAll = true;
    mTx20.children[2] = mTx32;

    mTx32.children = new Array();
    var mTx32m = new this.TestTreeNode();
    mTx32m.label = "Store Sales";
    mTx32m.level = 4;
    mTx32m.axisCoordinate = 10;
    mTx32m.isAll = false;
    mTx32.children[0] = mTx32m;




    // Canada  Food
    mTx21.children = new Array(2);
    var mTx33 = new this.TestTreeNode();
    mTx33.label = "Baked Goods";
    mTx33.level = 3;
    mTx33.axisCoordinate = 14;
    mTx33.isAll = false;
    mTx21.children[0] = mTx33;

    mTx33.children = new Array();
    var mTx33m = new this.TestTreeNode();
    mTx33m.label = "Store Sales";
    mTx33m.level = 4;
    mTx33m.axisCoordinate = 14;
    mTx33m.isAll = false;
    mTx33.children[0] = mTx33m;



    var mTx34 = new this.TestTreeNode();
    mTx34.label = "ALL";
    mTx34.level = 3;
    mTx34.axisCoordinate = 13;
    mTx34.isAll = true;
    mTx21.children[1] = mTx34;

    mTx34.children = new Array();
    var mTx34m = new this.TestTreeNode();
    mTx34m.label = "Store Sales";
    mTx34m.level = 4;
    mTx34m.axisCoordinate = 13;
    mTx34m.isAll = false;
    mTx34.children[0] = mTx34m;



    // Canada  Non-Consumable
    mTx22.children = new Array(3);
    var mTx35 = new this.TestTreeNode();
    mTx35.label = "Carousel";
    mTx35.level = 3;
    mTx35.axisCoordinate = 16;
    mTx35.isAll = false;
    mTx22.children[0] = mTx35;

    mTx35.children = new Array();
    var mTx35m = new this.TestTreeNode();
    mTx35m.label = "Store Sales";
    mTx35m.level = 4;
    mTx35m.axisCoordinate = 16;
    mTx35m.isAll = false;
    mTx35.children[0] = mTx35m;



    var mTx36 = new this.TestTreeNode();
    mTx36.label = "Checkout";
    mTx36.level = 3;
    mTx36.axisCoordinate = 17;
    mTx36.isAll = false;
    mTx22.children[1] = mTx36;

    mTx36.children = new Array();
    var mTx36m = new this.TestTreeNode();
    mTx36m.label = "Store Sales";
    mTx36m.level = 4;
    mTx36m.axisCoordinate = 17;
    mTx36m.isAll = false;
    mTx36.children[0] = mTx36m;



    var mTx37 = new this.TestTreeNode();
    mTx37.label = "ALL";
    mTx37.level = 3;
    mTx37.axisCoordinate = 15;
    mTx37.isAll = true;
    mTx22.children[2] = mTx37;

    mTx37.children = new Array();
    var mTx37m = new this.TestTreeNode();
    mTx37m.label = "Store Sales";
    mTx37m.level = 4;
    mTx37m.axisCoordinate = 15;
    mTx37m.isAll = false;
    mTx37.children[0] = mTx37m;



    // Canada  ALL ALL
    mTx23.children = new Array(1);
    var mTx38 = new this.TestTreeNode();
    mTx38.label = "ALL";
    mTx38.level = 3;
    mTx38.axisCoordinate = 9;
    mTx38.isAll = true;
    mTx23.children[1] = mTx38;

    mTx38.children = new Array();
    var mTx38m = new this.TestTreeNode();
    mTx38m.label = "Store Sales";
    mTx38m.level = 4;
    mTx38m.axisCoordinate = 9;
    mTx38m.isAll = false;
    mTx38.children[0] = mTx38m;






    // Mexico  Drink
    mTx24.children = new Array(3);
    var mTx39 = new this.TestTreeNode();
    mTx39.label = "Alcoholic Beverages";
    mTx39.level = 3;
    mTx39.axisCoordinate = 20;
    mTx39.isAll = false;
    mTx24.children[0] = mTx39;

    mTx39.children = new Array();
    var mTx39m = new this.TestTreeNode();
    mTx39m.label = "Store Sales";
    mTx39m.level = 4;
    mTx39m.axisCoordinate = 20;
    mTx39m.isAll = false;
    mTx39.children[0] = mTx39m;



    var mTx310 = new this.TestTreeNode();
    mTx310.label = "Beverages";
    mTx310.level = 3;
    mTx310.axisCoordinate = 21;
    mTx310.isAll = false;
    mTx24.children[1] = mTx310;

    mTx310.children = new Array();
    var mTx310m = new this.TestTreeNode();
    mTx310m.label = "Store Sales";
    mTx310m.level = 4;
    mTx310m.axisCoordinate = 21;
    mTx310m.isAll = false;
    mTx310.children[0] = mTx310m;



    var mTx311 = new this.TestTreeNode();
    mTx311.label = "ALL";
    mTx311.level = 3;
    mTx311.axisCoordinate = 19;
    mTx311.isAll = true;
    mTx24.children[2] = mTx311;

    mTx311.children = new Array();
    var mTx311m = new this.TestTreeNode();
    mTx311m.label = "Store Sales";
    mTx311m.level = 4;
    mTx311m.axisCoordinate = 19;
    mTx311m.isAll = false;
    mTx311.children[0] = mTx311m;



    // Mexico  Food
    mTx25.children = new Array(2);
    var mTx312 = new this.TestTreeNode();
    mTx312.label = "Baked Goods";
    mTx312.level = 3;
    mTx312.axisCoordinate = 23;
    mTx312.isAll = false;
    mTx25.children[0] = mTx312;

    mTx312.children = new Array();
    var mTx312m = new this.TestTreeNode();
    mTx312m.label = "Store Sales";
    mTx312m.level = 4;
    mTx312m.axisCoordinate = 23;
    mTx312m.isAll = false;
    mTx312.children[0] = mTx312m;



    var mTx313 = new this.TestTreeNode();
    mTx313.label = "ALL";
    mTx313.level = 3;
    mTx313.axisCoordinate = 22;
    mTx313.isAll = true;
    mTx25.children[1] = mTx313;

    mTx313.children = new Array();
    var mTx313m = new this.TestTreeNode();
    mTx313m.label = "Store Sales";
    mTx313m.level = 4;
    mTx313m.axisCoordinate = 22;
    mTx313m.isAll = false;
    mTx313.children[0] = mTx313m;



    // Mexico  Non-Consumable
    mTx26.children = new Array(3);
    var mTx314 = new this.TestTreeNode();
    mTx314.label = "Carousel";
    mTx314.level = 3;
    mTx314.axisCoordinate = 25;
    mTx314.isAll = false;
    mTx26.children[0] = mTx314;

    mTx314.children = new Array();
    var mTx314m = new this.TestTreeNode();
    mTx314m.label = "Store Sales";
    mTx314m.level = 4;
    mTx314m.axisCoordinate = 25;
    mTx314m.isAll = false;
    mTx314.children[0] = mTx314m;



    var mTx315 = new this.TestTreeNode();
    mTx315.label = "Checkout";
    mTx315.level = 3;
    mTx315.axisCoordinate = 26;
    mTx315.isAll = false;
    mTx26.children[1] = mTx315;

    mTx315.children = new Array();
    var mTx315m = new this.TestTreeNode();
    mTx315m.label = "Store Sales";
    mTx315m.level = 4;
    mTx315m.axisCoordinate = 26;
    mTx315m.isAll = false;
    mTx315.children[0] = mTx315m;



    var mTx316 = new this.TestTreeNode();
    mTx316.label = "ALL";
    mTx316.level = 3;
    mTx316.axisCoordinate = 24;
    mTx316.isAll = true;
    mTx26.children[2] = mTx316;

    mTx316.children = new Array();
    var mTx316m = new this.TestTreeNode();
    mTx316m.label = "Store Sales";
    mTx316m.level = 4;
    mTx316m.axisCoordinate = 24;
    mTx316m.isAll = false;
    mTx316.children[0] = mTx316m;



    // Mexico  ALL ALL
    mTx27.children = new Array(1);
    var mTx317 = new this.TestTreeNode();
    mTx317.label = "ALL";
    mTx317.level = 3;
    mTx317.axisCoordinate = 18;
    mTx317.isAll = true;
    mTx27.children[1] = mTx317;

    mTx317.children = new Array();
    var mTx317m = new this.TestTreeNode();
    mTx317m.label = "Store Sales";
    mTx317m.level = 4;
    mTx317m.axisCoordinate = 18;
    mTx317m.isAll = false;
    mTx317.children[0] = mTx317m;






    // USA  Drink
    mTx28.children = new Array(3);
    var mTx318 = new this.TestTreeNode();
    mTx318.label = "Alcoholic Beverages";
    mTx318.level = 3;
    mTx318.axisCoordinate = 29;
    mTx318.isAll = false;
    mTx28.children[0] = mTx318;

    mTx318.children = new Array();
    var mTx318m = new this.TestTreeNode();
    mTx318m.label = "Store Sales";
    mTx318m.level = 4;
    mTx318m.axisCoordinate = 29;
    mTx318m.isAll = false;
    mTx318.children[0] = mTx318m;



    var mTx319 = new this.TestTreeNode();
    mTx319.label = "Beverages";
    mTx319.level = 3;
    mTx319.axisCoordinate = 30;
    mTx319.isAll = false;
    mTx28.children[1] = mTx319;

    mTx319.children = new Array();
    var mTx319m = new this.TestTreeNode();
    mTx319m.label = "Store Sales";
    mTx319m.level = 4;
    mTx319m.axisCoordinate = 30;
    mTx319m.isAll = false;
    mTx319.children[0] = mTx319m;



    var mTx320 = new this.TestTreeNode();
    mTx320.label = "ALL";
    mTx320.level = 3;
    mTx320.axisCoordinate = 28;
    mTx320.isAll = true;
    mTx28.children[2] = mTx320;

    mTx320.children = new Array();
    var mTx320m = new this.TestTreeNode();
    mTx320m.label = "Store Sales";
    mTx320m.level = 4;
    mTx320m.axisCoordinate = 28;
    mTx320m.isAll = false;
    mTx320.children[0] = mTx320m;




    // USA  Food
    mTx29.children = new Array(2);
    var mTx321 = new this.TestTreeNode();
    mTx321.label = "Baked Goods";
    mTx321.level = 3;
    mTx321.axisCoordinate = 32;
    mTx321.isAll = false;
    mTx29.children[0] = mTx321;

    mTx321.children = new Array();
    var mTx321m = new this.TestTreeNode();
    mTx321m.label = "Store Sales";
    mTx321m.level = 4;
    mTx321m.axisCoordinate = 32;
    mTx321m.isAll = false;
    mTx321.children[0] = mTx321m;



    var mTx322 = new this.TestTreeNode();
    mTx322.label = "ALL";
    mTx322.level = 3;
    mTx322.axisCoordinate = 31;
    mTx322.isAll = true;
    mTx29.children[1] = mTx322;

    mTx322.children = new Array();
    var mTx322m = new this.TestTreeNode();
    mTx322m.label = "Store Sales";
    mTx322m.level = 4;
    mTx322m.axisCoordinate = 31;
    mTx322m.isAll = false;
    mTx322.children[0] = mTx322m;



    // USA  Non-Consumable
    mTx210.children = new Array(3);
    var mTx323 = new this.TestTreeNode();
    mTx323.label = "Carousel";
    mTx323.level = 3;
    mTx323.axisCoordinate = 34;
    mTx323.isAll = false;
    mTx210.children[0] = mTx323;

    mTx323.children = new Array();
    var mTx323m = new this.TestTreeNode();
    mTx323m.label = "Store Sales";
    mTx323m.level = 4;
    mTx323m.axisCoordinate = 34;
    mTx323m.isAll = false;
    mTx323.children[0] = mTx323m;



    var mTx324 = new this.TestTreeNode();
    mTx324.label = "Checkout";
    mTx324.level = 3;
    mTx324.axisCoordinate = 35;
    mTx324.isAll = false;
    mTx210.children[1] = mTx324;

    mTx324.children = new Array();
    var mTx324m = new this.TestTreeNode();
    mTx324m.label = "Store Sales";
    mTx324m.level = 4;
    mTx324m.axisCoordinate = 35;
    mTx324m.isAll = false;
    mTx324.children[0] = mTx324m;



    var mTx325 = new this.TestTreeNode();
    mTx325.label = "ALL";
    mTx325.level = 3;
    mTx325.axisCoordinate = 33;
    mTx325.isAll = true;
    mTx210.children[2] = mTx325;

    mTx325.children = new Array();
    var mTx325m = new this.TestTreeNode();
    mTx325m.label = "Store Sales";
    mTx325m.level = 4;
    mTx325m.axisCoordinate = 33;
    mTx325m.isAll = false;
    mTx325.children[0] = mTx325m;




    // USA  ALL ALL
    mTx211.children = new Array(1);
    var mTx326 = new this.TestTreeNode();
    mTx326.label = "ALL";
    mTx326.level = 3;
    mTx326.axisCoordinate = 27;
    mTx326.isAll = true;
    mTx211.children[1] = mTx326;

     mTx326.children = new Array();
     var mTx326m = new this.TestTreeNode();
     mTx326m.label = "Store Sales";
     mTx326m.level = 4;
     mTx326m.axisCoordinate = 27;
     mTx326m.isAll = false;
     mTx326.children[0] = mTx326m;






    // ALL Countries  Drink
    mTx212.children = new Array(3);
    var mTx327 = new this.TestTreeNode();
    mTx327.label = "Alcoholic Beverages";
    mTx327.level = 3;
    mTx327.axisCoordinate = 2;
    mTx327.isAll = false;
    mTx212.children[0] = mTx327;

    mTx327.children = new Array();
    var mTx327m = new this.TestTreeNode();
    mTx327m.label = "Store Sales";
    mTx327m.level = 4;
    mTx327m.axisCoordinate = 2;
    mTx327m.isAll = false;
    mTx327.children[0] = mTx327m;



    var mTx328 = new this.TestTreeNode();
    mTx328.label = "Beverages";
    mTx328.level = 3;
    mTx328.axisCoordinate = 3;
    mTx328.isAll = false;
    mTx212.children[1] = mTx328;

    mTx328.children = new Array();
    var mTx328m = new this.TestTreeNode();
    mTx328m.label = "Store Sales";
    mTx328m.level = 4;
    mTx328m.axisCoordinate = 3;
    mTx328m.isAll = false;
    mTx328.children[0] = mTx328m;



    var mTx329 = new this.TestTreeNode();
    mTx329.label = "ALL";
    mTx329.level = 3;
    mTx329.axisCoordinate = 1;
    mTx329.isAll = true;
    mTx212.children[2] = mTx329;

    mTx329.children = new Array();
    var mTx329m = new this.TestTreeNode();
    mTx329m.label = "Store Sales";
    mTx329m.level = 4;
    mTx329m.axisCoordinate = 1;
    mTx329m.isAll = false;
    mTx329.children[0] = mTx329m;




    // ALL Countries  Food
    mTx213.children = new Array(2);
    var mTx330 = new this.TestTreeNode();
    mTx330.label = "Baked Goods";
    mTx330.level = 3;
    mTx330.axisCoordinate = 5;
    mTx330.isAll = false;
    mTx213.children[0] = mTx330;

    mTx330.children = new Array();
    var mTx330m = new this.TestTreeNode();
    mTx330m.label = "Store Sales";
    mTx330m.level = 4;
    mTx330m.axisCoordinate = 5;
    mTx330m.isAll = false;
    mTx330.children[0] = mTx330m;



    var mTx331 = new this.TestTreeNode();
    mTx331.label = "ALL";
    mTx331.level = 3;
    mTx331.axisCoordinate = 4;
    mTx331.isAll = true;
    mTx213.children[1] = mTx331;

    mTx331.children = new Array();
    var mTx331m = new this.TestTreeNode();
    mTx331m.label = "Store Sales";
    mTx331m.level = 4;
    mTx331m.axisCoordinate = 4;
    mTx331m.isAll = false;
    mTx331.children[0] = mTx331m;



    // ALL Countries  Non-Consumable
    mTx214.children = new Array(3);
    var mTx332 = new this.TestTreeNode();
    mTx332.label = "Carousel";
    mTx332.level = 3;
    mTx332.axisCoordinate = 7;
    mTx332.isAll = false;
    mTx214.children[0] = mTx332;

    mTx332.children = new Array();
    var mTx332m = new this.TestTreeNode();
    mTx332m.label = "Store Sales";
    mTx332m.level = 4;
    mTx332m.axisCoordinate = 7;
    mTx332m.isAll = false;
    mTx332.children[0] = mTx332m;



    var mTx333 = new this.TestTreeNode();
    mTx333.label = "Checkout";
    mTx333.level = 3;
    mTx333.axisCoordinate = 8;
    mTx333.isAll = false;
    mTx214.children[1] = mTx333;

    mTx333.children = new Array();
    var mTx333m = new this.TestTreeNode();
    mTx333m.label = "Store Sales";
    mTx333m.level = 4;
    mTx333m.axisCoordinate = 8;
    mTx333m.isAll = false;
    mTx333.children[0] = mTx333m;



    var mTx334 = new this.TestTreeNode();
    mTx334.label = "ALL";
    mTx334.level = 3;
    mTx334.axisCoordinate = 6;
    mTx334.isAll = true;
    mTx214.children[2] = mTx334;

    mTx334.children = new Array();
    var mTx334m = new this.TestTreeNode();
    mTx334m.label = "Store Sales";
    mTx334m.level = 4;
    mTx334m.axisCoordinate = 6;
    mTx334m.isAll = false;
    mTx334.children[0] = mTx334m;



    // ALL Countries  ALL ALL
    mTx215.children = new Array(1);
    var mTx335 = new this.TestTreeNode();
    mTx335.label = "ALL";
    mTx335.level = 3;
    mTx335.axisCoordinate = 0;
    mTx335.isAll = true;
    mTx215.children[1] = mTx335;

    mTx335.children = new Array();
    var mTx335m = new this.TestTreeNode();
    mTx335m.label = "Store Sales";
    mTx335m.level = 4;
    mTx335m.axisCoordinate = 0;
    mTx335m.isAll = false;
    mTx335.children[0] = mTx335m;





   // row tree nodes
    var mTyArray = [];





    // set the axis tree nodes
    mTArray[0] = mTyArray;      //  row
    mTArray[1] = mTx0;      //  column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;
  res.metadata.isOLAP = true;

  return res;
};



//  OLAP  measures in the middle, Dimension with NO ALl level member
//
//    COLUMN  Dimension Customers
//                  Level  Customer Country   (no ALL level)
//            Dimension Measures
//                  Level  Store Cost, Store Sales
//            Dimension Product
//                  Level  All
//                  Level  Product Family
//
//    NOTE:  Store Cost is ragged:
//                 Canada has no Store Cost details !
//
//
HighChartUnitTests.prototype.obj23 = function () {
    ////////////////////////////////////////
    // data 1 rows 20 columns
    var data = new Array(1);

    var r0 = new Array(36);
    r0[0] = 8669.84;
    r0[1] = 8669.84;
    r0[2] = 6392.12;
    r0[3] = 2;
    r0[4] = 1;
    r0[5] = 2435;
    r0[6] = 14;
    r0[7] = 246;
    r0[8] = 165;
    r0[9] = 24325;
    r0[10] = 1436;
    r0[11] = 24;
    r0[12] = 123;
    r0[13] = 28;
    r0[14] = 11;
    r0[15] = 2465;
    r0[16] = 132;
    r0[17] = 233;
    r0[18] = 441;
    r0[19] = 255;


    data[0] = r0;



  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = [];

    var ax0 = new Object();
    ax0.dimension = "Customer";
    ax0.label = "Customer Country";
    mAx.push(ax0);


    var ax3 = new Object();
    ax3.dimension = "Measures";
    ax3.label =  "Measures";
    mAx.push(ax3);

    var ax2 = new Object();
    ax2.dimension = "Products";
    ax2.label = "(All)";
    mAx.push(ax2);

    var ax1 = new Object();
    ax1.dimension = "Products";
    ax1.label = "Product Family";
    mAx.push(ax1);






    var mAy = [];


    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column


    // measures array
    var msArray = [];
    msArray.push("Store Cost");
    msArray.push("Store Sales");


    md.axes = mdArray;
    md.measureAxis = 1;
    md.measures = msArray;



    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);



    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;


    // column level 1    Countries
    mTx0.children = new Array(4);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Canada";
    mTx10.level = 1;
    mTx10.axisCoordinate = -1;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "Mexico";
    mTx11.level = 1;
    mTx11.axisCoordinate = -1;
    mTx0.children[1] = mTx11;

    var mTx12 = new this.TestTreeNode();
    mTx12.label = "USA";
    mTx12.level = 1;
    mTx12.axisCoordinate = -1;
    mTx0.children[2] = mTx12;



    // column level 2  Measures  Store Sales, Store Cost

    // Canada
    mTx10.children = new Array(2);
    var mTx20 = new this.TestTreeNode();
    mTx20.label = "Store Cost";
    mTx20.level = 2;
    mTx20.axisCoordinate = -1;
    mTx20.isAll = false;
    mTx10.children[0] = mTx20;

    // Canada
    var mTx21 = new this.TestTreeNode();
    mTx21.label = "Store Sales";
    mTx21.level = 2;
    mTx21.axisCoordinate = -1;
    mTx21.isAll = false;
    mTx10.children[1] = mTx21;


    // Mexico
    mTx11.children = new Array(2);
    var mTx24 = new this.TestTreeNode();
    mTx24.label = "Store Cost";
    mTx24.level = 2;
    mTx24.axisCoordinate = -1;
    mTx24.isAll = false;
    mTx11.children[0] = mTx24;

    // Mexico
    var mTx25 = new this.TestTreeNode();
    mTx25.label = "Store Sales";
    mTx25.level = 2;
    mTx25.axisCoordinate = -1;
    mTx25.isAll = false;
    mTx11.children[1] = mTx25;


    // USA
    mTx12.children = new Array(2);
    var mTx28 = new this.TestTreeNode();
    mTx28.label = "Store Cost";
    mTx28.level = 2;
    mTx28.axisCoordinate = -1;
    mTx28.isAll = false;
    mTx12.children[0] = mTx28;

    // USA
    var mTx29 = new this.TestTreeNode();
    mTx29.label = "Store Sales";
    mTx29.level = 2;
    mTx29.axisCoordinate = -1;
    mTx29.isAll = false;
    mTx12.children[1] = mTx29;


    // column level 3  Product Family


    // Canada  Store Cost
    mTx20.children = new Array(1);
    var mTx30 = new this.TestTreeNode();
    mTx30.label = "All Products";
    mTx30.level = 3;
    mTx30.axisCoordinate = 0;
    mTx30.isAll = true;
    mTx20.children[0] = mTx30;


    // Canada  Store Sales
    mTx21.children = new Array(4);
    var mTx30m = new this.TestTreeNode();
    mTx30m.label = "All Products";
    mTx30m.level = 3;
    mTx30m.axisCoordinate = 1;
    mTx30m.isAll = true;
    mTx21.children[0] = mTx30m;

    var mTx31 = new this.TestTreeNode();
    mTx31.label = "Drink";
    mTx31.level = 3;
    mTx31.axisCoordinate = 2;
    mTx31.isAll = false;
    mTx21.children[1] = mTx31;


    var mTx32 = new this.TestTreeNode();
    mTx32.label = "Food";
    mTx32.level = 3;
    mTx32.axisCoordinate = 3;
    mTx32.isAll = false;
    mTx21.children[2] = mTx32;


    var mTx33 = new this.TestTreeNode();
    mTx33.label = "Non-Consumable";
    mTx33.level = 3;
    mTx33.axisCoordinate = 4;
    mTx33.isAll = false;
    mTx21.children[3] = mTx33;




    // Mexico Store Cost
    mTx24.children = new Array(4);
    var mTx33m = new this.TestTreeNode();
    mTx33m.label = "All Products";
    mTx33m.level = 3;
    mTx33m.axisCoordinate = 5;
    mTx33m.isAll = true;
    mTx24.children[0] = mTx33m;


    var mTx34 = new this.TestTreeNode();
    mTx34.label = "Drink";
    mTx34.level = 3;
    mTx34.axisCoordinate = 6;
    mTx34.isAll = false;
    mTx24.children[1] = mTx34;

    var mTx35 = new this.TestTreeNode();
    mTx35.label = "Food";
    mTx35.level = 3;
    mTx35.axisCoordinate = 7;
    mTx35.isAll = false;
    mTx24.children[2] = mTx35;

    var mTx35m = new this.TestTreeNode();
    mTx35m.label = "Non-Consumable";
    mTx35m.level = 3;
    mTx35m.axisCoordinate = 8;
    mTx35m.isAll = false;
    mTx24.children[3] = mTx35m;


    // Mexico Store Sales
    mTx25.children = new Array(4);
    var mTx36 = new this.TestTreeNode();
    mTx36.label = "All Products";
    mTx36.level = 3;
    mTx36.axisCoordinate = 9;
    mTx36.isAll = true;
    mTx25.children[0] = mTx36;

    var mTx36m = new this.TestTreeNode();
    mTx36m.label = "Drink";
    mTx36m.level = 3;
    mTx36m.axisCoordinate = 10;
    mTx36m.isAll = false;
    mTx25.children[1] = mTx36m;

    var mTx37 = new this.TestTreeNode();
    mTx37.label = "Food";
    mTx37.level = 3;
    mTx37.axisCoordinate = 11;
    mTx37.isAll = false;
    mTx25.children[2] = mTx37;

    var mTx37m = new this.TestTreeNode();
    mTx37m.label = "Non-Consumable";
    mTx37m.level = 3;
    mTx37m.axisCoordinate = 12;
    mTx37m.isAll = false;
    mTx25.children[3] = mTx37m;



    // USA  Store Cost
    mTx28.children = new Array(4);
    var mTx38 = new this.TestTreeNode();
    mTx38.label = "All Products";
    mTx38.level = 3;
    mTx38.axisCoordinate = 13;
    mTx38.isAll = true;
    mTx28.children[0] = mTx38;


    var mTx38m = new this.TestTreeNode();
    mTx38m.label = "Drink";
    mTx38m.level = 3;
    mTx38m.axisCoordinate = 14;
    mTx38m.isAll = false;
    mTx28.children[1] = mTx38m;

    var mTx39 = new this.TestTreeNode();
    mTx39.label = "Food";
    mTx39.level = 3;
    mTx39.axisCoordinate = 15;
    mTx39.isAll = false;
    mTx28.children[2] = mTx39;

    var mTx310 = new this.TestTreeNode();
    mTx310.label = "Non-Consumable";
    mTx310.level = 3;
    mTx310.axisCoordinate = 16;
    mTx310.isAll = false;
    mTx28.children[3] = mTx310;


    // USA Store sales
    mTx29.children = new Array(4);
    var mTx311 = new this.TestTreeNode();
    mTx311.label = "All Products";
    mTx311.level = 3;
    mTx311.axisCoordinate = 17;
    mTx311.isAll = true;
    mTx29.children[0] = mTx311;


    var mTx312 = new this.TestTreeNode();
    mTx312.label = "Drink";
    mTx312.level = 3;
    mTx312.axisCoordinate = 18;
    mTx312.isAll = false;
    mTx29.children[1] = mTx312;

    var mTx313 = new this.TestTreeNode();
    mTx313.label = "Food";
    mTx313.level = 3;
    mTx313.axisCoordinate = 19;
    mTx313.isAll = false;
    mTx29.children[2] = mTx313;


    var mTx314 = new this.TestTreeNode();
    mTx314.label = "Non-Consumable";
    mTx314.level = 3;
    mTx314.axisCoordinate = 20;
    mTx314.isAll = false;
    mTx29.children[3] = mTx314;



   // row tree nodes
    var mTyArray = [];


    // set the axis tree nodes
    mTArray[0] = mTyArray;      //  row
    mTArray[1] = mTx0;      //  column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;
  res.metadata.isOLAP = true;

  return res;
};




//  OLAP  measures first in Axis, Country Dimension 2 levels with ALL, product no ALL   level member
//
//    COLUMN
//            Dimension Measures
//                  Level  Store Cost, Store Sales
//            Dimension Customers
//                  Level  ALL
//                  Level  Customer Country
//                  Level  State
//            Dimension Product
//                  Level  Product Family
//

//    NOTE:  Store Cost is ragged:
//                 Canada has no Store Cost details !
//
//
HighChartUnitTests.prototype.obj24 = function () {
    ////////////////////////////////////////
    // data 1 rows 24 columns
    var data = new Array(1);

    var r0 = new Array(36);
    r0[0] = 8669.84;
    r0[1] = 8669.84;
    r0[2] = 6392.12;
    r0[3] = 2;
    r0[4] = 1;
    r0[5] = 2435;
    r0[6] = 14;
    r0[7] = 246;
    r0[8] = 165;
    r0[9] = 24325;
    r0[10] = 1436;
    r0[11] = 24;
    r0[12] = 123;
    r0[13] = 28;
    r0[14] = 11;
    r0[15] = 2465;
    r0[16] = 132;
    r0[17] = 233;
    r0[18] = 441;
    r0[19] = 255;
    r0[20] = 1436;
    r0[21] = 24;
    r0[22] = 123;
    r0[23] = 28;


    data[0] = r0;



  ////////////////////////////
  // metadata
  var md = new Object();

    // metadata axes
    var mdArray = new Array(2);

    var mAx = [];

    var ax3 = new Object();
    ax3.dimension = "Measures";
    ax3.label =  "Measures";
    mAx.push(ax3);

    var ax0 = new Object();
    ax0.dimension = "Customer";
    ax0.label = "(All)";
    mAx.push(ax0);

    var ax1 = new Object();
    ax1.dimension = "Customer";
    ax1.label = "Customer Country";
    mAx.push(ax1);

    var ax2 = new Object();
    ax2.dimension = "Customer";
    ax2.label = "Customer State";
    mAx.push(ax2);

    var ax4 = new Object();
    ax4.dimension = "Products";
    ax4.label = "Product Family";
    mAx.push(ax4);


    var mAy = [];

    mdArray[0] = mAy;        //  row
    mdArray[1] = mAx;        //  column


    // measures array
    var msArray = [];
    msArray.push("Store Cost");
    msArray.push("Store Sales");


    md.axes = mdArray;
    md.measureAxis = 1;
    md.measures = msArray;



    ////////////////////////
    // treeNodes
    var mTArray = new Array(2);



    // column level 0
    var mTx0 = new this.TestTreeNode();
    mTx0.label = "All";
    mTx0.level = 0;
    mTx0.axisCoordinate = -1;
    mTx0.isAll = true;


    // column level 1    Measures
    mTx0.children = new Array(2);
    var mTx10 = new this.TestTreeNode();
    mTx10.label = "Store Cost";
    mTx10.level = 1;
    mTx10.axisCoordinate = -1;
    mTx0.children[0] = mTx10;

    var mTx11 = new this.TestTreeNode();
    mTx11.label = "Store Sales";
    mTx11.level = 1;
    mTx11.axisCoordinate = -1;
    mTx0.children[1] = mTx11;




    // column level 2  Store Cost  Countries
    mTx10.children = new Array(3);
    var mTx20 = new this.TestTreeNode();
    mTx20.label = "Canada";
    mTx20.level = 2;
    mTx20.axisCoordinate = -1;
    mTx10.children[0] = mTx20;

    var mTx21 = new this.TestTreeNode();
    mTx21.label = "USA";
    mTx21.level = 2;
    mTx21.axisCoordinate = -1;
    mTx10.children[1] = mTx21;

    var mTx22 = new this.TestTreeNode();
    mTx22.label = "All";
    mTx22.level = 2;
    mTx22.isAll = true;
    mTx22.axisCoordinate = -1;
    mTx10.children[2] = mTx22;



    // level 2   Store Sales   Countries
    mTx11.children = new Array(3);
    var mTx24 = new this.TestTreeNode();
    mTx24.label = "Canada";
    mTx24.level = 2;
    mTx24.axisCoordinate = -1;
    mTx24.isAll = false;
    mTx11.children[0] = mTx24;

    var mTx25 = new this.TestTreeNode();
    mTx25.label = "USA";
    mTx25.level = 2;
    mTx25.axisCoordinate = -1;
    mTx25.isAll = false;
    mTx11.children[1] = mTx25;

    var mTx28 = new this.TestTreeNode();
    mTx28.label = "All";
    mTx28.level = 2;
    mTx28.axisCoordinate = -1;
    mTx28.isAll = true;
    mTx11.children[2] = mTx28;





    // column level 3  Store Cost  Canada  States
    mTx20.children = new Array(2);
    var mTx29 = new this.TestTreeNode();
    mTx29.label = "All";
    mTx29.level = 3;
    mTx29.axisCoordinate = -1;
    mTx29.isAll = true;
    mTx20.children[0] = mTx29;

    var mTx30 = new this.TestTreeNode();
    mTx30.label = "BC";
    mTx30.level = 3;
    mTx30.axisCoordinate = -1;
    mTx30.isAll = false;
    mTx20.children[1] = mTx30;


    //  Store Cost   USA   States
    mTx21.children = new Array(3);
    var mTx30m = new this.TestTreeNode();
    mTx30m.label = "All";
    mTx30m.level = 3;
    mTx30m.axisCoordinate = -1;
    mTx30m.isAll = true;
    mTx21.children[0] = mTx30m;

    var mTx31 = new this.TestTreeNode();
    mTx31.label = "CA";
    mTx31.level = 3;
    mTx31.axisCoordinate = -2;
    mTx31.isAll = false;
    mTx21.children[1] = mTx31;


    var mTx32 = new this.TestTreeNode();
    mTx32.label = "OR";
    mTx32.level = 3;
    mTx32.axisCoordinate = -3;
    mTx32.isAll = false;
    mTx21.children[2] = mTx32;



    // Store Cost  ALL ALL
    mTx22.children = new Array(1);
    var mTx33 = new this.TestTreeNode();
    mTx33.label = "All";
    mTx33.level = 3;
    mTx33.axisCoordinate = -4;
    mTx33.isAll = true;
    mTx22.children[0] = mTx33;




    // Store Sales  Canada States
    mTx24.children = new Array(2);
    var mTx33m = new this.TestTreeNode();
    mTx33m.label = "All";
    mTx33m.level = 3;
    mTx33m.axisCoordinate = -5;
    mTx33m.isAll = true;
    mTx24.children[0] = mTx33m;


    var mTx34 = new this.TestTreeNode();
    mTx34.label = "BC";
    mTx34.level = 3;
    mTx34.axisCoordinate = -6;
    mTx34.isAll = false;
    mTx24.children[1] = mTx34;


    // Store sales  USA  States
    mTx25.children = new Array(3);
    var mTx35 = new this.TestTreeNode();
    mTx35.label = "All";
    mTx35.level = 3;
    mTx35.axisCoordinate = -7;
    mTx35.isAll = true;
    mTx25.children[0] = mTx35;

    var mTx35m = new this.TestTreeNode();
    mTx35m.label = "CA";
    mTx35m.level = 3;
    mTx35m.axisCoordinate = -8;
    mTx35m.isAll = false;
    mTx25.children[1] = mTx35m;

    var mTx36 = new this.TestTreeNode();
    mTx36.label = "OR";
    mTx36.level = 3;
    mTx36.axisCoordinate = -9;
    mTx36.isAll = false;
    mTx25.children[2] = mTx36;


    // Store Sales ALL ALL
    mTx28.children = new Array(1);
    var mTx36m = new this.TestTreeNode();
    mTx36m.label = "ALL";
    mTx36m.level = 3;
    mTx36m.axisCoordinate = -10;
    mTx36m.isAll = true;
    mTx28.children[0] = mTx36m;



    // column level 4

    // Store Cost Canada ALL
    mTx29.children = new Array(2);
    var mTx40 = new this.TestTreeNode();
    mTx40.label = "Drink";
    mTx40.level = 4;
    mTx40.axisCoordinate = 2;
    mTx40.isAll = false;
    mTx29.children[0] = mTx30;

    var mTx41 = new this.TestTreeNode();
    mTx41.label = "Food";
    mTx41.level = 4;
    mTx41.axisCoordinate = 3;
    mTx41.isAll = false;
    mTx29.children[1] = mTx41;



    // Store Cost  Canada BC
    mTx34.children = new Array(2);
    var mTx42 = new this.TestTreeNode();
    mTx42.label = "Drink";
    mTx42.level = 4;
    mTx42.axisCoordinate = 4;
    mTx42.isAll = false;
    mTx34.children[0] = mTx42;

    var mTx43 = new this.TestTreeNode();
    mTx43.label = "Food";
    mTx43.level = 4;
    mTx43.axisCoordinate = 5;
    mTx43.isAll = false;
    mTx34.children[1] = mTx43;



    // Store Cost  USA  ALL
    mTx30.children = new Array(2);
    var mTx44 = new this.TestTreeNode();
    mTx44.label = "Drink";
    mTx44.level = 4;
    mTx44.axisCoordinate = 6;
    mTx44.isAll = false;
    mTx30.children[0] = mTx44;

    var mTx45 = new this.TestTreeNode();
    mTx45.label = "Food";
    mTx45.level = 4;
    mTx45.axisCoordinate = 7;
    mTx45.isAll = false;
    mTx30.children[1] = mTx45;



    // Store Cost  USA  CA
    mTx31.children = new Array(2);
    var mTx46 = new this.TestTreeNode();
    mTx46.label = "Drink";
    mTx46.level = 4;
    mTx46.axisCoordinate = 8;
    mTx46.isAll = false;
    mTx31.children[0] = mTx46;

    var mTx47 = new this.TestTreeNode();
    mTx47.label = "Food";
    mTx47.level = 4;
    mTx47.axisCoordinate = 9;
    mTx47.isAll = false;
    mTx31.children[1] = mTx47;



    // Store Cost  USA  OR
    mTx32.children = new Array(2);
    var mTx48 = new this.TestTreeNode();
    mTx48.label = "Drink";
    mTx48.level = 4;
    mTx48.axisCoordinate = 10;
    mTx48.isAll = false;
    mTx32.children[0] = mTx48;

    var mTx49 = new this.TestTreeNode();
    mTx49.label = "Food";
    mTx49.level = 4;
    mTx49.axisCoordinate = 11;
    mTx49.isAll = false;
    mTx32.children[1] = mTx49;


    // Store Cost ALL ALL
    mTx33.children = new Array(2);
    var mTx410 = new this.TestTreeNode();
    mTx410.label = "Drink";
    mTx410.level = 4;
    mTx410.axisCoordinate = 0;
    mTx410.isAll = false;
    mTx33.children[0] = mTx410;

    var mTx411 = new this.TestTreeNode();
    mTx411.label = "Food";
    mTx411.level = 4;
    mTx411.axisCoordinate = 1;
    mTx411.isAll = false;
    mTx33.children[1] = mTx411;



     // Store Sales Canada ALL
    mTx33m.children = new Array(2);
    var mTx412 = new this.TestTreeNode();
    mTx412.label = "Drink";
    mTx412.level = 4;
    mTx412.axisCoordinate = 14;
    mTx412.isAll = false;
    mTx33m.children[0] = mTx412;

    var mTx413 = new this.TestTreeNode();
    mTx413.label = "Food";
    mTx413.level = 4;
    mTx413.axisCoordinate = 15;
    mTx413.isAll = false;
    mTx33m.children[1] = mTx413;


    //  Store Sales Canada BC
    mTx34.children = new Array(2);
    var mTx414 = new this.TestTreeNode();
    mTx414.label = "Drink";
    mTx414.level = 4;
    mTx414.axisCoordinate = 16;
    mTx414.isAll = false;
    mTx34.children[0] = mTx414;

    var mTx415 = new this.TestTreeNode();
    mTx415.label = "Food";
    mTx415.level = 4;
    mTx415.axisCoordinate = 17;
    mTx415.isAll = false;
    mTx34.children[1] = mTx415;


    // Store Sales  USA  ALL
    mTx35.children = new Array(2);
    var mTx416 = new this.TestTreeNode();
    mTx416.label = "Drink";
    mTx416.level = 4;
    mTx416.axisCoordinate = 18;
    mTx416.isAll = false;
    mTx35.children[0] = mTx416;

    var mTx417 = new this.TestTreeNode();
    mTx417.label = "Food";
    mTx417.level = 4;
    mTx417.axisCoordinate = 19;
    mTx417.isAll = false;
    mTx35.children[1] = mTx417;



    // Store Sales  USA CA
    mTx35m.children = new Array(2);
    var mTx418 = new this.TestTreeNode();
    mTx418.label = "Drink";
    mTx418.level = 4;
    mTx418.axisCoordinate = 20;
    mTx418.isAll = false;
    mTx35m.children[0] = mTx418;

    var mTx419 = new this.TestTreeNode();
    mTx419.label = "Food";
    mTx419.level = 4;
    mTx419.axisCoordinate = 21;
    mTx419.isAll = false;
    mTx35m.children[1] = mTx419;


    // Store Sales  USA OR
    mTx36.children = new Array(2);
    var mTx420 = new this.TestTreeNode();
    mTx420.label = "Drink";
    mTx420.level = 4;
    mTx420.axisCoordinate = 22;
    mTx420.isAll = false;
    mTx36.children[0] = mTx420;


    var mTx421 = new this.TestTreeNode();
    mTx421.label = "Food";
    mTx421.level = 4;
    mTx421.axisCoordinate = 23;
    mTx421.isAll = false;
    mTx36.children[1] = mTx421;



    // Store Sales  ALL ALL

    mTx36m.children = new Array(2);
    var mTx422 = new this.TestTreeNode();
    mTx422.label = "Drink";
    mTx422.level = 4;
    mTx422.axisCoordinate = 12;
    mTx422.isAll = false;
    mTx36m.children[0] = mTx422;

    var mTx423 = new this.TestTreeNode();
    mTx423.label = "Food";
    mTx423.level = 4;
    mTx423.axisCoordinate = 13;
    mTx423.isAll = false;
    mTx36m.children[1] = mTx423;



   // row tree nodes
    var mTyArray = [];


    // set the axis tree nodes
    mTArray[0] = mTyArray;      //  row
    mTArray[1] = mTx0;      //  column


  var res = new Object();
  res.data = data;
  res.treeNodes = mTArray;
  res.metadata = md;
  res.metadata.isOLAP = true;

  return res;
};





/*
 **   cut and paste code to put unit test into highcharts.js to run:

       // Measures {Store Sales, Store Cost, Unit Sales}
          var unitTest = new HighChartUnitTests();


         var testObj4 =  unitTest.obj4();
         var json = Object.toJSON(testObj4);
         //AdhocDataProcessor.fn.loadTest(json);
         //AdhocDataProcessor.fn.load(json);
         var sstate = new Object();
         sstate.queryData = testObj4;
         AdhocDataProcessor.fn.load(sstate);

         var testObj4Col10 = AdhocDataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
         unitTest.checkObj4Col10(testObj4Col10);
         var leafArrayObj4Col10   = AdhocDataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col10);


         var testObj4Col11 = AdhocDataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
         unitTest.checkObj4Col11(testObj4Col11);
         var leafArrayObj4Col11   = AdhocDataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col11);

         var testObj4Col12 = AdhocDataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
         unitTest.checkObj4Col12(testObj4Col12);
         var leafArrayObj4Col12   = AdhocDataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col12);


         // since  level 3 is the last non-measure level, this is the same as (1, 4)
         // so we can use the (1, 4)
         var testObj4Col13 = AdhocDataProcessor.fn.getSimpleTreeForSliderLevel(1, 3);
         unitTest.checkObj4Col14(testObj4Col13);
         var leafArrayObj4Col13   = AdhocDataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col13);

         var testObj4Col14 = AdhocDataProcessor.fn.getSimpleTreeForSliderLevel(1, 4);
         unitTest.checkObj4Col14(testObj4Col14);
         var leafArrayObj4Col14   = AdhocDataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col14);


         var testObj400ChartRes = highchartDataMapper.renderBasicColumnChart(0, 0);

         var testObj413ChartRes = highchartDataMapper.renderBasicColumnChart(1, 3);
         testObj413ChartRes.chart.renderTo = 'chartContainer';
         var charttt = new Highcharts.Chart(testObj413ChartRes);


 ////////////////////




*/

HighChartUnitTests.prototype.run = function () {


        this.DataProcessor = AdhocDataProcessor;
        var unitTest = this;



        //  OLAP  measures first in Axis, Country Dimension 2 levels with ALL, product no ALL   level member
        //
        //    COLUMN
        //            Dimension Measures
        //                  Level  Store Cost, Store Sales
        //            Dimension Customers
        //                  Level  ALL
        //                  Level  Customer Country
        //                  Level  State
        //            Dimension Product
        //                  Level  Product Family
        //

        //    NOTE:  Store Cost is ragged:
        //                 Canada has no Store Cost details !
        //
        //


        var testObj24 = unitTest.obj24();
        var json = Object.toJSON(testObj24);
        this.DataProcessor.fn.loadTest(json);

        // there is no ALL level for Customers
        // test top level grand total
        var dimLevels = [];
        dimLevels.push({ level: 0 });
        dimLevels.push({ level: 1 });

        var testObj24Col01 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        //unitTest.checkObj23Col00(testObj23Col00);
        //var leafArrayObj24Col01 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj24Col01);



        var dimLevels = [];
        dimLevels.push({ level: 1 });
        dimLevels.push({ level: 1 });

        var testObj24Col11 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        //unitTest.checkObj23Col00(testObj23Col00);
        //var leafArrayObj24Col11 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj24Col11);




    //  OLAP  measures in the middle, Dimension with NO ALl level member
    //
    //    COLUMN  Dimension Customers
    //                  Level  Customer Country   (no ALL level)
    //            Dimension Measures
    //                  Level  Store Cost, Store Sales
    //            Dimension Product
    //                  Level  All
    //                  Level  Product Family
    //
    //    NOTE:  Store Cost is ragged:
    //                 Canada has no Store Cost details !
    //
    //


        var testObj23 = unitTest.obj23();
        var json = Object.toJSON(testObj23);
        this.DataProcessor.fn.loadTest(json);

        // there is no ALL level for Customers
        // test top level grand total
        //var dimLevels = [];
        //dimLevels.push({ level: 0 });
        //dimLevels.push({ level: 0 });

        //var testObj23Col00 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        //unitTest.checkObj23Col00(testObj23Col00);
        //var leafArrayObj23Col00 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj23Col00);


        // test country totals
        var dimLevels = [];
        dimLevels.push({ level: 1 });
        dimLevels.push({ level: 0 });

        var testObj23Col10 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        unitTest.checkObj23Col10(testObj23Col10);
        var leafArrayObj23Col10 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj23Col10);



        // test fully expanded levels on all Dimensions
        var dimLevels = [];
        dimLevels.push({ level: 1 });
        dimLevels.push({ level: 1 });

        var testObj23Col11 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        //alert("unitTest.checkObj23Col12(testObj23Col12);  turned off");
        unitTest.checkObj23Col11(testObj23Col11);
        var leafArrayObj23Col11 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj23Col11);







        // new for OLAP
        //
        // most basic  OLAP crosstab:
        //
        //    COLUMN  DImension Customers
        //                  Level  All
        //                  Level  Customer Country
        //            Dimension Product
        //                  Level  All
        //                  Level  Product Family
        //                  Level  Product Department
        //
        //    ROW     Dimension Measures
        //                  Level  Store Cost




        var testObj20 = unitTest.obj20();
        var json = Object.toJSON(testObj20);
        this.DataProcessor.fn.loadTest(json);

        // test top level grand total
        var dimLevels = [];
        dimLevels.push({ level: 0 });
        dimLevels.push({ level: 0 });

        var testObj20Col00 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        unitTest.checkObj20Col00(testObj20Col00);
        var leafArrayObj20Col00 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj20Col00);


        // test country totals
        var dimLevels = [];
        dimLevels.push({ level: 1 });
        dimLevels.push({ level: 0 });

        var testObj20Col10 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        unitTest.checkObj20Col10(testObj20Col10);
        var leafArrayObj20Col10 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj20Col10);

        // test Product Family subtotals  under ALL Countries
        var dimLevels = [];
        dimLevels.push({ level: 0 });
        dimLevels.push({ level: 1 });

        var testObj20Col01 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        unitTest.checkObj20Col01(testObj20Col01);
        var leafArrayObj20Col01 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj20Col01);



        // test leaf level Product Department subtotals  under ALL Countries
        var dimLevels = [];
        dimLevels.push({ level: 0 });
        dimLevels.push({ level: 2 });

        var testObj20Col02 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        //alert("unitTest.checkObj20Col02(testObj20Col02);  turned off");
        unitTest.checkObj20Col02(testObj20Col02);
        var leafArrayObj20Col02 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj20Col02);


        // test fully expanded levels on all Dimensions
        var dimLevels = [];
        dimLevels.push({ level: 1 });
        dimLevels.push({ level: 2 });

        var testObj20Col12 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        //alert("unitTest.checkObj20Col12(testObj20Col12);  turned off");
        unitTest.checkObj20Col12(testObj20Col12);
        var leafArrayObj20Col12 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj20Col12);



        // most basic  OLAP crosstab:
        //
        //  this is Obj20  with  measures added for Dimension
        //
        //    COLUMN  DImension Customers
        //                  Level  All
        //                  Level  Customer Country
        //            Dimension Product
        //                  Level  All
        //                  Level  Product Family
        //                  Level  Product Department
        //            Dimension Measures
        //                  Level  Store Cost
        //
        //
        //   the unit tests for obj20  work for obj22 as is  b/c all we added was single measure at end

        var testObj22 = unitTest.obj22();
        var json = Object.toJSON(testObj22);
        this.DataProcessor.fn.loadTest(json);

        // test top level grand total
        var dimLevels = [];
        dimLevels.push({ level: 0 });
        dimLevels.push({ level: 0 });

        var testObj22Col00 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        unitTest.checkObj20Col00(testObj22Col00);
        var leafArrayObj22Col00 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj22Col00);

        // test country totals
        var dimLevels = [];
        dimLevels.push({ level: 1 });
        dimLevels.push({ level: 0 });

        var testObj22Col10 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        unitTest.checkObj20Col10(testObj22Col10);
        //var leafArrayObj20Col10 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj20Col10);

        // test Product Family subtotals  under ALL Countries
        var dimLevels = [];
        dimLevels.push({ level: 0 });
        dimLevels.push({ level: 1 });

        var testObj22Col01 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        unitTest.checkObj20Col01(testObj22Col01);
        //var leafArrayObj20Col01 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj20Col01);



        // test leaf level Product Department subtotals  under ALL Countries
        var dimLevels = [];
        dimLevels.push({ level: 0 });
        dimLevels.push({ level: 2 });

        var testObj22Col02 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        //alert("unitTest.checkObj20Col02(testObj20Col02);  turned off");
        unitTest.checkObj20Col02(testObj22Col02);
        //var leafArrayObj20Col02 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj20Col02);


        // test fully expanded levels on all Dimensions
        var dimLevels = [];
        dimLevels.push({ level: 1 });
        dimLevels.push({ level: 2 });

        var testObj22Col12 = this.DataProcessor.fn.getSimpleTreeForDimLevelRadio(1, dimLevels);
        //alert("unitTest.checkObj22Col12(testObj20Col12);  turned off");
        unitTest.checkObj22Col12(testObj22Col12);
        //var leafArrayObj22Col12 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj22Col12);



   /*

         //   OLAP crosstab:
         //
         //    COLUMN  DImension Customers
         //                  Level  All
         //                  Level  Customer Country
         //                  Level  Customer State
         //            Dimension Product
         //                  Level  Product Family      (no ALL level for Product)
         //            Dimension Measures
         //                  Store Cost
         //                  Store Sales
         //
         //
        var testObj21 = unitTest.obj21();
        var json = Object.toJSON(testObj21);
        this.DataProcessor.fn.loadTest(json);


  */



        var testObj = unitTest.obj2();


        var json = Object.toJSON(testObj);
        this.DataProcessor.fn.loadTest(json);

        var testRawTreeNodes = this.DataProcessor.rawTreeNodeAxes;



        // total trees

        // rows
        // rowLevels:  "Product Family", "Measures"
        // colLevels: "Customer Country", "Customer City"

        // measureAxis = 0  rows
        // measures = "Store Sales

        var testSimpleTreeRowSlider0 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(0, 0);
        unitTest.checkObj2SimpleTreeRow00(testSimpleTreeRowSlider0);
        var leafArrayRowSlider0 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testSimpleTreeRowSlider0);


        var testSimpleTreeColSlider0 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        unitTest.checkObj2SimpleTreeCol00(testSimpleTreeColSlider0);
        var leafArrayColSlider0 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testSimpleTreeColSlider0);


        var testSimpleTreeRowSlider1 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(0, 1);
        unitTest.checkObj2SimpleTreeRow01(testSimpleTreeRowSlider1);
        var leafArraySimpleTreeRowSlider1   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testSimpleTreeRowSlider1);


        var testSimpleTreeColSlider11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        unitTest.checkObj2SimpleTreeCol11(testSimpleTreeColSlider11);
        var leafArraySimpleTreeColSlider11   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testSimpleTreeColSlider11);


        var testSimpleTreeColSlider12 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
        unitTest.checkObj2SimpleTreeCol12(testSimpleTreeColSlider12);
        var leafArraySimpleTreeColSlider12   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testSimpleTreeColSlider12);



        // ROW:  Product Family.
        // COLUMN:   Customer Country, {Store Sales, Unit Sales}, State  (with Country 'Mexico' filtered out for simplicity)     22
        // MEASURES:   {Store Sales, Unit Sales}
        //
        var testObj3 = unitTest.obj3();
        var json = Object.toJSON(testObj3);
        this.DataProcessor.fn.loadTest(json);

        var test2middleMeasuresColSlider10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        unitTest.check2middleMeasuresColSlider10(test2middleMeasuresColSlider10);
        var leafArray2middleMeasuresColSlider10   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(test2middleMeasuresColSlider10);

        var test2middleMeasuresColSlider11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        unitTest.check2middleMeasuresColSlider11(test2middleMeasuresColSlider11);
        var leafArray2middleMeasuresColSlider11   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(test2middleMeasuresColSlider11);

        var test2middleMeasuresColSlider12 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
        unitTest.check2middleMeasuresColSlider12(test2middleMeasuresColSlider12);
        var leafArray2middleMeasuresColSlider12   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(test2middleMeasuresColSlider12);



        //  ROW   Product Family   Measures
        //  COLUMN   Customer Country     ONLY
        //  MEASURES  Store Sales

        var testObj5 = unitTest.obj5();
        var json = Object.toJSON(testObj5);
        this.DataProcessor.fn.loadTest(json);

        var testObj5Col10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        unitTest.checkObjCol10(testObj5Col10);
        var leafArrayObj5Col10   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj5Col10);

        var testObj5Col11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        unitTest.checkObjCol11(testObj5Col11);
        var leafArrayObj5Col11   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj5Col11);




        // Style 2   CROSSTAB
        // ROWS  1  level    Product Family
        // COLUMNS   {Customer Country,  Customer State, Customer City,   Measures}
        // Measures {Store Sales, Store Cost, Unit Sales}

        var testObj4 =  unitTest.obj4();
        var json = Object.toJSON(testObj4);
        this.DataProcessor.fn.loadTest(json);

        var testObj4Col10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        unitTest.checkObj4Col10(testObj4Col10);
        var leafArrayObj4Col10   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col10);


        var testObj4Col11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        unitTest.checkObj4Col11(testObj4Col11);
        var leafArrayObj4Col11   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col11);

        var testObj4Col12 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
        unitTest.checkObj4Col12(testObj4Col12);
        var leafArrayObj4Col12   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col12);

        // since  level 3 is the last non-measure level, this is the same as (1, 4)
        // so we can use the (1, 4)
        var testObj4Col13 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 3);
        unitTest.checkObj4Col14(testObj4Col13);
        var leafArrayObj4Col13   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col13);

        var testObj4Col14 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 4);
        unitTest.checkObj4Col14(testObj4Col14);
        var leafArrayObj4Col14   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col14);


        var datamapper = highchartsDataMapper;
        //var datamapper = new HighChartDataMapper(this.DataProcessor);


        //var testObj400ChartRes = datamapper.renderBasicColumnChart(0, 0);

        //var testObj413ChartRes = datamapper.renderBasicColumnChart(1, 3);

        var testObj400ChartRes = datamapper.getSeries(0, 0);

        var testObj413ChartRes = datamapper.getSeries(1, 3);



        //  ROW    Product Family
        //  COLUMNS   Measures, Customer Country, Customer State
        //  Measures:  Store Sales, Store Cost, Unit Sales

        var testObj6 =  unitTest.obj6();
        var json = Object.toJSON(testObj6);
        this.DataProcessor.fn.loadTest(json);

        var testObj6Col10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        var leafArrayObj6Col10 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj6Col10);


        var testObj6Col11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        var leafArrayObj6Col11 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj6Col11);

        var testObj6Col12 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
        var leafArrayObj6Col12 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj6Col12);



        //  STYLE  1   Measures on 1 Axis  All Groups on the other Axis
        //  ROW      Customer Country, Customer State
        //  COLUMNS   Measures only
        //  Measures:  Store Sales, Store Cost, Unit Sales

        var testObj7 =  unitTest.obj7();
        var json = Object.toJSON(testObj7);
        this.DataProcessor.fn.loadTest(json);

        var testObj7Col10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        var leafArrayObj7Col10 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj7Col10);

        var testObj7Row00 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(0, 0);
        var leafArrayObj7Row00 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj7Row00);

        datamapper =highchartsDataMapper;
        //datamapper = new HighChartDataMapper(this.DataProcessor);


        var testObj700ChartRes = datamapper.getSeries(0, 0);

        //var testPackageRow0Column0 =  this.DataProcessor.fn.getDataPackage(0, 0);




        var testObj8 =  unitTest.obj8();
        var json = Object.toJSON(testObj8);
        this.DataProcessor.fn.loadTest(json);

        var testObj8Col10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        var leafArrayObj8Col10 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj8Col10);

        var testObj8Col11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        var leafArrayObj8Col11 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj8Col11);

        var testObj8Col12 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
        var leafArrayObj8Col12 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj8Col12);



        var testObj8Row00 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(0, 0);
        var leafArrayObj8Row00 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj8Row00);


        datamapper = highchartsDataMapper;
        //datamapper = new HighChartDataMapper(this.DataProcessor);


        var testObj800ChartRes = datamapper.getSeries(0, 0);



        var here = 'here';


};


/*

HighChartUnitTests.prototype.run = function () {


        this.DataProcessor = new dataprocessor();
        var unitTest = new HighChartUnitTests();
        //var testObj = this.unitTest.obj2();
        var testObj = unitTest.obj2();

        //var testObj = this.DataProcessor.fn.obj2();
        var json = Object.toJSON(testObj);
        this.DataProcessor.fn.loadTest(json);

        var testRawTreeNodes = this.DataProcessor.fn.rawTreeNodeAxes;



        // total trees

        // rows
        // rowLevels:  "Product Family", "Measures"
        // colLevels: "Customer Country", "Customer City"

        // measureAxis = 0  rows
        // measures = "Store Sales

        var testSimpleTreeRowSlider0 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(0, 0);
        unitTest.checkObj2SimpleTreeRow00(testSimpleTreeRowSlider0);
        var leafArrayRowSlider0 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testSimpleTreeRowSlider0);


        var testSimpleTreeColSlider0 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        unitTest.checkObj2SimpleTreeCol00(testSimpleTreeColSlider0);
        var leafArrayColSlider0 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testSimpleTreeColSlider0);


        var testSimpleTreeRowSlider1 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(0, 1);
        unitTest.checkObj2SimpleTreeRow01(testSimpleTreeRowSlider1);
        var leafArraySimpleTreeRowSlider1   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testSimpleTreeRowSlider1);


        var testSimpleTreeColSlider11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        unitTest.checkObj2SimpleTreeCol11(testSimpleTreeColSlider11);
        var leafArraySimpleTreeColSlider11   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testSimpleTreeColSlider11);


        var testSimpleTreeColSlider12 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
        unitTest.checkObj2SimpleTreeCol12(testSimpleTreeColSlider12);
        var leafArraySimpleTreeColSlider12   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testSimpleTreeColSlider12);



        // ROW:  Product Family.
        // COLUMN:   Customer Country, {Store Sales, Unit Sales}, State  (with Country 'Mexico' filtered out for simplicity)     22
        // MEASURES:   {Store Sales, Unit Sales}
        //
        var testObj3 = unitTest.obj3();
        var json = Object.toJSON(testObj3);
        this.DataProcessor.fn.loadTest(json);

        var test2middleMeasuresColSlider10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        unitTest.check2middleMeasuresColSlider10(test2middleMeasuresColSlider10);
        var leafArray2middleMeasuresColSlider10   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(test2middleMeasuresColSlider10);

        var test2middleMeasuresColSlider11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        unitTest.check2middleMeasuresColSlider11(test2middleMeasuresColSlider11);
        var leafArray2middleMeasuresColSlider11   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(test2middleMeasuresColSlider11);

        var test2middleMeasuresColSlider12 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
        unitTest.check2middleMeasuresColSlider12(test2middleMeasuresColSlider12);
        var leafArray2middleMeasuresColSlider12   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(test2middleMeasuresColSlider12);



        //  ROW   Product Family   Measures
        //  COLUMN   Customer Country     ONLY
        //  MEASURES  Store Sales

        var testObj5 = unitTest.obj5();
        var json = Object.toJSON(testObj5);
        this.DataProcessor.fn.loadTest(json);

        var testObj5Col10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        unitTest.checkObjCol10(testObj5Col10);
        var leafArrayObj5Col10   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj5Col10);

        var testObj5Col11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        unitTest.checkObjCol11(testObj5Col11);
        var leafArrayObj5Col11   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj5Col11);


        // Style 2   CROSSTAB
        // ROWS  1  level    Product Family
        // COLUMNS   {Customer Country,  Customer State, Customer City,   Measures}
        // Measures {Store Sales, Store Cost, Unit Sales}

        var testObj4 =  unitTest.obj4();
        var json = Object.toJSON(testObj4);
        this.DataProcessor.fn.loadTest(json);

        var testObj4Col10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        unitTest.checkObj4Col10(testObj4Col10);
        var leafArrayObj4Col10   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col10);


        var testObj4Col11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        unitTest.checkObj4Col11(testObj4Col11);
        var leafArrayObj4Col11   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col11);

        var testObj4Col12 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
        unitTest.checkObj4Col12(testObj4Col12);
        var leafArrayObj4Col12   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col12);

        // since  level 3 is the last non-measure level, this is the same as (1, 4)
        // so we can use the (1, 4)
        var testObj4Col13 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 3);
        unitTest.checkObj4Col14(testObj4Col13);
        var leafArrayObj4Col13   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col13);

        var testObj4Col14 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 4);
        unitTest.checkObj4Col14(testObj4Col14);
        var leafArrayObj4Col14   = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj4Col14);


        var datamapper = new HighChartDataMapper(this.DataProcessor);


        var testObj400ChartRes = datamapper.renderBasicColumnChart(0, 0);

        var testObj413ChartRes = datamapper.renderBasicColumnChart(1, 3);




        //  ROW    Product Family
        //  COLUMNS   Measures, Customer Country, Customer State
        //  Measures:  Store Sales, Store Cost, Unit Sales

        var testObj6 =  unitTest.obj6();
        var json = Object.toJSON(testObj6);
        this.DataProcessor.fn.loadTest(json);

        var testObj6Col10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        var leafArrayObj6Col10 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj6Col10);


        var testObj6Col11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        var leafArrayObj6Col11 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj6Col11);

        var testObj6Col12 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
        var leafArrayObj6Col12 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj6Col12);



        //  STYLE  1   Measures on 1 Axis  All Groups on the other Axis
        //  ROW      Customer Country, Customer State
        //  COLUMNS   Measures only
        //  Measures:  Store Sales, Store Cost, Unit Sales

        var testObj7 =  unitTest.obj7();
        var json = Object.toJSON(testObj7);
        this.DataProcessor.fn.loadTest(json);

        var testObj7Col10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        var leafArrayObj7Col10 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj7Col10);

        var testObj7Row00 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(0, 0);
        var leafArrayObj7Row00 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj7Row00);


        datamapper = new HighChartDataMapper(this.DataProcessor);


        var testObj700ChartRes = datamapper.renderBasicColumnChart(0, 0);

        var testPackageRow0Column0 =  this.DataProcessor.fn.getDataPackage(0, 0);




        var testObj8 =  unitTest.obj8();
        var json = Object.toJSON(testObj8);
        this.DataProcessor.fn.loadTest(json);

        var testObj8Col10 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 0);
        var leafArrayObj8Col10 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj8Col10);

        var testObj8Col11 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 1);
        var leafArrayObj8Col11 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj8Col11);

        var testObj8Col12 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(1, 2);
        var leafArrayObj8Col12 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj8Col12);



        var testObj8Row00 = this.DataProcessor.fn.getSimpleTreeForSliderLevel(0, 0);
        var leafArrayObj8Row00 = this.DataProcessor.fn.getLeafArrayFromSimpleTree(testObj8Row00);



        datamapper = new HighChartDataMapper(this.DataProcessor);


        var testObj800ChartRes = datamapper.renderBasicColumnChart(0, 0);



        var here = 'here';


};
*/


// this is for losers !
// basic structure
//    non-sense data
/*
HighChartUnitTests.prototype.jsontest_01 =
'{ "data": [[1,2], [3,4]], ' +
  '"treenodes": [ {"label" : "rootx" , "level" : "0", "axisCoordinate" : "-1"},  ' +
  '                    {"label" : "rooty" , "level" : "0", "axisCoordinate" : "-1"}, ' +
  '                    ], ' +
  ' "metadata":  { {"axes": [ [ {"level": "Country"} ,{"level": "State"}, {"level": "City"} ], ' +
  '                                      [ {"level": "measures"} ] ' +
  '                                    ] ' +
  '                     },    ' +
  '                       {"measureAxis" : "y"}, ' +
  '                       {"measures" : [ {"name": "store cost"}] ' +
  '                                    } ' +
  '             } ' +
  '} '
;
*/

