import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo } from "react";
import { Bar, BarChart, XAxis } from "recharts";

type Props = {
    className?: string;
    internalLinks: number;
    externalLinks: number;
}

const chartData = [
    { links: "links", internal: 0, external: 12 },
]
const chartConfig = {
    internal: {
        label: "Internal",
        color: "#2563eb",
    },
    external: {
        label: "External",
        color: "#60a5fa",
    },
} satisfies ChartConfig
export const LinksChart = ({ className, internalLinks, externalLinks }: Props) => {
    const chartData = useMemo(() => [
        { links: "links", internal: internalLinks, external: externalLinks },
    ], [internalLinks, externalLinks])

    return (
        <Card className={className}>
            <CardHeader>
                Internal vs External links
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <XAxis
                            dataKey="links"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent payload={[]} />} />
                        <Bar dataKey="internal" fill="var(--color-internal)" radius={4} />
                        <Bar dataKey="external" fill="var(--color-external)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}