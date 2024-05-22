import '@testing-library/jest-dom/extend-expect';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R; 
      // Add other matchers from jest-dom if needed
    }
  }
}

