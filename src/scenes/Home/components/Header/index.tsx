import { FC } from "react";

const Header: FC = () => {
  return (
    <div className="flex justify-center border-b">
      <div className="flex-1 max-w-screen-lg flex flex-col justify-center text-center items-center">
        <div className="h-8" />
        {/* <div className="px-100"> */}
        <h1 className="text-heading-1 whitespace-pre-line ">
          {`Visualizing a Nation's
		   Blood System`}
        </h1>
        <h6 className="text-body-large opacity-50">{`A Case Study of South Korea`}</h6>
        {/* </div> */}
        <div className="h-2" />
        <p className="max-w-[700px] text-body-small">
          When it comes to analyzing how blood donations are managed, it is
          important to consider the balance between supply and demand. This
          visualization explores the delicate balance of blood supply and demand
          in South Korea. The supply data was calculated using the amount of
          blood donations and the demand data was calculated using the amount of
          surgeries operated in hospitals. All data was collected from{" "}
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
