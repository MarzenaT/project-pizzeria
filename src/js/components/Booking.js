import { templates, select, settings, classNames } from "../settings.js";
import utils from "../utils.js";
import AmountWidget from  "./AmountWidget.js";
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";

export default class Booking {
  constructor(container) {
        const thisBooking = this;
        thisBooking.selectedTable = 0;
        thisBooking.renderBooking(container);
        thisBooking.getData();
      }

      getData() {
        const thisBooking = this;
        const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.dateWidget.minDate);
        const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.dateWidget.maxDate);
        const repeat = settings.db.notRepeatParam;
        const notRepeat = settings.db.repeatParam;
        const params = {
          booking:      [
            startDateParam,
            endDateParam,
          ],   
          eventsCurrent:[
            startDateParam,
            endDateParam,
            repeat
          ],   
          eventsRepeat: [
            endDateParam,
            notRepeat
          ],   
        };
        console.log('getData params', params);
        const urls = {
          booking:          settings.db.url + '/' + settings.db.bookings
                                            + '?' + params.booking.join('&')  ,
          eventsCurrent:    settings.db.url + '/' + settings.db.events  
                                            + '?' + params.eventsCurrent.join('&')  ,
          eventsRepeat:     settings.db.url + '/' + settings.db.events  
                                            + '?' + params.eventsRepeat.join('&')  ,
        };

        console.log('getData urls', urls);

        Promise.all([
          fetch(urls.booking),
          fetch(urls.eventsCurrent),
          fetch(urls.eventsRepeat),
        ])
        .then(function(allResponses) {
          const [bookingsResponse, eventsCurrentResponse, eventsRepeatResponse] = allResponses;
          return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ])
        })
        .then(function([bookings, eventsCurrent, eventsRepeat]) {
          console.log([bookings, eventsCurrent, eventsRepeat])
          thisBooking.parseData(bookings, eventsCurrent, eventsRepeat)
        })
      }

      parseData(bookings, eventsCurrent, eventsRepeat) {
        const thisBooking = this;

        thisBooking.booked = {};
        for(let item of bookings) {
          thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }
        for(let item of eventsCurrent) {
          thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        const minDate = thisBooking.dateWidget.minDate;
        const maxDate = thisBooking.dateWidget.maxDate;


        for(let item of eventsRepeat) {
          if(item.repeat == 'daily') {
            for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
              thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
            }
            
          }
        }
        console.log('booked:', thisBooking.booked)

        thisBooking.updateDOM();
      }

      makeBooked(date, hour, duration, table) {
        const thisBooking = this;
        if(typeof thisBooking.booked[date] == 'undefined') {
          thisBooking.booked[date] = {}
        }
        const startHour = utils.hourToNumber(hour)

        for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
          if(typeof thisBooking.booked[date][hourBlock] == 'undefined') {
            thisBooking.booked[date][hourBlock] = []
          }
          thisBooking.booked[date][hourBlock].push(table);
        }
      }

      updateDOM() {
        const thisBooking = this;
        thisBooking.date = thisBooking.dateWidget.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourWidget.value);

        let allAvailable = false;

        if(typeof thisBooking.booked[thisBooking.date] == 'undefined' || 
          typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ) {
          allAvailable = true;
        }

        for(let table of thisBooking.dom.tables) {
          let tableId = table.getAttribute(settings.booking.tableIdAttribute);
          if(!isNaN(tableId)) {
            tableId = parseInt(tableId);
          }

          if(
            !allAvailable 
            &&
            thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
          ) {
            table.classList.add(classNames.booking.tableBooked)
          } else {
            table.classList.remove(classNames.booking.tableBooked)
          }
          table.classList.remove(classNames.booking.tableSelected);
          thisBooking.selectedTable = 0;
        }
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
        thisBooking.dom.tables = document.querySelectorAll(select.booking.tables);
        thisBooking.dom.floorPlan = document.querySelector(select.booking.floorPlan);
        thisBooking.dom.form = document.querySelector(select.booking.form);
        thisBooking.dom.bookingOptions = document.querySelector(select.booking.bookingOptions);
        thisBooking.initWidgets(thisBooking.dom.peopleAmount, thisBooking.dom.hoursAmount);
      }

      initWidgets(peopleAmountDom, hoursAmountDom) {
        const thisBooking = this;
        thisBooking.peopleAmountWidget = new AmountWidget(peopleAmountDom );
        thisBooking.hoursAmountWidget = new AmountWidget(hoursAmountDom );
        thisBooking.dateWidget = new DatePicker(thisBooking.dom.datePicker );
        thisBooking.hourWidget = new HourPicker(thisBooking.dom.hourPicker );

        thisBooking.dom.wrapper.addEventListener('updated', function() {
          thisBooking.updateDOM();
        });
        thisBooking.dom.floorPlan.addEventListener('click', function(event) {
          const clickedElement = event.target;
          if(clickedElement.classList.contains(classNames.booking.table))
          {
            if(clickedElement.classList.contains(classNames.booking.tableBooked)){
              window.alert('This table is booked')
            } else {
              const tableId = clickedElement.getAttribute(settings.booking.tableIdAttribute);
              if(thisBooking.selectedTable && tableId !== thisBooking.selectedTable) {
                for(let table of thisBooking.dom.tables) {
                  const recentTableId = table.getAttribute(settings.booking.tableIdAttribute);
                  if(recentTableId === thisBooking.selectedTable) {
                    table.classList.toggle(classNames.booking.tableSelected)
                  }
                }
              }
              const toggled = clickedElement.classList.toggle(classNames.booking.tableSelected)
              thisBooking.selectedTable = toggled ? tableId : 0;
            }
          }
        });
        thisBooking.dom.form.addEventListener('click', function(event) {
          event.preventDefault();
          thisBooking.starters = [];
          thisBooking.duration = parseInt(thisBooking.dom.hoursAmount.querySelector('input.amount').value)
          thisBooking.ppl = parseInt(thisBooking.dom.peopleAmount.querySelector('input.amount').value)
          thisBooking.dom.bookingOptions.querySelectorAll('.checkbox').forEach(el => {
            const input = el.querySelector('input');
            if(input.checked) {
              thisBooking.starters.push(input.getAttribute('value'));
            }
          })
          thisBooking.dom.wrapper.querySelectorAll(select.booking.orderConfirmation).forEach(input => {
            if(input.name === 'phone') {
              thisBooking.phone = input.value
            } else if(input.name === 'address') {
              thisBooking.address = input.value
            }
          })
          thisBooking.sendBooking()
        });
      }

      sendBooking() {
        const thisBooking = this;
        const url = settings.db.url + '/' + settings.db.bookings;
        console.log(url)
        const payload = {
          "date": thisBooking.date,
          "hour": utils.numberToHour(thisBooking.hour),
          "table": parseInt(thisBooking.selectedTable) || null,
          "duration" : thisBooking.duration,
          "ppl": thisBooking.ppl,
          "starters": thisBooking.starters,
          "phone": thisBooking.phone,
          "address": thisBooking.address
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
          if(thisBooking.selectedTable) {
            thisBooking.makeBooked(thisBooking.date, utils.numberToHour(thisBooking.hour), thisBooking.duration, parseInt(jsonResp.table))
            thisBooking.updateDOM();
          }
          
        })
    }
}