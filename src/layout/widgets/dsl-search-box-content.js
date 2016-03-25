import {Container, Decorators, customElement, bindable, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import $ from 'jquery';
import {bootstrap} from 'bootstrap'
import {WidgetContent} from './widget-content';
import {DslExpressionManagerFactory} from 'dsl/dsl-expression-manager-factory';
import {StringHelper} from 'helpers/string-helper';


export class DslSearchBoxContent extends WidgetContent {

  constructor(widget){
    super(widget);
    var container = new Container();
    this._expressionManagerFactory = container.get(DslExpressionManagerFactory);

    this._searchString = "";

    this._assumptionString = "";
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


  get selectedSuggestion (){
    return this._selectedSuggestion;
  }
  set selectedSuggestion (value){
    if (this._selectedSuggestion  != value) {
      this._selectedSuggestion = value;
      this.select(this._selectedSuggestion)
    }
  }

  get assumptionString (){
    return this._assumptionString;
  }
  set assumptionString (value){
    this._assumptionString = value;
  }


  get suggestionsListSettings(){
    return this._suggestionsListSettings;
  }
  set suggestionsListSettings(value){
    this._suggestionsListSettings = value;
  }

  get isValid() {
    if ((this.searchString==='')||(!this.expressionManager))
      return true;
    return this.expressionManager.validate(this.searchString);
  }

  refresh(){
    this._expressionManagerFactory.createInstance(this.dataHolder, this.widget.dataSource.transport.readService.configuration.schema.fields).then(
        x=> {
        this.expressionManager = x;
        if (this.widget.state){
          this.searchString = this.widget.state;
          this.suggestionsListSettings.displaySuggestions = false;
        }
      });
  }





  get searchString(){
    return this._searchString;
  }
  set searchString(value){
    if (this._searchString != value) {
      this._searchString = value;
      this.populateSuggestions(value);
      this.notifySearchCriteriaChanged();
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
      /*if ((lastWord!="") && (this.suggestionsListSettings.suggestions.length == 0) && (!this.isValid)){ // suspect misspelling
        // count levenstein distance for each suggestion
        var assumptions = this.getAssumptions(lastWord, this.suggestionsListSettings.suggestions)
        if (assumptions.length>0){
          this.suggestionsListSettings.title = '';
          this.suggestionsListSettings.suggestions = assumptions;
        }
      }*/
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

  getAssumptions(wrongString, suggestions){
    var assumptions = [];
    for (let sg of suggestions)
    {
      assumptions.push({
        distance: StringHelper.getEditDistance(sg.value.substring(0,wrongString.length), wrongString),
        value: sg.value,
        type: sg.type
      });
    }
    assumptions = assumptions.sort(function(a,b){
        if (a.distance > b.distance)
          return 1;
        if (a.distance < b.distance)
          return -1;
        return 0;
      }).splice(0, assumptions.length>1 ? 1 : assumptions.length);

    return assumptions;
  }

  getLastWord(searchStr){
    var str = StringHelper.getPreviousWord(searchStr,this.caretPosition,this._separators);
    for (let s of this._specialSymbols)
      str =  StringHelper.replaceAll(str, "\\" + s,"");
    return str.trim();
  }


  notifySearchCriteriaChanged() {
    if (this.isValid) {
      this.widget.state = this.searchString;
    }
    var self = this;
    self.assumptionString = "";
    window.clearTimeout(self._timer);
    self._timer = window.setTimeout(function () {
        if (self.isValid) {
          var searchExpression = '';
          if (self.searchString!=='')
            var searchExpression = self.expressionManager.parse(self.searchString)
          self.widget.dataFilterChanged.raise(searchExpression);
        }
        /*else{
          self.assumptionString = self.createSearchStringAssumption(self.searchString)
        }*/
      }, 500);
  }

  createSearchStringAssumption(searchStr) {
    var maxAttempts = 10;
    var result = "";
    for (var i=0;i<=maxAttempts;i++){
      var err = this.expressionManager.getParserError(searchStr);
      if (err.offset < searchStr.length){
        var wrongStr = StringHelper.getNextWord(searchStr,err.offset,this._separators);
        if (wrongStr.trim().length>0) {
          var assump = this.getAssumptions(wrongStr, this.expressionManager.populate(searchStr));
          if (assump.length>0){
            searchStr = StringHelper.replaceAll(searchStr,wrongStr,assump[0].value);
            if (this.expressionManager.validate(searchStr)) {
              result = searchStr;
              break;
            }
          }
        }
      }
      else
        break;
    }
    console.log(result);
    return result;
  }

  selectAssumption(){
    this.searchString = this.assumptionString;
  }

  get showAssumption(){
    return ((this.assumptionString != '') && (!this.suggestionsListSettings.displaySuggestions));
  }
}
