import React, { FC, useEffect, useMemo, useRef, useState } from "react";

import * as d3 from "d3";
import * as topojson from "topojson-client";
import topoData from "@data/korea/provinces-topo-simple.json";
import { Filter } from "@data/useData";
import "./map.css";
import cityData from "@data/korea/cities.json";
import { Supply } from "@data/supply/Supply";
import { Demand } from "@data/demand/Demand";
import { Event } from "@data/events/Event";

interface CityData {
  lon: number;
  lat: number;
  donation: number;
  name: string;
}

interface KoreaMapProps {
  width: number;
  height: number;
  setFilter: (newFilter: Filter) => void;
  filter: Filter;
  filteredData: {
    supply: Supply[];
    demand: Demand[];
    events: Event[];
  } | null;
  maxDonation: number;
  minDonation: number;
}

const KoreaMap: FC<KoreaMapProps> = ({
  width,
  height,
  setFilter,
  filter,
  filteredData,
  maxDonation,
  minDonation,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState({
    opacity: 0,
    x: 0,
    y: 0,
    content: "",
  });

  const cityGroupedData: {
    supply: Map<string, number>;
    demand: Map<string, number>;
    events: Map<string, number>;
  } = useMemo(() => {
    if (!filteredData)
      return {
        supply: new Map(),
        demand: new Map(),
        events: new Map(),
      };
    const supplyData = new Map<string, number>();
    const demandData = new Map<string, number>();
    const eventData = new Map<string, number>();

    filteredData.supply.forEach((s) => {
      const city = s.city;
      if (!supplyData.has(city)) {
        supplyData.set(city, 0);
      }
      supplyData.set(city, supplyData.get(city)! + s.total_unit);
    });

    filteredData.demand.forEach((d) => {
      const city = d.city;
      if (!demandData.has(city)) {
        demandData.set(city, 0);
      }
      demandData.set(city, demandData.get(city)! + d.unit);
    });

    filteredData.events.forEach((e) => {
      const city = e.city;
      if (!eventData.has(city)) {
        eventData.set(city, 0);
      }
      eventData.set(city, eventData.get(city)! + 1);
    });

    const cityData: CityData[] = [];
    supplyData.forEach((value, key) => {
      cityData.push({
        lon: +cityData.find((c) => c.name === key)?.lon!,
        lat: +cityData.find((c) => c.name === key)?.lat!,
        donation: value,
        name: key,
      });
    });

    return {
      supply: supplyData,
      demand: demandData,
      events: eventData,
    };
  }, [filteredData]);

  useEffect(() => {
    if (!svgRef.current) return;
    // clear svg
    d3.select(svgRef.current).selectAll("*").remove();

    const minDonation = d3.min(cityGroupedData.supply.values());
    const maxDonation = d3.max(cityGroupedData.supply.values());

    const colorScale = d3
      .scaleLinear<string>()
      .range(["rgba(255,0,0,0.1)", "rgba(255,0,0,0.8)"])
      .domain([minDonation, maxDonation] as [number, number]);
    // const height = width * 1.8;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const map = svg.append("g").attr("id", "map");
    const points = svg.append("g").attr("id", "cities");
    const lines = svg.append("g").attr("id", "lines");

    const radius = d3.scaleSqrt().domain([0, 1e6]).range([0, 15]);

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width / 2 + 100}, ${height - 20})`)
      .selectAll("g")
      .data([1e6, 5e6, 1e7])
      .enter()
      .append("g");

    // legend
    //   .append("circle")
    //   .attr("cy", (d) => -radius(d))
    //   .attr("r", radius);

    // legend
    //   .append("text")
    //   .attr("y", (d) => -2 * radius(d))
    //   .attr("dy", "1.3em")
    //   .text(d3.format(".1s"));
    // const features = topojson.feature(objects, topoData.objects.provinces);
    // console.log(topoData);

    const geojson: any = topojson.feature(
      topoData as any,
      topoData.objects["provinces-geo"] as any
    );

    const center = d3.geoCentroid(geojson as any);

    const projection = d3
      .geoMercator()
      .center(center)
      .scale(2600)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);
    const bounds = path.bounds(geojson);
    const widthScale = (bounds[1][0] - bounds[0][0]) / width;
    const heightScale = (bounds[1][1] - bounds[0][1]) / height;
    const scale = 1 / Math.max(widthScale, heightScale);

    map
      .selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("class", (d: any) => `province c${d.properties.code}`)
      .attr("fill", (d: any) => {
        const name = d.properties.name_eng;
        if (filter.city && filter.city !== name) {
          return "rgba(255,255,255,0.1)";
        }
        if (cityGroupedData.supply.has(name)) {
          return colorScale(cityGroupedData.supply.get(name)!);
        } else {
          return "rgba(255,255,255,0.1)";
        }
      })
      .attr("stroke", "rgba(0,0,0,0.2)")
      .attr("d", path as any)
      .on("click", (e, d: any) => {
        setFilter({
          ...filter,
          city: d.properties.name_eng,
        });
      })
      .on("mousemove", (e, d: any) => {
        if (!d.properties.name_eng) {
          setTooltip((prev) => ({ ...prev, opacity: 0 }));
          return;
        }
        const [x, y] = d3.pointer(e);
        const proj = projection(d3.geoCentroid(d))!;
        setTooltip({
          opacity: 1,
          x: proj[0],
          y: proj[1],
          content: `${d.properties.name_eng}`,
        });
      });

    svg.on("mouseleave", () => {
      setTooltip((prev) => ({ ...prev, opacity: 0 }));
    });

    // d3.json(cityData).then((data: any) => {
    // make a line that protrudes out of the circle horizontally
    lines
      .selectAll("line")
      .data(cityData)
      .enter()
      .append("line")
      .attr("x1", (d: any) => {
        const proj = projection([+d.lon, +d.lat])![0];
        return projection([+d.lon, +d.lat])![0];
      })
      .attr("y1", (d: any) => projection([+d.lon, +d.lat])![1])
      .attr("x2", (d: any) => {
        const proj = projection([+d.lon, +d.lat])![0];
        return proj;
      })
      .attr("y2", (d: any) => projection([+d.lon, +d.lat])![1])
      .style("stroke", "black")
      .style("stroke-width", 2);

    // points
    //   .selectAll("circle")
    //   .data(cityData)
    //   .enter()
    //   .append("circle")
    //   .attr("class", "city_bubble")
    //   .attr("cx", (d: any) => projection([+d.lon, +d.lat])![0])
    //   .attr("cy", (d: any) => projection([+d.lon, +d.lat])![1])
    //   .attr("r", (d: any) => 10)
    //   .style("fill", (d: any) => colorScale(+d.pop))
    //   .style("opacity", 0.5);

    // points
    //   .selectAll("text")
    //   .data(cityData)
    //   .enter()
    //   .append("text")
    //   .attr("class", "city_label")
    //   .attr(
    //     "x",
    //     (d: any) => projection([+d.lon, +d.lat])![0] - d.name.length * 2.5
    //   )
    //   .attr("y", (d: any) => projection([+d.lon, +d.lat])![1] + 5)
    //   .text((d: any) => d.name)
    //   .style("font-size", "10px")
    //   .style("fill", "black");
    // });
  }, [
    svgRef,
    width,
    height,
    cityGroupedData,
    maxDonation,
    minDonation,
    filter.city,
  ]);

  return (
    <div id="chart" className="relative">
      {!filter.city && (
        <div className="absolute text-body-small mt-8 opacity-50 text-center w-full">
          Blood Donation Heatmap
        </div>
      )}
      <pre
        className="tooltip"
        style={{
          zIndex: 100,
          opacity: tooltip.opacity,
          position: "absolute",
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          transform: "translate(-50%,0%)",
          backgroundColor: "white",
          border: "1px solid rgba(0,0,0,0.1)",
          padding: "8px",
          pointerEvents: "none", // Makes the tooltip not block mouse events
          transition: "opacity 0.3s ease, left 0.2s ease, top 0.2s ease", // Smooth transitions
        }}
      >
        {tooltip.content}
      </pre>

      <svg ref={svgRef}></svg>
    </div>
  );
};

export default KoreaMap;
