import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MultilineTextFields from '@/components/rest/MultilineTextField';

type BodySelect = 'none' | 'text' | 'json' | 'form';

type Body = {
  select: BodySelect;
  text: string;
  json: string;
};

type Row = {
  key: string;
  value: string;
  select: boolean;
};

type Store = {
  body: Body;
  setBody: (b: Body) => void;
  bodyTable: Row[];
  setBodyTable: (r: Row[]) => void;
  headers: unknown[];
  setHeaders: (h: unknown[]) => void;
};

type VariablesStore = {
  variables: Record<string, string>;
};

const setBodyMock: jest.Mock<void, [Body]> = jest.fn();
const setBodyTableMock: jest.Mock<void, [Row[]]> = jest.fn();
const setHeadersMock: jest.Mock<void, [unknown[]]> = jest.fn();

let storeState: Store = {
  body: { select: 'text', text: '', json: '' },
  setBody: setBodyMock,
  bodyTable: [],
  setBodyTable: setBodyTableMock,
  headers: [{}],
  setHeaders: setHeadersMock,
};

let variablesState: VariablesStore = { variables: {} };

jest.mock('@/store/restStore', () => ({
  useRestStore: (selector: (s: Store) => unknown) => selector(storeState),
}));

jest.mock('@/store/variablesStore', () => ({
  useVariablesStore: (selector: (s: VariablesStore) => unknown) =>
    selector(variablesState),
}));

const preSelectHeadersMock = jest.fn<unknown, [string]>(() => ({
  key: 'Content-Type',
  value: 'application/json',
  select: true,
}));
const replaceVariablesMock = jest.fn<
  [string | undefined, boolean],
  [string, Record<string, string>]
>((input: string) => [input, false]);
const textToBase64Mock = jest.fn<string, [string, string, number]>(() => 'enc');

jest.mock('@/accessory/function', () => ({
  preSelectHeaders: (v: string) => preSelectHeadersMock(v),
  replaceVariables: (t: string, v: Record<string, string>) =>
    replaceVariablesMock(t, v),
  textToBase64: (t: string, p: string, d: number) => textToBase64Mock(t, p, d),
}));

jest.mock('@/i18n/navigation', () => ({
  usePathname: () => '/path',
}));

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

jest.mock('@/components/rest/DataTable', () => ({
  __esModule: true,
  default: ({ rows }: { rows: Row[] }) => (
    <div data-testid="datatable">{rows.length}</div>
  ),
}));

let replaceStateSpy: ReturnType<typeof jest.spyOn>;

beforeEach(() => {
  storeState = {
    body: { select: 'text', text: '', json: '' },
    setBody: setBodyMock,
    bodyTable: [],
    setBodyTable: setBodyTableMock,
    headers: [{}],
    setHeaders: setHeadersMock,
  };
  variablesState = { variables: {} };
  setBodyMock.mockClear();
  setBodyTableMock.mockClear();
  setHeadersMock.mockClear();
  preSelectHeadersMock.mockClear();
  replaceVariablesMock.mockClear();
  textToBase64Mock.mockClear();
  replaceStateSpy = jest.spyOn(window.history, 'replaceState');
});

afterEach(() => {
  replaceStateSpy.mockRestore();
});

test('renders textbox in text mode and updates body.text on input', () => {
  render(<MultilineTextFields />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'hello' } });
  expect(setBodyMock).toHaveBeenCalledWith({
    select: 'text',
    text: 'hello',
    json: '',
  });
});

test('switching to form mode renders DataTable and hides the textbox', () => {
  storeState.body.select = 'form';
  storeState.bodyTable = [
    { key: 'a', value: '1', select: true },
    { key: 'b', value: '2', select: false },
  ];
  render(<MultilineTextFields />);
  expect(screen.getByTestId('datatable')).toBeInTheDocument();
  expect(screen.queryByRole('textbox')).toBeNull();
});

test('typing in JSON mode updates body.json and invalid JSON shows an error on the label', async () => {
  storeState.body.select = 'json';
  render(<MultilineTextFields />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: '{' } });
  expect(setBodyMock).toHaveBeenCalledWith({
    select: 'json',
    text: '',
    json: '{',
  });
  await waitFor(() =>
    expect(
      screen.getByLabelText(/JSON .*Unexpected end of JSON input/)
    ).toBeInTheDocument()
  );
});

test('radio change updates select and preselects headers', () => {
  render(<MultilineTextFields />);
  const jsonRadio = screen.getByLabelText('JSON');
  fireEvent.click(jsonRadio);
  expect(preSelectHeadersMock).toHaveBeenCalledWith('json');
  expect(setHeadersMock).toHaveBeenCalledWith([
    preSelectHeadersMock.mock.results[0].value,
  ]);
  expect(setBodyMock).toHaveBeenCalledWith({
    select: 'json',
    text: '',
    json: '',
  });
});

test('variable replacement triggers replaceState with encoded path', () => {
  storeState.body.select = 'text';
  storeState.body.text = 'Hello';
  render(<MultilineTextFields />);
  expect(textToBase64Mock).toHaveBeenCalledWith('Hello', '/path', 3);
  expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/enenc');
});

test('shows variable not found error when vars flag is set and text is unchanged', async () => {
  replaceVariablesMock.mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (input: string, _vars: Record<string, string>) => [input, true]
  );
  storeState.body.select = 'text';
  storeState.body.text = 'Hi {{missing}}';
  render(<MultilineTextFields />);
  await waitFor(() =>
    expect(
      screen.getByLabelText(/TEXT Variable not found:/)
    ).toBeInTheDocument()
  );
});

test('textbox is disabled when select is none', () => {
  storeState.body.select = 'none';
  render(<MultilineTextFields />);
  const input = screen.getByRole('textbox');
  expect(input).toBeDisabled();
});
