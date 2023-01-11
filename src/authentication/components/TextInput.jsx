import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { COLORS, SIZES } from 'constants/theme';

const TextInput = ({ icon, touched, errors, ...props }) => {
  const color = !touched
    ? COLORS.darkGray
    : errors
    ? COLORS.danger
    : COLORS.valid;

  return (
    <div style={{ marginBottom: SIZES.borderRadius.m }}>
      <div style={{ ...styles.inputContainer, borderColor: color }}>
        {icon && <FontAwesomeIcon icon={icon} />}
        <input style={styles.textInput} {...props} />
        {touched && (
          <FontAwesomeIcon
            color={color}
            size='sm'
            icon={errors ? faCircleXmark : faCircleCheck}
          />
        )}
      </div>
      <div style={styles.errorContainer}>{touched && errors}</div>
    </div>
  );
};

export default TextInput;

const styles = {
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 320,
    height: 48,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: SIZES.borderRadius.m,
    paddingLeft: SIZES.padding,
  },
  textInput: {
    width: 250,
    height: 50,
    color: COLORS.primary,
    border: 0,
    background: 'transparent',
    paddingLeft: SIZES.padding,
  },
  errorContainer: {
    height: 20,
    color: COLORS.danger,
    display: 'flex',
    alignItems: 'flex-start',
    paddingLeft: 15,
  },
};
