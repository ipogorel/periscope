import lodash from 'lodash';

export class DataHelper {


  static getNumericFields(fields){
    return _.filter(fields, f => {
      if ((f.type == "number")||(f.type == "currency"))
        return f;
    });
  }
  static getStringFields(fields){
    return _.filter(fields,{type:"string"});
  }

  static getDateFields(fields){
    return _.filter(fields,{type:"date"});
  }

  static getFieldType(collection, fieldName) {
    var blankCount = 0;
    var result;
    for(var i=0; i< collection.length; i++){
      var val = collection[i][fieldName];
      if(val!=undefined){
        if (DataHelper.isString(val))
          result = "string";
        else if (DataHelper.isNumber(val)) {
          if (DataHelper.isCurrency(collection, fieldName))
            result = "currency";
          else
            result = "number";
        }
        else if (DataHelper.isDate(val))
          result = "date";
        return result;
      }
      else{
        blankCount++;
      }
      if(blankCount>300){
        return undefined;
      }
    }
  }

  static deserializeDates(jsonArray) {
    for(var r = 0; r< jsonArray.length; r++) {
      var jsonObj = jsonArray[r];
      for (var field in jsonObj) {
        if (jsonObj.hasOwnProperty(field)) {
          var value = jsonObj[field];
          if(value && typeof value == 'string' && value.indexOf('/Date')===0){
            jsonObj[field] = new Date(parseInt(value.substr(6)));
          }
        }
      }
    }
    return jsonArray;
  }

  static isCurrency(collection, fieldName){
    if ((collection.length===0)||(!fieldName))
      return false;
    var largeValues =_.filter(collection, x=> (Math.abs(x[fieldName])>=1000)).length;
    if ((largeValues/collection.length)> 0.4)
      return true;
    return false;
  }

  static isDate(value)
  {
    return ((new Date(value) !== "Invalid Date" && !isNaN(new Date(value))));
  }

  static isString(value)
  {
    return (typeof value === 'string' || value instanceof String);
  }

  static isNumber(value)
  {
    return (typeof value === 'number');
  }
}
