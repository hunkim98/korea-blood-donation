import { months } from "@utils/months";
import { FC } from "react";

export interface HeadlineProps {
  year: number;
  month: number;
  city: string | null;
  supply: number;
  demand: number;
  color: string;
}

const Headline: FC<HeadlineProps> = ({
  supply,
  demand,
  city,
  year,
  month,
  color,
}) => {
  const mode = supply > demand ? "surplus" : "shortage";

  const monthName = months[month - 1].long;

  return (
    <>
      <p className=" font-normal text-lg">
        Blood donation supply in{" "}
        <span className="underline font-bold">{city ?? "South Korea"}</span>{" "}
        offset blood demand by{" "}
        <em
          style={{ background: color }}
          className="p-[3px] px-2 font-bold rounded-lg text-heading-6"
        >
          {mode === "surplus"
            ? "+ " + (((supply - demand) / demand) * 100).toFixed(1)
            : "- " + (((demand - supply) / supply) * 100).toFixed(1)}
          %
        </em>
      </p>
      <p></p>
    </>
  );
};

export default Headline;
