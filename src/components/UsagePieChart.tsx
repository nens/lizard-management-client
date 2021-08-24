import React from 'react';
import { bytesToDisplayValue } from './../utils/byteUtils';


interface Props {
  available: number;
  used: number;
}

const UsagePieChart = (props:Props) => {
  const {available, used} = props;
  const percentageUsed = (used/available) * 100;
  const percentageNotUsed = 100 - percentageUsed;
  return (
      <div
      style={{
        position: "relative",
        alignItems: "flex-start",
        display: "inline-flex",
        flexDirection: "column",
      }}
      >
        <div 
          style={{
            position: "relative",
            alignItems: "flex-start",
            display: "inline-flex",
            flexDirection: "column",
          }}
        >
          <svg
            height={138}
            width={138}
            viewBox={"-18 -18 36 36"}
          >
            <circle
              cx="0" 
              cy="0" 
              // use this radius see tutorial here:
              // https://heyoka.medium.com/scratch-made-svg-donut-pie-charts-in-html5-2c587e935d72
              r="15.91549430918952" 
              fill="none"
              stroke="#E6E6E6" 
              stroke-width="4"
            ></circle>
            <circle
              cx="0" 
              cy="0" 
              r="15.91549430918952" 
              fill="none"
              stroke="#139696" 
              stroke-width="4"
              stroke-dasharray={`${percentageUsed} ${percentageNotUsed}`} 
              stroke-dashoffset="25"
            ></circle>
          </svg>
          <div
            style={{
              position: "absolute", 
              width: "100%",
              textAlign: "center",
              top: "50%",
              transform: "translate(0%,-50%)",
              fontSize: "23px"
            }}
          >
            {bytesToDisplayValue(used)}
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            width: "100%",
            marginTop: "8px",
            fontSize: "12px",
            lineHeight: "15px",
          }}
        >
          {"of "+bytesToDisplayValue(available) }
        </div>
        
      </div>
  )
};

export default UsagePieChart;