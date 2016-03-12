import {inject} from 'aurelia-framework';
import {DataHelper} from '../helpers/data-helper';
import lodash from 'lodash';
import {DslExpressionManager} from '../dsl/dsl-expression-manager';
import {ExpressionParserFactory} from '../dsl/expression-parser-factory';

@inject(ExpressionParserFactory)
export class DslExpressionManagerFactory {

  constructor(expressionParserFactory) {
    this.expressionParserFactory = expressionParserFactory;
  }

  createInstance(dataHolder, fields) {
      var allFields = _.map(fields,"field");
      var numericFields = _.map(DataHelper.getNumericFields(fields),"field");
      var stringFields = _.map(DataHelper.getStringFields(fields),"field");
      var dateFields = _.map(DataHelper.getDateFields(fields),"field");
      return this.expressionParserFactory
        .createInstance(numericFields, stringFields, dateFields)
        .then(parser=>{
          return new DslExpressionManager(parser, dataHolder, allFields);
        });
  }
}
