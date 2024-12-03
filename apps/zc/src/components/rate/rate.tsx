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
  onChange?: (value: number) => void;
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

  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const newValue = getPreciseValue(event);
    if (newValue === value) {
      setValue(0);
      setHoverValue(0);
    } else {
      setValue(newValue);
    }
  }
  
  function getPreciseValue(event: React.MouseEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const elementRect = element.getBoundingClientRect();
    const iconRect = element.children[0].getBoundingClientRect();
    const x = new Decimal(event.clientX).minus(elementRect.left).toNumber();
    const value = new Decimal(x).dividedBy(iconRect.width).toFixed(1);
    return updateValuePrecision(parseFloat(value));
  }
  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const value = getPreciseValue(event);
    setHoverValue(value);
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

    return [...Array(count)].map((_, i) => <div key={i}>{renderIcon(i)}</div>);
  }

  return (
    <div
      className="flex cursor-pointer"
      onMouseLeave={resetHoverValue}
      onClick={(e) => onClick(e)}
      onMouseMove={(e) => onMouseMove(e)}
    >
      {render()}
    </div>
  );
};

Rate.displayName = 'Rate';
