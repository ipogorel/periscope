import {DataHelper} from '../helpers/data-helper';
import {StringHelper} from '../helpers/string-helper';
import lodash from 'lodash';

export class DslExpressionManager {

  constructor(parser, dataHolder, fieldsList) {
    this.dataHolder = dataHolder;
    this.fields = fieldsList;
    this.parser = parser;
  }

  populate(searchStr, lastWord) {
    let parserError = this.getParserError(searchStr);
    return this._getIntellisenseData(searchStr, lastWord, parserError);
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

  _getIntellisenseData (searchStr, lastWord, pegException) {
    let type='';
    let result = [];
    let lastFldName = '';

    if (!pegException)
      return new Promise((resolve, reject)=>{ resolve([])});

    let tokenName = this._interpreteParserError(pegException);
    return new Promise((resolve, reject)=>{
      switch (tokenName) {
        case "STRING_FIELD_NAME":
        case "NUMERIC_FIELD_NAME":
        case "DATE_FIELD_NAME":
          var filteredFields = lastWord? _.filter(this.fields,f=>{return f.startsWith(lastWord)}) : this.fields;
          resolve(this._normalizeData("field", filteredFields.sort()));
          break;
        case "STRING_OPERATOR_EQUAL":
        case "STRING_OPERATOR_IN":
          resolve(this._normalizeData("operator", this._getStringComparisonOperatorsArray()));
          break;
        case "STRING_VALUE":
        case "STRING_PATTERN":
          lastFldName = this._getLastFieldName(searchStr, this.fields, pegException.column);
          this._getFieldValuesArray(lastFldName, lastWord).then(data=>{
            resolve(this._normalizeData("string", data))
          });
          break;
        case "STRING_VALUES_ARRAY":
          lastFldName = this._getLastFieldName(searchStr, this.fields, pegException.column);
          this._getFieldValuesArray(lastFldName, lastWord).then(data=>{
            resolve(this._normalizeData("array_string", data))
          });
          break;
          resolve(this._normalizeData("array_string", []));
          break;
        case "OPERATOR":
          resolve(this._normalizeData("operator", this._getComparisonOperatorsArray()));
          break;
        case "LOGIC_OPERATOR":
        case "end of input":
          resolve(this._normalizeData("operator", this._getLogicalOperatorsArray()));
          break;
        default:
          resolve([]);
          break;
      }
    });

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


  _getFieldValuesArray(fieldName, lastWord) {
    this.dataHolder.take = 100;
    this.dataHolder.skip = 0;
    if (lastWord)
      this.dataHolder.query.serverSideFilter = this.parse(fieldName + " = '" + lastWord + "%'");
    else
      this.dataHolder.query.serverSideFilter ="";
    this.dataHolder.fields = [fieldName];
    return this.dataHolder.load().then(d=>{
      var result = _.map(this.dataHolder.data,fieldName);
      return _.uniq(result).sort();
    })
  }

  _normalizeData(type, dataArray) {
    return _.map(dataArray,d=>{ return { type: type, value: d }});
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
