import { render } from "react-dom";
import React, { Component } from "react";
import glamorous, { Div } from "glamorous";
import Downshift from "downshift";

const cities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Philadelphia, PA",
  "Phoenix, AZ",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Jacksonville, FL",
  "Indianapolis, IN",
  "San Francisco, CA",
  "Austin, TX",
  "Columbus, OH",
  "Fort Worth, TX",
  "Louisville, KY",
  "Charlotte, NC",
  "Detroit, MI",
  "El Paso, TX",
  "Memphis, TN",
  "Baltimore, MD",
  "Boston, MA",
  "Seattle, WA",
  "Washington, DC"
];

const SpectreItem = ({ children, value, index, isActive, onClick }) =>
  <div
    className="menu-item"
    style={isActive ? { backgroundColor: "#eee" } : {}}
    onClick={onClick}
  >
    <a href="#!">
      <div className="tile tile-centered">
        <div className="tile-content">
          {children}
        </div>
      </div>
    </a>
  </div>;

const SpectreACMenu = ({ children }) =>
  children.length > 0 &&
  <ul className="menu">
    {children}
  </ul>;

class SpectreAutocomplete extends Component {
  constructor() {
    super();
    this.state = {
      selectedCities: [],
      availableCities: [...cities]
    };
    this.handleChange = this.handleChange.bind(this);
    this.addCity = this.addCity.bind(this);
    this.removeCity = this.removeCity.bind(this);
    this.clearInputValue = this.clearInputValue.bind(this);
    this.keyboardChange = this.keyboardChange.bind(this);
  }
  handleChange(e) {
    console.log("handle change fn");
  }
  clearInputValue() {
    console.log("CLEAR THE INPUT VALUE AFTER KEYBOARD CHANGE");
    this.ACInput.value = "";
  }
  addCity({ value, index }, callback) {
    this.setState(
      prevState => {
        const availableCities = [...prevState.availableCities];
        const selectedCities = [...prevState.selectedCities];

        availableCities.splice(index, 1);
        selectedCities.push({ city: value, availableCitiesIndex: index });

        return {
          selectedCities,
          availableCities
        };
      },
      () => {
        if (callback) {
          callback();
        }
      }
    );
  }
  removeCity({ value, index, availableCitiesIndex }) {
    this.setState(prevState => {
      const availableCities = [...prevState.availableCities];
      const selectedCities = [...prevState.selectedCities];

      availableCities.splice(availableCitiesIndex, 0, value);
      selectedCities.splice(index, 1);

      return {
        selectedCities,
        availableCities
      };
    });
  }
  clickChange(item, clearSelection) {
    console.log("CLICK CHANGE");
    this.addCity(
      {
        value: item,
        index: this.state.availableCities.indexOf(item)
      },
      clearSelection
    );
  }
  keyboardChange(city, clearSelection) {
    console.log("KEYBOARD CHANGE");
    this.addCity(
      {
        value: city,
        index: this.state.availableCities.indexOf(city)
      },
      this.clearInputValue
    );
  }
  render() {
    const selectedCityTags = this.state.selectedCities.map(
      ({ city, availableCitiesIndex }, i) => {
        // console.log({ city, availableCitiesIndex })
        return (
          <label className="chip" key={city}>
            {city}
            <button
              className="btn btn-clear"
              onClick={({ target }) => {
                this.removeCity({
                  value: city,
                  index: i,
                  availableCitiesIndex
                });
              }}
            />
          </label>
        );
      }
    );
    return (
      <Downshift
        onChange={city => this.keyboardChange(city)}
        onStateChange={e => console.log("stateChange", e)}
      >
        {({
          clearSelection,
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex
        }) =>
          <div className="form-autocomplete-input form-input">
            {selectedCityTags}
            <input
              defaultValue=""
              {...getInputProps({
                defaultValue: ""
              })}
              className="form-input"
              type="text"
              placeholder="Choose your city..."
              ref={n => (this.ACInput = n)}
            />

            {(isOpen &&
              <div className="menu">
                {this.state.availableCities
                  .filter(
                    i =>
                      !inputValue ||
                      i.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((item, index) =>
                    <SpectreItem
                      {...getItemProps({ item, index })}
                      key={item}
                      isActive={highlightedIndex === index}
                      onClick={() => this.clickChange(item, clearSelection)}
                    >
                      {item}
                    </SpectreItem>
                  )}
              </div>) ||
              (!isOpen && <div />)}
          </div>}
      </Downshift>
    );
  }
}

const Examples = () => {
  return (
    <Div
      css={{
        margin: "50px auto",
        maxWidth: 800,
        textAlign: "center"
      }}
    >
      <link
        href="https://unpkg.com/spectre.css@0.2.14/dist/spectre.css"
        rel="stylesheet"
      />
      <link
        href="https://unpkg.com/spectre.css@0.2.14/dist/spectre-icons.css"
        rel="stylesheet"
      />
      <h1>Spectre Autocomplete</h1>
      <p>
        Uses{" "}
        <a
          href="https://picturepan2.github.io/spectre"
          target="_blank"
          rel="noopener noreferrer"
        >
          spectre.css
        </a>{" "}
        and{" "}
        <a
          href="https://en.wikipedia.org/wiki/2010_United_States_Census#City_rankings"
          target="_blank"
          rel="noopener noreferrer"
        >
          this Wikipedia article
        </a>{" "}
        to style and populate the cities list,&nbsp;respectively.
      </p>
      <br />
      <div
        className="form-autocomplete"
        style={{ margin: "auto", maxWidth: 600 }}
      >
        <SpectreAutocomplete />
      </div>
    </Div>
  );
};

render(<Examples />, document.getElementById("root"));
