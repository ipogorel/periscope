import 'fetch';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-animator-css');
  //aurelia.use.plugin('aurelia-html-import-template-loader')
  aurelia.start().then(a => a.setRoot());
}
