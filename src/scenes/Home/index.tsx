import { Filter } from "@data/useData";
import { FC } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./components/Header";
import Body from "./components/Body";
import Navigator from "./components/Navigator";
import Summary from "./components/Summary";

const Home: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter: Filter = {
    year: searchParams.get("year") ? parseInt(searchParams.get("year")!) : null,
    month: searchParams.get("month")
      ? parseInt(searchParams.get("month")!)
      : null,
    city: searchParams.get("city"),
  };

  const setFilter = (newFilter: Filter) => {
    const params = new URLSearchParams();
    if (newFilter.year) {
      params.set("year", newFilter.year.toString());
    }
    if (newFilter.month) {
      params.set("month", newFilter.month.toString());
    }
    if (newFilter.city) {
      params.set("city", newFilter.city);
    }

    setSearchParams(params);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col overflow-y-auto">
      <div className="flex justify-center pb-16">
        <div className="flex-1 max-w-screen-xl">
          <Header />
          <div className="flex flex-grow">
            <div className="sticky top-0 overflow-y-auto">
              <Navigator filter={filter} setFilter={setFilter} />
            </div>
            <div className="flex-grow overflow-y-auto overflow-x-hidden">
              <Body filter={filter} setFilter={setFilter} />
            </div>
            <div className="flex-grow overflow-y-auto overflow-x-hidden h-screen">
              <Summary filter={filter} setFilter={setFilter} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
