function populateDates() {
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  var entrySheet = spread.getSheetByName("Available");
  var putSheet = spread.getSheetByName("Slots");
  var makeupSheet = spread.getSheetByName("Make Ups");
  putSheet.getRange(2, getColByName(putSheet,"BSlots"), 200, 6).clearContent();
  makeupSheet.getRange(2, getColByName(makeupSheet,"BSlots"), 200, 6).clearContent();
  var times = entrySheet.getRange(3,1,12,1).getValues().map(function(r){return r[0]});
  var days = entrySheet.getRange(2,2,1,7).getValues()[0];
  
  var bs = entrySheet.getRange(3,2,12,7).getValues();
  var bsVals = fillEm(bs, days, times);
  if(bsVals.length > 0){
    var bFill = putSheet.getRange(2, getColByName(putSheet,"BSlots"), bsVals.length, 2);
    bFill.setValues(bsVals);
  }
  var bsValsMakeUp = fillEmMakeUps(bs, days, times);
  if(bsValsMakeUp.length > 0){
    var bFillMakeUp = makeupSheet.getRange(2, getColByName(makeupSheet,"BSlots"), bsValsMakeUp.length, 2);
    bFillMakeUp.setValues(bsValsMakeUp);
  }
  
  var as = entrySheet.getRange(19,2,12,7).getValues();
  var asVals = fillEm(as, days, times);
  if(asVals.length > 0){
    var aFill = putSheet.getRange(2, getColByName(putSheet,"ASlots"), asVals.length, 2);
    aFill.setValues(asVals);
  }
  var asValsMakeUp = fillEmMakeUps(as, days, times);
  if(asValsMakeUp.length > 0){
    var aFillMakeUp = makeupSheet.getRange(2, getColByName(makeupSheet,"ASlots"), asValsMakeUp.length, 2);
    aFillMakeUp.setValues(asValsMakeUp);
  }
  
  var ss = entrySheet.getRange(35,2,12,7).getValues();
  var ssVals = fillEm(ss, days, times);
  if(ssVals.length > 0){
    var sFill = putSheet.getRange(2, getColByName(putSheet,"SSlots"), ssVals.length, 2);
    sFill.setValues(ssVals);
  }
  var ssValsMakeUp = fillEmMakeUps(ss, days, times);
  if(ssValsMakeUp.length > 0){
    var sFillMakeUp = makeupSheet.getRange(2, getColByName(makeupSheet,"SSlots"), ssValsMakeUp.length, 2);
    sFillMakeUp.setValues(ssValsMakeUp);
  }
}


function fillEm(levelRange, days, times){
  
  var studentsPerLesson = 6;
  
  var slots = [[],[],[],[],[],[],[]];
  for(var time=0; time<levelRange.length; time++){
    for(var day=0; day<levelRange[time].length; day++){
      var slot = days[day] + times[time];
      var slotValue = levelRange[time][day];
      
      if (slotValue>0){
        slots[day].push([slot,slotValue*studentsPerLesson]);
      }
    }
  }
  var allSlots = [].concat.apply([], slots);
  return allSlots;
}


function fillEmMakeUps(levelRange, days, times){
  
  var studentsPerLesson = 2;
  
  var slots = [[],[],[],[],[],[],[]];
  for(var time=0; time<levelRange.length; time++){
    for(var day=0; day<levelRange[time].length; day++){
      var slot = days[day] + times[time];
      var slotValue = levelRange[time][day];
      
      if (slotValue>0){
        slots[day].push([slot,slotValue*studentsPerLesson]);
      }
    }
  }
  var allSlots = [].concat.apply([], slots);
  return allSlots;
}


function addAllMakeUp(){
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  var makeupSheet = spread.getSheetByName("Make Ups");
  var days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  var levels = ["B","A","S"];
  levels.forEach(function(eachLevel){
    switch(eachLevel){
    case "B":
      var get = 1;
      var put = 11;
      break;
    case "A":
      var get = 3;
      var put = 64;
      break;
    case "S":
      var get = 5;
      var put = 117;
      break;
    }
    var levelDates = makeupSheet.getRange(1, put, 1, 52).getValues()[0];
    var available = makeupSheet.getRange(2,get,realLastRow(makeupSheet, get),2).getValues();
    var allForLevel = available.map(function(r){return r[0]});
    for(i=put;i<levelDates.length+put;i++){
      makeupSheet.getRange(2,i,100,1).clearContent();
      var goose = allForLevel.map(function(r){
        var newDate = new Date(levelDates[i-put].getTime());
        Logger.log(newDate);
        newDate.setDate(newDate.getDate()+days.indexOf(r.slice(0,3)));
        Logger.log(newDate);
        return [r + " (" + newDate.toString().slice(4,10) + ")"];
      });
      var putRange = makeupSheet.getRange(2,i,goose.length,1);
      putRange.setValues(goose);
    }
  });
}



function switchDates(){
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  var theCells = spread.getActiveSheet().getActiveRange();  
  var dates = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  var fixed = [];
  theCells.getValues().forEach(function onEachDate(each){if(dates.indexOf(each[0].split(" ")[0]) > dates.indexOf(each[1].split(" ")[0])){fixed.push([each[1],each[0]]);} else if(dates.indexOf(each[0].split(" ")[0]) == dates.indexOf(each[1].split(" ")[0]) && each[0].split(" ")[1]>(each[1].split(" ")[1])){fixed.push([each[1],each[0]]);} else {fixed.push(each);}});
  theCells.setValues(fixed);
}

function onEdit(e) {
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  var theSheet = spread.getSheetByName("Students");
  var theCol = getColByName(theSheet, "isvalid");
  var theCells = theSheet.getRange(2,theCol,21,1);
  if (
    e.source.getSheetName() == "Students" &&
    e.range.columnStart == theCol &&
    e.range.columnEnd == theCol &&
    e.range.rowStart >= 2 &&
    e.range.rowEnd <= 21
  ) {
    theCells.clearContent();
  }
}

