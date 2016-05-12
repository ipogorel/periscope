import {Grammar} from './grammar';
import {DataHelper} from './../../helpers/data-helper';

const DSL_GRAMMAR_TREE = `
{
  function findFirstLeftStatement(arr) {
    if ( Array.isArray(arr) ) {
      return findFirstLeftStatement(arr[0]["left"]);
    } else if ( typeof arr === "object" ) {
        return arr;
    }
  }

  function inject(arr, connector) {
    findFirstLeftStatement(arr)["connector"] = connector;
    return arr;
  }
  
  function createInExpression (fieldname, value) {
    var result = []
    var values = value.split(',');
    for (var i=0;i<values.length;i++){
    	if (i!=0)
    		result.push({field:fieldname, type:'string' ,value:values[i]});
        else
            result.push({field:fieldname, type:'string' ,value:values[i], connector:" || "});
    }
    return result;
  }
}

//Start = statement *
Start
  = st:statement  {return [st]}  
  
statement
  = left:block cnct:connector right:statement 
    { return { left: left, right: inject(right, cnct) }; }
  / left: block 
    { return left; }
    
block
  = pOpen block:statement* pClose space?
    { return block; }
  / block:condition space?
    { return block; }
    
condition = space? f:stringField o:op_eq v:stringValue 
			{return {field:f, type:"string", operand:o, value:v}}
            / space? f:stringField o:op_in a:valuesArray 
            {return createInExpression(f,a)}            
			/ space? f:numericField o:op v:numericValue 
            {return {field:f, type:"number", operand:o, value:v}}
          	/ space? f:dateField o:op v:dateValue
          {return {field:f, type:"date", operand:o, value:v}}

connector "LOGIC_OPERATOR"
    = cn:(or / and) 
      { return cn.toString(); }
      
and = space* "and"i space* {return " && ";}

or = space* "or"i space* {return " || ";}

valuesArray "STRING_VALUES_ARRAY"
      = pOpen va:$(v:stringValue space* nextValue*)+ pClose {return  va }
      
nextValue = nv:(space* "," space* v:stringValue) {return  nv}      

dateValue "DATE_VALUE"
        = quote? dt:$(date+) quote? {return dt;}


stringValue  "STRING_VALUE"
	  = quote w:$(char+) quote {return  w }
      / quote quote {return "";}


numericValue  "NUMERIC_VALUE"
       = $(numeric+)

op "OPERAND"
   = op_eq
   / ge
   / gt
   / le
   / lt

op_eq "STRING_OPERATOR_EQUAL"
  = eq
  / not_eq

op_in "STRING_OPERATOR_IN"
  = in

eq = space* "=" space* {return "==";}

not_eq = space* "!=" space* {return "!=";}

gt = space* v:">" space* {return v;}

ge = space* v:">=" space* {return v;}

lt = space* v:"<" space* {return v;}

le = space* v:"<=" space* {return v;}

in = space* v:"in" space* {return v;}


date = [0-9\\:\\/]

char = [a-z0-9 \\%\\$\\_\\-\\:\\,\\.\\/]i

numeric = [0-9-\\.]

space = [ \\t\\n\\r]+

pOpen = [\\(] space*

pClose = space* [\\)]

field "FIELD_NAME"
      = stringField
     / numericField
     / dateField

stringField "STRING_FIELD_NAME"
     = @S@

numericField "NUMERIC_FIELD_NAME"
     = @N@

dateField "DATE_FIELD_NAME"
     = @D@

quote = [\\'\\"]
`;


export class GrammarTree extends Grammar {
  constructor(dataFields){
    super();
    this.text = DSL_GRAMMAR_TREE;
    this.dataFields = dataFields;
  }

  getGrammar(){
    let stringFieldList = _.map(DataHelper.getStringFields(this.dataFields),"field");
    let numericFieldList = _.map(DataHelper.getNumericFields(this.dataFields),"field");
    let dateFieldList = _.map(DataHelper.getDateFields(this.dataFields),"field");
    let parserText = this.text.replace('@S@', this._concatenateFields(stringFieldList))
      .replace('@N@', this._concatenateFields(numericFieldList))
      .replace('@D@', this._concatenateFields(dateFieldList));
    return parserText;
  }

  _concatenateFields(fieldList){
    for (var i = 0; i < fieldList.length; i++) {
      fieldList[i] = '\'' + fieldList[i] + '\'i';
    }
    if (fieldList.length>0)
      return fieldList.join('/ ');
    else
      return "'unknown_field'"
  }
}

