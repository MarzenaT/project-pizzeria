      import { settings, select, classNames, templates } from "../settings";
      import utils from "../utils";
      import CartProduct from "./CartProduct";

    export default class Cart {
    constructor(element) {
      const thisCart = this;
      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();
    }

    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
      thisCart.dom.deliveryFee  = thisCart.dom.wrapper.querySelectorAll(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice  = thisCart.dom.wrapper.querySelectorAll(select.cart.subtotalPrice);
      thisCart.dom.totalPrice  = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.totalNumber  = thisCart.dom.wrapper.querySelectorAll(select.cart.totalNumber);
    
    }

    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function(event) {
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('updated', function() {
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove', function(event) {
        thisCart.remove(event.detail.cartProduct);
      });
      thisCart.dom.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisCart.sendOrder()
      });
    }

    remove(product) {
      const thisCart = this;
      const index = thisCart.products.indexOf(product);
      thisCart.dom.productList.children[index].remove();
      thisCart.products.splice(index, 1)
      thisCart.update();
    }

    add(menuProduct) {
      const thisCart = this;

      const generatedHtml = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHtml);
      thisCart.dom.productList.appendChild(generatedDOM);

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      thisCart.update();
      console.log('adding product', menuProduct)
    }

    update() {
      const thisCart = this;
      
      let totalNumber  = 0;
      let subtotalPrice = 0;
      for(const product of thisCart.products) {
        subtotalPrice += product.price;
        totalNumber += product.amount;
      }
      let deliveryFee = totalNumber > 0 ? settings.cart.defaultDeliveryFee : 0;
      thisCart.totalPrice =  deliveryFee + subtotalPrice;
      thisCart.totalNumber = totalNumber;
      thisCart.deliveryFee = deliveryFee;
      thisCart.dom.deliveryFee.forEach(elem => elem.innerHTML = deliveryFee)
      thisCart.dom.subtotalPrice.forEach(elem => elem.innerHTML  = subtotalPrice)
      thisCart.dom.totalPrice.forEach(elem => elem.innerHTML  = thisCart.totalPrice)
      thisCart.dom.totalNumber.forEach(elem => elem.innerHTML  = totalNumber)
    
    }

    sendOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.orders;
      console.log(url)
      const payload = {
        address: thisCart.dom.phone.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.totalPrice - thisCart.deliveryFee,
        totalNumber: thisCart.totalNumber,
        deliveryFee: thisCart.deliveryFee,
        products: thisCart.products.map(product => 
          product.getData()
        )
      }
      console.log(payload)
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      fetch(url, options).then(resp => (resp.json())).then(jsonResp => {
        console.log(jsonResp);
      })
    }
  }