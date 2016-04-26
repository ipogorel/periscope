import {inject} from 'aurelia-framework';
import * as _ from 'lodash';
import {DataHelper} from './../helpers/data-helper';
import {DslExpressionManager} from './../dsl/dsl-expression-manager';
import {ExpressionParserFactory} from './../dsl/expression-parser-factory';

@inject(ExpressionParserFactory)
export class DslExpressionManagerFactory {

  constructor(expressionParserFactory) {
    this.expressionParserFactory = expressionParserFactory;
  }

  createInstance(dataSource, fields) {
    return dataSource.transport.readService.getSchema().then(schema=>{
      let fields = schema.fields;
      var allFields = _.map(fields,"field");
      var numericFields = _.map(DataHelper.getNumericFields(fields),"field");
      var stringFields = _.map(DataHelper.getStringFields(fields),"field");
      var dateFields = _.map(DataHelper.getDateFields(fields),"field");
      let parser = this.expressionParserFactory.createInstance(numericFields, stringFields, dateFields);
      return new DslExpressionManager(parser, dataSource, allFields);
    })

  }
}
