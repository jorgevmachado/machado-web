import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

import Modal from './Modal';
import { useModal } from './useModal';

const BASE_PROPS = {
  title: 'Test Modal',
  isOpen: true,
  children: <p>Modal content</p>,
};

describe('<Modal />', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal {...BASE_PROPS} isOpen={false} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders dialog with title and children when isOpen is true', () => {
    render(<Modal {...BASE_PROPS} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<Modal {...BASE_PROPS} subtitle='Modal subtitle' />);

    expect(screen.getByText('Modal subtitle')).toBeInTheDocument();
  });

  it('renders close button when onClose is provided', () => {
    render(<Modal {...BASE_PROPS} onClose={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...BASE_PROPS} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = jest.fn();
    render(<Modal {...BASE_PROPS} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closeOnEsc is false', () => {
    const onClose = jest.fn();
    render(<Modal {...BASE_PROPS} onClose={onClose} closeOnEsc={false} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking outside (backdrop)', () => {
    const onClose = jest.fn();
    render(<Modal {...BASE_PROPS} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close modal overlay' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside dialog', () => {
    const onClose = jest.fn();
    render(<Modal {...BASE_PROPS} onClose={onClose} />);

    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when closeOnOutsideClick is false', () => {
    const onClose = jest.fn();
    render(<Modal {...BASE_PROPS} onClose={onClose} closeOnOutsideClick={false} />);

    expect(screen.queryByRole('button', { name: 'Close modal overlay' })).not.toBeInTheDocument();

    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders submit button and calls its onClick', () => {
    const onClick = jest.fn();
    render(
      <Modal
        {...BASE_PROPS}
        submitButton={{ label: 'Save', onClick }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled submit button when disabled prop is set', () => {
    render(
      <Modal
        {...BASE_PROPS}
        submitButton={{ label: 'Save', onClick: jest.fn(), disabled: true }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('renders close button and calls onClose when closeButton has no onClick', () => {
    const onClose = jest.fn();
    render(
      <Modal
        {...BASE_PROPS}
        onClose={onClose}
        closeButton={{ label: 'Cancel' }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders close button with custom onClick', () => {
    const customClose = jest.fn();
    render(
      <Modal
        {...BASE_PROPS}
        closeButton={{ label: 'Cancel', onClick: customClose }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(customClose).toHaveBeenCalledTimes(1);
  });

  it('renders custom close icon', () => {
    render(
      <Modal
        {...BASE_PROPS}
        onClose={jest.fn()}
        customCloseIcon={<span data-testid='custom-icon'>X</span>}
      />,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('sets body overflow hidden when open and restores on close', () => {
    const { unmount } = render(<Modal {...BASE_PROPS} />);

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('auto');
  });

  it('sets body overflow auto when isOpen is false', () => {
    render(<Modal {...BASE_PROPS} isOpen={false} />);
    expect(document.body.style.overflow).toBe('auto');
  });

  it('does not render Escape listener when isOpen is false', () => {
    const onClose = jest.fn();
    render(<Modal {...BASE_PROPS} isOpen={false} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('presses Escape with no onClose handler (covers onClose falsy branch)', () => {
    // onClose is undefined — Escape is pressed but nothing should happen
    render(<Modal {...BASE_PROPS} onClose={undefined} />);

    // Should not throw
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('applies custom maxHeight', () => {
    render(<Modal {...BASE_PROPS} maxHeight='90vh' />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ maxHeight: '90vh' });
  });
});

describe('useModal', () => {
  it('initial state: isOpen is false and modal is null', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.modal).toBeNull();
  });

  it('openModal sets isOpen and renders modal', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({ title: 'My Modal', body: <p>Body</p> });
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.modal).not.toBeNull();
  });

  it('closeModal resets isOpen and clears modal', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({ title: 'My Modal', body: <p>Body</p> });
    });

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.modal).toBeNull();
  });

  it('updateModal updates modal config while open', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({ title: 'Original', body: <p>Body</p> });
    });

    act(() => {
      result.current.updateModal({ title: 'Updated' });
    });

    // Re-render the modal to check updated title
    const { getByText } = render(<>{result.current.modal}</>);
    expect(getByText('Updated')).toBeInTheDocument();
  });

  it('updateModal does nothing when modal is not open', () => {
    const { result } = renderHook(() => useModal());

    // Should not throw
    act(() => {
      result.current.updateModal({ title: 'No-op' });
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('rendered modal calls closeModal when close button is clicked', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal({ title: 'Close Test', body: <p>Content</p> });
    });

    const { getByRole } = render(<>{result.current.modal}</>);
    fireEvent.click(getByRole('button', { name: 'Close modal' }));

    act(() => {}); // flush state updates

    expect(result.current.isOpen).toBe(false);
  });
});
