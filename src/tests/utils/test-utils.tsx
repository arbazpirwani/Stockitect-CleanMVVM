import React, { ReactElement } from 'react';
import { render } from '@testing-library/react-native';

// Create custom render function
function customRender(ui: ReactElement, options = {}) {
    return render(ui, {
        ...options,
    });
}

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };