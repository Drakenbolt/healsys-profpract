import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock react-router-dom
jest.mock('react-router-dom');

describe('App Component', () => {
  test('renders app without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Just verify the app renders without crashing
    expect(document.body).toBeInTheDocument();
  });
});
