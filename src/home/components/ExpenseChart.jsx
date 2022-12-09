import React from 'react';
import { connect } from 'react-redux';
import { VictoryPie } from 'victory';
import { COLORS, SIZES } from '../../constants/theme';

const ExpenseChart = (props) => {
  // Filter expenses with "Confirmed status"
  const processCategoryDataToDisplay = () => {
    let chartData = props.categoriesData.map((item) => {
      let confirmedExpenses = item.expenses?.filter((e) => e.status === 'C');
      let total = confirmedExpenses?.reduce(
        (acc, e) => acc + (e.total || 0),
        0
      );
      return {
        name: item.name,
        y: total,
        expenseCount: confirmedExpenses?.length,
        color: item.color,
        id: item.id,
      };
    });
    // Filter out categories with no expenses
    let filteredChartData = chartData?.filter((item) => item.y > 0);

    // Calculate the total of all expenses
    let totalExpenses = filteredChartData?.reduce(
      (acc, c) => acc + (c.y || 0),
      0
    );
    return filteredChartData?.map((item) => {
      let percentage = ((item.y / totalExpenses) * 100).toFixed(0);

      return {
        label: `${percentage}%`,
        y: Number(item.y),
        name: item.name,
        expenseCount: item.expenseCount,
        color: item.color,
        id: item.id,
      };
    });
  };

  const setSelectCategoryByName = (name) => {
    let category = props.categoriesData?.filter((a) => a.name === name);
    props.setSelectedCategory(category[0]);
  };

  let chartData = [];
  chartData = processCategoryDataToDisplay();
  let colorScales = chartData?.map((item) => item.color);
  let totalExpenseCount = chartData?.reduce(
    (acc, c) => acc + (c.expenseCount || 0),
    0
  );

  if (chartData.length === 0) {
    return <div style={styles.noExpenseContainer}>No record</div>;
  }

  return (
    <div style={styles.container}>
      <svg
        viewBox='-25 -25 450 450'
        width='450px'
        height='450px'
        style={{ zIndex: 99 }}
      >
        <VictoryPie
          standalone={false}
          data={chartData}
          colorScale={colorScales}
          labels={(datum) => `${datum.y}`}
          radius={({ datum }) =>
            props.selectedCategory &&
            props.selectedCategory?.name === datum.name
              ? 210
              : 200
          }
          innerRadius={70}
          labelRadius={({ innerRadius }) => (210 + innerRadius) / 2.5}
          style={{
            labels: { fill: COLORS.white, fontSize: SIZES.h2 },
          }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onClick: () => {
                  return [
                    {
                      target: 'labels',
                      mutation: (props) => {
                        const categoryName = chartData[props.index].name;
                        return setSelectCategoryByName(categoryName);
                      },
                    },
                  ];
                },
              },
            },
          ]}
        />
        <text x={191} y={200} style={styles.expenseCountTitle}>
          {totalExpenseCount}
        </text>
        <text x={160} y={230} style={styles.expenseText}>
          Expenses
        </text>
      </svg>
      {/*box shadow*/}
      <div style={styles.shadow} />
    </div>
  );
};
const mapStateToProps = (store) => ({
  categoriesData: store.categoriesData,
});

export default connect(mapStateToProps, null)(ExpenseChart);

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
    position: 'relative',
    display: 'flex',
    height: 450,
    width: 450,
    justifyContent: 'center',
  },
  expenseCountTitle: {
    fill: COLORS.primary,
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    margin: 0,
  },
  expenseText: {
    fill: COLORS.darkGray,
    fontSize: SIZES.body2,
    margin: 0,
  },
  shadow: {
    position: 'absolute',
    top: 25,
    backgroundColor: 'transparent',
    height: 400,
    width: 400,
    zIndex: 0,
    borderRadius: '50%',
    boxShadow: `0px 0px 20px ${COLORS.darkGray}`,
  },
};
