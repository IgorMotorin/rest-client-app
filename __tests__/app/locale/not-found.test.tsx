import NotFoundPage from '@/app/[locale]/not-found';
import { render, screen } from '@testing-library/react';

test('renders title and description', () => {
  render(<NotFoundPage />);
  expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument();
  expect(screen.getByText('description')).toBeInTheDocument();
});
