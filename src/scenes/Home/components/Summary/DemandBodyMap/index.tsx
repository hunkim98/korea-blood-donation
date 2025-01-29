import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ExampleBodySvg from "./exampleSvg";

export interface DemandBodyMapProps {
  width: number;
  height: number;
}

const DemandBodyMap: React.FC<DemandBodyMapProps> = ({ width, height }) => {
  return (
    <div>
      <ExampleBodySvg />
    </div>
  );
};

export default DemandBodyMap;
