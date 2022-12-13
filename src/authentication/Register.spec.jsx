import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from './Register';
import { createUserWithEmailAndPassword } from 'firebase/auth';

jest.mock('@firebase/auth', () => ({
  getAuth: jest.fn(() => null),
  createUserWithEmailAndPassword: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => null),
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

describe('Register', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    render(<Register />, { wrapper: Router });
  });

  describe('render', () => {
    it('shows the correct content', () => {
      expect(
        screen.getByRole('heading', { name: 'Sign up and track your expenses' })
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Enter your name')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Enter your email')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Enter your password')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Confirm your password')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Sign up' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Got an account? Sign in' })
      ).toBeInTheDocument();
    });
  });

  describe('when typing in email', () => {
    describe('if email is left empty', () => {
      it('shows the correct error', async () => {
        user.click(screen.getByPlaceholderText('Enter your email'));
        user.click(
          screen.getByRole('heading', {
            name: 'Sign up and track your expenses',
          })
        );
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
        user.click(
          screen.getByRole('heading', {
            name: 'Sign up and track your expenses',
          })
        );
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
        user.click(
          screen.getByRole('heading', {
            name: 'Sign up and track your expenses',
          })
        );
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
        user.click(
          screen.getByRole('heading', {
            name: 'Sign up and track your expenses',
          })
        );
        await waitFor(() => {
          expect(screen.getByText('Required!')).toBeInTheDocument();
        });
      });
    });

    describe('if password is too short', () => {
      it('shows the correct error', async () => {
        await user.type(
          screen.getByPlaceholderText('Enter your password'),
          'test'
        );
        user.click(
          screen.getByRole('heading', {
            name: 'Sign up and track your expenses',
          })
        );
        await waitFor(() => {
          expect(screen.getByText('Too short!')).toBeInTheDocument();
        });
      });
    });
    describe('if password is too long', () => {
      it('shows the correct error', async () => {
        await user.type(
          screen.getByPlaceholderText('Enter your password'),
          'seddoeiusmodtemporincididuntutlaboreetdoloremagnaaliqua. '
        );
        user.click(
          screen.getByRole('heading', {
            name: 'Sign up and track your expenses',
          })
        );
        await waitFor(() => {
          expect(screen.getByText('Too long!')).toBeInTheDocument();
        });
      });
    });

    describe('if password is in correct format', () => {
      it('does not show any error', async () => {
        await user.type(
          screen.getByPlaceholderText('Enter your password'),
          'testing'
        );
        user.click(
          screen.getByRole('heading', {
            name: 'Sign up and track your expenses',
          })
        );
        await waitFor(() => {
          expect(screen.queryByText('Required!')).not.toBeInTheDocument();
        });
        expect(screen.queryByText('Too short!')).not.toBeInTheDocument();
        expect(screen.queryByText('Too long!')).not.toBeInTheDocument();
      });
    });
  });
  describe('when confirming the password', () => {
    describe('if the password does not match', () => {
      it('shows the correct error', async () => {
        await user.type(
          screen.getByPlaceholderText('Enter your password'),
          'testing'
        );
        await user.type(
          screen.getByPlaceholderText('Confirm your password'),
          'testin'
        );
        user.click(
          screen.getByRole('heading', {
            name: 'Sign up and track your expenses',
          })
        );
        await waitFor(() => {
          expect(
            screen.getByText('Password does not match!')
          ).toBeInTheDocument();
        });
      });
    });

    describe('if the password matches', () => {
      it('does not show any error', async () => {
        await user.type(
          screen.getByPlaceholderText('Enter your password'),
          'testing'
        );
        await user.type(
          screen.getByPlaceholderText('Confirm your password'),
          'testing'
        );
        user.click(
          screen.getByRole('heading', {
            name: 'Sign up and track your expenses',
          })
        );
        await waitFor(() => {
          expect(
            screen.queryByText('Password does not match!')
          ).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('when the submit button is clicked', () => {
    describe('and the required data is empty', () => {
      it('shows the correct error', async () => {
        user.click(screen.getByRole('button', { name: 'Sign up' }));
        await waitFor(() => {
          expect(screen.queryAllByText('Required!').length).toBe(4);
        });
      });
    });
    describe('and the required data is filled', () => {
      it('calls the createUserWithEmailAndPassword function', async () => {
        await user.type(
          screen.getByPlaceholderText('Enter your name'),
          'tester'
        );
        await user.type(
          screen.getByPlaceholderText('Enter your email'),
          'test@gmail.com'
        );
        await user.type(
          screen.getByPlaceholderText('Enter your password'),
          'testing'
        );
        await user.type(
          screen.getByPlaceholderText('Confirm your password'),
          'testing'
        );
        user.click(screen.getByRole('button', { name: 'Sign up' }));

        await waitFor(() => {
          expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            null,
            'test@gmail.com',
            'testing'
          );
        });
      });
    });
  });
});
