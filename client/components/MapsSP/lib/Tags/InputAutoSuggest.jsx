import React from "react";
import TextField from "@material-ui/core/TextField";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

export class InputAutoSuggest extends React.Component {
  "use strict";
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      suggestions: []
    };
  }

  /**
   *
   *
   * @memberof InputAutoSuggest
   */
  componentDidMount() {
    this.setState({
      value: this.props.value,
      suggestions: this.props.suggestions
    });
  }

  /**
   *
   *
   * @memberof InputAutoSuggest
   */
  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
    this.props.onChange(newValue);
  };

  /**
   *
   *
   * @memberof InputAutoSuggest
   */
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  /**
   *
   *
   * @memberof InputAutoSuggest
   */
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  /**
   *
   *
   * @memberof InputAutoSuggest
   */
  renderInputComponent = inputProps => {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;

    return (
      <TextField
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          }
        }}
        {...other}
      />
    );
  };

  /**
   *
   *
   * @memberof InputAutoSuggest
   */
  escapeRegexCharacters = str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  /**
   *
   *
   * @memberof InputAutoSuggest
   */
  getSuggestions = value => {
    const escapedValue = this.escapeRegexCharacters(value.trim());
    return this.props.suggestions.filter(
      word => word.indexOf(escapedValue) != -1
    );
  };

  /**
   *
   *
   * @memberof InputAutoSuggest
   */
  getSuggestionValue = word => {
    return word;
  };

  /**
   *
   *
   * @memberof InputAutoSuggest
   */
  renderSuggestion = (word, { query, isHighlighted }) => {
    const matches = match(word, query);
    const parts = parse(word, matches);

    return (
      <div>
        {parts.map(part => (
          <span
            key={part.text}
            style={{ fontWeight: part.highlight ? 500 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </div>
    );
  };

  /**
   *
   *
   * @returns
   * @memberof InputAutoSuggest
   */
  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      label: this.props.label,
      value,
      onChange: this.onChange
    };
    return (
      <Autosuggest
        renderInputComponent={this.renderInputComponent}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={() => true}
      />
    );
  }
}
