'use client';
import React from 'react';
import { useColor } from '@/app/utils';

export default function Dots() {
  const { main } = useColor();

  return (
    <svg
      viewBox="0 0 60 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      <circle
        cx="10"
        cy="6"
        r="2"
        fill={main}
        style={{
          animation: 'dotsBounce 1.4s ease-in-out infinite',
        }}
      />
      <circle
        cx="30"
        cy="6"
        r="2"
        fill={main}
        style={{
          animation: 'dotsBounce 1.4s ease-in-out infinite 0.2s',
        }}
      />
      <circle
        cx="50"
        cy="6"
        r="2"
        fill={main}
        style={{
          animation: 'dotsBounce 1.4s ease-in-out infinite 0.4s',
        }}
      />
      <style>{`
        @keyframes dotsBounce {
          0%, 80%, 100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          40% {
            transform: scale(1.15) translateY(-4px);
            opacity: 0.6;
          }
        }
      `}</style>
    </svg>
  );
}

