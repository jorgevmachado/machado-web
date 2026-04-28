import React ,{ useMemo } from 'react';

import {
  DECORATION_CLASS_MAP ,
  joinClass ,
  LEADING_CLASS_MAP ,
  TEXT_ALIGN_CLASS_MAP ,
  TEXT_SIZE_CLASS_MAP ,
  TEXT_TONE_CLASS_MAP ,
  TRACKING_CLASS_MAP ,
  TRANSFORM_CLASS_MAP ,
  WEIGHT_CLASS_MAP ,
  FONT_FAMILY_CLASS_MAP ,
  WHITESPACE_CLASS_MAP ,
  LINE_CLAMP_CLASS_MAP ,
  DISPLAY_CLASS_MAP ,
  BREAK_CLASS_MAP ,WRAP_CLASS_MAP ,buildColorTone ,
} from '@/app/utils';

import type { TextProps , TextTag ,TextTagProps } from './types';

const TAG_CLASS_MAP_PROPS: Record<TextTag, TextTagProps> = {
  blockquote: {
    tone: 'neutral',
    className: 'border-l-4 border-slate-200 pl-4 italic',
  },
  code: {
    size: 'sm',
    color: 'text-slate-800',
    fontFamily: 'mono',
    className: 'rounded-md bg-slate-100 px-1.5 py-0.5',
  },
  div: {
    size: 'base',
    tone:'neutral',
  },
  em: {
    tone:'neutral',
    className:'italic'
  },
  figcaption: {
    size: 'sm',
    tone: 'subtle',
  },
  h1: {
    size: '4xl',
    weight: 'bold',
    tracking: 'tight',
    color: 'text-slate-950',
    className:'md:text-5xl'
  },
  h2: {
    size: '3xl',
    weight: 'bold',
    tracking: 'tight',
    color: 'text-slate-950',
    className:'md:text-4xl'
  },
  h3: {
    size: '2xl',
    tone: 'default',
    weight: 'semibold',
    tracking: 'tight',
  },
  h4: {
    size: 'xl',
    weight: 'semibold',
    tone: 'default',
  },
  h5: {
    tone: 'default' ,
    size: 'lg' ,
    weight: 'semibold' ,
  },
  h6: {
    tone: 'default' ,
    size: 'base' ,
    weight: 'semibold' ,
  },
  label: {
    tone:'neutral',
    size: 'sm',
    weight: 'medium',
  },
  legend: {
    size: 'sm',
    weight: 'semibold',
    color: 'text-slate-800',
  },
  mark: {
    color: 'text-amber-950',
    className: 'bg-amber-100 px-1'
  },
  p: {
    tone:'neutral',
    size: 'base',
    leading: '7',
  },
  small: {
    size: 'sm',
    tone: 'subtle',
  },
  span: { tone:'inherit' },
  strong:{
    tone: 'default',
    weight: 'semibold',
  },
};

/**
 * Polymorphic typography primitive with semantic defaults and Tailwind-friendly overrides.
 * For any advanced Tailwind rule not covered by props, pass it through `className`.
 */
const TextBase = <T extends TextTag = 'p'>({
  as ,
  children ,
  size ,
  weight ,
  tone ,
  align ,
  transform ,
  tracking ,
  leading ,
  decoration ,
  fontFamily ,
  display ,
  wrap ,
  color ,
  whitespace ,
  breakStrategy ,
  lineClamp ,
  italic = false ,
  truncate = false ,
  srOnly = false ,
  className ,
  ...elementProps
}: TextProps<T>) => {
  const Component = (as ?? 'p') as React.ElementType;

  const classNameList = useMemo(() => {
    const classNames: Array<string> = [];
    const tagClassProps = TAG_CLASS_MAP_PROPS[Component as TextTag];
    const tagColor = buildColorTone({
      tone,
      color,
      optColor: tagClassProps?.color ,
      optTone: tagClassProps?.tone ,
      classMap: TEXT_TONE_CLASS_MAP,
    });
    if (tagColor) {
      classNames.push(tagColor);
    }
    const tagSize = size ?? tagClassProps?.size;
    if (tagSize) {
      classNames.push(TEXT_SIZE_CLASS_MAP[tagSize]);
    }
    const tagWeight = weight ?? tagClassProps?.weight;

    if (tagWeight) {
      classNames.push(WEIGHT_CLASS_MAP[tagWeight]);
    }
    const tagTracking = tracking ?? tagClassProps?.tracking;
    if (tagTracking) {
      classNames.push(TRACKING_CLASS_MAP[tagTracking]);
    }
    const tagFontFamily = fontFamily ?? tagClassProps?.fontFamily;
    if (tagFontFamily) {
      classNames.push(FONT_FAMILY_CLASS_MAP[tagFontFamily]);
    }

    const tagLeading = leading ?? tagClassProps?.leading;
    if (tagLeading) {
      classNames.push(LEADING_CLASS_MAP[tagLeading]);
    }

    if (tagClassProps?.className) {
      classNames.push(tagClassProps.className);
    }

    if (align) {
      classNames.push(TEXT_ALIGN_CLASS_MAP[align]);
    }

    if (transform) {
      classNames.push(TRANSFORM_CLASS_MAP[transform]);
    }

    if (decoration) {
      classNames.push(DECORATION_CLASS_MAP[decoration]);
    }

    if (display) {
      classNames.push(DISPLAY_CLASS_MAP[display]);
    }

    if (wrap) {
      classNames.push(WRAP_CLASS_MAP[wrap]);
    }

    if (whitespace) {
      classNames.push(WHITESPACE_CLASS_MAP[whitespace]);
    }

    if (breakStrategy) {
      classNames.push(BREAK_CLASS_MAP[breakStrategy]);
    }

    if (typeof lineClamp !== 'undefined') {
      classNames.push(LINE_CLAMP_CLASS_MAP[lineClamp]);
    }

    if (italic) {
      classNames.push('italic');
    }

    if (truncate) {
      classNames.push('truncate');
    }

    if (srOnly) {
      classNames.push('sr-only');
    }

    if (className) {
      classNames.push(className);
    }

    return joinClass(classNames);
  } ,[
    Component ,
    align ,
    breakStrategy ,
    className ,
    color ,
    decoration ,
    display ,
    fontFamily ,
    italic ,
    leading ,
    lineClamp ,
    size ,
    srOnly ,
    tone ,
    tracking ,
    transform ,
    truncate ,
    weight ,
    whitespace ,
    wrap]);

  return React.createElement(
    Component ,
    {
      ...elementProps ,
      className: classNameList ,
    } ,
    children ,
  );
};

const Text = React.memo(TextBase) as typeof TextBase;

export default Text;

