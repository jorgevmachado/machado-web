import { render, screen } from '@testing-library/react';

import { ColorProvider } from './ColorProvider';
import { useColor } from './useColor';

const Consumer = () => {
  const color = useColor();

  return <span>{color.main}</span>;
};

describe('color utilities', () => {
  it('provides the default primary color', () => {
    render(
      <ColorProvider>
        <Consumer />
      </ColorProvider>,
    );

    expect(screen.getByText('#3b82f6')).toBeInTheDocument();
  });

  it('provides a configured color', () => {
    render(
      <ColorProvider color="warning">
        <Consumer />
      </ColorProvider>,
    );

    expect(screen.getByText('#f59e0b')).toBeInTheDocument();
  });
});
