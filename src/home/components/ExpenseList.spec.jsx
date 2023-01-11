import React from 'react';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import ExpenseList from './ExpenseList';

jest.mock('redux/actions', () => ({
  confirmExpense: () => ({
    type: 'TESTING',
  }),
}));

describe('ExpenseList', () => {
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
          title: 'test',
          location: 'testplace',
          status: 'P',
          total: 15,
          id: '3',
        },
      ],
    },
  ];

  const user = userEvent.setup();

  describe('render', () => {
    describe('if there are no expenses data', () => {
      it('shows the correct content', () => {
        render(<ExpenseList />);
        expect(screen.getByText('No record')).toBeInTheDocument();
      });
    });

    describe('if there are some expenses data', () => {
      it('has the correct amount of expenses in the list', () => {
        render(<ExpenseList />, {
          preloadedState: { categoriesData: initialCategoriesData },
        });
        expect(screen.getAllByTestId('expense-container')).toHaveLength(1);
      });

      it('shows the correct content', () => {
        render(<ExpenseList />, {
          preloadedState: { categoriesData: initialCategoriesData },
        });

        expect(screen.queryByText('No record')).not.toBeInTheDocument();
        expect(
          screen.getByRole('heading', { name: 'Pending Expenses' })
        ).toBeInTheDocument();

        expect(
          screen.getByRole('heading', {
            name: `${initialCategoriesData[0].expenses[0].title} – ${initialCategoriesData[0].expenses[0].total}€`,
          })
        ).toBeInTheDocument();
        expect(
          screen.getByText(initialCategoriesData[0].expenses[0].description)
        ).toBeInTheDocument();
        expect(
          screen.getByText(initialCategoriesData[0].expenses[0].location)
        ).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveStyle(
          `background-color: ${initialCategoriesData[0].color}`
        );
      });
    });
  });

  describe('when clicking on the confirm button', () => {
    it('shows a notification banner', async () => {
      render(<ExpenseList />, {
        preloadedState: { categoriesData: initialCategoriesData },
      });
      user.click(screen.getByRole('button'));

      expect(
        await screen.findByText('Successfully updated!')
      ).toBeInTheDocument();
    });
  });
});
