import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Snackbar, Alert } from '@mui/material';

import icons from '../../constants/icons';
import { COLORS, SIZES } from '../../constants/theme';
import { confirmExpense, fetchCategories } from '../../redux/actions';

const ExpenseList = (props) => {
  const [open, setOpen] = useState(false);

  const incomingExpenses = props.categoriesData.map((item) => {
    let pendingExpenses = item.expenses?.filter((e) => e.status === 'P');
    return {
      ...item,
      expenses: pendingExpenses,
    };
  });
  const totalExpenses = incomingExpenses.reduce((acc, c) => {
    const totalPerCategory = c.expenses?.length || 0;
    return acc + totalPerCategory;
  }, 0);

  return (
    <div style={styles.container}>
      <h2 style={{ color: COLORS.primary, fontSize: SIZES.h2, margin: 0 }}>
        Pending Expenses
      </h2>
      {totalExpenses > 0 && (
        <ul>
          {incomingExpenses.map((category) => {
            const iconName = icons[category.icon];
            return category.expenses?.map((expense) => {
              return (
                <div
                  key={expense.id}
                  style={styles.itemContainer}
                  data-testid='expense-container'
                >
                  <div style={styles.expenseContainer}>
                    <FontAwesomeIcon
                      icon={fas[iconName]}
                      color={category.color}
                      size='xl'
                    />
                    <div style={styles.expenseSummary}>
                      <h3 style={styles.expenseTitle}>
                        {expense.title} – {expense.total}€
                      </h3>
                      <p style={styles.expenseDescription}>
                        {expense.description}
                      </p>
                      {expense.location && (
                        <div
                          style={{
                            display: 'flex',
                            color: COLORS.darkGray,
                            alignItems: 'center',
                          }}
                        >
                          <FontAwesomeIcon
                            icon={fas['faLocationDot']}
                            size='sm'
                          />
                          <span style={{ paddingLeft: SIZES.spacing.s }}>
                            {expense.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    style={{
                      ...styles.confirmButton,
                      backgroundColor: category.color,
                    }}
                    onClick={() => {
                      props.confirmExpense(expense, category.id);
                      setOpen(true);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={fas['faCheck']}
                      color={COLORS.white}
                      size='xl'
                    />
                  </button>
                </div>
              );
            });
          })}
        </ul>
      )}
      {totalExpenses === 0 && (
        <div style={styles.noExpenseContainer}>No record</div>
      )}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity='success'
          sx={{ width: '100%' }}
        >
          Successfully updated!
        </Alert>
      </Snackbar>
    </div>
  );
};
const mapStateToProps = (store) => ({
  categoriesData: store.categoriesData,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ confirmExpense, fetchCategories }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseList);

const styles = {
  noExpenseContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 450,
    color: COLORS.primary,
    fontSize: SIZES.h2,
    fontWeight: 'bold',
  },
  container: {
    height: '95%',
    padding: SIZES.padding,
    overflowY: 'scroll',
  },
  itemContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: `${SIZES.spacing.m}px 0`,
    overflow: 'hidden',
    height: 100,
    boxShadow: `0px 2px 5px ${COLORS.darkGray}`,
  },
  expenseContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${SIZES.padding}px`,
    maxWidth: 300,
  },
  expenseSummary: {
    marginLeft: SIZES.spacing.m,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  expenseTitle: {
    margin: 0,
    marginBottom: 4,
    color: COLORS.primary,
  },
  expenseDescription: {
    margin: 0,
    marginBottom: 4,
    color: COLORS.darkGray,
    wordWrap: 'break-word',
    width: 250,
  },
  confirmButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 40,
    cursor: 'pointer',
    border: 0,
  },
};
