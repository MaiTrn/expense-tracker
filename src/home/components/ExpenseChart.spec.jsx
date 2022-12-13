import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import ExpenseChart from './ExpenseChart';

describe('ExpenseChart', () => {
  const initialCategoriesData = [
    {
      color: '#F6A192',
      icon: 'healthcare',
      id: '1',
      name: 'Beauty & Care',
      expenses: [
        {
          creation: { year: 2022, month: 12, date: 1 },
          description: 'Test expense',
          title: 'test',
          status: 'C',
          total: 15,
        },
      ],
    },
    {
      color: '#FFD573',
      icon: 'education',
      id: '2',
      name: 'Education',
      expenses: [
        {
          creation: { year: 2022, month: 12, date: 12 },
          description: 'education expense',
          title: 'Education test',
          status: 'C',
          total: 20,
        },
      ],
    },
  ];

  const user = userEvent.setup();

  describe('render', () => {
    describe('if there are no expenses data', () => {
      it('shows the correct content', () => {
        render(<ExpenseChart />);
        expect(screen.getByText('No record')).toBeInTheDocument();
      });
    });

    describe('if there are some expenses data', () => {
      it('shows the correct content', () => {
        render(<ExpenseChart />, {
          preloadedState: { categoriesData: initialCategoriesData },
        });
        expect(screen.queryByText('No record')).not.toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Expenses')).toBeInTheDocument();
      });

      it('has the correct amount of slices', () => {
        render(<ExpenseChart />, {
          preloadedState: { categoriesData: initialCategoriesData },
        });
        expect(screen.getAllByRole('presentation')).toHaveLength(2);
      });

      it('renders the correct amount of expenses percentage', () => {
        render(<ExpenseChart />, {
          preloadedState: { categoriesData: initialCategoriesData },
        });

        const totalAmountOfExpenses = initialCategoriesData.reduce((acc, c) => {
          const categoryTotal = c.expenses.reduce(
            (total, e) => total + (e.total || 0),
            0
          );
          return acc + categoryTotal || 0;
        }, 0);

        expect(
          screen.getByText(
            `${(
              (initialCategoriesData[0].expenses[0].total /
                totalAmountOfExpenses) *
              100
            ).toFixed(0)}%`
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            `${(
              (initialCategoriesData[1].expenses[0].total /
                totalAmountOfExpenses) *
              100
            ).toFixed(0)}%`
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('when clicking on an expense slice', () => {
    it('calls the setSelectedCategory function with correct parameters', async () => {
      const mockSetCategory = jest.fn();
      render(<ExpenseChart setSelectedCategory={mockSetCategory} />, {
        preloadedState: { categoriesData: initialCategoriesData },
      });

      user.click(screen.getAllByRole('presentation')[0]);

      await waitFor(() => {
        expect(mockSetCategory).toHaveBeenCalledWith(initialCategoriesData[0]);
      });
    });
  });
});
