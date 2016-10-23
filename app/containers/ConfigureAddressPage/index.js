import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Geosuggest from 'components/Geosuggest';
import { actions } from '../../reducers/places';

import styles from './styles.css';

export class ConfigureAddressPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.configureAddressPage}>
        <Geosuggest
          country="fr"
          onSelect={(place) => this.props.setWorkAddressRequest(place)}
        />
      </div>
    );
  }
}

ConfigureAddressPage.propTypes = {
  setWorkAddressRequest: React.PropTypes.func,
};

const mapStateToProps = createSelector(
  (state) => ({
    auth: state.get('auth'),
    places: state.get('places'),
  }),
  ({ places, auth }) => ({
    setWorkAddressRequest: places.addPlace,
    signIn: auth.signIn,
    signOut: auth.signOut,
    user: auth.user,
  })
);

function mapDispatchToProps(dispatch) {
  return {
    setWorkAddressRequest: actions.setWorkAddressRequest(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureAddressPage);
