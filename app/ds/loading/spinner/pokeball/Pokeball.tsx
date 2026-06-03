import React from 'react';

export default function Pokeball() {
  return (
    <svg
      viewBox='0 0 40 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      focusable='false'
      className='h-full w-full'
      style={{
        animation: 'pokeballSpin 0.85s linear infinite',
        transformOrigin: '50% 50%',
      }}
    >
      <circle cx='20' cy='20' r='18.5' fill='#f8fafc' stroke='#0f172a' strokeWidth='2' />
      <path d='M1.5 20h37' stroke='#0f172a' strokeWidth='2' />
      <path
        d='M1.5 20C1.5 10.059 9.559 2 19.5 2A18.5 18.5 0 0138.5 20H1.5Z'
        fill='#ef4444'
      />
      <circle cx='20' cy='20' r='5' fill='#f8fafc' stroke='#0f172a' strokeWidth='2' />
      <circle cx='20' cy='20' r='2.5' fill='#0f172a' />
      <style>{`
        @keyframes pokeballSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </svg>
  );
}
