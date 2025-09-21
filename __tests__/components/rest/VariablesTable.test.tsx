import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VariablesTable, { tRows } from '@/components/variables/VariablesTable';

const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

describe('VariablesTable (no-assertions)', () => {
  const makeRows = (rows?: tRows): tRows =>
    rows ?? [{ id: 1, key: 'k1', value: 'v1', select: false }];

  const renderWithHandlers = (
    rows: tRows,
    fns: {
      onRows?: (r: tRows) => void;
      onStore?: (r: tRows) => void;
    } = {}
  ) => {
    const setRows = ((r: tRows) => {
      fns.onRows?.(r);
    }) as jest.MockedFunction<(r: tRows) => void>;
    const setLocalStorage = ((r: tRows) => {
      fns.onStore?.(r);
    }) as jest.MockedFunction<(r: tRows) => void>;

    render(
      <VariablesTable
        rows={rows}
        setRows={setRows}
        setLocalStorage={setLocalStorage}
      />
    );

    return { setRows, setLocalStorage };
  };

  it('renders headers and initial row values', () => {
    renderWithHandlers(makeRows());

    // These throw if not found -> test fails automatically
    screen.getByText('turn');
    screen.getByText('variables');
    screen.getByText('values');

    // Two textboxes: 0 = key, 1 = value
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    if (!inputs[0] || inputs[0].value !== 'k1') {
      throw new Error('Key input did not render initial value "k1"');
    }
    if (!inputs[1] || inputs[1].value !== 'v1') {
      throw new Error('Value input did not render initial value "v1"');
    }
  });

  it('toggles the checkbox and passes updated rows to both callbacks', () => {
    const initial = makeRows([
      { id: 1, key: 'k1', value: 'v1', select: false },
    ]);
    const expected: tRows = [{ id: 1, key: 'k1', value: 'v1', select: true }];

    renderWithHandlers(initial, {
      onRows: (r) => {
        if (!same(r, expected)) {
          throw new Error('setRows received incorrect rows after toggle');
        }
      },
      onStore: (r) => {
        if (!same(r, expected)) {
          throw new Error(
            'setLocalStorage received incorrect rows after toggle'
          );
        }
      },
    });

    const cb = screen.getAllByRole('checkbox')[0];
    fireEvent.click(cb);
  });

  it('updates key field and forwards updated rows to both callbacks', () => {
    const initial = makeRows([{ id: 1, key: 'k1', value: 'v1', select: true }]);
    const expected: tRows = [
      { id: 1, key: 'apiKey', value: 'v1', select: true },
    ];

    renderWithHandlers(initial, {
      onRows: (r) => {
        if (!same(r, expected)) {
          throw new Error('setRows received incorrect rows after key change');
        }
      },
      onStore: (r) => {
        if (!same(r, expected)) {
          throw new Error(
            'setLocalStorage received incorrect rows after key change'
          );
        }
      },
    });

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: 'apiKey' } });
  });

  it('updates value field and forwards updated rows to both callbacks', () => {
    const initial = makeRows([{ id: 1, key: 'k1', value: 'v1', select: true }]);
    const expected: tRows = [
      { id: 1, key: 'k1', value: 'secret', select: true },
    ];

    renderWithHandlers(initial, {
      onRows: (r) => {
        if (!same(r, expected)) {
          throw new Error('setRows received incorrect rows after value change');
        }
      },
      onStore: (r) => {
        if (!same(r, expected)) {
          throw new Error(
            'setLocalStorage received incorrect rows after value change'
          );
        }
      },
    });

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.change(inputs[1], { target: { value: 'secret' } });
  });

  it('deletes a row on "del" click', () => {
    const initial = makeRows([
      { id: 1, key: 'a', value: '1', select: false },
      { id: 2, key: 'b', value: '2', select: true },
    ]);
    const expected: tRows = [{ id: 2, key: 'b', value: '2', select: true }];

    renderWithHandlers(initial, {
      onRows: (r) => {
        if (!same(r, expected)) {
          throw new Error('setRows received incorrect rows after delete');
        }
      },
      onStore: (r) => {
        if (!same(r, expected)) {
          throw new Error(
            'setLocalStorage received incorrect rows after delete'
          );
        }
      },
    });

    const delButtons = screen.getAllByRole('button', { name: 'del' });
    fireEvent.click(delButtons[0]);
  });

  it('adds a new row with next id on "add" click', () => {
    const initial = makeRows([
      { id: 1, key: 'a', value: '1', select: false },
      { id: 3, key: 'c', value: '3', select: false },
    ]);
    const expectedLast = { id: 4, key: '', value: '', select: false };

    renderWithHandlers(initial, {
      onRows: (r) => {
        const last = r[r.length - 1];
        if (!same(last, expectedLast)) {
          throw new Error(
            'setRows did not append a row with the correct next id'
          );
        }
      },
      onStore: (r) => {
        const last = r[r.length - 1];
        if (!same(last, expectedLast)) {
          throw new Error(
            'setLocalStorage did not append a row with the correct next id'
          );
        }
      },
    });

    const addButton = screen.getByRole('button', { name: 'add' });
    fireEvent.click(addButton);
  });
});
