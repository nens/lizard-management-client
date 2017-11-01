import React, { Component } from "react";
import moment from "moment";
import styles from "./ThresholdChart.css";
import {
  Baseline,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  Resizable,
  LineChart
} from "react-timeseries-charts";
import { TimeSeries, Index } from "pondjs";

class ThresholdChart extends Component {
  render() {
    const { value, timeseries, parameter, unit } = this.props;

    try {
      const data = timeseries.map(d => {
        return [moment(d[0]), d[1]];
      });

      const series = new TimeSeries({
        name: "timeserie",
        columns: ["index", "value"],
        points: data.map(([d, value]) => [
          Index.getIndexString("1h", moment(d)),
          value
        ])
      });

      return (
        <div className={styles.ThresholdChart}>
          <Resizable>
            <ChartContainer timeRange={series.range()}>
              <ChartRow height="175">
                <YAxis
                  id="timeserie"
                  label={parameter ? `${parameter} (${unit})` : null}
                  min={series.min()}
                  max={series.max()}
                  format=".2f"
                  width="70"
                  type="linear"
                />
                <Charts>
                  <LineChart axis="timeserie" series={series} />
                  <Baseline
                    axis="timeserie"
                    value={value ? value : 0}
                    label="Threshold"
                    position="right"
                  />
                </Charts>
              </ChartRow>
            </ChartContainer>
          </Resizable>
        </div>
      );
    } catch (e) {
      console.log(
        "Something went wrong trying to draw the timeseries chart... probably no data!"
      );
      return null;
    }
  }
}

export default ThresholdChart;
