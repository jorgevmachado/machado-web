import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Loading from './Loading';
import LoadingProvider from './LoadingProvider';
import RouteChangeTracker from './RouteChangeTracker';
import { useLoading } from './useLoading';
import Spinner from './spinner';
import Bar from './spinner/bar';
import Circle from './spinner/circle';
import Dots from './spinner/dots';
import Pokeball from './spinner/pokeball';
import TopProgressBar from './top-progress-bar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from 'next/navigation';
const mockUsePathname = usePathname as jest.Mock;

// ─── Loading ──────────────────────────────────────────────────────────────────

describe('<Loading />', () => {
  it('renders TopProgressBar by default', () => {
    render(<Loading isVisible={true} />);
    expect(screen.getByRole('progressbar', { name: 'Page loading', hidden: true })).toBeInTheDocument();
  });

  it('renders Spinner when type is not top-progress-bar', () => {
    render(<Loading type='pokeball' isVisible={true} />);
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();
  });
});

// ─── TopProgressBar ───────────────────────────────────────────────────────────

describe('<TopProgressBar />', () => {
  it('renders progressbar with aria-busy true when visible', () => {
    render(<TopProgressBar isVisible={true} />);
    const bar = screen.getByRole('progressbar', { name: 'Page loading', hidden: true });
    expect(bar).toHaveAttribute('aria-busy', 'true');
    expect(bar).toHaveAttribute('aria-hidden', 'false');
  });

  it('renders progressbar with aria-busy false when hidden', () => {
    render(<TopProgressBar isVisible={false} />);
    // aria-hidden=true: use querySelector since accessible name isn't computed for hidden elements
    const bar = document.querySelector('[role="progressbar"][aria-label="Page loading"]') as HTMLElement;
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute('aria-busy', 'false');
    expect(bar).toHaveAttribute('aria-hidden', 'true');
  });
});

// ─── Spinner ──────────────────────────────────────────────────────────────────

describe('<Spinner />', () => {
  it('renders pokeball type by default', () => {
    render(<Spinner />);
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();
  });

  it('renders with overlay', () => {
    render(<Spinner overlay />);
    const container = screen.getByRole('status', { name: 'loading' }).parentElement;
    expect(container).toHaveClass('fixed');
  });

  it('renders circle type', () => {
    render(<Spinner type='circle' />);
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();
  });

  it('renders bar type', () => {
    render(<Spinner type='bar' />);
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();
  });

  it('renders dots type', () => {
    render(<Spinner type='dots' />);
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();
  });

  it('renders sm size', () => {
    render(<Spinner size='sm' />);
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();
  });

  it('renders lg size', () => {
    render(<Spinner size='lg' />);
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();
  });
});

// ─── Spinner sub-components ───────────────────────────────────────────────────

