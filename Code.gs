function populateDates() {
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spread.getSheetByName("Slots");
  sheet.getRange(2, 1, 200, 3).clearContent();
  var times = sheet.getRange(3,5,10,1).getValues().map(function(r){return r[0]});
  var days = sheet.getRange(2,6,1,7).getValues()[0];
  
  var bs = sheet.getRange(3,6,10,7).getValues();
  var bsVals = fillEm("B", bs, days, times);
  if(bsVals.length > 0){
    var bFill = sheet.getRange(2, 1, bsVals.length, 1);
    bFill.setValues(bsVals);
  }
  
  var as = sheet.getRange(3,15,10,7).getValues();
  var asVals = fillEm("A", as, days, times);
  if(asVals.length > 0){
    var aFill = sheet.getRange(2, 2, asVals.length, 1);
    aFill.setValues(asVals);
  }
  
  var ss = sheet.getRange(3,24,10,7).getValues();
  var ssVals = fillEm("S", ss, days, times);
  if(ssVals.length > 0){
    var sFill = sheet.getRange(2, 3, ssVals.length, 1);
    sFill.setValues(ssVals);
  }

}


function fillEm(level, levelRange, days, times){ 
  
  var studentsPerLesson = 2;
  
  var slots = [[],[],[],[],[],[],[]];
  for(var time=0; time<levelRange.length; time++){
    for(var day=0; day<levelRange[time].length; day++){
      var slot = days[day] + times[time];
      var slotValue = levelRange[time][day];
      
      if (slotValue>0 && checkEm(level, slot) < studentsPerLesson*slotValue){
        slots[day].push(slot);
      }
    }
  }
  var allSlots = [].concat.apply([], slots);
  return allSlots.map(function(e){return [e]});
}


function checkEm(checkLevel, checkSlot){
  
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spread.getSheetByName("Students");
  var level = getColDataByName(sheet, "Level");
  var toCheckA = getColDataByName(sheet, "First Lesson");
  var toCheckB = getColDataByName(sheet, "Second Lesson");
  var mergeSlot = checkLevel+checkSlot;
  var mergeCheck = [];
  for(var i=0; i<toCheckA.length; i++){
    mergeCheck.push(level[i]+toCheckA[i]);
    mergeCheck.push(level[i]+toCheckB[i]);
  }
  Logger.log(mergeSlot);
  Logger.log(mergeCheck);
  count = 0;
  for(var i=0; i<mergeCheck.length; i++){
    if(mergeCheck[i] == mergeSlot){
      count++
    }
  }
  Logger.log(count);
  return count;
}



function checkEmAlone(studLevel="B"){
  
  var studentsPerLesson = 2;
  
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  var studentSheet = spread.getSheetByName("Students");
  var slotsSheet = spread.getSheetByName("Slots");
  
  var allLevels = getColDataByName(studentSheet, "Level");
  var toCheckA = getColDataByName(studentSheet, "First Lesson");
  var toCheckB = getColDataByName(studentSheet, "Second Lesson");
  var mergeSlots = getColDataByName(slotsSheet, studLevel).map(function(e){ return studLevel + e});
  
  var mergeCheck = [];
  for(var i=0; i<toCheckA.length; i++){
    mergeCheck.push(allLevels[i]+toCheckA[i]);
    mergeCheck.push(allLevels[i]+toCheckB[i]);
  }
  Logger.log(mergeSlots);
  Logger.log(mergeCheck);
  count = 0;
  for(var i=0; i<mergeCheck.length; i++){
    if(mergeCheck[i] == mergeSlots){
      count++
    }
  }
  Logger.log(count);
  return count < studentsPerLesson;
}
