import React, { useMemo } from 'react';

import {
  BACKGROUND_COLOR_CLASS_MAP ,BORDER_COLOR_CLASS_MAP ,
  BORDER_RADIUS_CLASS_MAP ,HOVER_EFFECT_CLASS_MAP ,PADDING_CLASS_MAP ,
  SHADOW_CLASS_MAP ,
  joinClass
} from '@/app/utils';

import {
  type CardProps,
  type CardVariant,
} from './types';

const VARIANT_CLASS_MAP = {
  elevated: 'bg-white shadow-md border border-slate-200',
  filled: 'bg-slate-100 shadow-sm',
  outlined: 'bg-white border-2 border-slate-200',
  tonal: 'bg-slate-50 border border-slate-100',
  none: ''
} as const satisfies Record<CardVariant, string>;

/**
 * Card component: versatile container supporting multiple variants, customizable styling,
 * and flexible hover effects. Accepts children for any content.
 */
const CardBase = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'elevated',
      padding = 'md',
      rounded = '2xl',
      shadow = 'md',
      backgroundColor,
      borderColor,
      borderWidth = 0,
      hoverEffect = 'none',
      interactive = false,
      as: Component = 'article',
      className,
      ...divProps
    },
    ref,
  ) => {
    const cardClasses = useMemo(() => {
      const baseClasses = [
        'overflow-hidden',
        'transition-all',
        PADDING_CLASS_MAP[padding],
        BORDER_RADIUS_CLASS_MAP[rounded],
      ];

      // Apply variant base styles
      const variantClasses = VARIANT_CLASS_MAP[variant];
      baseClasses.push(variantClasses);

      // Override background if specified
      if (backgroundColor) {
        // Remove existing bg from variant
        const withoutBg = variantClasses
          .split(' ')
          .filter(c => !c.startsWith('bg-'))
          .join(' ');

        baseClasses[baseClasses.length - 1] = joinClass([
          withoutBg,
          BACKGROUND_COLOR_CLASS_MAP[backgroundColor],
        ]);
      }

      // Override shadow if specified
      if (shadow) {
        baseClasses.push(SHADOW_CLASS_MAP[shadow]);
      }

      // Add border color if specified
      if (borderColor && borderColor !== 'none') {
        baseClasses.push(BORDER_COLOR_CLASS_MAP[borderColor]);
      }

      // Add border width
      if (borderWidth > 0) {
        baseClasses.push(`border-${borderWidth}`);
      }

      // Add hover effect
      if (hoverEffect !== 'none') {
        baseClasses.push(HOVER_EFFECT_CLASS_MAP[hoverEffect]);
      }

      // Add interactive cursor
      if (interactive) {
        baseClasses.push('cursor-pointer');
      }

      // Add custom className
      if (className) {
        baseClasses.push(className);
      }

      return joinClass(baseClasses);
    }, [
      backgroundColor,
      borderColor,
      borderWidth,
      className,
      hoverEffect,
      interactive,
      padding,
      rounded,
      shadow,
      variant,
    ]);

    // Use JSX to avoid ESLint ref warning with createElement
    if (Component === 'article') {
      return (
        <article
          ref={ref as React.Ref<HTMLElement>}
          {...divProps}
          className={cardClasses}
        >
          {children}
        </article>
      );
    }

    if (Component === 'div') {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          {...divProps}
          className={cardClasses}
        >
          {children}
        </div>
      );
    }

    if (Component === 'section') {
      return (
        <section
          ref={ref as React.Ref<HTMLElement>}
          {...divProps}
          className={cardClasses}
        >
          {children}
        </section>
      );
    }

    // For any other component, render as div (safest default)
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        {...divProps}
        className={cardClasses}
      >
        {children}
      </div>
    );
  },
);

CardBase.displayName = 'Card';

const Card = React.memo(CardBase);

export default Card;



