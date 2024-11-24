'use client';
import { useControllableValue } from 'ahooks';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useDefaultProps } from '@/hooks/use-default-props';
import React from 'react';
import { Decimal } from 'decimal.js';
export interface RateProps {
  value?: number;
  defaultValue?: number;
  count?: number;
  icon?: React.ReactNode;
  precision?: number;
  disabled?: boolean;
}
export const Rate = (_props: RateProps) => {
  const props = useDefaultProps(_props, {
    defaultValue: 0,
    count: 5,
    icon: <Star color="#0858d9" />,
    emptyIcon: <Star />,
    precision: 1,
    disabled: false,
  });
  const { count, icon, precision, disabled, emptyIcon } = props;
  const [value, setValue] = useControllableValue<RateProps['value']>(props);
  const [hoverValue, setHoverValue] = useState(
    updateValuePrecision(value ?? 0)
  );

  function resetHoverValue() {
    setHoverValue(updateValuePrecision(value ?? 0));
  }

  function updateValuePrecision(value: number) {
    return new Decimal(value)
      .dividedBy(precision)
      .floor()
      .times(precision)
      .toNumber();
  }

  function getPreciseValue(event: React.MouseEvent, index: number) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const ratio = new Decimal(x).dividedBy(rect.width).toFixed(1);
    return new Decimal(index)
      .plus(updateValuePrecision(parseFloat(ratio)))
      .toNumber();
  }

  function onClick(event: React.MouseEvent<HTMLDivElement>, index: number) {
    if (disabled) return;
    const newValue = getPreciseValue(event, index);
    if (newValue === value) {
      setValue(0);
      setHoverValue(0);
    } else {
      setValue(newValue);
    }
  }

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>, index: number) {
    if (disabled) return;
    setHoverValue(getPreciseValue(event, index));
  }

  function render() {
    if (hoverValue === undefined) return null;
    const fullIndex = new Decimal(hoverValue).minus(1).floor().toNumber();
    const hasDecimal = hoverValue % 1 !== 0;
    const decimal = hasDecimal
      ? new Decimal(updateValuePrecision(hoverValue))
          .minus(new Decimal(hoverValue).floor())
          .toNumber()
      : 0;

    function renderIcon(i: number) {
      if (i <= fullIndex) {
        return React.cloneElement(icon);
      }

      if (i === fullIndex + 1 && hasDecimal) {
        return (
          <div className="relative">
            {React.cloneElement(emptyIcon)}
            <div
              className="absolute top-0 overflow-hidden"
              style={{ width: `${decimal * 100}%` }}
            >
              {React.cloneElement(icon)}
            </div>
          </div>
        );
      }

      return React.cloneElement(emptyIcon);
    }

    return [...Array(count)].map((_, i) => (
      <div key={i} className=" px-0.5">
        <div
          onClick={(e) => onClick(e, i)}
          onMouseMove={(e) => onMouseMove(e, i)}
        >
          {renderIcon(i)}
        </div>
      </div>
    ));
  }

  return (
    <div className="flex cursor-pointer" onMouseLeave={resetHoverValue}>
      {render()}
    </div>
  );
};

Rate.displayName = 'Rate';
