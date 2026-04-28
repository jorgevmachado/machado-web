'use client';
import React from 'react';
import { useColor } from '@/app/utils';

export default function Bar() {
  const { main } = useColor();

  return (
    <svg
      viewBox="0 0 120 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      <rect
        x="0"
        y="0"
        width="40"
        height="8"
        rx="4"
        fill={main}
        style={{
          animation: 'barSlide 1.6s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes barSlide {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: translateX(80px);
            opacity: 1;
          }
        }
      `}</style>
    </svg>
  );
}

