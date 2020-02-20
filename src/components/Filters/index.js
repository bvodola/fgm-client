import React from "react";
import { Row, Switch, Text, DateRange } from "src/components";
import FadeIn from "react-fade-in";

const Filters = props => (
  <Row style={{ height: "40px" }}>
    <Switch checked={props.filterByDate} onChange={props.handleFilterByDate} />
    <Text variant="label" style={{ margin: "0 10px 0 10px" }}>
      Filtrar por data
    </Text>

    {props.filterByDate && (
      <FadeIn>
        <DateRange
          calendarIcon={null}
          clearIcon={null}
          value={props.dateRange}
          onChange={dateRange => props.handleDateRange(dateRange)}
        />
      </FadeIn>
    )}
  </Row>
);

export default Filters;
