
export const getContrastColor = (backgroundColor: string): string => {
    // Convert the hex color to RGB
    const hexToRgb = (hex: string): number[] => {
      const bigint = parseInt(hex.replace('#', ''), 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };
  
    const [r, g, b] = hexToRgb(backgroundColor);
  
    // Calculate the relative luminance using the formula for sRGB
    const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
  
    // Set the text color based on the luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };
