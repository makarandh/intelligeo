import { render, screen } from '@testing-library/react';
import MainRouter from '../components/MainRouter';

test('renders learn react link', () => {
  render(<MainRouter />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
