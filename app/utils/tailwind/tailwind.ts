import { TTone } from '@/app/utils';

type BuildColorToneParams = {
  tone?: TTone;
  color?: string;
  optTone?: TTone;
  optColor?: string;
  classMap?: Record<TTone ,string>;
}
export const buildColorTone = ({
  tone,
  color,
  optTone,
  optColor,
  classMap
}: BuildColorToneParams
): string | undefined => {
  if (color) {
    return color;
  }

  if (tone && classMap) {
    return classMap[tone];
  }

  if (optTone && classMap) {
    return classMap[optTone];
  }

  if (optColor) {
    return optColor;
  }

  return;
};