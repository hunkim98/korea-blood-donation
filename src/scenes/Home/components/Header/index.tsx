import { FC } from "react";

const Header: FC = () => {
  return (
    <div className="flex justify-center border-b">
      <div className="flex-1 max-w-screen-lg flex flex-col justify-center text-center items-center">
        <div className="h-8" />
        {/* <div className="px-100"> */}
        <h1 className="text-heading-1 whitespace-pre-line ">
          {`Balancing Blood: Visualizing Supply \n and Demand in a Nation’s \n Blood System`}
        </h1>
        <h6 className="text-body-large opacity-50">{`A Case Study of South Korea`}</h6>
        {/* </div> */}
        <div className="h-2" />
        <p className="max-w-[700px] text-body-medium">
          This visualization examines South Korea’s blood system by comparing
          donation levels to surgical demand. The findings reveal clear seasonal
          imbalances, with shortages in winter and surpluses in summer, shedding
          light on critical gaps in donation trends. All data was collected from{" "}
          <a href="https://kosis.kr/eng/">
            <span className="underline">KOSIS</span>
          </a>
          .
        </p>
        <div className="h-4" />
      </div>
    </div>
  );
};

export default Header;
