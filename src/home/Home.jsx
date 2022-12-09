import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from './components/Header';
import { COLORS } from '../constants/theme';
import { fetchCategories } from '../redux/actions';
import ExpenseChart from './components/ExpenseChart';

const Home = (props) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    props.fetchCategories();
  }, []);

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.expenseSummary}>
          <ExpenseChart {...{ selectedCategory, setSelectedCategory }} />
        </div>
        <div style={styles.expenseList}></div>
      </div>
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
    justifyContent: 'center',
  },
  expenseList: { flex: 3 },
};
