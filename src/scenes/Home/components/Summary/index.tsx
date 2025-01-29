import React from "react";
import DemandBodyMap, { DemandBodyMapProps } from "./DemandBodyMap";
import SupplyBubbleMap, { SupplyBubbleMapProps } from "./SupplyBubbleMap";
import Resizer from "@utils/mapResizer";
import { useData } from "@data/useData";

interface SummaryProps
  extends Pick<SupplyBubbleMapProps, "filter" | "setFilter"> {}

const Summary: React.FC<SummaryProps> = (props) => {
  const { loading: filteredDataLoading, data: filteredData } = useData(
    props.filter
  );
  return (
    <div className="min-w-64 w-64 h-full">
      <Resizer>
        <SupplyBubbleMap
          {...props}
          filteredData={filteredData}
          width={50}
          height={50}
        />
      </Resizer>
      <Resizer>
        <DemandBodyMap width={50} height={50} />
      </Resizer>
    </div>
  );
};

export default Summary;
