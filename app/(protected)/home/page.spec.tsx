import { render, screen } from '@testing-library/react';

import Home from './page';

const useUserMock = jest.fn();

jest.mock('@/app/ui/features/auth', () => ({
  useUser: () => useUserMock(),
}));

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/app/ui/features/home/components/onboarding', () => ({
  __esModule: true,
  default: function MockHomeOnboarding() {
    return <div>Onboarding</div>;
  },
}));

jest.mock('@/app/ui/features/home/components/dashboard', () => ({
  __esModule: true,
  default: function MockTrainerDashboard() {
    return <div>Trainer dashboard</div>;
  },
}));

jest.mock('@/app/ds', () => {
  const React = jest.requireActual('react');
  return {
    Text: ({ as: Component = 'p', children }: { as?: string; children: React.ReactNode }) => React.createElement(Component, {}, children),
  };
});

describe('Home page', () => {
  it('renders the onboarding flow when the user has no trainer', () => {
    useUserMock.mockReturnValue({
      user: { id: '1', trainer: undefined },
    });

    render(<Home />);

    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('renders the trainer dashboard when the trainer exists', () => {
    useUserMock.mockReturnValue({
      user: { id: '1', trainer: { id: 'trainer-1' } },
    });

    render(<Home />);

    expect(screen.getByRole('heading', { name: 'home.title' })).toBeInTheDocument();
    expect(screen.getByText('home.welcome')).toBeInTheDocument();
    expect(screen.getByText('Trainer dashboard')).toBeInTheDocument();
  });
});
