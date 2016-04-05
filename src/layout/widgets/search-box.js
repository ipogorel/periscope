import {customElement, useView} from 'aurelia-framework';
import {Widget} from './widget';
import {DslSearchBoxContent} from './dsl-search-box-content';

@customElement('search-box')
@useView('./widget.html')
export class SearchBox extends Widget {
  constructor(settings) {
    super(settings);
    this.stateType = "searchBoxState";
    this.initContent();
  }


  initContent() {
    this.content = new DslSearchBoxContent(this);
  }
}
