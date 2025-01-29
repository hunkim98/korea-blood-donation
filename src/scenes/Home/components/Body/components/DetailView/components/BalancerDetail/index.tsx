import Balancer from "@components/display/Balancer";
import { BalancerRowProps } from "@components/display/BalancerRow";
import { motion } from "framer-motion";
import { FC } from "react";

export interface BalancerDetailProps {
  row: BalancerRowProps;
  focus: number;
  setFocus: (newFocus: number) => void;
  maxScore: string;
  minScore: string;
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

const BalancerDetail: FC<BalancerDetailProps> = ({
  row,
  focus,
  setFocus,
  min,
  max,
  maxScore,
  minScore,
}) => {
  const size = 200;
  const gap = 20;
  return (
    <div
      style={{
        paddingTop: `${gap}px`,
        height: `${size + gap * 2}px`,
      }}
      className="relative"
    >
      <motion.div
        style={{
          zIndex: 10,
          top: "8px",
          position: "absolute",
          width: `${size + 24}px`,
          height: `${size + 24}px`,
          border: "1px solid rgba(0,0,0,0.3)",
          borderRadius: "16px",
        }}
        animate={{
          left: focus === 0 ? 0 : `${size / 2 - 12}px`,
        }}
      >
        <div style={{ height: "100%", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateY(-100%)",
              display: "flex",
              alignItems: "stretch",
              gap: 3,
            }}
          >
            <div className="w-0.5 border-l border-gray-500" />
            <div className="text-body-small">
              <span className="opacity-50">Best Ratio</span> <br />
              {/* Round till digit 2 */}
              {maxScore}%
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateX(100%) translateY(-100%)",
              display: "flex",
              flexFlow: "column",
            }}
          >
            <div
              style={{
                transform: "rotate(-90deg) translateX(-16px)",
                transformOrigin: "left top",
              }}
              className="text-body-small -mb-5"
            >
              <span className="opacity-50">Worst Ratio</span> <br />
              {/* Round till digit 2 */}
              {minScore}%
            </div>
            <div className="w-6 border-t border-gray-500" />
          </div>
        </div>
      </motion.div>
      <div className="relative">
        <motion.div
          className="flex absolute"
          style={{
            gap: `${gap}px`,
          }}
          animate={{
            left: `calc(${focus === 0 ? size / 2 + 12 : size}px - ${
              size / 2 + focus * (size + gap)
            }px)`,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          {row.balancers.map((balancer, index) => {
            return (
              <motion.div
                key={`balancer-${index}`}
                className="bg-gray-100 rounded-md"
                style={{
                  width: "200px",
                  height: "200px",
                }}
                animate={{
                  opacity: focus === index ? 1 : 0.5,
                  scale: focus === index ? 1 : 0.8,
                  marginLeft: focus === index - 1 ? "24px" : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <Balancer
                  key={`detail-balancer-${index}`}
                  width={200}
                  value={balancer}
                  max={max}
                  min={min}
                  index={{ row: 0, col: index }}
                  onClick={() => setFocus(index)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default BalancerDetail;
