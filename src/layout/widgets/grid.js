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

    // configurate dataholder
    this.dataHolder.take = this.settings.pageSize ? this.settings.pageSize : 20;
    this.dataHolder.skip = 0;
    this.dataHolder.group = this.settings.group;

    this.initContent();
  }

  initContent() {
    this.content = new GridContent(this);
  }
}
