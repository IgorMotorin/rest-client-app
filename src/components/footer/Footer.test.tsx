import { render, screen } from '@testing-library/react';
import Footer from '@/components/footer/Footer';

describe('Footer', () => {
  it('renders author links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: '@IgorMotorin' })).toHaveAttribute(
      'href',
      'https://github.com/IgorMotorin'
    );
    expect(screen.getByRole('link', { name: '@IFMA25' })).toHaveAttribute(
      'href',
      'https://github.com/IFMA25'
    );
    expect(
      screen.getByRole('link', { name: '@jvallejoromero' })
    ).toHaveAttribute('href', 'https://github.com/jvallejoromero');
  });

  it('renders copyright with current year and translation key', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(
      screen.getByText(
        (content) =>
          content.includes(year) && content.includes('allRightsReserved')
      )
    ).toBeInTheDocument();
  });

  it('renders course info link with logo and label', () => {
    render(<Footer />);
    const courseLink = screen.getByRole('link', {
      name: /courseName/i,
    });
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(screen.getByAltText('courseAlt')).toBeInTheDocument();
  });
});
