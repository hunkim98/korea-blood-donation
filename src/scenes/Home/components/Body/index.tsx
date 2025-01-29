import { Filter, useData } from "@data/useData";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import DetailView from "./components/DetailView";
import MatrixView from "./components/MatrixView";

export interface BodyProps {
  filter: Filter;
  setFilter: (newFilter: Filter) => void;
}

const Body: FC<BodyProps> = ({ filter, setFilter }) => {
  const {
    data: { supply, demand, events },
    loading,
  } = useData({
    year: null,
    month: null,
    city: filter.city,
  });

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

  const minSupply = Math.min(...supply.map((s) => s.total_unit));
  const maxSupply = Math.max(...supply.map((s) => s.total_unit));
  const minDemand = Math.min(...demand.map((d) => d.unit));
  const maxDemand = Math.max(...demand.map((d) => d.unit));
  const offsets = Object.entries(values).map(([year, months]) => {
    return Object.entries(months).map(([month, { supply, demand, events }]) => {
      return supply - demand;
    });
  });
  const maxOffset = Math.max(...offsets.flat());
  const minOffset = Math.min(...offsets.flat());
  const minRatio = Math.min(...ratios);
  const maxRatio = Math.max(...ratios);
  const years = Object.keys(values);

  if (supply.length === 0 || demand.length === 0 || events.length === 0) {
    return null;
  }

  const balancers = years.map((year, i) => {
    return {
      onClick: (monthIndex: number) => {
        setFilter({
          ...filter,
          year: parseInt(year),
          month: monthIndex + 1,
        });
      },
      balancers: Object.entries(values[parseInt(year)]).map(
        ([month, { supply, demand, events }]) => {
          return {
            supply,
            demand,
            events,
          };
        }
      ),
      min: {
        supply: minSupply,
        demand: minDemand,
        events: eventMin,
        ratio: minRatio,
        offset: minOffset,
      },
      max: {
        supply: maxSupply,
        demand: maxDemand,
        events: eventMax,
        ratio: maxRatio,
        offset: maxOffset,
      },
      index: i,
      label: year,
    };
  });

  return (
    <AnimatePresence>
      <motion.div
        key={filter.year ? "detailView" : "matrixView"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ overflowX: "hidden" }}
      >
        {filter.year ? (
          <DetailView
            filter={filter}
            setFilter={setFilter}
            row={balancers.find((b) => b.label === filter.year?.toString())!}
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
          />
        ) : (
          <MatrixView
            filter={filter}
            setFilter={setFilter}
            balancers={balancers}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Body;
