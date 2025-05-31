import { templates, select } from "../settings.js";
import AmountWidget from  "./AmountWidget.js";

export default class Booking {
  constructor(container) {
        const thisBooking = this;
        thisBooking.renderBooking(container);
      }
      renderBooking(element) {
        const thisBooking = this;
        const generatedHtml = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML = generatedHtml;
        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
        thisBooking.initWidgets(thisBooking.dom.peopleAmount, thisBooking.dom.hoursAmount);
      }

      initWidgets(peopleAmountDom, hoursAmountDom) {
        const thisBooking = this;
        thisBooking.peopleAmountWidget = new AmountWidget(peopleAmountDom );
        thisBooking.hoursAmountWidget = new AmountWidget(hoursAmountDom );
        thisBooking.dom.peopleAmount.addEventListener('updated', function(e) {

        });
        thisBooking.dom.hoursAmount.addEventListener('updated', function(e) {

        });
      }
}