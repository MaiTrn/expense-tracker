import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { auth, methods, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import { COLORS, SIZES } from '../constants/theme';
import TextInput from './components/TextInput';

const bg = require('../assets/bg.png');

const RegisterSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Too short!')
    .max(25, 'Too long!')
    .required('Required!'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password does not match!')
    .required('Required!'),
  email: Yup.string().email('Invalid email!').required('Required!'),
  name: Yup.string().required('Required!'),
});

const Register = () => {
  const navigate = useNavigate();

  const onRegister = async (values) => {
    const { name, email, password } = values;
    const modifiedName = name.charAt(0).toUpperCase() + name.slice(1);

    try {
      await methods.createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'usersData', auth?.currentUser.uid), {
        name: modifiedName,
        email,
      });
    } catch (err) {
      console.log(err);
    }

    navigate('/');
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      validationSchema: RegisterSchema,
      onSubmit: onRegister,
    });

  return (
    <div>
      <img style={styles.backgroundImage} src={bg} alt='background' />
      <div style={styles.container}>
        <h1 style={{ fontSize: 48, color: COLORS.primary }}>
          Sign up and track your expenses
        </h1>
        <div style={styles.formWrapper}>
          <TextInput
            placeholder='Enter your name'
            value={values.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            errors={errors.name}
            touched={touched.name}
            autoCapitalize='none'
            icon={faUser}
          />
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
          <TextInput
            placeholder='Confirm your password'
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            errors={errors.confirmPassword}
            touched={touched.confirmPassword}
            autoCapitalize='none'
            icon={faLock}
            type='password'
          />
          <button type='submit' onClick={handleSubmit} style={styles.button}>
            Sign up
          </button>
          <Link
            to='/'
            style={{ textDecoration: 'none', color: COLORS.primary }}
          >
            Got an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  formWrapper: {
    backgroundColor: COLORS.lightGray,
    padding: '30px 70px 30px 70px',
    borderRadius: SIZES.borderRadius.l,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
