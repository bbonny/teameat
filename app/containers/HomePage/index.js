import _ from 'lodash';
import React from 'react';

import { connect } from 'react-redux';

import Geosuggest from 'components/Geosuggest';
import { actions } from '../../reducers/places';
import { createSelector } from 'reselect';
import { selectPlaces } from './selectors';

import styles from './styles.css';

export class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.getPlacesRequest();
  }
  componentWillReceiveProps(newProps) {
    if (this.props.addPlace && this.props.addPlace.sending && !newProps.addPlace.sending) {
      this.props.getPlacesRequest();
    }
  }
  render() {
    return (
      <div className={styles.homePage}>
        <Geosuggest
          country="fr"
          onSelect={(place) => this.props.addPlaceRequest(place)}
        />
        <ul>
        { this.props.getPlaces && this.props.getPlaces.data && _.map(this.props.getPlaces.data, (place, index) => (
          <li key={index}>{ place.place && place.place.label }</li>
        )) }
        </ul>
      </div>
    );
  }
}

HomePage.propTypes = {
  addPlaceRequest: React.PropTypes.func,
  getPlacesRequest: React.PropTypes.func,
  addPlace: React.PropTypes.object,
  getPlaces: React.PropTypes.object,
};

const mapStateToProps = createSelector(
  selectPlaces(),
  (places) => ({
    addPlace: places.addPlace,
    getPlaces: places.getPlaces,
  })
);

function mapDispatchToProps(dispatch) {
  return {
    addPlaceRequest: actions.addPlaceRequest(dispatch),
    getPlacesRequest: actions.getPlacesRequest(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
