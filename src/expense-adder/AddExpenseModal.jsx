import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { COLORS, SIZES } from 'constants/theme';
import Input from './components/Input';
import { addExpense } from 'redux/actions';

const expenseSchema = Yup.object().shape({
  selectedCategory: Yup.string().required('Required!'),
  title: Yup.string()
    .max(20, 'Title cannot be longer than 20 words!')
    .required('Required!'),
  description: Yup.string().max(
    60,
    'Description cannot be longer than 60 words!'
  ),
  location: Yup.string().max(20, 'Location cannot be longer than 20 words!'),
  status: Yup.string().required('Required!'),
  total: Yup.number().required('Required!'),
});

const AddExpenseModal = (props) => {
  const [categories, setCategories] = useState([]);
  const statusType = [
    { label: 'Confirm', value: 'C' },
    { label: 'Pending', value: 'P' },
  ];

  useEffect(() => {
    let c = props.categoriesData?.map((category) => ({
      label: category.name,
      value: category.id,
    }));
    setCategories(c);
  }, []);

  const saveExpense = (values) => {
    props.addExpense(values);
    props.setAdded(true);
    props.setOpen(false);
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        title: '',
        description: '',
        location: '',
        total: '',
        status: '',
        selectedCategory: '',
      },
      validationSchema: expenseSchema,
      onSubmit: saveExpense,
    });

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>ADD NEW EXPENSE</h2>
        <div style={styles.formContainer}>
          <Input
            label='Category*'
            select
            items={categories}
            value={values.selectedCategory}
            onChange={handleChange('selectedCategory')}
            errors={errors.selectedCategory}
            touched={touched.selectedCategory}
            onBlur={handleBlur('selectedCategory')}
          />
          <Input
            label='Title*'
            placeholder='Expense title'
            onChange={handleChange('title')}
            value={values.title}
            errors={errors.title}
            touched={touched.title}
            onBlur={handleBlur('title')}
          />
          <Input
            label='Description'
            placeholder='Expense description'
            onChange={handleChange('description')}
            value={values.description}
            errors={errors.description}
            touched={touched.description}
            onBlur={handleBlur('description')}
          />
          <Input
            label='Location'
            placeholder='Expense location'
            onChange={handleChange('location')}
            value={values.location}
            errors={errors.location}
            touched={touched.location}
            onBlur={handleBlur('location')}
          />
          <Input
            label='Total*'
            placeholder='Expense cost'
            onChange={handleChange('total')}
            type='number'
            value={values.total}
            errors={errors.total}
            touched={touched.total}
            onBlur={handleBlur('total')}
          />
          <Input
            label='Status*'
            select
            value={values.status}
            items={statusType}
            onChange={handleChange('status')}
            placeholder='Expense status'
            errors={errors.status}
            touched={touched.status}
            onBlur={handleBlur('status')}
          />
        </div>
        <div style={styles.buttonContainer}>
          <button
            style={styles.cancelButton}
            onClick={() => props.setOpen(false)}
          >
            CANCEL
          </button>
          <button
            type='submit'
            style={styles.saveButton}
            onClick={handleSubmit}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (store) => ({
  categoriesData: store.categoriesData,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ addExpense }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddExpenseModal);

const styles = {
  container: {
    width: 700,
    height: 700,
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    borderRadius: SIZES.borderRadius.l,
  },

  background: {
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'fixed',
    top: 0,
    zIndex: 999,
  },
  title: {
    margin: '40px 0px 30px 100px',
    color: COLORS.primary,
    fontSize: SIZES.h2,
    fontWeight: 'bold',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonContainer: { position: 'absolute', bottom: 40, right: 40 },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 110,
    marginRight: 20,
    color: COLORS.primary,
    fontSize: SIZES.h3,
    backgroundColor: 'transparent',
    border: 0,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 110,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    border: 0,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
    cursor: 'pointer',
  },
};
