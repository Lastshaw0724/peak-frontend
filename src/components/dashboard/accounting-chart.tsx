'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { day: "Monday", sales: 1550 },
  { day: "Tuesday", sales: 1300 },
  { day: "Wednesday", sales: 2250 },
  { day: "Thursday", sales: 1750 },
  { day: "Friday", sales: 2800 },
  { day: "Saturday", sales: 3200 },
  { day: "Sunday", sales: 2100 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function AccountingChart() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription>A summary of sales for the current week.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                 <YAxis
                    tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              </BarChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}
