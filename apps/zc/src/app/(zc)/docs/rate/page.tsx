'use client'
import { Rate } from '@/components/rate';
import { useState } from 'react';

export default function Page() {
  // return <Rate defaultValue={1.5} precision={0.2} />;
  return <App />;
}

function App() {
  return (
    <Parent>
      <Child />
    </Parent>
  );
}

function Parent({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(0);
  debugger;
  return (
    <div onClick={() => setValue((v) => v + 1)}>
      {value}
      {children}
    </div>
  );
}

function Child() {
  console.log('child');
  return 'child';
}