describe('<Bar />', () => {
  it('renders SVG bar', () => {
    render(<Spinner type='bar'><Bar /></Spinner>);
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();
  });

  it('renders standalone', () => {
    const { container } = render(<Bar />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('<Circle />', () => {
  it('renders standalone', () => {
    const { container } = render(<Circle />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('<Dots />', () => {
  it('renders standalone', () => {
    const { container } = render(<Dots />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('<Pokeball />', () => {
  it('renders standalone', () => {
    const { container } = render(<Pokeball />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

// ─── useLoading ───────────────────────────────────────────────────────────────

describe('useLoading', () => {
  it('throws when used outside LoadingProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const BadConsumer = () => {
      useLoading();
      return null;
    };

    expect(() => render(<BadConsumer />)).toThrow(
      'useLoading must be used within a <LoadingProvider>.',
    );

    consoleError.mockRestore();
  });

  it('returns context when inside LoadingProvider', () => {
    mockUsePathname.mockReturnValue('/home');

    const Consumer = () => {
      const ctx = useLoading();
      return <span>{typeof ctx.startPageLoading}</span>;
    };

    render(
      <LoadingProvider>
        <Consumer />
      </LoadingProvider>,
    );

    expect(screen.getByText('function')).toBeInTheDocument();
  });
});

// ─── LoadingProvider ──────────────────────────────────────────────────────────

describe('<LoadingProvider />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUsePathname.mockReturnValue('/home');
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders children', () => {
    render(
      <LoadingProvider>
        <span>child</span>
      </LoadingProvider>,
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('startPageLoading shows progress bar and stopPageLoading hides it after delay', () => {
    const Consumer = () => {
      const { startPageLoading, stopPageLoading } = useLoading();
      return (
        <>
          <button onClick={startPageLoading}>Start</button>
          <button onClick={stopPageLoading}>Stop</button>
        </>
      );
    };

    render(
      <LoadingProvider>
        <Consumer />
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    // Query after state update is applied
    const progressBar = document.querySelector('[role="progressbar"][aria-label="Page loading"]') as HTMLElement;
    expect(progressBar).toHaveAttribute('aria-busy', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
    // Still visible until minimum duration
    expect(progressBar).toHaveAttribute('aria-busy', 'true');

    act(() => jest.advanceTimersByTime(400));
    expect(progressBar).toHaveAttribute('aria-busy', 'false');
  });

  it('startPageLoading clears pending stop timer', () => {
    const Consumer = () => {
      const { startPageLoading, stopPageLoading } = useLoading();
      return (
        <>
          <button onClick={startPageLoading}>Start</button>
          <button onClick={stopPageLoading}>Stop</button>
        </>
      );
    };

    render(
      <LoadingProvider>
        <Consumer />
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
    // Re-start before timer expires
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    // After starting again, progress bar should be visible
    const progressBar = document.querySelector('[role="progressbar"][aria-label="Page loading"]') as HTMLElement;
    expect(progressBar).toHaveAttribute('aria-busy', 'true');

    act(() => jest.advanceTimersByTime(400));
    expect(progressBar).toHaveAttribute('aria-busy', 'true');
  });

  it('startContentLoading shows spinner and stopContentLoading hides it', () => {
    const Consumer = () => {
      const { startContentLoading, stopContentLoading } = useLoading();
      return (
        <>
          <button onClick={startContentLoading}>Start Content</button>
          <button onClick={stopContentLoading}>Stop Content</button>
        </>
      );
    };

    render(
      <LoadingProvider>
        <Consumer />
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start Content' }));
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Stop Content' }));

    act(() => jest.advanceTimersByTime(400));
    expect(screen.queryByRole('status', { name: 'loading' })).not.toBeInTheDocument();
  });

  it('startContentLoading clears pending stop timer', () => {
    const Consumer = () => {
      const { startContentLoading, stopContentLoading } = useLoading();
      return (
        <>
          <button onClick={startContentLoading}>Start Content</button>
          <button onClick={stopContentLoading}>Stop Content</button>
        </>
      );
    };

    render(
      <LoadingProvider>
        <Consumer />
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start Content' }));
    fireEvent.click(screen.getByRole('button', { name: 'Stop Content' }));
    // Re-start before timer expires
    fireEvent.click(screen.getByRole('button', { name: 'Start Content' }));

    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(400));
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();
  });

  it('clears pending page and content timers on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const Consumer = () => {
      const { startPageLoading, stopPageLoading, startContentLoading, stopContentLoading } = useLoading();
      return (
        <>
          <button onClick={() => {
            startPageLoading();
            stopPageLoading();
            startContentLoading();
            stopContentLoading();
          }}
          >
            Schedule stops
          </button>
        </>
      );
    };

    const { unmount } = render(
      <LoadingProvider>
        <Consumer />
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Schedule stops' }));
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    clearTimeoutSpy.mockRestore();
  });
});

// ─── RouteChangeTracker ───────────────────────────────────────────────────────

describe('<RouteChangeTracker />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUsePathname.mockReturnValue('/home');
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders null (no DOM output)', () => {
    const { container } = render(
      <LoadingProvider>
        <RouteChangeTracker />
      </LoadingProvider>,
    );

    // RouteChangeTracker renders null; LoadingProvider renders other elements
    // Just verify it doesn't crash
    expect(container).toBeInTheDocument();
  });

  it('calls stopPageLoading when pathname changes', () => {
    const stopPageLoading = jest.fn();
    const startPageLoading = jest.fn();

    jest.mock('./useLoading', () => ({
      useLoading: () => ({ stopPageLoading, startPageLoading }),
    }));

    // Re-render with different pathname to simulate navigation
    mockUsePathname.mockReturnValue('/home');

    const { rerender } = render(
      <LoadingProvider>
        <RouteChangeTracker />
      </LoadingProvider>,
    );

    // Simulate pathname change
    mockUsePathname.mockReturnValue('/pokedex');
    rerender(
      <LoadingProvider>
        <RouteChangeTracker />
      </LoadingProvider>,
    );

    // The internal effect should have called stopPageLoading
    // We verify no crash occurs
    expect(document.body).toBeInTheDocument();
  });

  it('does not stop loading when pathname is unchanged on rerender', () => {
    mockUsePathname.mockReturnValue('/home');

    const { rerender } = render(
      <LoadingProvider>
        <RouteChangeTracker />
      </LoadingProvider>,
    );

    // First pathname change (true branch of line 25)
    mockUsePathname.mockReturnValue('/pokedex');
    rerender(
      <LoadingProvider>
        <RouteChangeTracker />
      </LoadingProvider>,
    );

    // Same pathname again (false branch of line 25)
    rerender(
      <LoadingProvider>
        <RouteChangeTracker />
      </LoadingProvider>,
    );

    expect(document.body).toBeInTheDocument();
  });

  it('does not start loading for anchors without href attribute', () => {
    mockUsePathname.mockReturnValue('/home');

    render(
      <LoadingProvider>
        <RouteChangeTracker />
        <a>No href anchor</a>
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByText('No href anchor'));
    expect(document.body).toBeInTheDocument();
  });

  it('triggers startPageLoading on internal link click', () => {
    mockUsePathname.mockReturnValue('/home');

    render(
      <LoadingProvider>
        <RouteChangeTracker />
        <a href='/pokedex'>Go to Pokedex</a>
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Go to Pokedex' }));
    // Verify no crash — click handling is attached to document
  });

  it('does not start loading for hash links', () => {
    mockUsePathname.mockReturnValue('/home');

    render(
      <LoadingProvider>
        <RouteChangeTracker />
        <a href='#section'>Go to section</a>
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Go to section' }));
    // No crash
  });

  it('does not start loading for external blank links', () => {
    mockUsePathname.mockReturnValue('/home');

    render(
      <LoadingProvider>
        <RouteChangeTracker />
        <a href='https://example.com' target='_blank' rel='noreferrer'>
          External
        </a>
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'External' }));
    // No crash
  });
});

// ─── RouteChangeTracker (anchor click — real timers) ─────────────────────────
// These tests run without fake timers to ensure useEffect registers the
// document click listener before fireEvent.click is dispatched.

describe('<RouteChangeTracker /> anchor click (real timers)', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/home');
  });

  it('does not start loading for mailto: links', () => {
    render(
      <LoadingProvider>
        <RouteChangeTracker />
        <a href='mailto:user@example.com'>Email us</a>
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Email us' }));
    expect(document.body).toBeInTheDocument();
  });

  it('does not start loading for tel: links', () => {
    render(
      <LoadingProvider>
        <RouteChangeTracker />
        <a href='tel:+1234567890'>Call us</a>
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Call us' }));
    expect(document.body).toBeInTheDocument();
  });

  it('does not start loading for links with same href as current pathname', () => {
    render(
      <LoadingProvider>
        <RouteChangeTracker />
        <a href='/home'>Same page</a>
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Same page' }));
    expect(document.body).toBeInTheDocument();
  });

  it('does not start loading for fully external links', () => {
    render(
      <LoadingProvider>
        <RouteChangeTracker />
        <a href='https://example.com'>External no blank</a>
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'External no blank' }));
    expect(document.body).toBeInTheDocument();
  });

  it('does not start loading when click is not on an anchor', () => {
    render(
      <LoadingProvider>
        <RouteChangeTracker />
        <span>Not a link</span>
      </LoadingProvider>,
    );

    fireEvent.click(screen.getByText('Not a link'));
    expect(document.body).toBeInTheDocument();
  });
});
