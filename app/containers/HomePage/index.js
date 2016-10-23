import _ from 'lodash';
import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Geosuggest from 'components/Geosuggest';
import { actions } from '../../reducers/places';

import styles from './styles.css';

export class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.getPlacesRequest();
  }
  componentWillReceiveProps(newProps) {
    if ((this.props.addPlace && this.props.addPlace.sending && !newProps.addPlace.sending) ||
      (this.props.deletePlace && this.props.deletePlace.sending && !newProps.deletePlace.sending) ||
      (this.props.signIn && this.props.signIn.sending && !newProps.signIn.sending) ||
      (this.props.signOut && this.props.signOut.sending && !newProps.signOut.sending) ||
      (this.props.user !== newProps.user)
    ) {
      this.props.getPlacesRequest();
    }
  }
  handleDelete = (event) => {
    event.preventDefault();
    this.props.deletePlaceRequest(event.currentTarget.id);
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
          <li key={index}>
            { place && place.label }
            <button id={place.placeId} onClick={this.handleDelete}>x</button>
          </li>
        )) }
        </ul>
      </div>
    );
  }
}

HomePage.propTypes = {
  addPlaceRequest: React.PropTypes.func,
  deletePlaceRequest: React.PropTypes.func,
  getPlacesRequest: React.PropTypes.func,
  addPlace: React.PropTypes.object,
  deletePlace: React.PropTypes.object,
  getPlaces: React.PropTypes.object,
  signIn: React.PropTypes.object,
  signOut: React.PropTypes.object,
  user: React.PropTypes.object,
};

const mapStateToProps = createSelector(
  (state) => ({
    places: state.get('places'),
    auth: state.get('auth'),
  }),
  ({ places, auth }) => ({
    addPlace: places.addPlace,
    deletePlace: places.deletePlace,
    getPlaces: places.getPlaces,
    signIn: auth.signIn,
    signOut: auth.signOut,
    user: auth.user,
  })
);

function mapDispatchToProps(dispatch) {
  return {
    addPlaceRequest: actions.addPlaceRequest(dispatch),
    deletePlaceRequest: actions.deletePlaceRequest(dispatch),
    getPlacesRequest: actions.getPlacesRequest(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
