  import { settings, select } from "../settings.js";
  import BaseWidget from "./BaseWidget.js";
  
  export default class AmountWidget extends BaseWidget {
    constructor(element) {
      super(element, settings.amountWidget.defaultValue);
      const thisWidget = this;
      thisWidget.getElements();
      
      thisWidget.initActions();
      console.log('Amount Widget: ', thisWidget);
    }

    isValid(value) {
      return super.isValid(value) 
      && value >= settings.amountWidget.defaultMin 
      && value <= settings.amountWidget.defaultMax
    }

    renderValue() {
      const thisWidget = this;
      thisWidget.dom.input.value = thisWidget.value;
    }

    getElements(){
      const thisWidget = this;
    
      thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }

    initActions() {
      const thisWidget = this;
      thisWidget.dom.input.addEventListener('change', function(event) {
        event.preventDefault();
        thisWidget.value = thisWidget.dom.input.value;
      });
      thisWidget.dom.linkDecrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.value = thisWidget.value - 1;
      });
      thisWidget.dom.linkIncrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.value = thisWidget.value + 1;
      });
    }
  }