import React, { Component } from "react";

import Data from "./availability.json";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      dates: [],
      currentHours: [],
      slotId: "",
      currentDate: [],
      currentHour: []
    };
    this.handleDateClick = this.handleDateClick.bind(this);
  }

  getSlotId(date, time) {
    const a = Data.available_slots.filter(
      dateObj => dateObj.date.toLowerCase() === date.toLowerCase()
    );
    if (a.length > 0) {
      if (a[0].date_slots.length > 0) {
        const c = a[0].date_slots
          .map(
            dateObj =>
              dateObj.hour_slots.length > 0
                ? dateObj.hour_slots.filter(
                    hourObj =>
                      Object.keys(hourObj)[0].toLowerCase() ===
                      time.toLowerCase()
                  )
                : null
          )
          .filter(data => (data ? data.length > 0 : null));
        if (c.length > 0) {
          const d = c[0].reduce(a => a[time]);
          return d[time];
        }
      }
    }
    return null;
  }

  getAllHours(date) {
    const a = Data.available_slots.filter(
      dateObj => dateObj.date.toLowerCase() === date.toLowerCase()
    );
    if (a.length > 0) {
      const values = [];
      a[0].date_slots.map(
        dateObj =>
          dateObj.hour_slots.length > 0
            ? dateObj.hour_slots.map(hourObj =>
                values.push(Object.keys(hourObj)[0])
              )
            : null
      );
      if (values.length > 0) {
        return values;
      }
    }
    return null;
  }

  getDates() {
    const values = [];
    Data.available_slots.map(dateObj => values.push(dateObj.date));
    return values;
  }

  componentDidMount() {
    let currentDate = "Today";
    let currentHours = this.getAllHours(currentDate);
    let slotId = this.getSlotId(currentDate, currentHours[0]);
    this.setState({
      dates: this.getDates(),
      currentDate,
      currentHour: currentHours[0],
      currentHours,
      slotId
    });
  }

  handleDateClick(date) {
    let currentDate = date;
    let currentHours = this.getAllHours(currentDate);
    if (currentHours) {
      let slotId = this.getSlotId(currentDate, currentHours[0]);
      this.setState({
        currentDate,
        currentHour: currentHours[0],
        currentHours,
        slotId
      });
    } else {
      this.setState({
        currentHours: [],
        slotId: "",
        currentDate: date,
        currentHour: []
      });
    }
  }

  handleHourClick(hour) {
    let slotId = this.getSlotId(this.state.currentDate, hour);
    if (slotId) {
      this.setState({
        slotId,
        currentHour: hour
      });
    } else {
      this.setState({
        currentHour: hour
      });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="roller">
          {this.state.dates.length > 0
            ? this.state.dates.map(
                date =>
                  date === this.state.currentDate ? (
                    <button
                      className="active"
                      key={date}
                    >
                      {date}
                    </button>
                  ) : (
                    <button
                      onClick={() => this.handleDateClick(date)}
                      key={date}
                    >
                      {date}
                    </button>
                  )
              )
            : "No Dates"}
        </div>
        <div className="roller">
          {this.state.currentHours.length > 0
            ? this.state.currentHours.map(
                hour =>
                  hour === this.state.currentHour ? (
                    <button className="active">
                      {hour}
                    </button>
                  ) : (
                    <button onClick={() => this.handleHourClick(hour)}>{hour}</button>
                  )
              )
            : <button className="danger">No Timings</button>}
        </div>
        <div className="roller">
          {this.state.slotId === "" ? <button className="danger">No Slot Available</button> : <button className="accept">{this.state.slotId}</button>}
        </div>
      </div>
    );
  }
}

export default App;
