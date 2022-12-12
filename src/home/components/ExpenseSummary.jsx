import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import icons from '../../constants/icons';
import { COLORS, SIZES } from '../../constants/theme';

const ExpenseSummary = (props) => {
  const categories = props.categoriesData.map((item) => {
    const confirmedExpenses = item.expenses?.filter((e) => e.status === 'C');
    const total = confirmedExpenses?.reduce(
      (acc, e) => acc + (e.total || 0),
      0
    );

    return {
      name: item.name,
      icon: item.icon,
      total,
      color: item.color,
      id: item.id,
    };
  });

  const setSelectCategoryByName = (name) => {
    let category = props.categoriesData?.filter((a) => a.name === name);
    props.setSelectedCategory(category[0]);
  };

  return (
    <div style={styles.container}>
      <h2 style={{ paddingLeft: 20, color: COLORS.primary }}>Categories</h2>
      <div style={styles.categoriesContainer}>
        {categories.map((category) => {
          const icon = icons[category.icon];
          return (
            <div
              style={{
                ...styles.categoryContainer,
                boxShadow: `0px 5px 10px ${
                  props.selectedCategory?.name === category.name
                    ? category.color
                    : COLORS.darkGray
                }`,
              }}
              key={category.id}
              onClick={() => setSelectCategoryByName(category.name)}
            >
              <FontAwesomeIcon
                icon={fas[icon]}
                color={category.color}
                style={{ width: 50, height: 50 }}
              />
              <p style={styles.categoryName}>{category.name}</p>
              <p style={styles.categoryTotal}>{category.total}€</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (store) => ({
  categoriesData: store.categoriesData,
});

export default connect(mapStateToProps, null)(ExpenseSummary);

const styles = {
  container: {
    display: 'flex',
    flex: 0.8,
    width: '95%',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 10,
  },
  categoriesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  categoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    height: 150,
    minWidth: 120,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius.l,
    margin: 5,
    padding: SIZES.padding,
  },
  categoryName: {
    color: COLORS.darkGray,
    fontSize: SIZES.h3,
    fontWeight: '500',
    marginTop: '30px',
    marginBottom: '5px',
  },
  categoryTotal: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: SIZES.body2,
    margin: 0,
  },
};
