import BalancerRow, { BalancerRowProps } from "@components/display/BalancerRow";
import { Filter, useData } from "@data/useData";
import { FC } from "react";

export interface MatrixViewProps {
  filter: Filter;
  setFilter: (newFilter: Filter) => void;
  balancers: BalancerRowProps[];
}

const MatrixView: FC<MatrixViewProps> = ({ balancers, filter, setFilter }) => {
  const {
    data: { supply, demand, events },
    loading,
  } = useData(filter);

  const getValues = () => {
    const result: {
      [year: number]: {
        [month: number]: { supply: number; demand: number; events: number };
      };
    } = {};

    for (const year of Array.from({ length: 2022 - 2006 + 1 }).map(
      (_, i) => i + 2006
    )) {
      result[year] = {};
      for (const month of Array.from({ length: 12 }).map((_, i) => i + 1)) {
        result[year][month] = {
          supply: 0,
          demand: 0,
          events: 0,
        };
      }
    }

    for (const s of supply) {
      result[s.year][s.month].supply += s.total_unit;
    }

    for (const d of demand) {
      result[d.year][d.month].demand += d.unit;
    }

    for (const e of events) {
      result[e.year][e.month].events += 1;
    }

    return result;
  };

  const values = getValues();

  const ratios = Object.entries(values)
    .map(([year, months]) => {
      return Object.entries(months).map(
        ([month, { supply, demand, events }]) => {
          return supply / demand;
        }
      );
    })
    .flat();

  const eventCounts = Object.entries(values)
    .map(([year, months]) => {
      return Object.entries(months).map(
        ([month, { supply, demand, events }]) => {
          return events;
        }
      );
    })
    .flat();

  const eventMax = Math.max(...eventCounts);
  const eventMin = Math.min(...eventCounts);
  const offsets = Object.entries(values).map(([year, months]) => {
    return Object.entries(months).map(([month, { supply, demand, events }]) => {
      return supply - demand;
    });
  });
  const maxOffset = Math.max(...offsets.flat());
  const minOffset = Math.min(...offsets.flat());
  const minSupply = Math.min(...supply.map((s) => s.total_unit));
  const maxSupply = Math.max(...supply.map((s) => s.total_unit));
  const minDemand = Math.min(...demand.map((d) => d.unit));
  const maxDemand = Math.max(...demand.map((d) => d.unit));
  const minRatio = Math.min(...ratios);
  const maxRatio = Math.max(...ratios);
  const years = Object.keys(values);

  if (supply.length === 0 || demand.length === 0 || events.length === 0) {
    return null;
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (loading) return <div />;

  return (
    <div className="flex-1">
      <div className="h-8" />
      <div className="flex pl-16 pr-8">
        {months.map((month) => (
          <div key={`month-${month}`} className="flex-1 text-center">
            <p className="text-body-small">{month}</p>
          </div>
        ))}
      </div>
      <div className="pl-16 pr-8">
        {years.map((year, i) => {
          return (
            <BalancerRow
              key={`balancer-row-${year}`}
              onClick={(monthIndex) => {
                setFilter({
                  ...filter,
                  year: parseInt(year),
                  month: monthIndex + 1,
                });
              }}
              balancers={Object.entries(values[parseInt(year)]).map(
                ([month, { supply, demand, events }]) => {
                  return {
                    supply,
                    demand,
                    events,
                  };
                }
              )}
              min={{
                supply: minSupply,
                demand: minDemand,
                events: eventMin,
                ratio: minRatio,
                offset: minOffset,
              }}
              max={{
                supply: maxSupply,
                demand: maxDemand,
                events: eventMax,
                ratio: maxRatio,
                offset: maxOffset,
              }}
              index={i}
              label={year}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MatrixView;
