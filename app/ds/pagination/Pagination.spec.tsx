import { fireEvent, render, screen } from '@testing-library/react';

import Pagination from './Pagination';

describe('Pagination', () => {
  it('calls onPageChange when clicking a different page', () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={4}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('does not render when totalPages is 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={jest.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

