import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
  test('renders logo and navigation', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByText('AI Consultancy')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders get started button', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
  });
});
