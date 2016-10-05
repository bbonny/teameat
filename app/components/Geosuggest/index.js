/**
*
* Geosuggest
*
*/

import React from 'react';

import Input from 'components/Input';
import SuggestList from 'components/SuggestList';

import styles from './styles.css';

class Geosuggest extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      isSuggestsHidden: true,
      isLoading: false,
      activeSuggest: null,
      suggests: [],
      timer: null,
    };
  }
  componentWillMount() {
    const googleMaps = (window.google && // eslint-disable-line no-extra-parens
      window.google.maps) ||
      this.googleMaps;

    /* istanbul ignore next */
    if (!googleMaps) {
      console.error(// eslint-disable-line no-console
        'Google map api was not found in the page.');
      return;
    }
    this.googleMaps = googleMaps;

    this.autocompleteService = new googleMaps.places.AutocompleteService();
    this.geocoder = new googleMaps.Geocoder();
  }
  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }
  onInputChange = (userInput) => {
    this.setState({ userInput }, this.onAfterInputChange);
  }
  onAfterInputChange = () => {
    this.showSuggests();
  }
  onInputFocus = () => {
    this.showSuggests();
  }
  onInputBlur = () => {
    if (!this.state.ignoreBlur) {
      this.hideSuggests();
    }
  }
  onNext = () => this.activateSuggest('next')
  onPrev = () => this.activateSuggest('prev')
  onSelect = () => this.selectSuggest(this.state.activeSuggest)
  onSuggestMouseDown = () => this.setState({ ignoreBlur: true })
  onSuggestMouseOut = () => this.setState({ ignoreBlur: false })
  onSuggestNoResults = () => {
  }
  update(userInput) {
    this.setState({ userInput });
  }
  clear() {
    this.setState({ userInput: '' }, this.hideSuggests);
  }
  searchSuggests() {
    if (!this.state.userInput) {
      this.updateSuggests();
      return;
    }
    const options = {
      input: this.state.userInput,
    };
    ['location', 'radius', 'bounds', 'types'].forEach((option) => {
      if (this.props[option]) {
        options[option] = this.props[option];
      }
    });
    if (this.props.country) {
      options.componentRestrictions = {
        country: this.props.country,
      };
    }
    this.setState({ isLoading: true }, () => {
      this.autocompleteService.getPlacePredictions(
        options,
        (suggestsGoogle) => {
          this.setState({ isLoading: false });
          this.updateSuggests(suggestsGoogle || [], // can be null
            () => {
              if (this.props.autoActivateFirstSuggest &&
                !this.state.activeSuggest
              ) {
                this.activateSuggest('next');
              }
            });
        }
      );
    });
  }
  updateSuggests(suggestsGoogle = [], callback) {
    const suggests = [];
    let activeSuggest = null;

    suggestsGoogle.forEach((suggest) => {
      suggests.push({
        label: suggest.description,
        placeId: suggest.place_id,
        isFixture: false,
      });
    });

    activeSuggest = this.updateActiveSuggest(suggests);
    this.setState({ suggests, activeSuggest }, callback);
  }
  updateActiveSuggest(suggests = []) {
    let activeSuggest = this.state.activeSuggest;

    if (activeSuggest) {
      const newSuggest = suggests.find((listedSuggest) =>
        activeSuggest.placeId === listedSuggest.placeId &&
        activeSuggest.isFixture === listedSuggest.isFixture
      );

      activeSuggest = newSuggest || null;
    }

    return activeSuggest;
  }
  showSuggests() {
    this.searchSuggests();
    this.setState({ isSuggestsHidden: false });
  }
  hideSuggests = () => {
    const timer = setTimeout(() => {
      this.setState({
        isSuggestsHidden: true,
        activeSuggest: null,
      });
    }, 100);

    this.setState({ timer });
  }
  activateSuggest(direction) { // eslint-disable-line complexity
    if (this.state.isSuggestsHidden) {
      this.showSuggests();
      return;
    }

    const suggestsCount = this.state.suggests.length - 1;
    const next = direction === 'next';
    let newActiveSuggest = null;
    let newIndex = 0;
    let i = 0;

    for (i; i <= suggestsCount; i += 1) {
      if (this.state.suggests[i] === this.state.activeSuggest) {
        newIndex = next ? i + 1 : i - 1;
      }
    }

    if (!this.state.activeSuggest) {
      newIndex = next ? 0 : suggestsCount;
    }

    if (newIndex >= 0 && newIndex <= suggestsCount) {
      newActiveSuggest = this.state.suggests[newIndex];
    }
    this.setState({ activeSuggest: newActiveSuggest });
  }
  selectSuggest = (suggest) => {
    let newSuggest = suggest;
    if (!newSuggest) {
      newSuggest = {
        label: this.state.userInput,
      };
    }

    if (suggest) {
      this.props.onSelect(newSuggest);
    }

    this.setState({
      isSuggestsHidden: true,
      userInput: newSuggest.label,
    });

    if (newSuggest.location) {
      this.setState({ ignoreBlur: false });
      return;
    }

    this.geocodeSuggest(newSuggest);
  }
  geocodeSuggest(suggest) {
    const newSuggest = suggest;
    this.geocoder.geocode(
      newSuggest.placeId && !newSuggest.isFixture ?
        { placeId: newSuggest.placeId } : { address: newSuggest.label },
      (results, status) => {
        if (status !== this.googleMaps.GeocoderStatus.OK) {
          return;
        }

        const gmaps = results[0];
        const location = gmaps.geometry.location;

        newSuggest.gmaps = gmaps;
        newSuggest.location = {
          lat: location.lat(),
          lng: location.lng(),
        };
      }
    );
  }
  render() {
    const input = (<Input
      className={styles.input}
      value={this.state.userInput}
      ignoreEnter={!this.state.isSuggestsHidden}
      onChange={this.onInputChange}
      onFocus={this.onInputFocus}
      onBlur={this.onInputBlur}
      onNext={this.onNext}
      onPrev={this.onPrev}
      onSelect={this.onSelect}
      onEscape={this.hideSuggests}
    />);
    const suggestionsList = (<SuggestList
      isHidden={this.state.isSuggestsHidden}
      suggests={this.state.suggests}
      activeSuggest={this.state.activeSuggest}
      onSuggestNoResults={this.onSuggestNoResults}
      onSuggestMouseDown={this.onSuggestMouseDown}
      onSuggestMouseOut={this.onSuggestMouseOut}
      onSuggestSelect={this.selectSuggest}
    />);
    return (
      <div className={styles.geosuggest}>
        <div>
          {input}
        </div>
        <div>
          {suggestionsList}
        </div>
      </div>
    );
  }
}

Geosuggest.propTypes = {
  autoActivateFirstSuggest: React.PropTypes.bool,
  country: React.PropTypes.string,
  onSelect: React.PropTypes.func,
};

export default Geosuggest;
