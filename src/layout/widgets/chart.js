import {customElement, inject, useView} from 'aurelia-framework';
import {Widget} from './widget';
import {ChartContent} from './chart-content';


@customElement('chart')
@useView('./widget.html')
export class Chart extends Widget {
  constructor(settings) {
    super(settings);
    this.stateType = "chartState";
    this.initContent();
  }

  initContent() {
    this.content = new ChartContent(this);
  }
}
