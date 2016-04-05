import {Decorators, customElement, bindable, inject, useView, noView} from 'aurelia-framework';
import {Widget} from './widget';
import {GridContent} from './grid-content';

@customElement('grid')
@useView('./widget.html')
//@noView()
export class Grid extends Widget {
  constructor(settings) {
    super(settings);
    this.stateType = "gridState";
    this.initContent();
  }

  initContent() {
    this.content = new GridContent(this);
  }
}
