export enum CardItemTypes {
  BUY_SELL = 'buy_sell',
  PERCENT = 'percent',
}

const percentColors = [
  { pct: 0.0, color: { r: 35, g: 133, b: 81 } },
  { pct: 0.5, color: { r: 200, g: 118, b: 25 } },
  { pct: 1.0, color: { r: 205, g: 66, b: 70 } },
];

const getColorForPercentage = (pct) => {
  let i;
  for (i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  const lower = percentColors[i - 1];
  const upper = percentColors[i];
  const range = upper.pct - lower.pct;
  const rangePct = (pct - lower.pct) / range;
  const pctLower = 1 - rangePct;
  const pctUpper = rangePct;
  const color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
  };
  console.log('rgb(' + [color.r, color.g, color.b].join(',') + ')');
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  // or output as hex if preferred
};

// for (var i = 0, l = 3; i <= l; i++) {
//   var li = $('<li>')
//     .css('background-color', getColorForPercentage(i / l))
//     .text(((i / l) * 100).toFixed(0) + '%');
//   $('.spot').append(li);
// }

export default function CardItem({
  title,
  value,
  type,
}: {
  title: string;
  value: string | number;
  type?: CardItemTypes;
}) {
  let classNames = '';
  let styles = {};
  switch (type) {
    case CardItemTypes.BUY_SELL:
      classNames = value === 'BUY' ? 'text-bSuccess' : 'text-bDanger';
      break;
    case CardItemTypes.PERCENT:
      value =
        value.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }) + ' %';
      styles = { color: getColorForPercentage(parseInt(value) / 100) };
      break;
  }

  return (
    <div className="flex justify-between py-2 px-3 hover:bg-bDarkGray-4/50 transition">
      <div>{title}</div>
      <div className={classNames} style={styles}>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
