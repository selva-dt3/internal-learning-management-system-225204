import { render, screen } from '@testing-library/react';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

test('renders Sign in heading on LoginPage', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>
  );
  const heading = screen.getByText(/Sign in/i);
  expect(heading).toBeInTheDocument();
});
