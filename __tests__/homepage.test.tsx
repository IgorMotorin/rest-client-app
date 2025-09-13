import { render, screen } from '@testing-library/react';
import Home from '@/app/[locale]/(protected)/page';

describe('HomePage', () => {
  it('renders a title', () => {
    render(<Home />);
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
  });
});
