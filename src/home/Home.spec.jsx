import React from 'react';
import { render, screen } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import Home from './Home';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('../redux/actions', () => ({
  addExpense: () => ({
    type: 'TESTING',
  }),
  fetchCategories: () => ({
    type: 'TESTING',
  }),
}));

jest.mock('../expense-adder/AddExpenseModal', () => ({ setAdded, setOpen }) => {
  const mockAdd = () => {
    setAdded(true);
    setOpen(false);
  };

  return (
    <div>
      <h2>ADD NEW EXPENSE</h2>
      <button onClick={mockAdd}>SAVE</button>
    </div>
  );
});

describe('Home', () => {
  const date = new Date();
  const initialCategoriesData = [
    {
      color: '#F6A192',
      icon: 'healthcare',
      id: '1',
      name: 'Beauty & Care',
      expenses: [
        {
          creation: { year: 2022, month: date.getMonth() + 1, date: 1 },
          description: 'Test expense',
          title: 'test pending',
          location: 'testplace',
          status: 'P',
          total: 10,
          id: '3',
        },
        {
          creation: { year: 2022, month: date.getMonth() + 1, date: 1 },
          description: 'Test expense',
          title: 'test confirmed',
          location: 'testplace',
          status: 'C',
          total: 15,
          id: '3',
        },
      ],
    },
  ];

  const user = userEvent.setup();

  describe('render', () => {
    it('shows correct content initially', () => {
      render(<Home />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Expense Tracker' })
      ).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'profile' })).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Pending Expenses' })
      ).toBeInTheDocument();
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
      expect(screen.getByTestId('add-button')).toBeInTheDocument();
    });

    it('shows correct content if there are no expense date', () => {
      render(<Home />);
      expect(
        screen.queryByRole('heading', { name: 'Categories' })
      ).not.toBeInTheDocument();
      expect(screen.getAllByText('No record')).toHaveLength(2);
    });

    it('shows correct content if there are expense date', () => {
      render(<Home />, {
        preloadedState: { categoriesData: initialCategoriesData },
      });
      expect(
        screen.getByRole('heading', { name: 'Categories' })
      ).toBeInTheDocument();
      expect(screen.queryByText('No record')).not.toBeInTheDocument();
      expect(
        screen.getByText(
          `${initialCategoriesData[0].expenses[0].title} – ${initialCategoriesData[0].expenses[0].total}€`
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(`${initialCategoriesData[0].name}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`${initialCategoriesData[0].expenses[1].total}€`)
      ).toBeInTheDocument();
      expect(screen.getAllByRole('presentation')).toHaveLength(1);
    });
  });

  describe('when clicking on the add new expense button', () => {
    it('shows the modal', async () => {
      render(<Home />, {
        preloadedState: { categoriesData: initialCategoriesData },
      });
      user.click(screen.getByTestId('add-button'));

      expect(await screen.findByText('ADD NEW EXPENSE')).toBeInTheDocument();
    });
    describe('when adding a new expense successfully', () => {
      it('shows a notification banner', async () => {
        render(<Home />, {
          preloadedState: { categoriesData: initialCategoriesData },
        });
        user.click(screen.getByTestId('add-button'));

        user.click(await screen.findByRole('button', { name: 'SAVE' }));

        expect(
          await screen.findByText('Added a new expense!')
        ).toBeInTheDocument();

        expect(
          screen.queryByRole('heading', { name: 'ADD NEW EXPENSE' })
        ).not.toBeInTheDocument();
      });
    });
  });
});
