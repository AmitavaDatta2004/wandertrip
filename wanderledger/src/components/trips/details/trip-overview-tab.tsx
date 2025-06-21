
'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, PieChartIcon, Wallet, HandCoins, TrendingUp, TrendingDown, AlertTriangle, ArrowRightLeft, ArrowRightCircle, ArrowLeftCircle, IndianRupee } from 'lucide-react';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';
import type { Trip, Expense, Member, RecordedPayment } from '@/lib/types/trip';

interface TripOverviewTabProps {
  trip: Trip;
  expenses: Expense[] | undefined;
  members: Member[] | undefined;
  currentUser: FirebaseUser | null;
  recordedPayments: RecordedPayment[] | undefined;
}

export default function TripOverviewTab({ trip, expenses, members, currentUser, recordedPayments }: TripOverviewTabProps) {
  const displayCurrencySymbol = trip.baseCurrency === 'INR' ? <IndianRupee className="inline-block h-5 w-5 relative -top-px mr-0.5" /> : trip.baseCurrency;
  
  const totalTripExpenses = useMemo(() => expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0, [expenses]);
  const numberOfExpenses = useMemo(() => expenses?.length || 0, [expenses]);

  const {
    currentUserTotalPaidInitial,
    currentUserTotalShare,
    currentUserTotalPaidAsSettlements,
    currentUserTotalReceivedFromSettlements,
    currentUserNetBalance,
  } = useMemo(() => {
    if (!currentUser || !expenses) {
      return {
        currentUserTotalPaidInitial: 0,
        currentUserTotalShare: 0,
        currentUserTotalPaidAsSettlements: 0,
        currentUserTotalReceivedFromSettlements: 0,
        currentUserNetBalance: 0,
      };
    }

    let paidByCurrentUserInitial = 0;
    let shareForCurrentUser = 0;

    expenses.forEach(exp => {
      if (exp.paidBy === currentUser.uid) {
        paidByCurrentUserInitial += exp.amount;
      }
      if (exp.participants.includes(currentUser.uid)) {
        if (exp.splitType === 'unequally' && exp.splitDetails && exp.splitDetails[currentUser.uid]) {
            shareForCurrentUser += exp.splitDetails[currentUser.uid];
        } else {
            const numberOfParticipants = exp.participants.length || 1;
            shareForCurrentUser += exp.amount / numberOfParticipants;
        }
      }
    });
    
    let paidAsSettlements = 0;
    let receivedFromSettlements = 0;

    if (recordedPayments) {
      recordedPayments.forEach(payment => {
        if (payment.fromUserId === currentUser.uid) {
          paidAsSettlements += payment.amount;
        }
        if (payment.toUserId === currentUser.uid) {
          receivedFromSettlements += payment.amount;
        }
      });
    }
    
    const finalNetBalance = (paidByCurrentUserInitial - shareForCurrentUser) + paidAsSettlements - receivedFromSettlements;

    return {
      currentUserTotalPaidInitial: paidByCurrentUserInitial,
      currentUserTotalShare: shareForCurrentUser,
      currentUserTotalPaidAsSettlements: paidAsSettlements,
      currentUserTotalReceivedFromSettlements: receivedFromSettlements,
      currentUserNetBalance: finalNetBalance,
    };
  }, [currentUser, expenses, recordedPayments]);

  const getMemberName = useCallback((uid: string) => members?.find(m => m.id === uid)?.displayName || uid.substring(0, 6) + "...", [members]);

  const categoryData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).map(([category, amount]) => ({ category, amount, fill: '' })).sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const categoryChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    categoryData.forEach((item, index) => {
      config[item.category] = {
        label: item.category,
        color: `hsl(var(--chart-${index % 5 + 1}))`,
      };
      const categoryItem = categoryData.find(cd => cd.category === item.category);
      if (categoryItem) {
        categoryItem.fill = `hsl(var(--chart-${index % 5 + 1}))`;
      }
    });
    return config;
  }, [categoryData]);

  const memberSpendingData = useMemo(() => {
    if (!expenses || expenses.length === 0 || !members || members.length === 0) return [];
    const spending = expenses.reduce((acc, curr) => {
      acc[curr.paidBy] = (acc[curr.paidBy] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(spending).map(([memberId, amount]) => ({
      name: getMemberName(memberId),
      amount,
      fill: 'hsl(var(--chart-1))'
    })).sort((a, b) => b.amount - a.amount);
  }, [expenses, members, getMemberName]);

  const memberSpendingChartConfig = {
    amount: { label: "Amount Spent", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  const NetBalanceDisplay = () => {
    if (Math.abs(currentUserNetBalance) < 0.01) { 
      return (
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg shadow text-green-700 dark:text-green-400">
          <div className="flex items-center">
            <ArrowRightLeft className="h-6 w-6 mr-3" />
            <div>
              <h3 className="text-sm font-medium">Your Current Net Position</h3>
              <p className="text-2xl font-bold">You Are Settled</p>
            </div>
          </div>
          <p className="text-xs mt-1">After all expenses and recorded settlements, your account is balanced.</p>
        </div>
      );
    } else if (currentUserNetBalance > 0) {
      return (
        <div className="p-4 bg-sky-100 dark:bg-sky-900/30 rounded-lg shadow text-sky-700 dark:text-sky-400">
           <div className="flex items-center">
            <TrendingUp className="h-6 w-6 mr-3" />
            <div>
              <h3 className="text-sm font-medium">Your Current Net Position</h3>
              <p className="text-2xl font-bold">You Are Owed: {displayCurrencySymbol}{currentUserNetBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <p className="text-xs mt-1">After all expenses and recorded settlements, others owe you this amount.</p>
        </div>
      );
    } else { // currentUserNetBalance < 0
      return (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg shadow text-red-700 dark:text-red-400">
          <div className="flex items-center">
            <TrendingDown className="h-6 w-6 mr-3" />
            <div>
              <h3 className="text-sm font-medium">Your Current Net Position</h3>
              <p className="text-2xl font-bold">You Owe: {displayCurrencySymbol}{Math.abs(currentUserNetBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <p className="text-xs mt-1">After all expenses and recorded settlements, you owe this amount.</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Your Financial Snapshot</CardTitle>
          <CardDescription>
            Detailed breakdown of your contributions, shares, and settlements.
            The "Current Net Position" reflects your final balance after all recorded payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-muted/70 dark:bg-muted/40 rounded-lg shadow-inner">
            <div className="flex items-center text-muted-foreground mb-1">
              <Wallet className="h-5 w-5 mr-2.5 text-primary" />
              <h3 className="text-sm font-medium">Total You Paid (for Expenses)</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{displayCurrencySymbol}{currentUserTotalPaidInitial.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          
          <div className="p-4 bg-muted/70 dark:bg-muted/40 rounded-lg shadow-inner">
             <div className="flex items-center text-muted-foreground mb-1">
              <HandCoins className="h-5 w-5 mr-2.5 text-accent" />
              <h3 className="text-sm font-medium">Your Total Share (of Expenses)</h3>
            </div>
            <p className="text-3xl font-bold text-accent">{displayCurrencySymbol}{currentUserTotalShare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <div className="p-4 bg-muted/70 dark:bg-muted/40 rounded-lg shadow-inner">
            <div className="flex items-center text-muted-foreground mb-1">
              <ArrowRightCircle className="h-5 w-5 mr-2.5 text-orange-500" />
              <h3 className="text-sm font-medium">Total You Paid (as Settlements)</h3>
            </div>
            <p className="text-3xl font-bold text-orange-500">{displayCurrencySymbol}{currentUserTotalPaidAsSettlements.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <div className="p-4 bg-muted/70 dark:bg-muted/40 rounded-lg shadow-inner">
            <div className="flex items-center text-muted-foreground mb-1">
              <ArrowLeftCircle className="h-5 w-5 mr-2.5 text-teal-500" />
              <h3 className="text-sm font-medium">Total You Received (from Settlements)</h3>
            </div>
            <p className="text-3xl font-bold text-teal-500">{displayCurrencySymbol}{currentUserTotalReceivedFromSettlements.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          
          <div className="md:col-span-2">
            <NetBalanceDisplay />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Overall Trip Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg shadow">
            <h3 className="text-sm font-medium text-muted-foreground">Total Trip Expenses</h3>
            <p className="text-2xl font-bold">{displayCurrencySymbol}{totalTripExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg shadow">
            <h3 className="text-sm font-medium text-muted-foreground">Number of Expenses Logged</h3>
            <p className="text-2xl font-bold">{numberOfExpenses}</p>
          </div>
        </CardContent>
      </Card>
      
      {!expenses || expenses.length === 0 ? (
         <Card className="shadow-md border-dashed">
            <CardHeader className="items-center text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-3"/>
                <CardTitle>No Expense Data Yet</CardTitle>
                <CardDescription>Charts for category and member spending will appear here once expenses are added.</CardDescription>
            </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5" /> Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ChartContainer config={categoryChartConfig} className="min-h-[250px] w-full aspect-square">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="category" hideLabel />} />
                    <Pie data={categoryData} dataKey="amount" nameKey="category" labelLine={false} label={({ percent, name }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || `hsl(var(--chart-${index % 5 + 1}))`} />
                      ))}
                    </Pie>
                    <RechartsLegend content={({ payload }) => <ChartLegendContent payload={payload} config={categoryChartConfig} />} />
                  </PieChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-10">No category data to display.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Spending per Member (Paid By)</CardTitle>
            </CardHeader>
            <CardContent>
              {memberSpendingData.length > 0 ? (
                <ChartContainer config={memberSpendingChartConfig} className="min-h-[250px] w-full">
                  <BarChart data={memberSpendingData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" tickFormatter={(value) => `${trip.baseCurrency === 'INR' ? '₹' : trip.baseCurrency}${value}`} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={100} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" hideLabel />} />
                    <Bar dataKey="amount" radius={4} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-10">No member spending data to display.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Trip Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{trip.description || "No description provided for this trip."}</p>
        </CardContent>
      </Card>
    </div>
  );
}
