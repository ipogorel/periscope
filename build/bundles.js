module.exports = {
  "bundles": {
    "dist/boot": {
      "includes": [
        "bootstrap"
      ],
      "options": {
        "inject": true,
        "minify": false,
        "depCache": true,
        "rev": false
      }
    },
    "dist/app-build": {
      "includes": [
        "[*.js]",
        "*.html!text",
        "*.css!text"
      ],
      "options": {
        "inject": true,
        "minify": true,
        "depCache": true,
        "rev": false
      }
    },
    "dist/aurelia": {
      "includes": [
        "jquery",
        "aurelia-framework",
        "aurelia-bootstrapper",
        "aurelia-fetch-client",
        "aurelia-router",
        "aurelia-animator-css",
        "aurelia-templating-binding",
        "aurelia-polyfills",
        "aurelia-templating-resources",
        "aurelia-templating-router",
        "aurelia-loader-default",
        "aurelia-history-browser",
        "aurelia-logging-console",
        "bootstrap",
        "bootstrap/css/bootstrap.css!text"
      ],
      "options": {
        "inject": true,
        "minify": true,
        "depCache": false,
        "rev": false
      }
    }
  }
};
