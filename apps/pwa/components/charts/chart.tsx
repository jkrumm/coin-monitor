import React, { useCallback, useMemo } from 'react';
import { scaleLog, scaleTime } from '@visx/scale';
import { AppleStock } from '@visx/mock-data/lib/mocks/appleStock';
import { LinearGradient } from '@visx/gradient';
import { bisector, extent, max, min } from 'd3-array';
import { defaultStyles, Tooltip, TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { timeFormat } from 'd3-time-format';
import { localPoint } from '@visx/event';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { Bar, Line, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { format } from 'd3-format';
import { Group } from '@visx/group';
import { GridColumns } from '@visx/grid';
import { GlyphTriangle } from '@visx/glyph';

const glyphs = [
  {
    date: '2018-12-13T00:00:00.000Z',
    type: 'buy',
  },
  {
    date: '2017-12-17T00:00:00.000Z',
    type: 'sell',
  },
];

// Initialize some variables
const PATTERN_ID = 'brush_pattern';
const GRADIENT_ID = 'brush_gradient';
export const background = '#1c2127';
export const background2 = '#252a31';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

// util
const formatDate = timeFormat('%Y-%m-%d');

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;
const bisectDate = bisector<AppleStock, Date>((d) => new Date(d.date)).left;

// FOR AREA CHART
const axisColor = '#f6f7f9';
const axisBottomTickLabelProps = {
  textAnchor: 'middle' as const,
  fontFamily: 'Arial',
  fontSize: 14,
  fill: axisColor,
};
const axisLeftTickLabelProps = {
  dx: '-0.25em',
  dy: '0.25em',
  fontFamily: 'Arial',
  fontSize: 14,
  textAnchor: 'end' as const,
  fill: axisColor,
};

const lineChartColor = '#184a90';

type TooltipData = AppleStock;
export type BrushProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  stock: { date: string; close: number }[];
  compact?: boolean;
};

/*{
    top: 20,
    left: 60,
    bottom: 40,
    right: 20,
  },*/

function BrushChart({
  compact = false,
  width,
  height,
  stock,
  margin = {
    top: 20,
    left: 60,
    bottom: 40,
    right: 20,
  },
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop = 0,
  tooltipLeft = 0,
}: BrushProps & WithTooltipProvidedProps<TooltipData>) {
  if (compact) {
    margin = {
      top: 0,
      left: 10,
      bottom: 0,
      right: 10,
    };
  }
  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(innerHeight, 0);
  const yMin = Math.min(innerHeight, 0);

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xMax],
        // range: [margin.left, innerWidth + margin.left],
        domain: extent(stock, getDate) as [Date, Date],
      }),
    [innerWidth, margin.left],
  );

  const stockScale = useMemo(
    () =>
      /*scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (max(stock, getStockValue) || 0) + innerHeight / 3],
        nice: true,
      }),*/
      scaleLog<number>({
        range: [yMax, yMin],
        // range: [innerHeight + margin.top, margin.top],
        domain: [min(stock, getStockValue), max(stock, getStockValue)],
        nice: true,
      }),
    [margin.top, innerHeight],
  );

  console.log(stock[3000]);

  // accessors
  const date = (d: AppleStock) => d.date.valueOf();
  const value = (d: AppleStock) => d.close;

  // positions
  const getX = (d: AppleStock) => dateScale(new Date(d.date)) ?? 0;
  const getY = (d: AppleStock) => stockScale(d.close) ?? 0;

  // tooltip handler
  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      let { x } = localPoint(event) || { x: 0 };
      x = x - margin.left;
      const x0 = dateScale.invert(x);
      const index = bisectDate(stock, x0, 1);
      const d0 = stock[index - 1];
      const d1 = stock[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: stockScale(getStockValue(d)),
      });
    },
    [showTooltip, stockScale, dateScale],
  );

  return (
    <div>
      <svg width={width} height={height}>
        <LinearGradient id={GRADIENT_ID} from={background} to={background2} rotate={45} />
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={`url(#${GRADIENT_ID})`}
          rx={14}
        />
        <Group left={margin.left} top={margin.top}>
          {/*<LinearGradient*/}
          {/*  id="gradient"*/}
          {/*  from={lineChartColor}*/}
          {/*  fromOpacity={1}*/}
          {/*  to={gradientColor}*/}
          {/*  toOpacity={0.8}*/}
          {/*/>
          <GridRows
            left={margin.left}
            scale={stockScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />*/}
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            stroke={accentColor}
            strokeOpacity={0.05}
            pointerEvents="none"
          />
          {/*<AreaClosed<AppleStock>
            data={stock}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => stockScale(getStockValue(d)) ?? 0}
            yScale={stockScale}
            strokeWidth={1}
            stroke={lineChartColor}
            fill={lineChartColor}
            curve={curveMonotoneX}
          />*/}
          <LinePath<AppleStock>
            data={stock}
            x={(d) => dateScale(getDate(d)) || 0}
            y={(d) => stockScale(getStockValue(d)) || 0}
            // yScale={yScale}
            strokeWidth={2}
            stroke={lineChartColor}
            // fill="url(#gradient)"
            curve={curveMonotoneX}
          />
          {!compact && (
            <AxisBottom
              top={yMax}
              scale={dateScale}
              numTicks={width > 520 ? 10 : 5}
              stroke={axisColor}
              tickStroke={axisColor}
              tickLabelProps={() => axisBottomTickLabelProps}
            />
          )}
          {!compact && (
            <AxisLeft
              scale={stockScale}
              numTicks={6}
              stroke={axisColor}
              tickStroke={axisColor}
              tickLabelProps={() => axisLeftTickLabelProps}
              tickFormat={format('~s')}
              // tickValues={}
            />
          )}
          {/*children*/}
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {/*<AreaChart
          hideBottomAxis={compact}
          hideLeftAxis={compact}
          data={stock}
          width={width}
          margin={{ ...margin }}
          yMax={yMax}
          xScale={dateScale}
          yScale={stockScale}
          gradientColor={background2}
        />*/}
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
          {stock.map((item, index) => {
            for (const glyph of glyphs) {
              if (item.date === glyph.date) {
                return (
                  <g key={`line-glyph-${index}`}>
                    <GlyphTriangle
                      fill={glyph.type === 'buy' ? 'green' : 'red'}
                      left={getX(item)}
                      top={getY(item) + (glyph.type === 'buy' ? 15 : -15)}
                      className={glyph.type === 'sell' && 'rotate-180'}
                    />
                  </g>
                );
              }
            }
          })}
        </Group>
      </svg>
      {tooltipData && (
        <Group left={margin.left} top={margin.top}>
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12 + margin.bottom}
              left={tooltipLeft + margin.left + 12}
              style={tooltipStyles}
            >
              {`$${getStockValue(tooltipData)}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft + margin.left - 8}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        </Group>
      )}
    </div>
  );
}

export default withTooltip<BrushProps, TooltipData>(BrushChart);
