import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExternalLink from '../../components/ExternalLink';

const URL = 'https://www.lmfdb.org/NumberField/1.1.1.1';

describe('ExternalLink', () => {
  let onLineSpy;

  beforeEach(() => {
    onLineSpy = jest.spyOn(window.navigator, 'onLine', 'get');
  });

  afterEach(() => {
    onLineSpy.mockRestore();
  });

  test('renders a link that opens in a new tab when online', () => {
    onLineSpy.mockReturnValue(true);
    render(<ExternalLink href={URL}>1.1.1.1</ExternalLink>);

    const link = screen.getByRole('link', { name: '1.1.1.1' });
    expect(link).toHaveAttribute('href', URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders plain text when offline', () => {
    onLineSpy.mockReturnValue(false);
    render(<ExternalLink href={URL}>1.1.1.1</ExternalLink>);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('1.1.1.1')).toBeInTheDocument();
  });

  test('switches between link and text on offline/online events', () => {
    onLineSpy.mockReturnValue(true);
    render(<ExternalLink href={URL}>1.1.1.1</ExternalLink>);
    expect(screen.getByRole('link', { name: '1.1.1.1' })).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('1.1.1.1')).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(screen.getByRole('link', { name: '1.1.1.1' })).toBeInTheDocument();
  });

  test('removes its event listeners on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ExternalLink href={URL}>1.1.1.1</ExternalLink>);
    unmount();

    const removed = removeSpy.mock.calls.map(([type]) => type);
    expect(removed).toEqual(expect.arrayContaining(['online', 'offline']));
    removeSpy.mockRestore();
  });
});
