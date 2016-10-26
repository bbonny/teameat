/**
*
* SuggestList
*
*/

import React from 'react';

import classnames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

import SuggestItem from 'components/SuggestItem';

import styles from './styles.css';

class SuggestList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  isHidden() {
    return this.props.isHidden || this.props.suggests.length === 0;
  }
  render() {
    const classes = classnames(
      styles.suggestList,
      { [styles['suggestList--hidden']]: this.isHidden() }
    );
    return (
      <ul
        className={classes}
      >
        {this.props.suggests.map((suggest) => {
          const isActive = this.props.activeSuggest &&
            suggest.placeId === this.props.activeSuggest.placeId;
          return (
            <SuggestItem
              key={suggest.placeId}
              suggest={suggest}
              isActive={isActive}
              onBlur={() => 0}
              onMouseDown={this.props.onSuggestMouseDown}
              onMouseOut={this.props.onSuggestMouseOut}
              onSelect={this.props.onSuggestSelect}
            />);
        })}
      </ul>);
  }
}

SuggestList.propTypes = {
  activeSuggest: React.PropTypes.object,
  isHidden: React.PropTypes.bool,
  onSuggestMouseDown: React.PropTypes.func,
  onSuggestMouseOut: React.PropTypes.func,
  onSuggestSelect: React.PropTypes.func,
  suggests: React.PropTypes.array,
};

export default SuggestList;
