// tests/SelectInput.test.tsx
// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import { AuthContext } from '@/services/auth/AuthContext';
// import SelectInput from '@/components/rest/SelectInput';
// import { useRestStore } from '@/store/restStore';

describe('SelectInput', () => {
  // test('renders select dropdown with available methods', () => {
  //   render(
  //     <AuthContext.Provider value={useRestStore}>
  //       <SelectInput />
  //     </AuthContext.Provider>
  //   );
  //
  //   const selectDropdown = screen.getByRole('combobox', { name: /select/i });
  //   expect(selectDropdown).toBeInTheDocument();
  //
  //   // Проверяем доступные опции
  //   const menuItems = screen.getAllByRole('option');
  //   expect(menuItems.length).toEqual(methods.length);
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
