import React, { useEffect, useState } from "react";

type Resizer<T> = T & {
  staticHeight?: number;
  maxHeight?: number;
  maxWidth?: number;
  children: React.ReactElement<{
    width: number;
    height: number;
  }>;
};

const Resizer = <T,>({
  children,
  staticHeight,
  maxWidth,
  maxHeight,
}: Resizer<T>) => {
  // add resize observer here
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (maxWidth && width >= maxWidth) {
          setContainerWidth(maxWidth);
        } else {
          setContainerWidth(width);
        }
        if (maxHeight && height >= maxHeight) {
          setContainerHeight(maxHeight);
        } else {
          setContainerHeight(height);
        }
        if (staticHeight === undefined) {
          setContainerHeight(height);
        }
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
          height: staticHeight ? staticHeight : containerHeight,
        })
      : child
  );

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        width: "100%",
        // height: "100%",
      }}
    >
      {enhancedChildren}
    </div>
  );
};

export default Resizer;
