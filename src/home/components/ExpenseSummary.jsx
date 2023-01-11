import React from 'react';
import { connect } from 'react-redux';

import { COLORS, SIZES } from 'constants/theme';

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
      {categories.length > 0 && (
        <>
          <h2 style={{ paddingLeft: 20, color: COLORS.primary }}>Categories</h2>
          <div style={styles.categoriesContainer}>
            {categories.map((category) => {
              const setColor = (selectedColor, defaultColor) =>
                props.selectedCategory?.name === category.name
                  ? selectedColor
                  : defaultColor;

              return (
                <div
                  style={{
                    ...styles.categoryContainer,
                    backgroundColor: setColor(category.color, COLORS.white),
                  }}
                  key={category.id}
                  onClick={() => setSelectCategoryByName(category.name)}
                  data-testid='category-summary-container'
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      data-testid={`category-${category.id}-color`}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 5,
                        marginRight: 10,
                        backgroundColor: setColor(COLORS.white, category.color),
                      }}
                    />
                    <p
                      style={{
                        ...styles.categoryName,
                        color: setColor(COLORS.white, COLORS.darkGray),
                      }}
                    >
                      {category.name}
                    </p>
                  </div>
                  <p
                    style={{
                      ...styles.categoryTotal,
                      color: setColor(COLORS.white, COLORS.primary),
                    }}
                  >
                    {category.total?.toFixed(0)}€
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
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
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    justifyContent: 'center',
    flex: 0.8,
  },
  categoryContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '19vw',
    boxShadow: `0px 5px 10px ${COLORS.darkGray}`,
    borderRadius: SIZES.borderRadius.l,
    margin: 5,
    padding: SIZES.padding,
    cursor: 'pointer',
  },
  categoryName: {
    fontSize: SIZES.h3,
    fontWeight: '500',
    margin: 0,
  },
  categoryTotal: {
    fontWeight: 'bold',
    fontSize: SIZES.body,
    margin: 0,
  },
};
