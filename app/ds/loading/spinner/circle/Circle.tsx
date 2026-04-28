'use client';
import React from 'react';
import { useColor } from '@/app/utils';

export default function Circle() {
  const { main } = useColor();

  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke={main}
        strokeWidth="4"
        strokeDasharray="31.4 94.2"
        strokeLinecap="round"
        style={{
          animation: 'circleRotate 1.2s linear infinite',
          transformOrigin: '50% 50%',
        }}
      />
      <style>{`
        @keyframes circleRotate {
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

