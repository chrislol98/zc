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
}
export const Rate = (_props: RateProps) => {
  const props = useDefaultProps(_props, {
    defaultValue: 0,
    count: 5,
    icon: <Star />,
    // TODO: HOW TO GET RID OF SATISFIES
  } satisfies RateProps);
  const { count, icon } = props;
  const [value, setValue] = useControllableValue<RateProps['value']>(props);
  const [hoverValue, setHoverValue] = useState(value);

  function resetHoverValue() {
    setHoverValue(value);
  }

  function getPreciseValue(event: React.MouseEvent, index: number) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const ratio = parseFloat((x / rect.width).toFixed(1));
    return index + ratio;
  }

  function onClick(event: React.MouseEvent<HTMLDivElement>, index: number) {
    const newValue = getPreciseValue(event, index);
    if (newValue === value) {
      setValue(0);
      setHoverValue(0);
    } else {
      setValue(newValue);
    }
  }

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>, index: number) {
    setHoverValue(getPreciseValue(event, index));
  }

  function render() {
    if (hoverValue === undefined) return null;
    const fullIndex = Math.floor(hoverValue - 1);
    const hasDecimal = hoverValue % 1 !== 0;
    const decimal = hasDecimal ? (hoverValue - fullIndex - 1).toFixed(1) : 0;
    const commonIconProps = {
      className: 'text-green-500',
    };

    function renderIcon(i: number) {
      if (i <= fullIndex) {
        return React.cloneElement(icon, { ...commonIconProps });
      }

      if (i === fullIndex + 1 && hasDecimal) {
        return decimal;
      }

      return React.cloneElement(icon);
    }

    return [...Array(count)].map((_, i) => (
      <div
        key={i}
        onClick={(e) => onClick(e, i)}
        onMouseMove={(e) => onMouseMove(e, i)}
      >
        {renderIcon(i)}
      </div>
    ));
  }

  return (
    <div className="flex" onMouseLeave={resetHoverValue}>
      {render()}
    </div>
  );
};

Rate.displayName = 'Rate';
