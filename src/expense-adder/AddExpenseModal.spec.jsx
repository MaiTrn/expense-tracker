import React from 'react';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import AddExpenseModal from './AddExpenseModal';

jest.mock('../redux/actions', () => ({
  addExpense: () => ({
    type: 'TESTING',
  }),
}));

describe('AddExpenseModal', () => {
  const initialCategoriesData = [
    {
      color: '#F6A192',
      icon: 'healthcare',
      id: '1',
      name: 'Beauty & Care',
    },
    {
      color: '#FFD573',
      icon: 'education',
      id: '2',
      name: 'Education',
    },
  ];

  const user = userEvent.setup();

  describe('render', () => {
    it('shows the modal correctly', () => {
      render(<AddExpenseModal />);

      expect(
        screen.getByRole('heading', { name: 'ADD NEW EXPENSE' })
      ).toBeInTheDocument();

      expect(screen.getByLabelText('Category*')).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Title*' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Description' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Location' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('spinbutton', { name: 'Total*' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Status*')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'SAVE' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'CANCEL' })
      ).toBeInTheDocument();
    });
    it('shows correct category items when clicked', async () => {
      render(<AddExpenseModal />, {
        preloadedState: { categoriesData: initialCategoriesData },
      });

      user.click(screen.getByLabelText('Category*'));

      expect(await screen.findAllByRole('option')).toHaveLength(2);
      expect(
        screen.getByRole('option', {
          name: initialCategoriesData[0].name,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', {
          name: initialCategoriesData[1].name,
        })
      ).toBeInTheDocument();
    });

    it('shows correct status items when clicked', async () => {
      render(<AddExpenseModal />, {
        preloadedState: { categoriesData: initialCategoriesData },
      });
      user.click(screen.getByLabelText('Status*'));

      expect(await screen.findAllByRole('option')).toHaveLength(2);
      expect(
        screen.getByRole('option', {
          name: 'Confirm',
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', {
          name: 'Pending',
        })
      ).toBeInTheDocument();
    });
  });

  describe('typing expense information into the modal', () => {
    it('shows the correct value', async () => {
      render(<AddExpenseModal />, {
        preloadedState: { categoriesData: initialCategoriesData },
      });
      await user.type(screen.getByRole('textbox', { name: 'Title*' }), 'test');
      await user.type(
        screen.getByRole('textbox', { name: 'Description' }),
        'description test'
      );
      await user.type(
        screen.getByRole('textbox', { name: 'Location' }),
        'location test'
      );
      await user.type(screen.getByRole('spinbutton', { name: 'Total*' }), '20');

      user.click(screen.getByLabelText('Category*'));
      user.click(
        await screen.findByRole('option', {
          name: initialCategoriesData[0].name,
        })
      );

      user.click(screen.getByLabelText('Status*'));
      user.click(await screen.findByRole('option', { name: 'Confirm' }));
      await waitForElementToBeRemoved(() => screen.queryAllByRole('option'));

      expect(screen.getByRole('textbox', { name: 'Title*' })).toHaveValue(
        'test'
      );
      expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(
        'description test'
      );
      expect(screen.getByRole('textbox', { name: 'Location' })).toHaveValue(
        'location test'
      );
      expect(screen.getByRole('spinbutton', { name: 'Total*' })).toHaveValue(
        20
      );
      expect(
        screen.getByRole('button', {
          name: `Category* ${initialCategoriesData[0].name}`,
        })
      ).toHaveTextContent(initialCategoriesData[0].name);
      expect(
        screen.getByRole('button', { name: 'Status* Confirm' })
      ).toHaveTextContent('Confirm');
    });

    it('shows the correct error if value is not valid', async () => {
      render(<AddExpenseModal />, {
        preloadedState: { categoriesData: initialCategoriesData },
      });

      await user.type(
        screen.getByRole('textbox', { name: 'Title*' }),
        'seddoeiusmodtemporinc'
      );
      await user.type(
        screen.getByRole('textbox', { name: 'Description' }),
        'seddoeiusmodtemporincididuntutlaboreetdoloremagnaaliqualiqua.'
      );
      await user.type(
        screen.getByRole('textbox', { name: 'Location' }),
        'seddoeiusmodtemporinc'
      );
      await user.click(screen.getByRole('spinbutton', { name: 'Total*' }));

      expect(
        screen.getByText('Title cannot be longer than 20 words!')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Description cannot be longer than 60 words!')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Location cannot be longer than 20 words!')
      ).toBeInTheDocument();
    });
  });

  describe('clicking the save button', () => {
    describe('if the form has no data', () => {
      it('shows errors', async () => {
        render(<AddExpenseModal />, {
          preloadedState: { categoriesData: initialCategoriesData },
        });

        user.click(screen.getByRole('button', { name: 'SAVE' }));

        expect(await screen.findAllByText('Required!')).toHaveLength(4);
      });
    });

    describe('if the form has sufficient data', () => {
      it('saves the information correctly', async () => {
        const mockSetOpen = jest.fn();
        const mockSetAdded = jest.fn();
        render(
          <AddExpenseModal setOpen={mockSetOpen} setAdded={mockSetAdded} />,
          {
            preloadedState: { categoriesData: initialCategoriesData },
          }
        );

        await user.type(
          screen.getByRole('textbox', { name: 'Title*' }),
          'test'
        );

        await user.type(
          screen.getByRole('spinbutton', { name: 'Total*' }),
          '20'
        );

        //imitates choosing a category from the select component
        user.click(screen.getByLabelText('Category*'));
        user.click(
          await screen.findByRole('option', {
            name: initialCategoriesData[0].name,
          })
        );

        //imitates choosing a status from the select component
        user.click(screen.getByLabelText('Status*'));
        user.click(await screen.findByRole('option', { name: 'Confirm' }));

        //wait for the list to close
        await waitForElementToBeRemoved(() => screen.queryAllByRole('option'));

        user.click(screen.getByRole('button', { name: 'SAVE' }));

        await waitFor(() => {
          expect(mockSetAdded).toHaveBeenCalledWith(true);
        });
        expect(mockSetOpen).toHaveBeenCalledWith(false);
      });
    });
  });
  describe('clicking the cancel button', () => {
    it('closes the modal', async () => {
      const mockSetOpen = jest.fn();
      render(<AddExpenseModal setOpen={mockSetOpen} />, {
        preloadedState: { categoriesData: initialCategoriesData },
      });

      user.click(screen.getByRole('button', { name: 'CANCEL' }));

      await waitFor(() => {
        expect(mockSetOpen).toHaveBeenCalledWith(false);
      });
    });
  });
});
