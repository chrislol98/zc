'use client';
import { useControllableValue } from 'ahooks';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useDefaultProps } from '@/hooks/use-default-props';
import React from 'react';
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
    const impreciseValue = Math.floor(value / precision) * precision;

    return parseFloat(impreciseValue.toFixed(1));
  }

  function getPreciseValue(event: React.MouseEvent, index: number) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const ratio = parseFloat((x / rect.width).toFixed(1));
    return index + updateValuePrecision(ratio);
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
    const fullIndex = Math.floor(hoverValue - 1);
    const hasDecimal = hoverValue % 1 !== 0;
    const decimal = hasDecimal
      ? updateValuePrecision(hoverValue) - Math.floor(hoverValue)
      : 0;

    function renderIcon(i: number) {
      if (i <= fullIndex) {
        return React.cloneElement(icon);
      }

      if (i === fullIndex + 1 && hasDecimal) {
        return decimal;
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
