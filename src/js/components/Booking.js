import { templates, select } from "../settings.js";
import AmountWidget from  "./AmountWidget.js";
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";

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
        thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
        
        thisBooking.initWidgets(thisBooking.dom.peopleAmount, thisBooking.dom.hoursAmount);
      }

      initWidgets(peopleAmountDom, hoursAmountDom) {
        const thisBooking = this;
        thisBooking.peopleAmountWidget = new AmountWidget(peopleAmountDom );
        thisBooking.hoursAmountWidget = new AmountWidget(hoursAmountDom );
        thisBooking.dateWidget = new DatePicker(thisBooking.dom.datePicker );
        thisBooking.hourWidget = new HourPicker(thisBooking.dom.hourPicker );
        thisBooking.dom.peopleAmount.addEventListener('updated', function() {

        });
        thisBooking.dom.hoursAmount.addEventListener('updated', function() {

        });
      }
}