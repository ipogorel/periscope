import {Decorators} from 'aurelia-framework';
import $ from 'jquery';
import {SearchBox} from './../search-box';
import {StringHelper} from './../../../helpers/string-helper';
import {ExpressionParser} from './../../../dsl/parser';
import {GrammarExpression} from './../../../dsl/grammar/grammar-expression';
import {GrammarTree} from './../../../dsl/grammar/grammar-tree';
import {IntellisenceManager} from './../../../dsl/intellisence-manager';


export class DefaultSearchBox extends SearchBox {
  constructor(settings){
    super(settings);

    this._isValid = true;
    this._caretPosition = 0;

    this._separators = [" ",","];
    this._specialSymbols= ["'","(",")","\""];

    this._timer;

    this._suggestionsListSettings = {
      title:'',
      suggestions:[],
      focusedSuggestion: -1,
      displaySuggestions: false,
      lastWord: ''
    }
  }

  get parser (){
    return this._parser;
  }
  set parser(value){
    this._parser = value;
  }

  get expressionManager (){
    return this._expressionManager;
  }
  set expressionManager(value){
    this._expressionManager = value;
  }

  get selectedSuggestion (){
    return this._selectedSuggestion;
  }

  set selectedSuggestion (value){
    if (this._selectedSuggestion  != value) {
      this._selectedSuggestion = value;
      this.select(this._selectedSuggestion)
    }
  }


  get suggestionsListSettings(){
    return this._suggestionsListSettings;
  }
  set suggestionsListSettings(value){
    this._suggestionsListSettings = value;
  }

  get isValid() {
    if ((this.searchString==='')||(!this.parser))
      return true;
    return this.parser.validate(this.searchString);
  }

  refresh(){
    super.refresh();
    var self = this;

    this.dataSource.transport.readService.getSchema().then(schema=>{
      let allFields = _.map(schema.fields,"field");
      //let grammar = new GrammarExpression(schema.fields);
      let grammar = new GrammarTree(schema.fields);
      self.parser = new ExpressionParser(grammar.getGrammar());
      self.expressionManager = new IntellisenceManager(self.parser, self.dataSource, allFields);
      self.restoreState();
      if (self.state)
        self.suggestionsListSettings.displaySuggestions = false;
    });
  }
  
  
  get searchString(){
    return this._searchString;
  }
  set searchString(value){
    if (this._searchString != value) {
      this._searchString = value;
      this.populateSuggestions(value);
      if (this.isValid) {
        this.notifySearchCriteriaChanged();
      }
    }
  }

  get caretPosition(){
    return this._caretPosition;
  }

  set caretPosition(value){
    //$(this.searchBox)[0].selectionStart = value;
    //$(this.searchBox)[0].selectionEnd = value;
    if (value != this._caretPosition) {
      var self = this;
      self._caretPosition = value;
      $(self.searchBox)[0].focus();
      window.setTimeout(()=> {
        $(self.searchBox)[0].setSelectionRange(value, value);
      }, 400);
    }
  }

  attached(){
    var self = this;
    $(this.searchBox)[0].addEventListener("keydown", function (e) {
      if (e.keyCode==40) {
        self.suggestionsListSettings.focusedSuggestion = 0;
        e.preventDefault();
        e.stopPropagation();
      }
      else {
        self.suggestionsListSettings.focusedSuggestion = -1;
        self._caretPosition = this.selectionEnd + 1;
      }

      if ((e.keyCode == 27)||(e.keyCode == 13)){ //escape
        self.suggestionsListSettings.displaySuggestions = false;
      }
    }, true);

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  populateSuggestions(searchStr){

    searchStr = searchStr.substring(0, this.caretPosition);
    var lastWord = this.getLastWord(searchStr)
    this.suggestionsListSettings.title = '';
    this.expressionManager.populate(searchStr, lastWord).then(data=>{
      this.suggestionsListSettings.suggestions =  data;
      this.suggestionsListSettings.lastWord = lastWord;
      this.suggestionsListSettings.displaySuggestions = this.suggestionsListSettings.suggestions.length > 0;
    });

  }

  select(suggestion){
    var searchStr = this.searchString;
    var position = this.caretPosition;
    while ((position<searchStr.length)&&(searchStr[position]!=" ")){
      position++;
    }

    var strLeft = searchStr.substring(0, position);
    var strRight = position < searchStr.length? searchStr.substring(position, searchStr.length) : '';

    var wordToReplace = this.getLastWord(searchStr);
    strLeft = strLeft.substring(0,strLeft.lastIndexOf(wordToReplace));
    var value = suggestion.value;
    if ((suggestion.type==='string')||(suggestion.type==='array_string'))
      value = "'" + value + "'";
    if (suggestion.type==='array_string') {
      // seatch for opening brace
      var openBraceExsits = false;
      for (let i=strLeft.trim().length;i>=0;i--){
        if (strLeft[i]==="(") {
          openBraceExsits = true;
          break;
        }
        if (strLeft[i]===")")
          break;
      }
      if (!openBraceExsits)
        value = "(" + value;
      else {
        var lastChar = strLeft.trim().charAt(strLeft.trim().length - 1);
        if ((lastChar !== '(') && (lastChar !== ','))
          value = "," + value;
      }
    }
    if ((suggestion.type==='operator')&&(suggestion.value==='in'))
      value += " (";
    else
      value += " ";

    this.caretPosition = (strLeft + value).length;
    this.searchString = strLeft + value + strRight;
  }


  getLastWord(searchStr){
    var str = StringHelper.getPreviousWord(searchStr,this.caretPosition,this._separators);
    for (let s of this._specialSymbols)
      str =  StringHelper.replaceAll(str, "\\" + s,"");
    return str.trim();
  }


  notifySearchCriteriaChanged() {
    this.saveState();
    var self = this;
    window.clearTimeout(self._timer);
    self._timer = window.setTimeout(function () {
      if (self.isValid) {
        let astTree = [];
        if (self.searchString!=='')
          astTree = self.parser.parse(self.searchString)
        self.dataFilterChanged.raise(astTree);
      }
    }, 500);
  }

}
