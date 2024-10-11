import { BalancerProps } from "@components/Balancer";
import CanvasRow from "@components/CanvasRow";
import { FC, useMemo } from "react";

export interface CanvasMatrixProps {
  data: {
    year: number;
    data: Omit<BalancerProps, "width" | "maxEvents" | "thk">[];
  }[];
}

const CanvasMatrix: FC<CanvasMatrixProps> = ({ data }) => {
  const sorted = useMemo(() => data.sort((a, b) => a.year - b.year), [data]);
  const maxEvents = useMemo(
    () =>
      Math.max(
        ...sorted.flatMap((item) =>
          item.data.map((balancer) => balancer.events)
        )
      ),
    [sorted]
  );
  return (
    <div>
      {sorted.map((item, index) => (
        <CanvasRow key={index} balancers={item.data} maxEvents={maxEvents} />
      ))}
    </div>
  );
};

export default CanvasMatrix;
