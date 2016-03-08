import {DataHelper} from '../helpers/data-helper';
import {StringHelper} from '../helpers/string-helper';

export class DslExpressionManager {

  constructor(parser, intelliSenceData, intelliSenceFields) {
    this.data = intelliSenceData;
    this.fields = intelliSenceFields;
    this.parser = parser;
  }

  populate(searchStr) {
    let parserError = this.getParserError(searchStr);
    if (parserError!=null)
      return this._getIntellisenseData(searchStr, parserError);
    return [];
  }

  parse(searchStr){
    var expression = this.parser.parse(searchStr);
    return this._normalizeSerachExpression(expression);
  }

  validate(searchStr) {
    return this.parser.validate(searchStr);
  }

  expectedToken(searchStr) {
    let tokenName = "";
    let parserError = this.getParserError(searchStr);
    if (parserError!=null)
      tokenName = this._interpreteParserError(parserError);
    return tokenName;
  }


  getParserError(searchStr)
  {
    let result = null;
    if (searchStr!="")
    {
      try {
        this.parse(searchStr);
        try{
          this.parse(searchStr + "^");
        }
        catch(ex2){
          result = ex2;
        }
      }
      catch (ex) {
        result = ex;
      }
    }
    return result;
  }

  _getIntellisenseData (searchStr, pegException) {
    let tokenName = this._interpreteParserError(pegException);
    let type='';
    let result = [];
    let lastFldName = '';
    switch (tokenName) {
      case "STRING_FIELD_NAME":
      case "NUMERIC_FIELD_NAME":
      case "DATE_FIELD_NAME":
        result = this.fields;
        type = "field";
        break;
      case "STRING_OPERATOR_EQUAL":
      case "STRING_OPERATOR_IN":
        result = this._getStringComparisonOperatorsArray();
        type = "operator";
        break;
      case "STRING_VALUE":
      case "STRING_PATTERN":
        lastFldName = this._getLastFieldName(searchStr, this.fields, pegException.column);
        if (lastFldName != "")
          result = this._getFieldValuesArray(lastFldName);
        type = "string";
        break;
      case "STRING_VALUES_ARRAY":
        lastFldName = this._getLastFieldName(searchStr, this.fields, pegException.column);
        if (lastFldName != "")
          result = this._getFieldValuesArray(lastFldName);
        type = "array_string";
        break;
      case "OPERATOR":
        result = this._getComparisonOperatorsArray();
        type = "operator";
        break;
      case "LOGIC_OPERATOR":
        result = this._getLogicalOperatorsArray();
        type = "operator";
        break;
      case "end of input":
        result = this._getLogicalOperatorsArray();
        type = "operator";
        break;
    }
    return this._normalizeDataSource(type, result);
  }

  _interpreteParserError(ex){
    if (Object.prototype.toString.call(ex.expected) == "[object Array]") {
      for (let desc of ex.expected) {
        if ((desc.type == "other")||(desc.type == "end")) {//"FIELD_NAME" "OPERATOR" "FIELD_VALUE", "LOGIC_OPERATOR"
          return desc.description;
        }
      }
    }
    return "";
  }



  _getLogicalOperatorsArray() {
    return (["and", "or"]);
  }

  _getComparisonOperatorsArray() {
    return (["!=", "=", ">", "<", ">=", "<="])
  }

  _getLastFieldName(searchStr, fieldsArray, index) {

    var tmpArr = searchStr.substr(0, index).split(" ");
    for (let i=(tmpArr.length-1); i>=0; i--)  {
      if (fieldsArray.findIndex(x=>x == tmpArr[i].trim())>=0)
        return tmpArr[i].trim();
    }
    return "";

  }

  _getStringComparisonOperatorsArray() {
    return (["=", "in"]);
  }


  _getFieldValuesArray(fieldName) {
    var res = [];
    if (this.data!==undefined) {
      for (var i=0; i< this.data.length; i++) {
        var row = this.data[i];
        var val = row[fieldName];
        if (val && (res.indexOf(val)<0))
          res.push(val);
      }
    }
    return res.sort();
  }

  _normalizeDataSource(type, dataArray)
  {
    let res = [];
    for (let d of dataArray) {
      res.push({ type: type, value: d });
    }
    return res;
  }

  _normalizeSerachExpression(searchExpression){
    var expr = new RegExp('record.([a-zA-Z0-9\%\_\-]*)', 'g');
    var match;
    while ((match = expr.exec(searchExpression)) !== null) {
      for (let fld of this.fields){
        if (match[1].toLowerCase()===fld.toLowerCase())
            searchExpression = StringHelper.replaceAll(searchExpression, match[0], 'record.' + fld);
      }
    }
    return searchExpression;
  }


}
