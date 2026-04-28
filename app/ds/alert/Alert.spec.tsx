import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Alert from './Alert';
import AlertProvider from './AlertProvider';
import { useAlert } from './useAlert';

describe('<Alert />', () => {
  it('renders message content', () => {
    render(<Alert type='info'>Info message</Alert>);

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('uses assertive aria-live for error and warning', () => {
    const { rerender } = render(<Alert type='warning'>Warning message</Alert>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');

    rerender(<Alert type='error'>Error message</Alert>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
  });

  it('uses polite aria-live for info and success', () => {
    const { rerender } = render(<Alert type='info'>Info message</Alert>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    rerender(<Alert type='success'>Success message</Alert>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('applies custom className', () => {
    render(<Alert type='info' className='custom-class'>Styled alert</Alert>);

    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });

  it('renders with default type when no type is provided', () => {
    render(<Alert>Default type</Alert>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});

describe('<AlertProvider />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders children', () => {
    render(
      <AlertProvider>
        <p>Child content</p>
      </AlertProvider>,
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('showAlert adds an alert and auto-dismisses after duration', () => {
    const Consumer = () => {
      const { showAlert } = useAlert();
      return (
        <button onClick={() => showAlert({ message: 'Hello!', durationMs: 1000 })}>
          Show
        </button>
      );
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Hello!')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(1100));
    expect(screen.queryByText('Hello!')).not.toBeInTheDocument();
  });

  it('showAlert with durationMs=0 does not auto-dismiss', () => {
    const Consumer = () => {
      const { showAlert } = useAlert();
      return (
        <button onClick={() => showAlert({ message: 'Persistent', durationMs: 0 })}>
          Show
        </button>
      );
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Persistent')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(10000));
    expect(screen.getByText('Persistent')).toBeInTheDocument();
  });

  it('dismissAlert removes the alert immediately', () => {
    const Consumer = () => {
      const { showAlert, dismissAlert } = useAlert();
      const [id, setId] = React.useState('');
      return (
        <>
          <button onClick={() => setId(showAlert({ message: 'Dismiss me', durationMs: 0 }))}>
            Show
          </button>
          <button onClick={() => dismissAlert(id)}>Dismiss</button>
        </>
      );
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });

  it('clicking the alert button dismisses the alert', () => {
    const Consumer = () => {
      const { showAlert } = useAlert();
      return (
        <button onClick={() => showAlert({ message: 'Click to close', durationMs: 0 })}>
          Show
        </button>
      );
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Click to close')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }));
    expect(screen.queryByText('Click to close')).not.toBeInTheDocument();
  });

  it('clearAlerts removes all alerts', () => {
    const Consumer = () => {
      const { showAlert, clearAlerts } = useAlert();
      return (
        <>
          <button onClick={() => { showAlert({ message: 'Alert 1', durationMs: 0 }); showAlert({ message: 'Alert 2', durationMs: 0 }); }}>
            Show
          </button>
          <button onClick={clearAlerts}>Clear all</button>
        </>
      );
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Alert 1')).toBeInTheDocument();
    expect(screen.getByText('Alert 2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.queryByText('Alert 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Alert 2')).not.toBeInTheDocument();
  });

  it('clearAlerts cancels pending auto-dismiss timeouts', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const Consumer = () => {
      const { showAlert, clearAlerts } = useAlert();
      return (
        <>
          <button onClick={() => { showAlert({ message: 'Timed 1', durationMs: 5000 }); showAlert({ message: 'Timed 2', durationMs: 5000 }); }}>
            Show
          </button>
          <button onClick={clearAlerts}>Clear all</button>
        </>
      );
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Timed 1')).toBeInTheDocument();

    // clearAlerts with active timeouts — exercises the forEach(clearTimeout) callback
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.queryByText('Timed 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Timed 2')).not.toBeInTheDocument();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it('dismissAlert clears pending auto-dismiss timeout', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const Consumer = () => {
      const { showAlert, dismissAlert } = useAlert();
      const [id, setId] = React.useState('');
      return (
        <>
          <button onClick={() => setId(showAlert({ message: 'Early dismiss', durationMs: 5000 }))}>
            Show
          </button>
          <button onClick={() => dismissAlert(id)}>Dismiss</button>
        </>
      );
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});

describe('useAlert', () => {
  it('throws when used outside of AlertProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const BadConsumer = () => {
      useAlert();
      return null;
    };

    expect(() => render(<BadConsumer />)).toThrow('useAlert must be used within an AlertProvider.');

    consoleError.mockRestore();
  });

  it('returns context when inside AlertProvider', () => {
    const Consumer = () => {
      const ctx = useAlert();
      return <span>{typeof ctx.showAlert}</span>;
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    expect(screen.getByText('function')).toBeInTheDocument();
  });

  it('showAlert uses default durationMs when not provided', () => {
    jest.useFakeTimers();

    const Consumer = () => {
      const { showAlert } = useAlert();
      return <button onClick={() => showAlert({ message: 'Default duration' })}>Show</button>;
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Default duration')).toBeInTheDocument();

    // Default is 4200ms; advance past it
    act(() => jest.advanceTimersByTime(4500));
    expect(screen.queryByText('Default duration')).not.toBeInTheDocument();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});
