// tests/SelectInput.test.tsx
// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import { AuthContext } from '@/services/auth/AuthContext';
// import SelectInput from '@/components/rest/SelectInput';
// import { useRestStore } from '@/store/restStore';
// import { AuthContextValue } from '@/services/auth/auth.types';

describe('SelectInput', () => {
  // test('renders select dropdown with available methods', () => {
  //   const defaultValue: AuthContextValue = {
  //     status: 'loading',
  //     user: null,
  //     signIn: async () => {
  //       throw new Error('not implemented');
  //     },
  //     signUp: async () => {
  //       throw new Error('not implemented');
  //     },
  //     signOut: async () => {
  //       throw new Error('not implemented');
  //     },
  //   };
  //
  //   render(
  //     <AuthContext.Provider value={{ ...defaultValue }}>
  //       <SelectInput />
  //     </AuthContext.Provider>
  //   );
  //
  //   const selectDropdown = screen.getByRole('combobox', { name: /select/i });
  //   expect(selectDropdown).toBeInTheDocument();
  //
  //   // Проверяем доступные опции
  //   // const menuItems = screen.getAllByRole('option');
  //   // expect(menuItems.length).toEqual(methods.length);
  // });
  //
  // test('changes method and updates route', async () => {
  //   render(
  //     <restStoreProvider>
  //       <SelectInput />
  //     </restStoreProvider>
  //   );
  //
  //   const selectDropdown = screen.getByRole('combobox', { name: /select/i });
  //   await userEvent.selectOptions(selectDropdown, ['POST']);
  //
  //   // Проверяем, изменилось ли значение метода
  //   expect(selectDropdown).toHaveDisplayValue(['POST']);
  //
  //   // Тут можно добавить проверку на смену маршрута, если это актуально
  // });
});
