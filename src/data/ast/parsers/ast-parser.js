export class AstParser{
  constructor(){
    this._clientSide = "clientSide";
    this._serverSide = "serverSide";
  }
  get type(){}
  getFilter(astTree){
    return {};
  }
}


/*
Parser should return the tree as follows
 [
 {
 "left": {
 "field": "Fs",
 "type": "string",
 "operand": "=",
 "value": "ss1"
 },
 "right": {
 "left": {
 "field": "Fs",
 "type": "string",
 "operand": "=",
 "value": "ss2"
 },
 "right": {
 "left": {
 "field": "Fs",
 "type": "string",
 "operand": "=",
 "value": "ss3"
 },
 "right": {
 "left": {
 "field": "Fs",
 "type": "string",
 "operand": "=",
 "value": "ss4"
 },
 "right": {
 "field": "Fn",
 "type": "number",
 "operand": "=",
 "value": "3",
 "connector": " && "
 },
 "connector": " || "
 },
 "connector": " || "
 },
 "connector": " || "
 }
 }
 ]
*/

