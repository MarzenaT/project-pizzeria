import Product from "./components/Product.js";
import Cart from "./components/Cart.js";
import Booking from "./components/Booking.js";
import { settings, select, classNames } from "./settings.js";

   const app = {
    initPages() {
      const thisApp = this;
      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.navLinks = document.querySelectorAll(select.nav.links);
      const idFromHash = window.location.hash.replace('#/', '');
      
      let pageMatchingHash = thisApp.pages[0].id;

      for(let page of thisApp.pages) {
        if(page.id === idFromHash) {
          pageMatchingHash = page.id;
          break;
        }
      }
      thisApp.activatePage(pageMatchingHash);
      
      for(let link of thisApp.navLinks) {
        link.addEventListener('click', function(event) {
          const clickedElement = this;
          event.preventDefault();
          const id = clickedElement.getAttribute('href').slice(1);
          thisApp.activatePage(id);
          window.location.hash = '#/' + id;
        })
      }
    },
    activatePage: function(pageId) {
      const thisApp = this;

      /* add class active to matching pages, remove from non-matching*/
      for(let page of thisApp.pages) {
        page.classList.toggle(classNames.pages.active, page.id === pageId);
      }
      /* add class active to matching links, remove from non-matching*/
            for(let link of thisApp.navLinks) {
        link.classList.toggle(classNames.nav.active, link.getAttribute('href') === '#' + pageId);
      }
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
    initBooking: function() {
      //const thisApp = this;

      const bookingContainer = document.querySelector(select.containerOf.booking);
      new Booking(bookingContainer);
    },
    init: function(){
      const thisApp = this;
      thisApp.initPages();
      thisApp.initData();
      thisApp.initCart();
      thisApp.initBooking();
    },
  };

  app.init();

  export default app;

