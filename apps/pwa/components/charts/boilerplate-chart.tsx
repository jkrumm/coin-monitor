import React, { useCallback, useMemo } from 'react';
import { scaleLog, scaleTime } from '@visx/scale';
import { AppleStock } from '@visx/mock-data/lib/mocks/appleStock';
import { bisector, extent, max, min } from 'd3-array';
import { defaultStyles, Tooltip, TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { Bar, Line, LinePath } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { format } from 'd3-format';
import { Group } from '@visx/group';
import { GridColumns, GridRows } from '@visx/grid';
import { GlyphTriangle } from '@visx/glyph';
import {
  accentColor,
  accentColorTooltip,
  axisBottomTickLabelProps,
  axisColor,
  axisLeftTickLabelProps,
  background,
  buyColor,
  formatDate,
  sellColor,
  tooltipStyles,
} from '@cm/pwa/components/charts/charts.constants';
import { curveMonotoneX } from '@visx/curve';
import { DateTime } from 'luxon';
import crypto from 'crypto';

export function toDateTime(date: string | Date): DateTime {
  if (date instanceof Date) {
    return DateTime.fromJSDate(date);
  }
  // in case we have invalid date, DateTime will softfail by returning a valid
  // Object with invalid data (which results in formmating functions to return null)
  return DateTime.fromISO(date);
}

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;
const bisectDate = bisector<AppleStock, Date>((d) => new Date(d.date)).left;

type TooltipData = AppleStock;
export type BrushProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  stock: { date: string; close: number }[];
  events: { date: string; close: number; index: number; type: 'buy' | 'sell' }[];
  showGrid?: boolean;
  useTooltip?: boolean;
  compact?: boolean;
};

function BoilerplateChart({
  compact = false,
  width,
  height,
  stock,
  events,
  showGrid = true,
  useTooltip = true,
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
        domain: [min(stock, getStockValue), max(stock, getStockValue)],
        nice: true,
      }),
    [margin.top, innerHeight],
  );

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
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
        <Group left={margin.left} top={margin.top}>
          {showGrid && (
            <GridRows
              scale={stockScale}
              numTicks={6}
              width={innerWidth}
              stroke={accentColor}
              strokeOpacity={0.05}
              pointerEvents="none"
            />
          )}
          {showGrid && (
            <GridColumns
              scale={dateScale}
              height={innerHeight}
              stroke={accentColor}
              strokeOpacity={0.05}
              pointerEvents="none"
            />
          )}
          <LinePath<AppleStock>
            data={stock.slice(0, events[0].index + 1)}
            x={(d) => dateScale(getDate(d)) || 0}
            y={(d) => stockScale(getStockValue(d)) || 0}
            strokeWidth={1}
            stroke={buyColor}
            curve={curveMonotoneX}
          />
          {events.map((event, index) => {
            if (index === 0) return;
            return (
              <LinePath<AppleStock>
                data={stock.slice(events[index - 1].index, event.index + 1)}
                x={(d) => dateScale(getDate(d)) || 0}
                y={(d) => stockScale(getStockValue(d)) || 0}
                strokeWidth={1}
                stroke={event.type === 'buy' ? sellColor : buyColor}
                curve={curveMonotoneX}
              />
            );
          })}
          <LinePath<AppleStock>
            data={stock.slice(-(stock.length - events.slice(-1)[0].index))}
            x={(d) => dateScale(getDate(d)) || 0}
            y={(d) => stockScale(getStockValue(d)) || 0}
            strokeWidth={1}
            stroke={events.slice(-1)[0].type === 'buy' ? buyColor : sellColor}
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
            />
          )}
          {useTooltip && (
            <Bar
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              rx={14}
              onTouchStart={handleTooltip}
              onTouchMove={handleTooltip}
              onMouseMove={handleTooltip}
              onMouseLeave={() => hideTooltip()}
            />
          )}
          {useTooltip && tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{ x: tooltipLeft, y: innerHeight }}
                stroke={accentColorTooltip}
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
                fill={accentColorTooltip}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
          {events &&
            stock.map((item, index) => {
              for (const event of events) {
                if (item.date === event.date) {
                  return (
                    <g key={`line-glyph-${index}`}>
                      <GlyphTriangle
                        fill={event.type === 'buy' ? buyColor : sellColor}
                        left={getX(item)}
                        top={getY(item) + (event.type === 'buy' ? 15 : -15)}
                        className={event.type === 'sell' ? 'rotate-180' : ''}
                      />
                    </g>
                  );
                }
              }
            })}
        </Group>
      </svg>
      {useTooltip && tooltipData && (
        <Group left={margin.left} top={margin.top}>
          <div>
            <TooltipWithBounds
              key={crypto.randomBytes(6).toString()}
              top={tooltipTop - 12 + margin.bottom}
              left={tooltipLeft + margin.left + 12}
              style={tooltipStyles}
            >
              {`$${getStockValue(tooltipData)}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 10}
              left={tooltipLeft + margin.left - 10}
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

export default withTooltip<BrushProps, TooltipData>(BoilerplateChart);
