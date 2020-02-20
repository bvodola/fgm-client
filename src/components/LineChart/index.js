import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default class Example extends PureComponent {
  render() {
    return (
      <LineChart
        width={1000}
        height={300}
        data={this.props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickSize={20} padding={{ left: 30, right: 30 }} />
        <YAxis
          interval={0}
          type="auto"
          tickSize={20}
          padding={{ top: 30, bottom: 30 }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="Número de recibos"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    );
  }
}
