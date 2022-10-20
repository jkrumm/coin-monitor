export default function CardItem({
  title,
  value,
  signal,
}: {
  title: string;
  value: string;
  signal?: string;
}) {
  return (
    <div className="flex justify-between py-2">
      <div>{title}</div>
      <div>{value}</div>
    </div>
  );
}
