import { render, screen } from '@testing-library/react';
import HomeNavigation from '@/components/home/HomeNavigation';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

describe('HomeNavigation component', () => {
  it('renders all navigation tabs', () => {
    render(<HomeNavigation />);

    expect(screen.getByText('rest')).toBeInTheDocument();
    expect(screen.getByText('history')).toBeInTheDocument();
    expect(screen.getByText('variables')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<HomeNavigation />);

    const restLink = screen.getByText('rest').closest('a');
    const historyLink = screen.getByText('history').closest('a');
    const variablesLink = screen.getByText('variables').closest('a');

    expect(restLink).toHaveAttribute('href', '/en/get/');
    expect(historyLink).toHaveAttribute('href', '/en/history/');
    expect(variablesLink).toHaveAttribute('href', '/en/variables/');
  });
});
