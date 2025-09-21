import HistoryLink from '@/components/history/HistoryLink';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@/components/auth/OnboardingUI', () => ({
  LoadingSpinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('HistoryLink', () => {
  it('renders link text', () => {
    render(<HistoryLink href="/test">Go</HistoryLink>);
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('shows loading spinner when clicked', () => {
    render(<HistoryLink href="/test">Go</HistoryLink>);
    fireEvent.click(screen.getByText('Go'));
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
