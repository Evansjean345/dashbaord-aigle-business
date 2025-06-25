"use client"

import {useEffect, useMemo, useState} from "react";
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {TrendingUp} from "lucide-react";
import {subDays, subMonths} from "date-fns";
import {DatePickerWithRange} from "../date-picker/date-range-picker";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {TransactionAnalyzeChart} from "@/types/transaction.types";
import {DateRange} from "react-day-picker";

const timeRanges = [
    {value: '7d', label: '7 derniers jours'},
    {value: '30d', label: '30 derniers jours'},
    {value: '3m', label: '3 derniers mois'},
];

interface Props {
    data: TransactionAnalyzeChart[],
    handleDateRangeSelected: (date: DateRange) => void
}

export const Chart = ({data, handleDateRangeSelected}: Props) => {
    const [selectedRange, setSelectedRange] = useState('7d');
    const [dateRange, setDateRange] = useState({
        from: subDays(new Date(), 7),
        to: new Date(),
    });

    const chartData = useMemo(() => data?.map(item => {
        const date = new Date(item.date);
        let day: number | string = date.getUTCDate();
        let month: number | string = date.getUTCMonth() + 1;
        let year: number | string = date.getUTCFullYear();

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = '0' + month;
        }

        return {
            ...item,
            date: `${day}/${month}/${year}`
        };
    }), [data]);


    const chartConfig = {
        payout: {
            label: "Transferts",
            color: "hsl(var(--chart-3))",
        },
        withdrawal: {
            label: "Encaissements",
            color: "hsl(var(--chart-4))",
        },
    };

    useEffect(() => {
        const today = new Date();
        let fromDate;

        switch (selectedRange) {
            case '7d':
                fromDate = subDays(today, 7);
                break;
            case '30d':
                fromDate = subDays(today, 30);
                break;
            case '3m':
                fromDate = subMonths(today, 3);
                break;
            default:
                fromDate = today;
        }

        setDateRange({from: fromDate, to: today});
        handleDateRangeSelected(dateRange)
    }, [selectedRange]);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Aperçu des transactions</CardTitle>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Select onValueChange={value => setSelectedRange(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Date"/>
                            </SelectTrigger>
                            <SelectContent>
                                {timeRanges.map((range) => (
                                    <SelectItem key={range.value}
                                                value={range.value.toString()}>{range.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <DatePickerWithRange
                            onChange={(range) => {
                                if (range?.from && range?.to) {
                                    setDateRange({from: range.from, to: range.to});
                                    handleDateRangeSelected(dateRange)
                                }
                            }}
                        />
                    </div>
                </div>
                <CardDescription>
                    Vue d'ensemble des transactions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                >
                    <AreaChart
                        accessibilityLayer
                        reverseStackOrder={true}
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 5)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent/>}/>
                        <defs>
                            <linearGradient id="fillPayout" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-payout)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-payout)" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="fillWithdrawal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-withdrawal)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-withdrawal)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="withdrawal"
                            type="natural"
                            fill="url(#fillWithdrawal)"
                            fillOpacity={0.4}
                            stroke="var(--color-withdrawal)"
                            stackId="a"
                        />
                        <Area
                            dataKey="payout"
                            type="natural"
                            fill="url(#fillPayout)"
                            fillOpacity={0.4}
                            stroke="var(--color-payout)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Vue d'ensemble des transactions <TrendingUp className="h-4 w-4"/>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};
