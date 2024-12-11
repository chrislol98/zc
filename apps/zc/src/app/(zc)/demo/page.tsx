'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

const DemoPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const position = e.currentTarget.scrollTop;
    setScrollPosition(position);
  };

  return (
    <div style={{ height: '200px', overflow: 'auto' }} onScroll={handleScroll}>
      <div style={{ height: '1000px' }}>
        <div style={{ position: 'fixed', top: 0, background: 'white' }}>
          Scroll position: {scrollPosition}
        </div>
        <div style={{ height: '100%' }}></div>
      </div>
    </div>
  );
};

export default DemoPage;
