import {useView} from 'aurelia-framework';
import {Widget} from './widget';
import {DataSourceConfiguratorContent} from './data-source-configurator-content';

@useView('./widget.html')
export class DataSourceConfigurator extends Widget {
  constructor(settings) {
    super(settings);
    this.stateType = "dataSourceConfiguratorState";
    this.initContent();
  }


  initContent() {
    this.content = new DataSourceConfiguratorContent(this);
  }
}
