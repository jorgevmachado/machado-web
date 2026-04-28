import React from 'react';

type TopProgressBarProps = {
  isVisible: boolean;
};

/**
 * Global page-navigation loading bar.
 * Fixed at the very top of the screen.
 * Uses a Pokémon-themed red → yellow → blue gradient with an indeterminate animation.
 */
const TopProgressBar = ({ isVisible }: TopProgressBarProps) => {
  return (
    <div
      role='progressbar'
      aria-label='Page loading'
      aria-busy={isVisible}
      aria-hidden={!isVisible}
      className={[
        'pointer-events-none fixed inset-x-0 top-0 z-300 h-0.75 overflow-hidden transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      <div
        className='h-full w-full animate-[progress-indeterminate_1.4s_ease-in-out_infinite]'
        style={{
          background: 'linear-gradient(to right, #ef4444 0%, #facc15 40%, #3b82f6 80%, #ef4444 100%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
};

export default TopProgressBar;

