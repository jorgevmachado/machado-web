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

  it('renders previous and next navigation buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={4}
        onPageChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument();
  });

  it('calls onPageChange with previous/next page', () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('renders ellipsis for large page counts (middle pages)', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={jest.fn()}
      />,
    );

    // Should show ellipsis between non-consecutive pages
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('renders ellipsis at start for last pages', () => {
    render(
      <Pagination
        currentPage={9}
        totalPages={10}
        onPageChange={jest.fn()}
      />,
    );

    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('renders ellipsis at end for first pages', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={10}
        onPageChange={jest.fn()}
      />,
    );

    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('does not call onPageChange when loading', () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
        isLoading
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 1' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('renders Link for pages when getPageHref is provided', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={jest.fn()}
        getPageHref={(page) => `/page/${page}`}
      />,
    );

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', '/page/2');
  });

  it('renders with custom ariaLabel', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={jest.fn()}
        ariaLabel='Pokemon pagination'
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Pokemon pagination' })).toBeInTheDocument();
  });

  it('renders button (not Link) for current page even when getPageHref is provided', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={jest.fn()}
        getPageHref={(page) => `/page/${page}`}
      />,
    );

    // Current page (2) is disabled — should render as a button, not a link
    const currentPageButton = screen.getByRole('button', { name: 'Go to page 2' });
    expect(currentPageButton).toBeInTheDocument();
    expect(currentPageButton).toBeDisabled();
  });

  it('does not change page when onPageChange is not provided', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={undefined}
      />,
    );

    // Click a non-current, non-disabled page button — handlePageChange returns early since no onPageChange
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    // No crash — early return in handlePageChange due to !onPageChange
  });
});
