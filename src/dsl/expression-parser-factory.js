import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {ExpressionParser} from '../dsl/expression-parser';
import peg from 'pegjs';

@inject(HttpClient)
export class ExpressionParserFactory {

  constructor(http) {
    http.configure(config => {
      config.useStandardConfiguration();
    });
    this.http = http;
  }

  createInstance(numericFieldList, stringFieldList, dateFieldList) {
    var that = this;
    return this.http
      .fetch('/parser_data/peg.js.grammar.txt')
      .then(response => response.text())
      .then(text=>{
        var parserText = text.replace('@S@', that.concatenateFieldList(stringFieldList))
          .replace('@N@', that.concatenateFieldList(numericFieldList))
          .replace('@D@', that.concatenateFieldList(dateFieldList));
        return new ExpressionParser(peg.buildParser(parserText));
      });
  }

  concatenateFieldList(fieldList){
    for (var i = 0; i < fieldList.length; i++) {
      fieldList[i] = '\'' + fieldList[i] + '\'i';
    }
    if (fieldList.length>0)
      return fieldList.join('/ ');
    else
      return "'unknown_field'"
  }
}

