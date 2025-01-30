import React, { useMemo } from "react";
import DemandBodyMap, { DemandBodyMapProps } from "./DemandBodyMap";
import Resizer from "@utils/mapResizer";
import { Filter, useData } from "@data/useData";
import SupplyMonthBarGraph from "./SupplyBarGraph";
import { months } from "@utils/months";

interface SummaryProps {
  filter: Filter;
}

const Summary: React.FC<SummaryProps> = (props) => {
  const { loading: filteredDataLoading, data: filteredData } = useData(
    props.filter
  );
  const aggMonthData = useMemo(() => {
    if (!filteredData) {
      return [];
    }
    const result: { [month: string]: number } = {};
    let yearCnt = 0;
    const yearsDict: Record<number, number> = {};
    filteredData.supply.forEach((s) => {
      if (!yearsDict[s.year]) {
        yearsDict[s.year] = yearCnt;
        yearCnt += 1;
      }
    });
    filteredData.supply.forEach((s) => {
      const monthName = months[s.month - 1].short;
      if (!result[monthName]) {
        result[monthName] = 0;
      }
      result[monthName] += s.total_unit / yearCnt; // average
      return result;
    });
    return result;
  }, [filteredData]);

  const sortedAggMonthData = useMemo(() => {
    return Object.entries(aggMonthData)
      .sort((a, b) => {
        return b[1] - a[1];
      })
      .map(([month, value]) => {
        return { label: month, value };
      });
  }, [aggMonthData]);
  console.log(sortedAggMonthData);

  return (
    <div className="sticky top-0 h-full border-l border-gray-200">
      <div className="p-6 h-full w-64 min-w-64 flex flex-col">
        {/* <div
          className="h-[50%] max-h-[300px]"
          style={{
            maxHeight: "300px",
          }}
        > */}
        <div
          style={{
            // maxHeight: "300px",
            // position: "relative",
            height: "50%",
          }}
          className="flex flex-col"
        >
          <div className="text-center">
            Which month did people donate their blood most?
          </div>
          <Resizer>
            <SupplyMonthBarGraph
              data={sortedAggMonthData}
              width={250}
              height={400}
              margin={{
                top: 10,
                right: 10,
                bottom: 20,
                left: 30,
              }}
              filter={props.filter}
            />
          </Resizer>
        </div>
        {/* </div> */}
        {/* <div className="h-[50%] max-h-[300px]"> */}
        {/* <Resizer> */}
        <div className="h-1/2">
          <DemandBodyMap width={50} height={50} />
        </div>
        {/* </Resizer> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Summary;
