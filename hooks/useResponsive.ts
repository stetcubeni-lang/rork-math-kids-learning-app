import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const scaleX = width / BASE_WIDTH;
    const scaleY = height / BASE_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    const isTablet = width >= 768;
    const isLargeTablet = width >= 1024;

    const s = (size: number) => Math.round(size * scale);

    const fs = (size: number) => {
      const factor = isTablet ? Math.min(scale, 1.6) : scale;
      return Math.round(size * factor);
    };

    const hp = (percentage: number) => Math.round((height * percentage) / 100);
    const wp = (percentage: number) => Math.round((width * percentage) / 100);

    const columns = isLargeTablet ? 3 : isTablet ? 2 : 1;

    const contentMaxWidth = isTablet ? Math.min(width * 0.85, 900) : width;

    return {
      width,
      height,
      scale,
      scaleX,
      scaleY,
      isTablet,
      isLargeTablet,
      s,
      fs,
      hp,
      wp,
      columns,
      contentMaxWidth,
    };
  }, [width, height]);
}
