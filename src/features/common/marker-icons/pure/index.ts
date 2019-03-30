import { DEFAULT_COLOR_MAP, EColorCodes, EIconStyle } from '../enums';

// Original fill color in the svg files
export const originalSvgColor = '#7C7CF0';

export const updateColors = (svgContent = '', type: string, iconStyle: EIconStyle): string => {
  let fillColor: string;

  switch (iconStyle) {
    case EIconStyle.GREEN:
      fillColor = 'green'; // used for checkpoints. Need to be defined correctly
      break;
    case EIconStyle.GREY:
      fillColor = 'grey'; // used for checkpoints. Need to be defined correctly
      break;
    case EIconStyle.RED:
      fillColor = 'red'; // used for checkpoints. Need to be defined correctly
      break;
    case EIconStyle.HIGHLIGHTED:
      fillColor = EColorCodes.HIGHLIGHTED;
      break;
    case EIconStyle.PIN:
      fillColor = EColorCodes.PIN;
      break;
    default:
      fillColor = DEFAULT_COLOR_MAP[type] || EColorCodes.LIGHT_GREEN;
      break;
  }

  return svgContent.replace(new RegExp(`fill="${originalSvgColor}"`, 'g'), `fill="${fillColor}"`);
};

export const getFileId = (type: string): string => {
  let fileId;

  switch (type) {
    case 'unknown':
      fileId = 'asterisco';
      break;
    case 'bench':
      fileId = 'picnic';
      break;
    default:
      fileId = type;
      break;
  }

  return fileId;
};

export const prepareSvg = (content: string, fileId: string, encoded: boolean, iconStyle: EIconStyle) => {
  if (content) {
    const iconStr = updateColors(content, fileId, iconStyle);

    return encoded ? `data:image/svg+xml;base64,${btoa(iconStr)}` : iconStr;
  } else {
    return undefined;
  }
};
