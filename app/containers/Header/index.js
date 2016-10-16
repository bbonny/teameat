/*
 *
 * Header
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { actions } from '../../reducers/auth';

import messages from './messages';
import styles from './styles.css';


export class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  handleSignIn = (event) => {
    event.preventDefault();
    this.props.signInAuthRequest();
  }
  handleSignOut = (event) => {
    event.preventDefault();
    this.props.signOutAuthRequest();
  }
  render() {
    return (
      <div className={styles.header}>
        <div className={styles.brand}>
          <FormattedMessage {...messages.header} />
        </div>
        { this.props.user
        ? (
          <button className={styles.userName} onClick={this.handleSignOut}>
            { this.props.user.displayName }
          </button>
        ) : (
          <button className={styles.signIn} onClick={this.handleSignIn}>
            <FormattedMessage {...messages.signin} />
          </button>
        )}
      </div>
    );
  }
}

Header.propTypes = {
  signInAuthRequest: React.PropTypes.func,
  signOutAuthRequest: React.PropTypes.func,
  user: React.PropTypes.object,
};

const mapStateToProps = createSelector(
  (state) => state.get('auth'),
  (auth) => ({
    user: auth.user,
  })
);

function mapDispatchToProps(dispatch) {
  return {
    signInAuthRequest: actions.signInAuthRequest(dispatch),
    signOutAuthRequest: actions.signOutAuthRequest(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
