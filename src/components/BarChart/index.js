import React from "react";
import { Chart } from "react-google-charts";

const BarChart = props => {
  return (
    <Chart
      chartLanguage="pt"
      width={"100%"}
      height={"300px"}
      chartType="Bar"
      loader={<div>Carregando Gráficos...</div>}
      data={props.data}
      options={{
        chart: {
          title: "Número de notas fiscais recebidas"
        }
      }}
    />
  );
};
export default BarChart;

BarChart.defaultProps = {
  data: []
};
