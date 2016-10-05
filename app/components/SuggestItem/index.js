/**
*
* SuggestItem
*
*/

import React from 'react';

import classnames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

import styles from './styles.css';

class SuggestItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  onClick = (event) => {
    event.preventDefault();
    this.props.onSelect(this.props.suggest);
  }
  render() {
    const classes = classnames(
      styles.suggestItem,
      { [styles['suggestItem--active']]: this.props.isActive },
    );
    return (
      <li // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={classes}
        onMouseDown={this.props.onMouseDown}
        onMouseOut={this.props.onMouseOut}
        onBlur={() => 0}
        onClick={this.onClick}
      >
        {this.props.suggest.label}
      </li>
    );
  }
}

SuggestItem.propTypes = {
  isActive: React.PropTypes.bool,
  suggest: React.PropTypes.object,
  onSelect: React.PropTypes.func,
  onMouseDown: React.PropTypes.func,
  onMouseOut: React.PropTypes.func,
};

export default SuggestItem;
