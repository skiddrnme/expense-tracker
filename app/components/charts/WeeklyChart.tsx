import React from "react";
import { Svg, G, Rect, Text, Line } from "react-native-svg";
import { Dimensions } from "react-native";
import * as d3 from "d3";

import { shortenNumber } from "../../utils/number";
import { theme } from "../../theme";
import { IExpenses } from "../../types/expenses";

type Props = {
  expenses: IExpenses[];
};

const GRAPH_MARGIN = 16;
const GRAPH_BAR_WIDTH = 39;

const dayNumberNames = {
  0: "Воскресенье",
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница",
  6: "Суббота",
};

export const WeeklyChart = ({ expenses }: Props) => {
  let averageExpense = 0;
  const defaultValues = [
    {
      day: "Понедельник",
      total: 0,
    },
    {
      day: "Вторник",
      total: 0,
    },
    {
      day: "Среда",
      total: 0,
    },
    {
      day: "Четверг",
      total: 0,
    },
    {
      day: "Пятница",
      total: 0,
    },
    {
      day: "Суббота",
      total: 0,
    },
    {
      day: "Воскресенье",
      total: 0,
    },
  ];

  const groupedExpenses = expenses.reduce((acc, expense) => {
    averageExpense += expense.amount;
    const day = dayNumberNames[expense.date.getDay()];
    const existing = acc.find((e) => e.day === day);
    if (!!existing) {
      existing.total += expense.amount;
      return acc;
    }
    acc.push({
      day,
      total: expense.amount,
    });
    return acc;
  }, defaultValues);
  averageExpense = averageExpense / 7;

  const SVGHeight = 147 + 2 * GRAPH_MARGIN;
  const SVGWidth = Dimensions.get("window").width;
  const graphHeight = SVGHeight - 2 * GRAPH_MARGIN;
  const graphWidth = SVGWidth - 2 * GRAPH_MARGIN;

  // x scale point
  const xDomain = groupedExpenses.map((expense) => expense.day);
  const xRange = [0, graphWidth];
  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

  // y scale point
  const maxValue = d3.max(groupedExpenses, (e) => e.total);
  const yDomain = [0, maxValue];
  const yRange = [0, graphHeight];
  const y = d3.scaleLinear().domain(yDomain).range(yRange);

  return (
    <Svg width={SVGWidth} height={SVGHeight}>
      <G y={graphHeight}>
        {groupedExpenses.map((item) => (
          <React.Fragment key={item.day}>
            <Rect
              x={x(item.day)}
              y={y(yDomain[1]) * -1}
              rx={8}
              width={GRAPH_BAR_WIDTH}
              height={y(yDomain[1])}
              fill={theme.colors.card}
            />
            <Rect
              x={x(item.day)}
              y={y(item.total) * -1}
              rx={8}
              width={GRAPH_BAR_WIDTH}
              height={y(item.total)}
              fill="white"
            />
            <Text
              x={x(item.day) - 6 + GRAPH_BAR_WIDTH / 2}
              y={24}
              fill={theme.colors.textSecondary}
              fontSize={16}>
              {item.day[0]}
            </Text>
          </React.Fragment>
        ))}
        <Text
          x={40}
          y={0}
          fill={theme.colors.textSecondary}
          fontSize={16}
          textAnchor="end">
          0
        </Text>
        <Text
          x={40}
          y={y(averageExpense) * -1}
          fill={theme.colors.textSecondary}
          fontSize={16}
          textAnchor="end">
          {shortenNumber(averageExpense)}
        </Text>
        <Text
          x={40}
          y={y(yDomain[1]) * -1 + 12}
          fill={theme.colors.textSecondary}
          fontSize={16}
          textAnchor="end">
          {shortenNumber(maxValue)}
        </Text>
        <Line
          x1={44}
          y1={y(averageExpense) * -1 - 4}
          x2={x(xDomain[xDomain.length - 1]) + GRAPH_BAR_WIDTH}
          y2={y(averageExpense) * -1 - 4}
          stroke={theme.colors.textSecondary}
          strokeDasharray={4}
        />
      </G>
    </Svg>
  );
};
