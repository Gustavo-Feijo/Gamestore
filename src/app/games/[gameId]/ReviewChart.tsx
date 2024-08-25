"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

const chartConfig = {
  percentage: {
    label: "Percentage",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Chart containing the review data.
export default function ReviewChart({
  reviewData,
  totalReviewsCount,
}: {
  reviewData: { score: number; count: number }[];
  totalReviewsCount: number;
}) {
  // Get the percentage of each score relatively to the total amount of reviews.
  const scoresPercentage = useMemo(
    () =>
      reviewData.map((value) => ({
        ...value,
        percentage: (value.count * 100) / totalReviewsCount,
      })),
    [reviewData, totalReviewsCount]
  );

  // Get the total score o
  const chartAverageScore = useMemo(() => {
    return (
      reviewData.reduce((acc, cur) => {
        return acc + cur.count * cur.score;
      }, 0) / totalReviewsCount
    );
  }, [reviewData, totalReviewsCount]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Scores</CardTitle>
        <CardDescription className="flex flex-col">
          <span>Percentage of reviews per score.</span>
          <span className="text-2xl text-foreground">
            Average Score:{chartAverageScore.toFixed(2)}
          </span>
          <span>Number of reviews:{totalReviewsCount}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-40 md:min-h-60 border rounded p-2"
        >
          <BarChart
            accessibilityLayer
            data={scoresPercentage}
            layout="vertical"
            margin={{
              left: -20,
            }}
            barGap={20}
          >
            <CartesianGrid
              vertical={true}
              horizontal={true}
              horizontalCoordinatesGenerator={(props) => {
                return Array.from({ length: 11 }, (_, i) => i).map(
                  (value) => value * (props.height / 10)
                );
              }}
            />
            <XAxis
              type="number"
              dataKey="percentage"
              hide
              interval={0}
              domain={[0, 100]}
            />
            <YAxis
              dataKey="score"
              type="category"
              tickLine={false}
              tickMargin={10}
              tickSize={20}
              axisLine={false}
              interval={0}
              textAnchor="middle"
              className="text-lg"
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="percentage" fill="var(--color-percentage)" radius={5}>
              <LabelList
                dataKey="percentage"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => {
                  if (value > 0) return `${value.toFixed(1)}%`;
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
