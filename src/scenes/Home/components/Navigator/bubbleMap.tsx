import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";
import { AbstractMapCanvas } from "./canvas";
import KR_CITIES from "@utils/cities";
import { Filter } from "@data/useData";
import { Supply } from "@data/supply/Supply";
import { Demand } from "@data/demand/Demand";
import { Event } from "@data/events/Event";
import * as topojson from "topojson-client";
import P5 from "p5";

interface BubbleMapProps {
  width: number;
  height: number;
  filter: Filter;
  setFilter: (newFilter: Filter) => void;
  filteredData: {
    supply: Supply[];
    demand: Demand[];
    events: Event[];
  };
}

const BubbleMap: FC<BubbleMapProps> = ({
  filter,
  width,
  height,
  setFilter,
  filteredData: allData,
}) => {
  const [supplyContainer, setSupplyContainer] = useState<HTMLDivElement | null>(
    null
  );

  // console.log(cityProjectionPoints);

  const [supplyCanvas, setSupplyCanvas] = useState<AbstractMapCanvas | null>(
    null
  );

  const gotSupplyContainer = useCallback((element: HTMLDivElement) => {
    if (!element) {
      return;
    }
    setSupplyContainer(element);
  }, []);

  useEffect(() => {
    if (!allData) {
      return;
    }
    if (!supplyCanvas) {
      return;
    }
    const supplyData = new Map<KR_CITIES, number>();
    let maxSupply = 0;
    let maxDemand = 0;
    let minSupply = Number.MAX_SAFE_INTEGER;
    let minDemand = Number.MAX_SAFE_INTEGER;
    const year = filter.year;
    const filteredData = allData;
    if (year) {
      filteredData.supply = filteredData.supply.filter((s) => s.year === year);
      filteredData.demand = filteredData.demand.filter((d) => d.year === year);
    }
    // sum by city
    filteredData.supply.forEach((s) => {
      const city = s.city as KR_CITIES;
      if (!supplyData.has(city)) {
        supplyData.set(city, 0);
      }
      supplyData.set(city, supplyData.get(city)! + s.total_unit);
    });
    // sum by city
    filteredData.demand.forEach((d) => {
      const city = d.city as KR_CITIES;
      if (!supplyData.has(city)) {
        supplyData.set(city, 0);
      }
      supplyData.set(city, supplyData.get(city)! + d.unit);
    });
    // get max supply
    supplyData.forEach((value) => {
      if (value > maxSupply) {
        maxSupply = value;
      }
      if (value < minSupply) {
        minSupply = value;
      }
    });

    // get max demand
    supplyData.forEach((value) => {
      if (value > maxDemand) {
        maxDemand = value;
      }
      if (value < minDemand) {
        minDemand = value;
      }
    });

    const maxVal = Math.max(maxSupply, maxDemand);
    const minVal = Math.min(minSupply, minDemand);
    supplyCanvas.intialize(supplyData, minVal, maxVal);
  }, [allData, supplyContainer, supplyCanvas]);

  useEffect(() => {
    if (!supplyContainer) {
      return;
    }
    const canvas = new P5(async (p5: P5) => {
      const width = supplyContainer.clientWidth;
      const abstractMapCanvas = new AbstractMapCanvas(
        p5,
        new Map(),
        width,
        height,
        setFilter,
        filter
      );
      setSupplyCanvas(abstractMapCanvas);
      const setup = () => {
        const canvas = p5.createCanvas(width, height);
        canvas.style("border", "1px solid rgba(0,0,0,0.1)");
        p5.noStroke();
      };
      p5.setup = () => {
        setup();
      };
      p5.draw = () => {
        p5.clear();
        p5.rect(0, 0, width, height);
        p5.noStroke();
        abstractMapCanvas.render();
      };
      p5.mouseClicked = () => {
        abstractMapCanvas.mouseClicked();
      };
      p5.mouseMoved = () => {
        abstractMapCanvas.mouseMoved();
      };
      if (!filter.city) {
        abstractMapCanvas.setSelectedCity(null);
      } else {
        abstractMapCanvas.setSelectedCity(filter.city as KR_CITIES);
      }
    }, supplyContainer);
    console.log("make canvas");
    return () => {
      console.log("remove canvas");
      canvas.remove();
    };
  }, [supplyContainer, height]);

  useEffect(() => {
    if (!supplyCanvas) {
      return;
    }
    if (!filter.city) {
      supplyCanvas.setSelectedCity(null);
    } else {
      supplyCanvas.setSelectedCity(filter.city as KR_CITIES);
    }
  }, [filter.city, filter, supplyCanvas]);

  useEffect(() => {
    if (!supplyCanvas) {
      return;
    }
    supplyCanvas.updateFilter(filter);
  }, [filter]);

  useEffect(() => {
    if (!supplyCanvas) {
      return;
    }
    supplyCanvas.updateSetFilter(setFilter);
  }, [setFilter]);

  return (
    <div
      className="relative"
      ref={gotSupplyContainer}
      style={{
        height: height,
      }}
    >
      <div className="absolute text-body-small mt-8 opacity-50 text-center w-full">
        Blood Donation Map by Volume
      </div>
    </div>
  );
};

export default BubbleMap;
