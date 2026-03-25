import { Button } from "@/components/ui/Button";

export type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => onChange(Math.max(1, value - 1))}>
        -
      </Button>
      <span className="min-w-[32px] text-center text-sm font-semibold">{value}</span>
      <Button variant="outline" size="sm" onClick={() => onChange(value + 1)}>
        +
      </Button>
    </div>
  );
}
