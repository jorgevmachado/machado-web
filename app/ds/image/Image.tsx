'use client';
import React ,{ useCallback ,useMemo ,useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import NextImage from 'next/image';

import { joinClass } from '../../utils';

import type { ImageProps ,ImageSizeProps ,TFit ,TImageSize } from './types';

const FIT_CLASS_MAP: Record<TFit ,string> = {
  fill: 'object-fill' ,
  none: 'object-none' ,
  cover: 'object-cover' ,
  contain: 'object-contain' ,
  'scale-down': 'object-scale-down' ,
};

const IMAGE_SIZE_CLASS_MAP: Record<TImageSize ,ImageSizeProps> = {
  sm: {
    py: 'py-10' ,
    width: 168 ,
    height: 132 ,
    className: 'max-h-32' ,
  } ,
  md: {
    py: 'py-16' ,
    width: 220 ,
    height: 180 ,
    className: 'max-h-48' ,
  } ,
  lg: {
    py: 'py-18' ,
    width: 280 ,
    height: 220 ,
    className: 'max-h-60' ,
  } ,
  xl: {
    py: 'py-20' ,
    width: 400 ,
    height: 400 ,
    className: 'max-h-72' ,
  } ,
};

export default function Image({
  alt = 'Image' ,
  fit ,
  src ,
  size = 'md' ,
  width ,
  height ,
  loading ,
  onError: onErrorCallback ,
  lazyLoad = true ,
  fallback ,
  className ,
  unoptimized = true ,
  fallbackSrcList ,
  ...props
}: ImageProps) {
  const [isInvalid ,setIsInvalid] = useState<boolean>(false);
  const [fallbackSrcState ,setFallbackSrcState] = useState<Array<string> | undefined>(
    fallbackSrcList);

  const [activeImageSrc ,setActiveImageSrc] = useState<string | undefined>(src);

  const isSrcInvalid = useMemo(
    () => !activeImageSrc || activeImageSrc?.trim() === '' ,[activeImageSrc]);

  const passthroughImageLoader = ({ src }: { src: string }) => src;

  const getNextSrc = useCallback((fallbackSrcState: Array<string>) => {
    const currentImage = fallbackSrcState[0];
    const fallbackSrcStateFiltered = fallbackSrcState.filter(
      (src) => src !== currentImage);
    setFallbackSrcState(fallbackSrcStateFiltered);
    return currentImage;
  } ,[]);

  const validateFallbackSrc = useCallback(
    (fallbackSrcState?: Array<string>) => {
      if (!fallbackSrcState) {
        return true;
      }
      if (fallbackSrcState.length <= 0) {
        setFallbackSrcState(undefined);
        return true;
      }
      const currentImage = getNextSrc(fallbackSrcState);
      setActiveImageSrc(currentImage);
      return false;
    } ,[getNextSrc]);

  const onError = useCallback<React.ReactEventHandler<HTMLImageElement>>(
    (event) => {
      setIsInvalid(validateFallbackSrc(fallbackSrcState));
      return onErrorCallback?.(event);
    } ,
    [fallbackSrcState ,onErrorCallback ,validateFallbackSrc] ,
  );

  const validateSrc = useCallback(() => {
    if (!activeImageSrc && fallbackSrcState && fallbackSrcState.length > 0) {
      const currentImage = getNextSrc(fallbackSrcState);
      setActiveImageSrc(currentImage);
      return false;
    }
    return (isSrcInvalid || isInvalid) && fallbackSrcState;
  } ,[activeImageSrc ,fallbackSrcState ,getNextSrc ,isInvalid ,isSrcInvalid]);

  const imageSizeConfig = useMemo(() => {
    const result: ImageSizeProps = { ...IMAGE_SIZE_CLASS_MAP[size] };
    if (width) {
      result.width = width;
    }
    if (height) {
      result.height = height;
    }

    result.className = !width || !height ? result.className : '';
    return result;
  } ,[height ,size ,width]);

  const classNameList = useMemo(() => {
    const classNames: Array<string> = [
      'w-full h-full' ,
      imageSizeConfig.className ,
      className ?? '' ,
    ];
    if (fit) {
      classNames.push(FIT_CLASS_MAP[fit]);
    }

    return joinClass(classNames);
  } ,[className ,fit ,imageSizeConfig.className]);

  const classNameListError = useMemo(() => {
    const classNames: Array<string> = [
      'flex' ,
      imageSizeConfig.py ,
      'rounded-lg' ,
      'items-center' ,
      'justify-center' ,
      'bg-neutral-800' ,
      'text-neutral-400' ,
      classNameList,
    ];
    return joinClass(classNames);
  } ,[classNameList ,imageSizeConfig.py]);

  if (validateSrc()) {
    return (
      <div
        title={ alt }
        className={ classNameListError }
        aria-label={ alt ?? 'Image failed to load' }
      >
        { fallback === undefined
          ? (
            <FaCamera size="2rem"/>
          )
          : fallback
        }
      </div>
    );
  }

  return (
    <NextImage
      { ...props }
      src={ activeImageSrc! }
      alt={ alt }
      width={ imageSizeConfig.width }
      height={ imageSizeConfig.height }
      loader={ passthroughImageLoader }
      loading={ loading ?? (lazyLoad ? 'lazy' : undefined) }
      onError={ onError }
      className={ classNameList }
      unoptimized={ unoptimized }
    />
  );
}
