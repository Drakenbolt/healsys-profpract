import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock the fetch function
global.fetch = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom');

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  test('renders login form', () => {
    renderLogin();
    
    // Check if all form elements are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows error message for invalid credentials', async () => {
    // Mock failed login response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Invalid email or password' })
    });

    renderLogin();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Check if error message appears
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  test('successful login stores token', async () => {
    // Mock successful login response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        access_token: 'fake-token',
        token_type: 'bearer',
        user: {
          email: 'test@example.com',
          is_doctor: true
        }
      })
    });

    renderLogin();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'correctpassword' }
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Check if token is stored
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token');
    });
  });

  test('validates required fields', async () => {
    renderLogin();

    // Try to submit without filling the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Check if validation messages appear
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
}); 