import { DEFAULT_COLOR_MAP, EColorCodes, EIconStyle } from '../enums';
import { SvgContent } from '../store/state';

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

  return svgContent.replace(new RegExp(`(fill|stroke)="${originalSvgColor}"`, 'g'), `$1="${fillColor}"`);
};

export const getFileId = (type: string): string => {
  switch (type) {
    case 'unknown':
      return 'asterisco';

    case 'bench':
      return 'picnic';

    default:
      return type;
  }
};

/**
 * Update colors and encode the svg content (if needed)
 */
export const prepareSvg = (content: string, fileId: string, encoded: boolean, iconStyle: EIconStyle) => {
  if (content) {
    const iconStr = updateColors(content, fileId, iconStyle);

    return encoded ? `data:image/svg+xml;base64,${btoa(iconStr)}` : iconStr;
  } else {
    return undefined;
  }
};

// Used in the selector
export const getSvgContent = (
  type: string,
  svgStoreContents: Array<SvgContent>,
  encoded: boolean,
  iconStyle: EIconStyle
): string => {
  const fileId = getFileId(type);

  const svgContent: SvgContent =
    svgStoreContents.find(s => s.id === fileId) || svgStoreContents.find(s => s.id === 'asterisco');

  if (svgContent) {
    return prepareSvg(svgContent.content, fileId, encoded, iconStyle);
  } else {
    return undefined;
  }
};
