import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '@/App';

test('renders correctly', async () => {
  const tree = render(<App />);
  await waitFor(() => {
    expect(tree.toJSON()).not.toBeNull();
  });
});
