import 'fetch';
import 'font-awesome'
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-validatejs')
    .plugin('aurelia-animator-css')
    .plugin("grofit/aurelia-chart");
  //aurelia.use.plugin('aurelia-html-import-template-loader')
  aurelia.start().then(a => a.setRoot());
}
