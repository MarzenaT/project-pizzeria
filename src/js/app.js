import Product from "./components/Product.js";
import Cart from "./components/Cart.js";
import { settings, select } from "./settings.js";

   const app = {
    initPages() {
      const thisApp = this;
      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.activatePage(thisApp.pages[0].id);
    },
    activatePage: function() {
      //const thisApp = this;

      /* add class active to matching pages, remove from non-matching*/

      /* add class active to matching links, remove from non-matching*/
    },
    initData: function() {
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
            console.log('000000000000000AAAAAAAAAAAA')
      fetch(url).then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        console.log(parsedResponse);
        thisApp.data.products = parsedResponse;
        thisApp.initMenu()
      })
      console.log('AAAAAAAAAAAA')
    },
    initMenu: function() {
      const thisApp = this;
      //console.log('thisApp.data:', thisApp.data);
      for(let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },
    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
      thisApp.productList = document.querySelector(select.containerOf.menu);
      thisApp.productList.addEventListener('add-to-cart', function(event) {
        app.cart.add(event.detail.product);
      })
    },
    init: function(){
      const thisApp = this;
      //thisApp.initPages();
      thisApp.initData();
      thisApp.initCart();
    },
  };

  app.init();

  export default app;

