import {Decorators, customElement, bindable, inject, useView, noView} from 'aurelia-framework';
import {Widget} from './widget';
import {JqGridContent} from './jq-grid-content';

@useView('./widget.html')
export class JqGrid extends Widget {
  constructor(settings) {
    super(settings);
    this.stateType = "gridState";
    this.initContent();
  }

  initContent() {
    this.content = new JqGridContent(this);
  }
}

