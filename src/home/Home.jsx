import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from './components/Header';
import { COLORS } from '../constants/theme';
import { fetchCategories, fetchExpensesFromUser } from '../redux/actions';

const Home = (props) => {
  useEffect(() => {
    props.fetchCategories();
  }, []);

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.expenseSummary}></div>
        <div style={styles.expenseList}></div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchCategories, fetchExpensesFromUser }, dispatch);

export default connect(null, mapDispatchToProps)(Home);

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: COLORS.lightGray2,
  },
  expenseSummary: {
    flex: 7,
    borderRight: `1px solid ${COLORS.darkGray}`,
  },
  expenseList: { flex: 3 },
};
