import React, { useState } from 'react';
import { H1, H3, H4, Icon, IconSize, Popover, Switch } from '@blueprintjs/core';
import { ParentSize } from '@visx/responsive';
import Chart from '@cm/pwa/components/charts/chart';
import { BaseMetric } from '@cm/types';

export default function ChartWrapper({
  baseMetric,
  lines,
}: {
  baseMetric: BaseMetric;
  lines: { values: number[]; id: string; color: string }[];
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [useCompact, setUseCompact] = useState<boolean>(false);
  const [useGlyphs, setUseGlyphs] = useState<boolean>(true);
  const [useTooltip, setUseTooltip] = useState<boolean>(true);
  const [useGrid, setUseGrid] = useState<boolean>(true);

  const mappedLines = lines.map((line) => {
    const reversedLine = line.values.slice().reverse();
    return {
      mappedValues: reversedLine.map((value, index) => ({
        c: value,
        d: baseMetric.btc.at(-(index + 1)).d,
      })),
      id: line.id,
      color: line.color,
    };
  });

  return (
    <div
      className="
        mt-8
        mb-20
        bg-bDarkGray-3
        border
        border-bDarkGray-5
        text-bLightGray-5
        min-w-full
        rounded"
    >
      <div className="flex justify-between h-[50px] border-b border-bDarkGray-5">
        <div className="px-3">
          <H1 className="mb-0 mt-1">Chart</H1>
        </div>
        <div>
          <Popover
            interactionKind="click"
            placement="bottom-end"
            isOpen={isSettingsOpen}
            usePortal={true}
            onInteraction={(state) => setIsSettingsOpen(state)}
          >
            <div
              className={`
                  border-l
                  border-bDarkGray-5
                  h-[48px]
                  px-5
                  flex
                  relative
                  items-center
                  justify-center
                  transition
                  hover:bg-bDarkGray-2
                  cursor-pointer
                  ${isSettingsOpen && 'bg-bDarkGray-2'}`}
            >
              <Icon icon="series-configuration" size={IconSize.LARGE} />
            </div>
            <div>
              <div className="border-b w-full border-bBorder px-3 py-2">
                <H4 className="m-0">Chart Settings</H4>
              </div>
              <div className="p-3">
                <Switch
                  checked={useCompact}
                  label="Compact"
                  onChange={() => setUseCompact(!useCompact)}
                />
                <Switch
                  checked={useGlyphs}
                  label="Arrow signals"
                  onChange={() => setUseGlyphs(!useGlyphs)}
                />
                <Switch
                  checked={useTooltip}
                  label="Tooltip"
                  onChange={() => setUseTooltip(!useTooltip)}
                />
                <Switch
                  checked={useGrid}
                  label="Grid"
                  onChange={() => setUseGrid(!useGrid)}
                />
              </div>
            </div>
          </Popover>
        </div>
      </div>
      <div className="h-[800px]">
        <ParentSize>
          {({ width, height }) => (
            <Chart
              btc={baseMetric.btc}
              events={baseMetric.events}
              width={width}
              height={height}
              useCompact={useCompact}
              useGlyphs={useGlyphs}
              useTooltip={useTooltip}
              useGrid={useGrid}
              lines={mappedLines}
            />
          )}
        </ParentSize>
      </div>
      <div>
        <div className="border-b border-t w-full border-bBorder px-3 py-2">
          <H3 className="m-0">Performance</H3>
        </div>
        <div>Lorem Impsum dolor</div>
      </div>
    </div>
  );
}
