
export class WidgetBehavior {

  get widget() {
    return this._widget;
  }

  attachToWidget(widget) {
    this._widget = widget;
    this._widget.behaviors.push(this);
  }

  detach(){
    for (let i=0; i<this.widget.behaviors.length; i++) {
      if(this.widget.behaviors[i] === this) {
        this.widget.behaviors.splice(i, 1);
        break;
      }
    }
  }

}
