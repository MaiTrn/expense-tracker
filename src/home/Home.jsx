import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Calendar from 'react-calendar';
import { Snackbar, Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Header from './components/Header';
import { COLORS } from '../constants/theme';
import { fetchCategories } from '../redux/actions';

import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import ExpenseSummary from './components/ExpenseSummary';
import AddExpenseModal from '../expense-adder/AddExpenseModal';
import 'react-calendar/dist/Calendar.css';
import '../constants/Calendar.css';

const Home = (props) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    props.fetchCategories();
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <Header />
      <div style={styles.container}>
        <div style={styles.expenseSummary}>
          <div
            style={{
              display: 'flex',
              width: '56rem',
              justifyContent: 'space-between',
            }}
          >
            <ExpenseChart {...{ selectedCategory, setSelectedCategory }} />
            <div style={{ height: 100, paddingTop: '5vh' }}>
              <Calendar />
            </div>
          </div>
          <ExpenseSummary {...{ selectedCategory, setSelectedCategory }} />
          <button style={styles.addButton} onClick={() => setOpen(true)}>
            <FontAwesomeIcon icon={faPlus} color={COLORS.white} size='2xl' />
          </button>
        </div>
        <div style={styles.expenseList}>
          <ExpenseList />
        </div>
      </div>
      {open && <AddExpenseModal setOpen={setOpen} setAdded={setAdded} />}
      <Snackbar
        open={added}
        autoHideDuration={4000}
        onClose={() => setAdded(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setAdded(false)}
          severity='success'
          sx={{ width: '100%' }}
        >
          Added a new expense!
        </Alert>
      </Snackbar>
    </div>
  );
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchCategories }, dispatch);

export default connect(null, mapDispatchToProps)(Home);

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 71px)', //header + header border
    backgroundColor: COLORS.lightGray2,
    overflow: 'hidden',
  },
  expenseSummary: {
    flex: 7,
    borderRight: `1px solid ${COLORS.darkGray}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  expenseList: { flex: 3 },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    backgroundColor: COLORS.secondary,
    position: 'absolute',
    bottom: 0,
    top: 0,
    margin: 'auto 0',
    right: 70,
    border: 0,
    boxShadow: `5px 5px 10px ${COLORS.darkGray}`,
    cursor: 'pointer',
  },
};
