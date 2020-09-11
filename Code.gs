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
  
  var studentsPerLesson = 7;
  
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

function levelCheckDates(theDate, available, daysOfTheWeek, availableSorted){
  var theMonth = new Date(theDate);
  theMonth.setDate(theDate.getDate() - theDate.getDate() + 1);
  var theEnd = theDate.getMonth();
  var allSlots = [];
  for(theMonth; theMonth.getMonth() == theEnd; theMonth.setDate(theMonth.getDate()+1)){
    var theDay = theMonth.getDay();
    var theSlots = availableSorted[theDay];
    if(theSlots != ""){
      for(i=0;i<theSlots.length;i++){
        allSlots.push([daysOfTheWeek[theDay] + " " + theSlots[i] + " (" + theMonth.toString().slice(4,10) + ")"]);
      }
    }
  }
  return allSlots;
}


function fillLevelCheckForMonths(){
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  var levelChSheet = spread.getSheetByName("Level Checks");
  var available = levelChSheet.getRange(2,1,realLastRow(levelChSheet, 1),2).getValues();
  var monthsOfTheYear = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var daysOfTheWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var availableSorted = [[],[],[],[],[],[],[]];
  for(each=0;each<available.length;each++){
    var itsDax = daysOfTheWeek.indexOf(available[each][0]);
    if(itsDax >= 0){
      availableSorted[itsDax].push(available[each][1]);
    }
  }
  var monthsToFill = getColDataByName(levelChSheet, "Months to fill");
  for(i=0;i<monthsToFill.length;i++){
    var whichMonth = monthsOfTheYear[monthsToFill[i].getMonth()];
    var monthsSlots = levelCheckDates(monthsToFill[i], available, daysOfTheWeek, availableSorted);
    Logger.log(monthsSlots);
    levelChSheet.getRange(2, getColByName(levelChSheet, whichMonth),100,1).clearContent();
    var putRange = levelChSheet.getRange(2, getColByName(levelChSheet, whichMonth),monthsSlots.length,1);
    putRange.setValues(monthsSlots);
  }
}


function nextWeek(){
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  var lessonFiles = spread.getSheetByName("Lesson Files");
  var getMe = lessonFiles.getRange(3, 1, 1, 2).getValues();
  var putMe = lessonFiles.getRange(2, 1, 1, 2);
  putMe.setValues(getMe);
}

function eightDates(whichRow){
  var theSpread = SpreadsheetApp.getActiveSpreadsheet();
  var makeUpSheet = theSpread.getSheetByName("Make Up Slots");
  var studSheet = theSpread.getSheetByName("Students");
  var checkDate = makeUpSheet.getRange(1,27).getValue();
  var thisWeek = new Date();
  var lessons = studSheet.getRange(whichRow, getColByName(studSheet, "First Lesson"),1,2).getValues()[0];
  if(lessons[0].length<2 || lessons[1].length<2){
    return;
  }
  var put = studSheet.getRange(whichRow, getColByName(studSheet, "8 dates"));
  var attendancePut = studSheet.getRange(whichRow, getColByName(studSheet, "Attendance"));
  put.clearContent();
  var daysOfTheWeek = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  //Logger.log(put.getValue());
  //Logger.log(lessons);
  var diff = thisWeek.getDay()-1;
  thisWeek.setDate(thisWeek.getDate() - diff);
  thisWeek.setHours(0,0,0,0);
  //Logger.log("This code works to compare to todays date");
  //Logger.log(thisWeek.toString());
  //Logger.log(checkDate);
  //Logger.log(thisWeek.toString() == checkDate);
  thisWeek.setDate(thisWeek.getDate() + 7);
  var putStuffHere = "";
  var attendanceStuffHere = "";
  for(i=0;i<4;i++){
    for(x=0;x<2;x++){
      var diff = (7*i)+daysOfTheWeek.indexOf(lessons[x].slice(0,3))
      thisWeek.setDate(thisWeek.getDate()+diff);
      putStuffHere = putStuffHere + lessons[x] + " (" + thisWeek.toString().slice(4,10) + "),";
      thisWeek.setDate(thisWeek.getDate()-diff);
      attendanceStuffHere = attendanceStuffHere + "false,"
    }
  }
  put.setValue(putStuffHere.slice(0,-1));
  attendancePut.setValue(attendanceStuffHere);
}


function dailyAttendanceMaker(){
  var theSpread = SpreadsheetApp.getActiveSpreadsheet();
  var studSheet = theSpread.getSheetByName("Students");
  var attendanceColumn = getColByName(studSheet, "Attendance");
  var startRow = 70;
  var allAttendances = studSheet.getRange(startRow, attendanceColumn, studSheet.getLastRow()-startRow+1 ,1).getValues().map(function(r){return r[0]});
  Logger.log(allAttendances);
  var allRowsToDo = [];
  for(i=0;i<allAttendances.length;i++){
    if(!allAttendances[i]){
      allRowsToDo.push(i+startRow);
    }
  }
  allRowsToDo.forEach(eightDates);
}


function fixAttendance(theString){
  var broken = theString.split(",");
  broken.shift();
  broken.shift();
  if(broken.length>6){
    broken.pop();
  }
  broken.push("false");
  broken.push("false");
  var fixed = broken.join();
  return fixed;
}


function weeklyAttendanceUpdater(){
  var startRow = 70;
  var aDate = new Date();
  aDate.setDate(aDate.getDate()+4);
  var thisWeek = whichWeek(aDate);
  var theSpread = SpreadsheetApp.getActiveSpreadsheet();
  var studSheet = theSpread.getSheetByName("Students");
  var attendanceColumn = getColByName(studSheet, "Attendance");
  var putDates = studSheet.getRange(startRow, getColByName(studSheet, "This Weeks MU"), studSheet.getLastRow()-startRow+1 ,1);
  var putMUDs = studSheet.getRange(startRow, getColByName(studSheet, "MUD1")+thisWeek, studSheet.getLastRow()-startRow+1 ,1);
  var putMUSlots = studSheet.getRange(startRow, getColByName(studSheet, "MU1")+thisWeek, studSheet.getLastRow()-startRow+1 ,1);
  var putAttendances = studSheet.getRange(startRow, attendanceColumn, studSheet.getLastRow()-startRow+1 ,1);
  
  var allAttendances = putAttendances.getValues().map(function(r){return r[0]});
  var allMUSlots = putMUSlots.getValues().map(function(r){return r[0]});
  var resetMe = [];
  var forAttendance = [];
  var forThisWeekDates = [];
  for(i=0;i<allAttendances.length;i++){
    resetMe.push(i+startRow);
    forAttendance.push([fixAttendance(allAttendances[i])]);
    forThisWeekDates.push([allMUSlots[i]]);
  }
  resetMe.forEach(eightDates);
  putDates.setValues(forThisWeekDates);
  putAttendances.setValues(forAttendance);
  putMUDs.clearContent();
  putMUSlots.clearContent();
}
