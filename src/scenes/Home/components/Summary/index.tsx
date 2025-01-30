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

  const { loading: allDataLoading, data: allData } = useData({
    year: null,
    month: null,
    city: null,
  });

  const isSingleMonthSelected = useMemo(() => {
    return props.filter.month !== null && props.filter.year !== null;
  }, [props.filter]);

  const aggMonthData = useMemo(() => {
    if (!filteredData) {
      return [];
    }
    let data = filteredData.supply;
    if (isSingleMonthSelected) {
      const selectedYear = props.filter.year!;
      data = allData.supply.filter((el) => {
        if (props.filter.city) {
          return el.year === selectedYear && el.city === props.filter.city;
        } else {
          return el.year === selectedYear;
        }
      });
    }
    const result: { [month: string]: number } = {};
    let yearCnt = 0;
    const yearsDict: Record<number, number> = {};
    data.forEach((s) => {
      if (!yearsDict[s.year]) {
        yearsDict[s.year] = yearCnt;
        yearCnt += 1;
      }
    });
    data.forEach((s) => {
      const monthName = months[s.month - 1].short;
      if (!result[monthName]) {
        result[monthName] = 0;
      }
      result[monthName] += s.total_unit / yearCnt; // average
      return result;
    });
    return result;
  }, [filteredData, isSingleMonthSelected, props.filter.city, allData]);

  const sortedAggMonthData = useMemo(() => {
    return Object.entries(aggMonthData)
      .sort((a, b) => {
        return b[1] - a[1];
      })
      .map(([month, value]) => {
        return { label: month, value };
      });
  }, [aggMonthData]);

  return (
    <div className="sticky top-0 h-full border-l border-gray-200">
      <div className="p-6 h-full w-64 min-w-64 flex flex-col max-h-[1000px]">
        <div
          style={{
            // maxHeight: "300px",
            position: "relative",
          }}
          className="flex flex-col h-1/2"
        >
          <div className="text-center">
            Which month did people donate their blood most
            <span>{props.filter.year ? ` in ${props.filter.year}` : ""}</span>?
          </div>
          <Resizer staticHeight={300}>
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
        {/* <div className="h-[50%] max-h-[300px]"> */}
        <Resizer>
          {/* <div className=""> */}
          <DemandBodyMap width={50} height={50} />
          {/* </div> */}
        </Resizer>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Summary;
