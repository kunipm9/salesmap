import React, { Component } from "react";
import PropTypes from "prop-types";
import countries from "./countries";

/**
 *
 *
 * @class ReactFlagsSelect
 * @extends {Component}
 */
class ReactFlagsSelect extends Component {
  /**
   *Creates an instance of ReactFlagsSelect.
   * @param {*} props
   * @memberof ReactFlagsSelect
   */
  constructor(props) {
    super(props);

    const defaultCountry =
      countries[this.props.defaultCountry] && this.props.defaultCountry;

    this.state = {
      openOptions: false,
      defaultCountry,
      filteredCountries: []
    };

    this.toggleOptions = this.toggleOptions.bind(this);
    this.closeOptions = this.closeOptions.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
    this.setCountries = this.setCountries.bind(this);
  }

  /**
   *
   *
   * @memberof ReactFlagsSelect
   */
  toggleOptions() {
    !this.state.disabled &&
      this.setState({
        openOptions: !this.state.openOptions
      });
  }

  /**
   *
   *
   * @param {*} evt
   * @memberof ReactFlagsSelect
   */
  toggleOptionsWithKeyboard(evt) {
    evt.preventDefault();
    if (evt.keyCode === 13) {
      //enter key: toggle options
      this.toggleOptions();
    } else if (evt.keyCode === 27) {
      //esc key: hide options
      !this.state.disabled &&
        this.setState({
          openOptions: false
        });
    }
  }

  /**
   *
   *
   * @param {*} event
   * @memberof ReactFlagsSelect
   */
  closeOptions(event) {
    if (
      /* eslint-disable react/no-string-refs */
      event.target !== this.refs.selectedFlag &&
      event.target !== this.refs.flagOptions &&
      event.target !== this.refs.filterText
      /* eslint-enable react/no-string-refs */
    ) {
      this.setState({
        openOptions: false
      });
    }
  }

  /**
   *
   *
   * @param {*} countryCode
   * @memberof ReactFlagsSelect
   */
  onSelect(countryCode) {
    this.setState({
      selected: countryCode,
      filter: "",
      openOptions: false
    });
    this.props.onSelect && this.props.onSelect(countryCode);
  }

  /**
   *
   *
   * @param {*} evt
   * @param {*} countryCode
   * @memberof ReactFlagsSelect
   */
  onSelectWithKeyboard(evt, countryCode) {
    evt.preventDefault();
    if (evt.keyCode === 13) {
      //enter key: select
      this.onSelect(countryCode);
      this.closeOptions(evt);
    } else if (evt.keyCode === 27) {
      //esc key: hide options
      this.toggleOptions();
    }
  }

  /**
   *
   *
   * @param {*} countryCode
   * @memberof ReactFlagsSelect
   */
  updateSelected(countryCode) {
    let isValid = countries[countryCode];

    isValid &&
      this.setState({
        selected: countryCode
      });
  }

  /**
   *
   *
   * @param {*} evt
   * @memberof ReactFlagsSelect
   */
  filterSearch(evt) {
    let filterValue = evt.target.value;
    let filteredCountries =
      filterValue &&
      this.state.countries.filter(key => {
        let label = this.props.customLabels[key] || countries[key];
        return label && label.match(new RegExp(filterValue, "i"));
      });

    this.setState({
      filter: filterValue,
      filteredCountries: filteredCountries
    });
  }

  /**
   *
   *
   * @memberof ReactFlagsSelect
   */
  setCountries() {
    const fullCountries = Object.keys(countries);

    let selectCountries =
      this.props.countries &&
      this.props.countries.filter(country => {
        return countries[country];
      });

    //Filter BlackList
    if (this.props.blackList && selectCountries) {
      selectCountries = fullCountries.filter(countryKey => {
        return (
          selectCountries.filter(country => {
            return countryKey === country;
          }).length === 0
        );
      });
    }

    this.setState(
      {
        countries: selectCountries || fullCountries
      },
      () => {
        const { selected } = this.state;

        if (selected && !this.state.countries.includes(selected)) {
          this.setState({ selected: null });
        }
      }
    );
  }

  /**
   *
   *
   * @memberof ReactFlagsSelect
   */
  componentDidMount() {
    this.setCountries();
    !this.props.disabled && window.addEventListener("click", this.closeOptions);
  }

