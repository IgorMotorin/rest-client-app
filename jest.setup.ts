import '@testing-library/jest-dom';

jest.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: () => {
    return (nsOrKey: string) => {
      return nsOrKey;
    };
  },
}));
