import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  CATEGORIES_CHANGE,
  EXPENSES_CHANGE,
  INVALID_CATEGORY_ID,
} from './constants';

const currentDate = new Date();
const fetchExpensesFromUser = (categoryId) => {
  let expensesList = [];

  return async (dispatch) => {
    if (!categoryId) {
      return dispatch({ type: INVALID_CATEGORY_ID });
    }

    let querySnapshot;
    const expensesRef = collection(
      db,
      'usersData',
      auth?.currentUser.uid,
      'expensesData',
      categoryId,
      'expenses'
    );

    const confirmedExpensesQuery = query(
      expensesRef,
      where('status', '==', 'C'),
      where('creation.month', '==', currentDate.getMonth() + 1),
      where('creation.year', '==', currentDate.getFullYear())
    );
    querySnapshot = await getDocs(confirmedExpensesQuery);
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      expensesList.push({ id, ...data });
    });

    const pendingExpensesQuery = query(expensesRef, where('status', '==', 'P'));
    querySnapshot = await getDocs(pendingExpensesQuery);
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      expensesList.push({ id, ...data });
    });

    dispatch({
      type: EXPENSES_CHANGE,
      expenses: expensesList,
      categoryId,
    });
  };
};

const fetchCategories = () => {
  return async (dispatch) => {
    const categoriesQuery = query(
      collection(db, 'categoriesData'),
      orderBy('name', 'asc')
    );

    const querySnapshot = await getDocs(categoriesQuery);
    const categoriesData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      return { id, ...data };
    });
    dispatch({ type: CATEGORIES_CHANGE, categoriesData });
    categoriesData.forEach((category) => {
      dispatch(fetchExpensesFromUser(category.id));
    });
  };
};

export { fetchCategories, fetchExpensesFromUser };
