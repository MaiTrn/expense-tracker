import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { auth, methods } from '../utils/firebase';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import { COLORS, SIZES } from '../constants/theme';
import TextInput from './components/TextInput';

const bg = require('../assets/bg.png');

const LoginSchema = Yup.object().shape({
  password: Yup.string().required('Required!'),
  email: Yup.string().email('Invalid email!').required('Required!'),
});

const Login = () => {
  const onLogin = async (values) => {
    const { email, password } = values;
    try {
      await methods.signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: LoginSchema,
      onSubmit: onLogin,
    });

  return (
    <div>
      <img style={styles.backgroundImage} src={bg} alt='background' />
      <div style={styles.container}>
        <div style={styles.columnContainer}>
          <div style={{ flexDirection: 'column' }}>
            <h1 style={{ fontSize: SIZES.largeTitle, color: COLORS.primary }}>
              Expense Tracker
            </h1>
            <span style={{ fontSize: SIZES.h2 }}>
              Keep track of your expenses monthly
            </span>
          </div>
        </div>
        <div style={styles.columnContainer}>
          <div style={styles.formWrapper}>
            <TextInput
              placeholder='Enter your email'
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              errors={errors.email}
              touched={touched.email}
              autoCapitalize='none'
              icon={faEnvelope}
            />
            <TextInput
              placeholder='Enter your password'
              value={values.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              errors={errors.password}
              touched={touched.password}
              autoCapitalize='none'
              icon={faLock}
              type='password'
            />
            <button type='submit' onClick={handleSubmit} style={styles.button}>
              Sign in
            </button>
            <Link
              to='/signup'
              style={{ textDecoration: 'none', color: COLORS.primary }}
            >
              New user? Create a new account!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
  },
  backgroundImage: {
    position: 'absolute',
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  columnContainer: {
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formWrapper: {
    backgroundColor: COLORS.lightGray,
    padding: '50px 70px 50px 70px',
    borderRadius: SIZES.borderRadius.l,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    width: 150,
    height: 40,
    borderRadius: SIZES.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
