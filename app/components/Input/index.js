/**
*
* Input
*
*/

import React from 'react';

import shallowCompare from 'react-addons-shallow-compare';

import styles from './styles.css';

class Input extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  onChange = () => {
    this.props.onChange(this.textInput.value);
  }
  onFocus = () => {
    this.props.onFocus();
  }
  onBlur = () => {
    this.props.onBlur();
  }
  onInputKeyDown = (event) => {
    switch (event.which) {
      case 40: // DOWN
        event.preventDefault();
        this.props.onNext();
        break;
      case 38: // UP
        event.preventDefault();
        this.props.onPrev();
        break;
      case 13: // ENTER
        this.props.onSelect();
        break;
      case 9: // TAB
        this.props.onSelect();
        break;
      default:
        break;
    }
  }
  focus() {
    this.textInput.focus();
  }
  render() {
    return (
      <input
        className={styles.input}
        type="text"
        autoComplete="off"
        ref={(ref) => { this.textInput = ref; }}
        value={this.props.value || ''}
        onKeyDown={this.onInputKeyDown}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    );
  }
}

Input.propTypes = {
  value: React.PropTypes.string,
  onBlur: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onNext: React.PropTypes.func,
  onPrev: React.PropTypes.func,
  onSelect: React.PropTypes.func,
};

export default Input;
