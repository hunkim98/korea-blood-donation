import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";
import KR_CITIES from "@utils/cities";
import { Filter } from "@data/useData";
import { Supply } from "@data/supply/Supply";
import { Demand } from "@data/demand/Demand";
import { Event } from "@data/events/Event";
import P5 from "p5";

export interface SupplyMonthBarGraphProps {
  width: number;
  height: number;
  filter: Filter;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  data: Array<{ label: string; value: number }>;
}

const SupplyMonthBarGraph: FC<SupplyMonthBarGraphProps> = ({
  filter,
  width,
  height,
  data,
  margin,
}) => {
  const [hoveringDataIdx, setHoveringDataIdx] = useState<number | null>(null);
  // const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const svgGRef = useRef<d3.Selection<SVGGElement, unknown, null, any>>();
  //   const axisGRef = useRef<d3.Selection<SVGGElement, unknown, null, any>>()
  const xAxisGRef = useRef<d3.Selection<SVGGElement, unknown, null, any>>();
  const yAxisGRef = useRef<d3.Selection<SVGGElement, unknown, null, any>>();
  const yRef = useRef<d3.ScaleBand<string>>();
  const xRef = useRef<d3.ScaleLinear<number, number>>();
  const xLabelsGRef = useRef<d3.Selection<SVGGElement, unknown, null, any>>();
  const barsGRef = useRef<d3.Selection<SVGGElement, unknown, null, any>>();
  const svgDefsRef = useRef<d3.Selection<SVGDefsElement, unknown, null, any>>();
  const numbersGRef = useRef<d3.Selection<SVGGElement, unknown, null, any>>();
  const behindBarsGRef =
    useRef<d3.Selection<SVGGElement, unknown, null, any>>();

  const renderGraph = useCallback(() => {
    // if (!ref.current) return;
    if (!svgRef.current) return;
    // const height = 250;

    const minDonation = d3.min(data, (d) => d.value)!;
    const maxDonation = d3.max(data, (d) => d.value)!;

    const colorScale = d3
      .scaleLinear<string>()
      .range(["rgba(255,0,0,0.1)", "rgba(255,0,0,0.8)"])
      .domain([minDonation, maxDonation] as [number, number]);

    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;
    const svgContainer = d3
      .select(svgContainerRef.current)
      .attr("width", width)
      .attr("height", height);
    // const svg = svgGRef.current
    //   ? svgGRef.current
    //   : (svgGRef.current = svgContainerRef.current!.append("g")).attr(
    //       "transform",
    //       `translate(0,${margin.top})`
    //     );
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const svgDefs = svgDefsRef.current
      ? svgDefsRef.current
      : (svgDefsRef.current = svg.append("defs"));
    const xAxisG = xAxisGRef.current
      ? xAxisGRef.current
      : (xAxisGRef.current = svg.append("g")).attr(
          "transform",
          `translate(${margin.left},${margin.top})`
        );
    const yAxisG = yAxisGRef.current
      ? yAxisGRef.current
      : (yAxisGRef.current = svg.append("g")).attr(
          "transform",
          `translate(${margin.left},${margin.top})`
        );
    const xLabelsG = xLabelsGRef.current
      ? xLabelsGRef.current
      : (xLabelsGRef.current = svg.append("g")).attr(
          "transform",
          `translate(${margin.left},${margin.top})`
        );

    const barsG = barsGRef.current
      ? barsGRef.current
      : (barsGRef.current = svg.append("g")).attr(
          "transform",
          `translate(${margin.left},${margin.top})`
        );
    const numbersG = numbersGRef.current
      ? numbersGRef.current
      : (numbersGRef.current = svg.append("g")).attr(
          "transform",
          `translate(${margin.left},${margin.top})`
        );
    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, svgHeight])
      .padding(0.1)!;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)! * 1.05])
      .nice()
      .range([0, svgWidth])!;

    yRef.current = y;
    xRef.current = x;
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // xAxisG
    //   .attr("transform", `translate(0,${svgHeight})`)
    //   .call(xAxis)
    //   .selectAll("text")
    //   .call((t) => {
    //     // remove text
    //     t.text("");
    //   })
    //   .attr("opacity", 1);

    yAxisG.call(yAxis).selectAll("text");
    // .attr("fill", "black")
    // behind bars is for hover effect

    barsG
      .selectAll("rect")
      .data(data)
      .join(
        // @ts-ignore
        (enter) => {
          return (
            enter
              .append("rect")
              // we will fill with gradient
              .attr("fill", (d) => {
                return colorScale(d.value);
              })
              // .attr("stroke", "rgba(255,255,255,1)")
              .attr("stroke-width", 1.5)
              // .attr("class", (d, i) => `cursor-pointer node-${i}`)
              .attr("x", (d) => x(0)!)
              .attr("y", (d) => y(d.label)!)
              .attr("width", (d) => x(0)!)
              .attr("height", y.bandwidth())
              .transition()
              .duration(1000)
              .attr("x", (d) => x(0)!)
              .attr("width", (d) => x(d.value)!)
            // .attr("height", (d) => svgHeight - y(d.label))
          );
          // .attr('height', (d) => svgHeight - y(d.value))
        },
        (update) => {
          return (
            update
              .transition()
              .duration(1000)
              .attr("fill", (d) => {
                return colorScale(d.value);
              })
              //   .attr('fill', 'red')
              .attr("x", (d) => x(0)!)
              .attr("y", (d) => y(d.label)!)
              .attr("width", (d) => x(d.value)!)
              .attr("height", y.bandwidth())
          );
        },
        (exit) => {
          return exit.remove();
        }
      );

    // add nubmers to the bars
    // numbersG
    //   .selectAll("text")
    //   .data(data)
    //   .join(
    //     // @ts-ignore
    //     (enter) => {
    //       return enter
    //         .append("text")
    //         .attr("x", (d) => x(d.label)! + x.bandwidth() / 2)
    //         .attr("y", (d) => y(d.value) - 10)
    //         .attr("text-anchor", "middle")
    //         .attr("class", "font-tiempos")
    //         .attr("font-size", 5)
    //         .attr("fill", "rgba(255,255,255,1)")
    //         .text((d) => d.value)
    //         .attr("opacity", 0)
    //         .transition()
    //         .delay(1000)
    //         .duration(500)
    //         .attr("opacity", 1);
    //     },
    //     (update) => {
    //       return update
    //         .attr("x", (d) => x(d.label)! + x.bandwidth() / 2)
    //         .attr("y", (d) => y(d.value) - 10)
    //         .attr("text-anchor", "middle")
    //         .attr("class", "font-tiempos")
    //         .attr("font-size", 3)
    //         .attr("fill", "rgba(255,255,255,1)")
    //         .text((d) => d.value)
    //         .transition()
    //         .delay(1000)
    //         .duration(100)
    //         .attr("opacity", 1);
    //     },
    //     (exit) => {
    //       return exit.remove();
    //     }
    //   );
  }, [
    data,
    height,
    // margin.bottom,
    // margin.left,
    // margin.right,
    // margin.top,
    width,
  ]);

  useEffect(() => {
    renderGraph();
  }, [renderGraph]);

  return (
    <div className="relative" ref={svgContainerRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default SupplyMonthBarGraph;
