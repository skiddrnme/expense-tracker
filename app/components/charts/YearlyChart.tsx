import React from 'react';
import { Svg, G, Rect, Text, Line } from 'react-native-svg';
import { Dimensions } from 'react-native';
import * as d3 from 'd3';

import { shortenNumber } from '../../utils/number';
import { theme } from '../../theme';
import {IExpenses} from "../../types/expenses"

type Props = {
    expenses: IExpenses[];
  };

  const GRAPH_MARGIN = 15;
  const GRAPH_BAR_WIDTH = 20;
  
  export const YearlyChart = ({ expenses }: Props) => {
    let averageExpense = 0;
  
    const defaultValues = [
      {
        month: 'Январь',
        total: 0,
      },
      {
        month: 'Февраль',
        total: 0,
      },
      {
        month: 'Март',
        total: 0,
      },
      {
        month: 'Апрель',
        total: 0,
      },
      {
        month: 'Май',
        total: 0,
      },
      {
        month: 'Июнь',
        total: 0,
      },
      {
        month: 'Июль',
        total: 0,
      },
      {
        month: 'Август',
        total: 0,
      },
      {
        month: 'Сентябрь',
        total: 0,
      },
      {
        month: 'Октябрь',
        total: 0,
      },
      {
        month: 'Ноябрь',
        total: 0,
      },
      {
        month: 'Декабрь',
        total: 0,
      },
    ];
  
    const monthNumberNames = defaultValues.map((e) => e.month);
  
    const groupedExpenses = expenses.reduce((acc, expense) => {
      averageExpense += expense.amount;
      const month = monthNumberNames[expense.date.getMonth()];
      const existing = acc.find((e) => e.month === month);
      if (!!existing) {
        existing.total += expense.amount;
        return acc;
      }
      acc.push({
        month,
        total: expense.amount,
      });
      return acc;
    }, defaultValues);
    averageExpense = averageExpense / expenses.length;
  
    const SVGHeight = 147 + 2 * GRAPH_MARGIN;
    const SVGWidth = Dimensions.get('window').width;
    const graphHeight = SVGHeight - 3 * GRAPH_MARGIN;
    const graphWidth = SVGWidth - 2 * GRAPH_MARGIN - 40;
  
    // x scale point
    const xDomain = groupedExpenses.map((expense) => expense.month);
    const xRange = [65, graphWidth];
    const x = d3.scalePoint().domain(xDomain).range(xRange).padding(-0.75);
  
    // y scale point
    const maxValue = d3.max(groupedExpenses, (e) => e.total);
    const yDomain = [0, maxValue];
    const yRange = [0, graphHeight];
    const y = d3.scaleLinear().domain(yDomain).range(yRange);
  
    return (
      <Svg width={SVGWidth} height={SVGHeight}>
        <G y={graphHeight}>
          {groupedExpenses.map((item) => (
            <React.Fragment key={item.month}>
              <Rect
                x={x(item.month)}
                y={y(yDomain[1]) * -1}
                rx={8}
                width={GRAPH_BAR_WIDTH}
                height={y(yDomain[1])}
                fill={theme.colors.card}
              />
              <Rect
                x={x(item.month)}
                y={y(item.total) * -1}
                rx={8}
                width={GRAPH_BAR_WIDTH}
                height={y(item.total)}
                fill='white'
              />
              <Text
                x={x(item.month) + GRAPH_BAR_WIDTH / 2}
                y={24}
                fill={theme.colors.textSecondary}
                fontSize={14}
                textAnchor='middle'
                transform={`rotate(30, ${
                  x(item.month) + GRAPH_BAR_WIDTH / 2
                }, 20)`}
              >
                {item.month.substring(0, 3)}
              </Text>
            </React.Fragment>
          ))}
          <Text
            x={40}
            y={0}
            fill={theme.colors.textSecondary}
            fontSize={16}
            textAnchor='end'
          >
            0
          </Text>
          <Text
            x={40}
            y={y(averageExpense) * -1}
            fill={theme.colors.textSecondary}
            fontSize={16}
            textAnchor='end'
          >
            {shortenNumber(averageExpense)}
          </Text>
          <Text
            x={40}
            y={y(yDomain[1]) * -1 + 12}
            fill={theme.colors.textSecondary}
            fontSize={16}
            textAnchor='end'
          >
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