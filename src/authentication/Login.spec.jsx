import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import { signInWithEmailAndPassword } from 'firebase/auth';

jest.mock('@firebase/auth', () => ({
  getAuth: jest.fn(() => null),
  signInWithEmailAndPassword: jest.fn(),
}));

describe('Login', () => {
  const user = userEvent.setup();
  beforeEach(() => {
    render(<Login />, { wrapper: Router });
  });

  describe('render', () => {
    it('shows the correct content', () => {
      expect(
        screen.getByRole('heading', { name: 'Expense Tracker' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Keep track of your expenses monthly')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Enter your email')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Enter your password')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Sign in' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'New user? Create a new account!' })
      ).toBeInTheDocument();
    });
  });

  describe('when typing in email', () => {
    describe('if email is left empty', () => {
      it('shows the correct error', async () => {
        user.click(screen.getByPlaceholderText('Enter your email'));
        user.click(screen.getByRole('heading', { name: 'Expense Tracker' }));
        await waitFor(() => {
          expect(screen.getByText('Required!')).toBeInTheDocument();
        });
      });
    });

    describe('if email is not in correct format', () => {
      it('shows the correct error', async () => {
        await user.type(
          screen.getByPlaceholderText('Enter your email'),
          'test'
        );
        user.click(screen.getByRole('heading', { name: 'Expense Tracker' }));
        await waitFor(() => {
          expect(screen.getByText('Invalid email!')).toBeInTheDocument();
        });
      });
    });

    describe('if email is in correct format', () => {
      it('does not show any error', async () => {
        await user.type(
          screen.getByPlaceholderText('Enter your email'),
          'test@gmail.com'
        );
        user.click(screen.getByRole('heading', { name: 'Expense Tracker' }));
        await waitFor(() => {
          expect(screen.queryByText('Invalid email!')).not.toBeInTheDocument();
        });
        expect(screen.queryByText('Required!')).not.toBeInTheDocument();
      });
    });
  });

  describe('when typing in password', () => {
    describe('if password is left empty', () => {
      it('shows the correct error', async () => {
        user.click(screen.getByPlaceholderText('Enter your password'));
        user.click(screen.getByRole('heading', { name: 'Expense Tracker' }));
        await waitFor(() => {
          expect(screen.getByText('Required!')).toBeInTheDocument();
        });
      });
    });

    describe('if password is in correct format', () => {
      it('does not show any error', async () => {
        await user.type(
          screen.getByPlaceholderText('Enter your password'),
          'testing'
        );
        user.click(screen.getByRole('heading', { name: 'Expense Tracker' }));
        await waitFor(() => {
          expect(screen.queryByText('Required!')).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('when the submit button is clicked', () => {
    describe('and the required data is empty', () => {
      it('shows the correct error', async () => {
        user.click(screen.getByRole('button', { name: 'Sign in' }));
        await waitFor(() => {
          expect(screen.queryAllByText('Required!').length).toBe(2);
        });
      });
    });
    describe('and the required data is filled', () => {
      it('calls the signInWithEmailAndPassword function', async () => {
        await user.type(
          screen.getByPlaceholderText('Enter your email'),
          'test@gmail.com'
        );
        await user.type(
          screen.getByPlaceholderText('Enter your password'),
          'testing'
        );
        user.click(screen.getByRole('button', { name: 'Sign in' }));

        await waitFor(() => {
          expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            null,
            'test@gmail.com',
            'testing'
          );
        });
      });
    });
  });
});
