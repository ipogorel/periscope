import * as peg from 'pegjs';

export class ExpressionParser {

  constructor(grammarText) {
    this.parser =  peg.buildParser(grammarText);
  }

  parse(searchString) {
    return this.parser.parse(searchString);
  }

  validate(searchString) {
    try{
      this.parser.parse(searchString);
      return true;
    }
    catch(ex) {
      return false;
    }
  }
}
