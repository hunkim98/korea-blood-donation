import BalancerRow, { BalancerRowProps } from "@components/display/BalancerRow";
import { Filter, useData } from "@data/useData";
import { FC, useMemo } from "react";
import BalancerDetail from "./components/BalancerDetail";
import Headline from "./components/Headline";
import useKeyboardControls from "./useKeyboardControls";
import { months } from "@utils/months";
import EventsDetail from "./components/EventsDetail";
import DemandDetail from "./components/DemandDetail";
import { getGradientColor } from "@utils/getGradientColor";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Button } from "@headlessui/react";

export interface DetailViewProps {
  filter: Filter;
  setFilter: (newFilter: Filter) => void;
  row: BalancerRowProps;
  min: {
    supply: number;
    demand: number;
    events: number;
    ratio: number;
    offset: number;
  };
  max: {
    supply: number;
    demand: number;
    events: number;
    ratio: number;
    offset: number;
  };
}

const DetailView: FC<DetailViewProps> = ({
  row,
  filter,
  setFilter,
  min,
  max,
}) => {
  useKeyboardControls(filter, setFilter);

  const month = filter.month!;
  const year = filter.year!;

  const {
    data: { supply, demand, events },
  } = useData(filter);

  const {
    data: { supply: citySupply, demand: cityDemand },
  } = useData({
    year: null,
    month: null,
    city: filter.city,
  });

  const totalSupply = useMemo(
    () => supply.reduce((acc, s) => acc + s.total_unit, 0),
    [supply]
  );
  const totalDemand = useMemo(
    () => demand.reduce((acc, d) => acc + d.unit, 0),
    [demand]
  );

  const exceedScore = useMemo(() => {
    if (!filter.city) {
      // we have to group them by year and month
      // then we can calculate the ratio
      const yearMonthSupply = citySupply.reduce((acc, s) => {
        const key = `${s.year}-${s.month}`;
        if (!acc.has(key)) {
          acc.set(key, 0);
        }
        acc.set(key, acc.get(key)! + s.total_unit);
        return acc;
      }, new Map<string, number>());
      const yearMonthDemand = cityDemand.reduce((acc, d) => {
        const key = `${d.year}-${d.month}`;
        if (!acc.has(key)) {
          acc.set(key, 0);
        }
        acc.set(key, acc.get(key)! + d.unit);
        return acc;
      }, new Map<string, number>());
      return Array.from(yearMonthSupply.keys()).map((key) => {
        const supply = yearMonthSupply.get(key)!;
        const demand = yearMonthDemand.get(key)!;
        return ((supply - demand) / demand) * 100;
      });
    }
    return citySupply.map((s, i) => {
      const balancerProps = row.balancers[i];
      const d = cityDemand[i];
      const sUnit = s.total_unit;
      const dUnit = d.unit;
      const ratio = ((sUnit - dUnit) / dUnit) * 100;
      return ratio;
    });
  }, [citySupply, cityDemand, filter]);

  const bestScore = useMemo(() => {
    return Math.max(...exceedScore).toFixed(1);
  }, [exceedScore]);

  const worstScore = useMemo(() => {
    return Math.min(...exceedScore).toFixed(1);
  }, [exceedScore]);

  const sideWidth = 240;

  const balancerProps = row.balancers[month - 1];

  const ratio = balancerProps.supply / balancerProps.demand;

  const color = getGradientColor(
    ["#3c8a1f", "#50b011", "#dfd73b", "#e39d42", "#d55940"].reverse(),
    ratio,
    min.ratio,
    max.ratio
  );

  return (
    <div className="pl-16 pt-16">
      <Button
        onClick={() => setFilter({ ...filter, month: null, year: null })}
        className="flex items-center mb-4"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Matrix View
      </Button>
      <p className="text-heading-4">
        {months[month - 1].long}, {year}
      </p>
      <Headline
        color={color}
        supply={totalSupply}
        demand={totalDemand}
        city={filter.city}
        year={year}
        month={month}
      />
      <div className="h-16" />
      <BalancerDetail
        row={row}
        focus={month - 1}
        setFocus={(i) => {
          setFilter({ ...filter, month: i + 1 });
        }}
        min={min}
        max={max}
        maxScore={bestScore}
        minScore={worstScore}
      />
      <div className="h-12" />
      <p className="text-heading-5 pb-4">Red Cross Events</p>
      <EventsDetail events={events} color={color} />
      <div className="h-12" />
      <p className="text-heading-5 pb-4">Blood Demand</p>
      <DemandDetail demand={demand} />
    </div>
  );
};

export default DetailView;
