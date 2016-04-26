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
      let allFields = _.map(fields,"field");
      let numericFields = _.map(DataHelper.getNumericFields(fields),"field");
      let stringFields = _.map(DataHelper.getStringFields(fields),"field");
      let dateFields = _.map(DataHelper.getDateFields(fields),"field");
      let parser = this.expressionParserFactory.createInstance(numericFields, stringFields, dateFields);
      return new DslExpressionManager(parser, dataSource, allFields);
    })

  }
}
