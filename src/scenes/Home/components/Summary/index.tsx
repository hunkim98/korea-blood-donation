import React, { useMemo } from "react";
import DemandBodyMap, { DemandBodyMapProps } from "./DemandBodyMap";
import Resizer from "@utils/mapResizer";
import { Filter, useData } from "@data/useData";
import SupplyMonthBarGraph from "./SupplyBarGraph";
import { months } from "@utils/months";
import HumanBody from "./DemandBodyMap/humanBody";
import { BodyPart, surgeryToBodyMap } from "@utils/surgeryToBody";

interface SummaryProps {
  filter: Filter;
}

const Summary: React.FC<SummaryProps> = (props) => {
  const { loading: filteredDataLoading, data: filteredData } = useData(
    props.filter
  );

  const { data: allData } = useData({
    city: null,
    month: null,
    year: null,
  });

  const isSingleMonthSelected = useMemo(() => {
    return props.filter.month !== null && props.filter.year !== null;
  }, [props.filter]);

  const selectedCityYearData = useMemo(() => {
    if (!allData) {
      return {
        supply: [],
        demand: [],
      };
    }
    const supply = allData.supply.filter((el) => {
      if (props.filter.city) {
        return el.year === props.filter.year && el.city === props.filter.city;
      } else {
        return el.year === props.filter.year;
      }
    });
    const demand = allData.demand.filter((el) => {
      if (props.filter.city) {
        return el.year === props.filter.year && el.city === props.filter.city;
      } else {
        return el.year === props.filter.year;
      }
    });
    return {
      supply,
      demand,
    };
  }, [props.filter.year, props.filter.city, allData]);

  const finalPortraySupplyData = useMemo(() => {
    if (isSingleMonthSelected) {
      return selectedCityYearData.supply;
    }
    return filteredData?.supply;
  }, [filteredData, isSingleMonthSelected, selectedCityYearData]);

  const aggMonthData = useMemo(() => {
    if (!finalPortraySupplyData) {
      return [];
    }
    const result: { [month: string]: number } = {};
    let yearCnt = 0;
    const yearsDict: Record<number, number> = {};
    finalPortraySupplyData.forEach((s) => {
      if (!yearsDict[s.year]) {
        yearsDict[s.year] = yearCnt;
        yearCnt += 1;
      }
    });
    finalPortraySupplyData.forEach((s) => {
      const monthName = months[s.month - 1].short;
      if (!result[monthName]) {
        result[monthName] = 0;
      }
      result[monthName] += s.total_unit / yearCnt; // average
      return result;
    });
    return result;
  }, [filteredData, finalPortraySupplyData, props.filter.city, allData]);

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
        <Resizer>
          <DemandBodyMap
            width={50}
            height={50}
            demand={
              isSingleMonthSelected
                ? selectedCityYearData.demand
                : filteredData?.demand
            }
          />
        </Resizer>
      </div>
    </div>
  );
};

export default Summary;
