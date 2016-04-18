import {useView} from 'aurelia-framework';
import {Widget} from './widget';
import {JqChartContent} from './jq-chart-content';

@useView('./widget.html')
export class JqChart extends Widget {
  constructor(settings) {
    super(settings);
    this.stateType = "chartState";
    this.initContent();
    this.categoriesField = settings.categoriesField;
  }

  initContent() {
    this.content = new JqChartContent(this);
  }

}
