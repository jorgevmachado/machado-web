import React from 'react';

export type TFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

export type TImageSize = 'sm' | 'md' | 'lg' | 'xl';

export type ImageSizeProps = {
  py: string;
  width: number;
  height: number;
  className: string;
}

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'>{
  src?: string;
  fit?: TFit;
  size?: TImageSize;
  width?: number;
  height?: number;
  lazyLoad?: boolean;
  fallback?: React.ReactNode;
  unoptimized?: boolean;
  fallbackSrcList?: Array<string>;
}