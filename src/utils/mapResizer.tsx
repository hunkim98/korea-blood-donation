import React, { useEffect, useState } from "react";

type Resizer<T> = T & {
  children: React.ReactElement<{
    width: number;
    height: number;
  }>;
};

const Resizer = <T,>({ children }: Resizer<T>) => {
  // add resize observer here
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerWidth(width);
        setContainerHeight(height);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  // Clone children and pass the container width as a prop
  const enhancedChildren = React.Children.map(children, (child) =>
    React.isValidElement<{
      width: number;
      height: number;
    }>(child)
      ? // override the width prop with the container width
        React.cloneElement(child, {
          width: containerWidth,
          height: containerHeight,
        })
      : child
  );

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        width: "100%",
      }}
    >
      {enhancedChildren}
    </div>
  );
};

export default Resizer;
