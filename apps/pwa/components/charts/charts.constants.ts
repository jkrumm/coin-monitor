import { timeFormat } from 'd3-time-format';
import { defaultStyles } from '@visx/tooltip';

// styling
export const background = '#1c2127';
export const accentColor = '#edffea';
export const accentColorTooltip = '#184a90';
export const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};
export const axisColor = '#f6f7f9';
export const axisBottomTickLabelProps = {
  textAnchor: 'middle' as const,
  fontFamily: 'Arial',
  fontSize: 14,
  fill: axisColor,
};
export const axisLeftTickLabelProps = {
  dx: '-0.25em',
  dy: '0.25em',
  fontFamily: 'Arial',
  fontSize: 14,
  textAnchor: 'end' as const,
  fill: axisColor,
};
export const buyColor = '#238551';
export const sellColor = '#cd4246';

// util
export const formatDate = timeFormat('%Y-%m-%d');
