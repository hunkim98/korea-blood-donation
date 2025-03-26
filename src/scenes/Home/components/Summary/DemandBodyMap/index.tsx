import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import HumanBody from "./humanBody";
import { BodyPart, surgeryToBodyMap } from "@utils/surgeryToBody";
import { Demand } from "@data/demand/Demand";

export interface DemandBodyMapProps {
  width: number;
  height: number;
  demand: Demand[];
  city: string | null;
  year: number | null;
}

const DemandBodyMap: React.FC<DemandBodyMapProps> = ({
  width,
  height,
  demand,
  city,
  year,
}) => {
  const maxHumanBodyNodeRadius = useMemo(() => {
    return 70;
  }, []);

  const minHumanBodyNodeRadius = useMemo(() => {
    return 10;
  }, []);

  const demandBodyPartCategories = useMemo(() => {
    const newRecord: Record<BodyPart, number> = {
      [BodyPart.NECK]: 0,
      [BodyPart.CHEST]: 0,
      [BodyPart.STOMACH]: 0,
      [BodyPart.PELVIC]: 0,
      [BodyPart.KNEE]: 0,
      [BodyPart.BRAIN]: 0,
      [BodyPart.LIVER]: 0,
      [BodyPart.HIP]: 0,
      [BodyPart.SPINE]: 0,
    };
    demand?.forEach((d) => {
      Object.keys(d).forEach((key: any) => {
        if (key in surgeryToBodyMap) {
          // @ts-ignore
          newRecord[surgeryToBodyMap[key]] += Number(d[key] ?? 0);
        }
      });
    });
    return newRecord;
  }, [demand]);

  const bodyPartNodeSizes = useMemo(() => {
    const result: Record<BodyPart, number> = {
      [BodyPart.NECK]: 0,
      [BodyPart.CHEST]: 0,
      [BodyPart.STOMACH]: 0,
      [BodyPart.PELVIC]: 0,
      [BodyPart.KNEE]: 0,
      [BodyPart.BRAIN]: 0,
      [BodyPart.LIVER]: 0,
      [BodyPart.HIP]: 0,
      [BodyPart.SPINE]: 0,
    };
    const max = Math.max(...Object.values(demandBodyPartCategories));
    const min = Math.min(...Object.values(demandBodyPartCategories));
    Object.keys(demandBodyPartCategories).forEach((key) => {
      // @ts-ignore
      result[key] =
        //@ts-ignore
        ((demandBodyPartCategories[key] - min) / (max - min)) *
          (maxHumanBodyNodeRadius - minHumanBodyNodeRadius) +
        minHumanBodyNodeRadius;
    });
    return result;
  }, [demandBodyPartCategories]);

  return (
    <
      // style={{
      //   width: width,
      //   height: height,
      // }}
    >
      <div className="text-center">
        {year ? "In " + year + ", where" : "Where "} was the donated blood used
        for?
      </div>
      <HumanBody
        neck={{ fill: "rgba(255,0,0,0.3)", r: bodyPartNodeSizes.neck }}
        chest={{ fill: "rgba(255,0,0,0.3)", r: bodyPartNodeSizes.chest }}
        stomach={{
          fill: "rgba(255,0,0,0.3)",
          r: bodyPartNodeSizes.stomach,
        }}
        pelvic={{ fill: "rgba(255,0,0,0.3)", r: bodyPartNodeSizes.pelvic }}
        knee={{ fill: "rgba(255,0,0,0.3)", r: bodyPartNodeSizes.knee }}
        brain={{ fill: "rgba(255,0,0,0.3)", r: bodyPartNodeSizes.brain }}
        liver={{ fill: "rgba(255,0,0,0.3)", r: bodyPartNodeSizes.liver }}
        hip={{ fill: "rgba(255,0,0,0.3)", r: bodyPartNodeSizes.hip }}
        spine={{ fill: "rgba(255,0,0,0.3)", r: bodyPartNodeSizes.spine }}
      />
    </>
  );
};

export default DemandBodyMap;
