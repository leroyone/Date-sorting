function realLastRow (sheet, theCol) {
  
  var colData = sheet.getRange(1, theCol, sheet.getLastRow(), 1).getValues();
  var filtered = colData.filter(String);
  var lastStringed = filtered[filtered.length-1];
  var last = colData.lastIndexOf(lastStringed);
  return last;
  
}


function getColByName(sheet, name){
  var headers = sheet.getDataRange().getValues().shift();
  var colindex = headers.indexOf(name);
  return colindex+1;
}


function getColDataByName(sheet, name){
  
  var col = getColByName(sheet, name);  
  var row = realLastRow(sheet, col);
  var colData = sheet.getRange(2,col, row, 1).getValues().map(function(r){return r[0]});
  
  return colData;
  
}