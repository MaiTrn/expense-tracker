import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import ExpenseSummary from './ExpenseSummary';

describe('ExpenseSummary', () => {
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
          status: 'C',
          total: 15,
        },
        {
          creation: { year: 2022, month: date.getMonth() + 1, date: 10 },
          description: 'Test expense',
          title: 'test 2',
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
          creation: { year: 2022, month: date.getMonth() + 1, date: 12 },
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
        render(<ExpenseSummary />);
        expect(screen.queryByText('Categories')).not.toBeInTheDocument();
      });
    });

    describe('if there are some expenses data', () => {
      it('has the correct amount of category summary blocks', () => {
        render(<ExpenseSummary />, {
          preloadedState: { categoriesData: initialCategoriesData },
        });
        expect(
          screen.getAllByTestId('category-summary-container')
        ).toHaveLength(2);
      });

      it('renders the correct content', () => {
        render(<ExpenseSummary />, {
          preloadedState: { categoriesData: initialCategoriesData },
        });

        expect(
          screen.getByRole('heading', { name: 'Categories' })
        ).toBeInTheDocument();

        expect(
          screen.getByText(initialCategoriesData[0].name)
        ).toBeInTheDocument();
        expect(screen.getByText('30€')).toBeInTheDocument();
        expect(
          screen.getByTestId(`category-${initialCategoriesData[0].id}-color`)
        ).toHaveStyle(`backgroundColor: ${initialCategoriesData[0].color}`);

        expect(
          screen.getByText(initialCategoriesData[1].name)
        ).toBeInTheDocument();
        expect(screen.getByText('20€')).toBeInTheDocument();
        expect(
          screen.getByTestId(`category-${initialCategoriesData[1].id}-color`)
        ).toHaveStyle(`backgroundColor: ${initialCategoriesData[1].color}`);
      });
    });
  });

  describe('when clicking on an expense summary', () => {
    it('changes the color of the container', async () => {
      let mockCategory;
      const mockSetCategory = jest.fn((c) => {
        mockCategory = c;
      });

      const { rerender } = render(
        <ExpenseSummary setSelectedCategory={mockSetCategory} />,
        {
          preloadedState: { categoriesData: initialCategoriesData },
        }
      );
      user.click(screen.getAllByTestId('category-summary-container')[0]);

      await waitFor(() => {
        expect(mockSetCategory).toHaveBeenCalledWith(initialCategoriesData[0]);
      });

      rerender(<ExpenseSummary selectedCategory={mockCategory} />);
      expect(
        screen.getAllByTestId('category-summary-container')[0]
      ).toHaveStyle(`backgroundColor: ${initialCategoriesData[0].color}`);
    });
  });
});
