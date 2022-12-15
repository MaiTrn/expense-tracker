import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { signOut } from 'firebase/auth';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock('@firebase/auth', () => ({
  getAuth: jest.fn(() => null),
  signOut: jest.fn(),
}));

describe('Header', () => {
  const user = userEvent.setup();
  describe('render', () => {
    it('shows the correct content', () => {
      render(<Header />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Expense Tracker' })
      ).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'profile' })).toBeInTheDocument();
    });
  });

  describe('when clicking on the profile picture', () => {
    it('shows the logout menu', async () => {
      render(<Header />);

      user.click(screen.getByRole('img', { name: 'profile' }));
      expect(await screen.findByText('Log out')).toBeInTheDocument();
    });
  });

  describe('when clicking on the logout button', () => {
    it('calls the signOut function', async () => {
      render(<Header />);

      user.click(screen.getByRole('img', { name: 'profile' }));
      user.click(await screen.findByText('Log out'));

      await waitFor(() => {
        expect(signOut).toHaveBeenCalled();
      });
    });
  });
});
