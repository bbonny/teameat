import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';


import { FormattedMessage } from 'react-intl';
import Geosuggest from 'components/Geosuggest';
import { actions } from '../../reducers/places';

import styles from './styles.css';
import messages from './messages';

export class ConfigureAddressPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.getWorkAddressRequest();
  }
  componentWillReceiveProps(newProps) {
    if ((this.props.setWorkAddress && this.props.setWorkAddress.sending && !newProps.setWorkAddress.sending)) {
      this.props.getWorkAddressRequest();
    }
  }
  render() {
    if (!this.props.getWorkAddress || this.props.getWorkAddress.sending) { return <div />; }
    return (
      <div className={styles.configureAddressPage}>
        { this.props.getWorkAddress &&
          <div>
          {this.props.getWorkAddress.data ?
          (
            <div>
              <FormattedMessage {...messages.workAdress} />
              { this.props.getWorkAddress.data.label }
            </div>
          ) : (
            <FormattedMessage {...messages.noWorkAdress} />
          )
          }
          </div>
        }
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
  getWorkAddressRequest: React.PropTypes.func,
  getWorkAddress: React.PropTypes.object,
  setWorkAddress: React.PropTypes.object,
};

const mapStateToProps = createSelector(
  (state) => ({
    auth: state.get('auth'),
    places: state.get('places'),
  }),
  ({ places, auth }) => ({
    setWorkAddress: places.setWorkAddress,
    getWorkAddress: places.getWorkAddress,
    signIn: auth.signIn,
    signOut: auth.signOut,
    user: auth.user,
  })
);

function mapDispatchToProps(dispatch) {
  return {
    setWorkAddressRequest: actions.setWorkAddressRequest(dispatch),
    getWorkAddressRequest: actions.getWorkAddressRequest(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureAddressPage);
