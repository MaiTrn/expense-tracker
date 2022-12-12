import {
  CATEGORIES_CHANGE,
  EXPENSES_CHANGE,
  UPDATE_EXPENSE,
  ADD_EXPENSE,
} from './constants';

const initialState = {
  categoriesData: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORIES_CHANGE:
      return {
        ...state,
        categoriesData: action.categoriesData,
      };
    case EXPENSES_CHANGE:
      return {
        ...state,
        categoriesData: state.categoriesData.map((category) =>
          category.id === action.categoryId
            ? {
                ...category,
                expenses: [...action.expenses],
              }
            : category
        ),
      };
    case UPDATE_EXPENSE:
      return {
        ...state,
        categoriesData: state.categoriesData.map((category) =>
          category.id === action.categoryId
            ? {
                ...category,
                expenses: category.expenses.map((expense) =>
                  expense.id === action.updatedExpense.id
                    ? action.updatedExpense
                    : expense
                ),
              }
            : category
        ),
      };
    case ADD_EXPENSE:
      return {
        ...state,
        categoriesData: state.categoriesData.map((category) =>
          category.id === action.categoryId
            ? {
                ...category,
                expenses: [...category.expenses, action.addedExpense],
              }
            : category
        ),
      };
    default:
      return state;
  }
};

export default reducer;