  /**
   *
   *
   * @param {*} prevProps
   * @memberof ReactFlagsSelect
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.countries !== this.props.countries ||
      prevProps.blackList !== this.props.blackList
    ) {
      this.setCountries();
    }
  }

  /**
   *
   *
   * @memberof ReactFlagsSelect
   */
  componentWillUnmount() {
    !this.props.disabled &&
      window.removeEventListener("click", this.closeOptions);
  }

  /**
   *
   *
   * @returns
   * @memberof ReactFlagsSelect
   */
  render() {
    let isSelected =
      this.state.selected ||
      this.state.defaultCountry ||
      this.props.defaultCountry;
    let selectedSize = this.props.selectedSize;
    let optionsSize = this.props.optionsSize;
    let alignClass =
      this.props.alignOptions.toLowerCase() === "left" ? "to--left" : "";

    /* eslint-disable react/no-string-refs */
    return (
      <div
        className={`flag-select ${
          this.props.className ? this.props.className : ""
        }`}
      >
        <div
          ref="selectedFlag"
          style={{ fontSize: `${selectedSize}px` }}
          className={`selected--flag--option ${
            this.props.disabled ? "no--focus" : ""
          }`}
          tabIndex="0"
          onClick={this.toggleOptions}
          onKeyUp={evt => this.toggleOptionsWithKeyboard(evt)}
        >
          {isSelected && (
            <span
              className="country-flag"
              style={{
                width: `${selectedSize}px`,
                height: `${selectedSize}px`
              }}
            >
              <img
                src={`/flags/${isSelected.toLowerCase()}.svg`}
                alt={isSelected}
              />
              {this.props.showSelectedLabel && (
                <span className="country-label">
                  {this.props.customLabels[isSelected] || countries[isSelected]}
                </span>
              )}
            </span>
          )}

          {!isSelected && (
            <span className="country-label">{this.props.placeholder}</span>
          )}
          <span className={`arrow-down ${this.props.disabled ? "hidden" : ""}`}>
            ▾
          </span>
        </div>

        {this.state.openOptions && (
          <div
            ref="flagOptions"
            style={{ fontSize: `${optionsSize}px` }}
            className={`flag-options ${alignClass}`}
          >
            {this.props.searchable && (
              <div className="filterBox">
                <input
                  type="text"
                  placeholder={this.props.searchPlaceholder}
                  ref="filterText"
                  onChange={this.filterSearch}
                />
              </div>
            )}
            {(this.state.filter
              ? this.state.filteredCountries
              : this.state.countries
            ).map(countryCode => (
              <div
                className={`flag-option ${
                  this.props.showOptionLabel ? "has-label" : ""
                }`}
                key={countryCode}
                tabIndex="0"
                onClick={() => this.onSelect(countryCode)}
                onKeyUp={evt => this.onSelectWithKeyboard(evt, countryCode)}
              >
                <span
                  className="country-flag"
                  style={{
                    width: `${optionsSize}px`,
                    height: `${optionsSize}px`
                  }}
                >
                  <img src={`/flags/${countryCode.toLowerCase()}.svg`} />
                  {this.props.showOptionLabel && (
                    <span className="country-label">
                      {this.props.customLabels[countryCode] ||
                        countries[countryCode]}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
    /* eslint-enable react/no-string-refs */
  }
}

ReactFlagsSelect.defaultProps = {
  selectedSize: 16,
  optionsSize: 14,
  placeholder: "Select a country",
  showSelectedLabel: true,
  showOptionLabel: true,
  alignOptions: "right",
  customLabels: {},
  disabled: false,
  blackList: false,
  searchable: false,
  searchPlaceholder: "Search"
};

ReactFlagsSelect.propTypes = {
  countries: PropTypes.array,
  blackList: PropTypes.bool,
  customLabels: PropTypes.object,
  selectedSize: PropTypes.number,
  optionsSize: PropTypes.number,
  defaultCountry: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  showSelectedLabel: PropTypes.bool,
  showOptionLabel: PropTypes.bool,
  alignOptions: PropTypes.string,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string
};

export default ReactFlagsSelect;
