import {customElement, bindable, bindingMode, inject} from 'aurelia-framework';
import $ from 'jquery';

export class List {
  @bindable items = null;
  @bindable title = "";
  @bindable highlightText = "";
  @bindable({defaultBindingMode: bindingMode.twoWay}) visible;
  @bindable({defaultBindingMode: bindingMode.twoWay}) selectedItem;
  @bindable({defaultBindingMode: bindingMode.twoWay}) focusedItemIndex;

  constrictor(){
  }


  //itemsChanged(newValue, oldValue)
  attached(params){

      var self = this;

      $("body").on( "click", function(args) {
        if (($(args.target).parents(".list-view").length>0)||($(args.target).hasClass("list-view"))) //do not close when user clicks on the list-view
          return;
        self.visible = false;
      });


      if ($('.list-container').length===0)
        return;
      $('.list-container')[0].addEventListener("keydown", function (e) {
        // Listen for the up, down arrow keys, otherwise, end here
        /*if ([13, 38, 40].indexOf(e.keyCode) == -1) {
          return;
        }*/
        // Store the reference to our top level link
        var container = $(this);

        if (container.find('li').length===0)
          return;

        switch (e.keyCode) {

          case 38: /// up arrow
            if (container.find('li').filter('.focused-item').length===0) {
              self.focusedItemIndex = container.find('li').length-1;
            }
            else{
              let previousIndex  = self.focusedItemIndex - 1;
              if (previousIndex < 0)
                previousIndex = container.find('li').length-1;
              self.focusedItemIndex = previousIndex;
            }
            break;

          case 40: // down arrow

            if (container.find('li').filter('.focused-item').length===0) {
              self.focusedItemIndex = 0;
            }
            else{
              let nextIndex  = self.focusedItemIndex + 1;
              if (nextIndex >= container.find('li').length)
                nextIndex = 0;
              self.focusedItemIndex = nextIndex;
            }
            break;
          case 13: // enter
            if (self.focusedItemIndex>=0) {
                self.select(self.focusedItemIndex);
            }
            break;
          case 27: //escape
            self.visible = false;
            break;
        }
        e.preventDefault();
        e.stopPropagation();
      });

  }


  format(itemText){
    if ((this.highlightText!=='')&&(itemText)&&(itemText.toLowerCase().indexOf(this.highlightText.toLowerCase())>=0)) {
      var regex = new RegExp(this.highlightText, 'i');
      return itemText.replace(regex, '<b>$&</b>');
    }
    return itemText
  }

  select (itemIndex){
    this.selectedItem = this.items[itemIndex];
    this.focusedItemIndex = -1;
  }


  focusedItemIndexChanged(newValue, oldValue) {
    if (this.focusedItemIndex!=undefined) {
      if (this.focusedItemIndex >= 0)
        this.setFocus(this.focusedItemIndex);
      else
        this.clearFocus();
    }
  }

  setFocus(itemIndex) {
    var container = $(this.listViewContainer);
    if (container.find('li').length===0)
      return;
    container.find('li').filter('.focused-item').removeClass("focused-item");
    $(container.find('li')[itemIndex]).addClass("focused-item");
    $(container.find('li')[itemIndex]).find('button').first().focus();
  }

  clearFocus() {
    var container = $(this.listViewContainer);
    if (container.find('li').filter('.focused-item').length===0)
      return;
    container.find('li').filter('.focused-item').first().find('button').first().blur();
    container.find('li').filter('.focused-item').removeClass("focused-item");
  }

}

