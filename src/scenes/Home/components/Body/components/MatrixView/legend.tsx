import React from "react";

interface LegendProps {}

const Legend: React.FC<LegendProps> = ({}) => {
  return (
    <div className="flex gap-8 mb-2 items-center border p-2 rounded-md">
      <div className="flex items-center gap-4">
        <p className="text-xs">Direction: </p>
        <div className="flex flex-col">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <p className="text-[9px] whitespace-pre-line leading-tight text-center">
                {"Demand Exceeds\n Supply"}
              </p>
              <div className="relative flex items-center">
                {/* Left Skewed */}
                <div className="rounded-bl-md rounded-tl-md h-3.5 w-6 bg-[rgba(0,0,0,0.3)]"></div>
                {/* Divider */}
                <div className="w-[1.5px] h-5 bg-[rgba(0,0,0,0.3)]"></div>
                {/* Fake Right */}
                <div className="w-6 bg-white"></div>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <p className="text-[9px] whitespace-pre-line leading-tight text-center">
                  {"Supply Exceeds\n Demand"}
                </p>
                <div className="relative flex items-center">
                  {/* Left Skewed */}
                  <div className="rounded-bl-md rounded-tl-md h-3.5 w-6"></div>
                  {/* Divider */}
                  <div className="w-[1.5px] h-5 bg-[rgba(0,0,0,0.3)]"></div>
                  {/* Right Skewed */}
                  <div className="rounded-tr-md rounded-br-md h-3.5 w-6 bg-[rgba(0,0,0,0.3)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-4">
          <p className="text-xs">Color: </p>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <p className="text-[9px] whitespace-pre-line text-center leading-tight">
                {"Worst \nratio"}
              </p>
              <p className="text-[9px] whitespace-pre-line text-center leading-tight">
                {"Best \nratio"}
              </p>
            </div>
            <div className="px-1">
              <div
                className="
                w-20 h-4
                rounded-lg
                bg-[linear-gradient(to_right,_#d55940_5%,_#e39d42_30%,_#dfd73b_50%,_#50b011_75%,_#3c8a1f_100%)]
            "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend;
