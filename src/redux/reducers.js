import { CATEGORIES_CHANGE, EXPENSES_CHANGE } from './constants';

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
    default:
      return state;
  }
};

export default reducer;
