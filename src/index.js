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

const SpectreItem = ({ children, value, index, isActive, onClick }) => (
  <div
    className="menu-item"
    style={isActive ? { backgroundColor: "#eee" } : {}}
    onClick={onClick}
  >
    <a href="#!">
      <div className="tile tile-centered">
        <div className="tile-content">{children}</div>
      </div>
    </a>
  </div>
);

const SpectreACMenu = ({ children }) =>
  children.length > 0 && <ul className="menu">{children}</ul>;

class SpectreAutocomplete extends Component {
  constructor() {
    super();
    this.state = {
      selectedCities: [],
      availableCities: [...cities]
    };
    this.addCity = this.addCity.bind(this);
    this.removeCity = this.removeCity.bind(this);
    this.clearInputValue = this.clearInputValue.bind(this);
    this.keyboardChange = this.keyboardChange.bind(this);
  }
  componentDidMount() {
    window.addEventListener("keydown", ({ keyCode }) => {
      if (
        keyCode === 8 &&
        this.ACInput.value === "" &&
        this.state.selectedCities.length >= 1
      ) {
        this.setState(prevState => {
          const { selectedCities } = prevState;
          const editableSelectedCities = [...selectedCities];
          editableSelectedCities.splice(-1, 1);
          return {
            selectedCities: editableSelectedCities
          };
        });
      }
    });
  }
  clearInputValue() {
    this.downshift.clearSelection();
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
    this.addCity(
      {
        value: item,
        index: this.state.availableCities.indexOf(item)
      },
      clearSelection
    );
  }
  keyboardChange(city, clearSelection) {
    city !== null &&
      this.addCity(
        {
          value: city,
          index: this.state.availableCities.indexOf(city)
        },
        this.downshift.clearSelection
      );
  }
  render() {
    const selectedCityTags = this.state.selectedCities.map(
      ({ city, availableCitiesIndex }, i) => {
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
        ref={downshift => (this.downshift = downshift)}
        onChange={city => this.keyboardChange(city)}
      >
        {({
          clearSelection,
          getDownshiftStateAndHelpers,
          getInputProps,
          getItemProps,
          setInputProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex
        }) => (
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
            {(isOpen && (
              <div className="menu">
                {(() => {
                  let filterMatchCount = 0
                  return [...this.state.availableCities, "No matches!"]
                    .filter((currentItem, index, allAvailableCities) => {
                      if (currentItem !== allAvailableCities[allAvailableCities.length-1]) {
                        filterMatchCount += currentItem !== null &&
                          (!inputValue ||
                            currentItem
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())) ? 1 : 0
                        return (
                          currentItem !== null && currentItem !== 'No matches!' &&
                          (!inputValue ||
                            currentItem
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()))
                        );
                      } else if (currentItem === allAvailableCities[allAvailableCities.length-1] && filterMatchCount <= 0) {
                        return true;
                      }
                    })
                    .map((item, index, arr) => (
                      <SpectreItem
                        {...getItemProps({ item, index })}
                        key={item}
                        isActive={highlightedIndex === index}
                        onClick={() => this.clickChange(item, clearSelection)}
                      >
                        {item}
                      </SpectreItem>
                    ));
                })()}
              </div>
            )) ||
              (!isOpen && <div />)}
          </div>
        )}
      </Downshift>
    );
  }
}

const commonStyles = {
  textAlign: "center"
};

const Examples = () => {
  return (
    <Div
      css={{
        margin: "50px auto",
        maxWidth: 800
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
      <h1 style={commonStyles}>Spectre Autocomplete</h1>
      <p style={commonStyles}>
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
      <br/>
      <p style={commonStyles}><small><a href="https://github.com/geoffdavis92/demo-downshift">Github repo</a></small></p>
    </Div>
  );
};

render(<Examples />, document.getElementById("root"));
