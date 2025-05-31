    import { select } from "../settings.js";
    import AmountWidget from "./AmountWidget.js";

    export default class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this;
      const {id, name, amount, priceSingle, price, params} = menuProduct;
      thisCartProduct.id = id;
      thisCartProduct.name = name;
      thisCartProduct.amount = amount;
      thisCartProduct.priceSingle = priceSingle;
      thisCartProduct.price = price;
      thisCartProduct.params = params;

      this.getElements(element);
      this.initAmountWidget();
      this.initActions();
      console.log('new cardProduct', thisCartProduct)
    }

    getElements(element) {
      const thisCartProduct = this;
      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price)
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit)
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove)
   
     }

     initAmountWidget() {
      const thisCartProduct = this;
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget );
      thisCartProduct.dom.amountWidget.addEventListener('updated', function() {
        const amount = thisCartProduct.amountWidget.value;
        thisCartProduct.amount = amount;
        thisCartProduct.price = amount * thisCartProduct.priceSingle;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price
      } )
    }

    remove() {
      const thisCartProduct = this;

      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct
        }
      })
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }

    initActions() {
      const thisCartProduct = this;

      thisCartProduct.dom.edit.addEventListener('click', function(event) {
        event.preventDefault();
      })
      thisCartProduct.dom.remove.addEventListener('click', function(event) {
        event.preventDefault();
        thisCartProduct.remove();
      })
    }

    getData() {
      const thisCartProduct = this;
      const {id, amount, price, priceSingle, name, params} = thisCartProduct;
      return {id, amount, price, priceSingle, name, params};
    }

  }