
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp as FirestoreTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, ArrowRight, CheckSquare, Scale, Loader2, History, FileText, UserCircle, CalendarIcon as CalendarIconLucide, ArrowDownUp, ClipboardEdit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Trip, Expense, Member, RecordedPayment, SettlementTransaction, MemberFinancials } from '@/lib/types/trip';
import { format } from 'date-fns';

interface SettlementTabProps {
  trip: Trip;
  expenses: Expense[] | undefined;
  members: Member[] | undefined;
  recordedPayments: RecordedPayment[] | undefined;
  currentUser: FirebaseUser | null;
  onAction: () => void;
}

export default function SettlementTab({ trip, expenses, members, recordedPayments, currentUser, onAction }: SettlementTabProps) {
  const displayCurrencySymbol = trip.baseCurrency === 'INR' ? <IndianRupee className="inline-block h-5 w-5 relative -top-px mr-0.5" /> : trip.baseCurrency;
  const getMemberName = useCallback((uid: string) => members?.find(m => m.id === uid)?.displayName || uid.substring(0, 6) + "...", [members]);
  const { toast } = useToast();
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [paymentToRecordDetails, setPaymentToRecordDetails] = useState<SettlementTransaction | null>(null);
  const [recordPaymentNotes, setRecordPaymentNotes] = useState('');
  const [sortRecordedPaymentsBy, setSortRecordedPaymentsBy] = useState('date-desc');
  const [filterRecorderId, setFilterRecorderId] = useState('all');

  const memberFinancials = useMemo((): MemberFinancials[] => {
    if (!members || members.length === 0) return [];

    const financials: Record<string, { paid: number, share: number, initialNet: number, adjustedNet: number }> = {};
    members.forEach(member => {
      financials[member.id] = { paid: 0, share: 0, initialNet: 0, adjustedNet: 0 };
    });

    if (expenses) {
      expenses.forEach(expense => {
        if (financials[expense.paidBy]) {
          financials[expense.paidBy].paid += expense.amount;
        }
        
        if (expense.splitType === 'unequally' && expense.splitDetails) {
          Object.entries(expense.splitDetails).forEach(([participantId, shareAmount]) => {
            if (financials[participantId] && expense.participants.includes(participantId)) {
              financials[participantId].share += shareAmount;
            }
          });
        } else { // Default to equal split
          const sharePerParticipant = expense.amount / (expense.participants.length || 1);
          expense.participants.forEach(participantId => {
            if (financials[participantId]) {
              financials[participantId].share += sharePerParticipant;
            }
          });
        }
      });
    }

    members.forEach(member => {
      const memberData = financials[member.id];
      memberData.initialNet = memberData.paid - memberData.share;
      memberData.adjustedNet = memberData.initialNet;
    });

    if (recordedPayments) {
      recordedPayments.forEach(payment => {
        if (financials[payment.fromUserId]) {
          financials[payment.fromUserId].adjustedNet += payment.amount;
        }
        if (financials[payment.toUserId]) {
          financials[payment.toUserId].adjustedNet -= payment.amount;
        }
      });
    }

    return members.map(member => {
      const memberData = financials[member.id];
      return {
        memberId: member.id,
        memberName: getMemberName(member.id),
        totalPaid: memberData.paid,
        totalShare: memberData.share,
        initialNetBalance: memberData.initialNet,
        netBalance: memberData.adjustedNet,
      };
    }).sort((a, b) => b.netBalance - a.netBalance);
  }, [expenses, members, recordedPayments, getMemberName]);

  const settlementTransactions = useMemo((): SettlementTransaction[] => {
    if (!memberFinancials || memberFinancials.length === 0) return [];

    const transactions: SettlementTransaction[] = [];
    const balancesCopy = JSON.parse(JSON.stringify(memberFinancials.map(mf => ({
      id: mf.memberId,
      name: mf.memberName,
      balance: mf.netBalance
    }))));

    let debtors = balancesCopy.filter((m: any) => m.balance < -0.005).sort((a: any, b: any) => a.balance - b.balance);
    let creditors = balancesCopy.filter((m: any) => m.balance > 0.005).sort((a: any, b: any) => b.balance - a.balance);

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      const amountToTransfer = Math.min(-debtor.balance, creditor.balance);

      if (amountToTransfer > 0.005) {
        transactions.push({
          fromUserId: debtor.id,
          from: debtor.name,
          toUserId: creditor.id,
          to: creditor.name,
          amount: amountToTransfer
        });

        debtor.balance += amountToTransfer;
        creditor.balance -= amountToTransfer;
      }

      if (Math.abs(debtor.balance) < 0.005) debtorIndex++;
      if (Math.abs(creditor.balance) < 0.005) creditorIndex++;
    }
    return transactions;
  }, [memberFinancials]);

  const uniqueRecorders = useMemo(() => {
    if (!recordedPayments || !members) return [];
    const recorderIds = [...new Set(recordedPayments.map(p => p.recordedBy))];
    return recorderIds.map(id => ({ id, name: getMemberName(id) }));
  }, [recordedPayments, members, getMemberName]);

  const sortedAndFilteredRecordedPayments = useMemo(() => {
    if (!recordedPayments) return [];
    let filtered = [...recordedPayments];

    if (filterRecorderId !== 'all') {
      filtered = filtered.filter(payment => payment.recordedBy === filterRecorderId);
    }
    
    switch (sortRecordedPaymentsBy) {
      case 'date-desc':
        filtered.sort((a, b) => (b.dateRecorded instanceof FirestoreTimestamp ? b.dateRecorded.toDate().getTime() : new Date(b.dateRecorded).getTime()) - (a.dateRecorded instanceof FirestoreTimestamp ? a.dateRecorded.toDate().getTime() : new Date(a.dateRecorded).getTime()));
        break;
      case 'date-asc':
        filtered.sort((a, b) => (a.dateRecorded instanceof FirestoreTimestamp ? a.dateRecorded.toDate().getTime() : new Date(a.dateRecorded).getTime()) - (b.dateRecorded instanceof FirestoreTimestamp ? b.dateRecorded.toDate().getTime() : new Date(b.dateRecorded).getTime()));
        break;
      case 'amount-desc':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }
    return filtered;
  }, [recordedPayments, sortRecordedPaymentsBy, filterRecorderId]);

  const handleRecordPayment = async () => {
    if (!currentUser || !trip || !paymentToRecordDetails) {
      toast({ title: "Error", description: "User, trip, or payment details are missing.", variant: "destructive" });
      return;
    }
    if (!trip.baseCurrency || trip.baseCurrency.length !== 3) {
        console.error(`Critical Error: Trip baseCurrency for trip ID ${trip.id} is invalid or missing. Value: "${trip.baseCurrency}". Cannot record payment.`);
        toast({
            title: "Trip Configuration Error",
            description: `The base currency ("${trip.baseCurrency || 'Not set'}") for this trip is not set up correctly. Cannot record payment. Please ensure it's set in the trip settings (e.g., 'INR').`,
            variant: "destructive",
            duration: 10000,
        });
        return;
    }

    setIsRecordingPayment(true);
    const paymentData = {
      fromUserId: paymentToRecordDetails.fromUserId,
      toUserId: paymentToRecordDetails.toUserId,
      amount: paymentToRecordDetails.amount,
      currency: trip.baseCurrency,
      dateRecorded: serverTimestamp(),
      recordedBy: currentUser.uid,
      notes: recordPaymentNotes.trim() || '',
    };
    
    try {
      await addDoc(collection(db, 'trips', trip.id, 'recordedPayments'), paymentData);
      toast({ title: "Payment Recorded", description: `Payment from ${paymentToRecordDetails.from} to ${paymentToRecordDetails.to} has been recorded.` });
      onAction();
      setPaymentToRecordDetails(null);
      setRecordPaymentNotes('');
    } catch (error: any) {
      console.error("[SettlementTab] Error recording payment:", error);
      toast({ title: "Error Recording Payment", description: error.message || "Could not record payment. Check console for details.", variant: "destructive" });
    } finally {
      setIsRecordingPayment(false);
    }
  };
  
  const formatDateForDisplay = (dateInput: Date | FirestoreTimestamp | undefined): string => {
    if (!dateInput) return 'N/A';
    const date = dateInput instanceof FirestoreTimestamp ? dateInput.toDate() : dateInput;
    return format(date, 'PPpp');
  };

  if (!expenses || !members) {
    return (
      <Card className="text-center py-10 shadow-sm border-dashed">
        <CardContent>
          <Scale className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-semibold">Loading data or no expenses/members yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Add expenses and members to see settlement details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <CardTitle>Member Financial Summary</CardTitle>
          <CardDescription>Breakdown of each member's contributions, shares, and net balance after recorded payments.</CardDescription>
        </CardHeader>
        <CardContent>
          {memberFinancials.length > 0 ? (
            <ul className="divide-y divide-border">
              {memberFinancials.map(({ memberId, memberName, totalPaid, totalShare, netBalance }) => (
                <li key={memberId} className="py-4 hover:bg-muted/30 transition-colors duration-150 px-2 -mx-2 rounded-md">
                  <div className="font-semibold text-lg mb-2 text-primary">{memberName}</div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Paid:</span>
                      <span className="font-medium">{displayCurrencySymbol}{totalPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Share:</span>
                      <span className="font-medium">{displayCurrencySymbol}{totalShare.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between font-semibold pt-1 mt-1 border-t border-dashed ${netBalance < -0.005 ? 'text-destructive' : netBalance > 0.005 ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'}`}>
                      <span>Net Balance:</span>
                      <span>
                        {netBalance < -0.005 ? <>Owes {displayCurrencySymbol}{Math.abs(netBalance).toFixed(2)}</> : (netBalance > 0.005 ? <>Is Owed {displayCurrencySymbol}{netBalance.toFixed(2)}</> : <>Settled {displayCurrencySymbol}0.00</>)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No financial information available.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md border-accent/20">
        <CardHeader>
          <CardTitle>Settlement Plan (Outstanding Debts)</CardTitle>
          <CardDescription>Suggested transactions to settle remaining debts. Click the checkmark to record a payment having been made.</CardDescription>
        </CardHeader>
        <CardContent>
          {settlementTransactions.length > 0 ? (
            <ul className="space-y-3">
              {settlementTransactions.map((txn, index) => (
                <li key={index} className="p-4 border rounded-lg shadow-sm bg-background hover:bg-muted/50 dark:bg-card/80 dark:hover:bg-muted/20 transition-colors flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-grow">
                    <span className="font-semibold text-accent text-sm break-all">{txn.from}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-semibold text-accent text-sm break-all">{txn.to}</span>
                  </div>
                  <strong className="text-base sm:text-lg font-semibold whitespace-nowrap text-foreground">{displayCurrencySymbol}{txn.amount.toFixed(2)}</strong>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPaymentToRecordDetails(txn)}
                    className="ml-2 flex-shrink-0 hover:bg-green-500/10 border-green-500/50 hover:border-green-500"
                    aria-label={`Record payment from ${txn.from} to ${txn.to}`}
                  >
                    <CheckSquare className="h-4 w-4 text-green-600" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              {expenses && expenses.length > 0 && members && members.length > 0
                ? "All outstanding debts are settled, or no transactions needed!"
                : "Add expenses and members to calculate settlement."
              }
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-grow">
                    <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5 text-primary" /> Recorded Payments History</CardTitle>
                    <CardDescription>A log of all manually recorded settlement payments.</CardDescription>
                </div>
                <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
                    <Select value={filterRecorderId} onValueChange={setFilterRecorderId}>
                        <SelectTrigger className="w-full xs:w-[200px] h-10">
                            <ClipboardEdit className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Filter by recorder" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Recorders</SelectItem>
                            {uniqueRecorders.map(recorder => (
                            <SelectItem key={recorder.id} value={recorder.id}>{recorder.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={sortRecordedPaymentsBy} onValueChange={setSortRecordedPaymentsBy}>
                        <SelectTrigger className="w-full xs:w-[240px] h-10">
                            <ArrowDownUp className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Sort payments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                            <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                            <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                            <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          {sortedAndFilteredRecordedPayments && sortedAndFilteredRecordedPayments.length > 0 ? (
            <ul className="divide-y divide-border">
              {sortedAndFilteredRecordedPayments.map(payment => (
                <li key={payment.id} className="py-4 space-y-2 px-2 -mx-2 rounded-md hover:bg-muted/30 transition-colors duration-150">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div className="font-semibold text-md">
                      <span className="text-foreground">{getMemberName(payment.fromUserId)}</span>
                      <ArrowRight className="inline-block h-4 w-4 mx-2 text-muted-foreground" />
                      <span className="text-foreground">{getMemberName(payment.toUserId)}</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {payment.currency === 'INR' ? '₹' : payment.currency}
                      {payment.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1 sm:space-y-0 sm:flex sm:justify-between">
                    <span className="flex items-center"><UserCircle className="mr-1.5 h-3.5 w-3.5" />Recorded by: <span className="font-medium text-foreground/80 ml-1">{getMemberName(payment.recordedBy)}</span></span>
                    <span className="flex items-center"><CalendarIconLucide className="mr-1.5 h-3.5 w-3.5" />{formatDateForDisplay(payment.dateRecorded)}</span>
                  </div>
                  {payment.notes && (
                    <p className="text-sm text-foreground bg-muted/50 p-2.5 rounded-md mt-1.5 flex items-start shadow-sm">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary/70" />
                      {payment.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-muted-foreground text-center py-6">
                {recordedPayments && recordedPayments.length > 0 ? 'No payments match your current filter.' : 'No payments have been recorded yet.'}
            </p>
          )}
        </CardContent>
      </Card>

      {paymentToRecordDetails && (
        <AlertDialog open={!!paymentToRecordDetails} onOpenChange={(open) => { if (!open) { setPaymentToRecordDetails(null); setRecordPaymentNotes(''); } }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Record Payment</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to record a payment of <strong className="mx-1 text-primary">{displayCurrencySymbol}{paymentToRecordDetails.amount.toFixed(2)}</strong>
                from <strong className="mx-1 text-accent">{paymentToRecordDetails.from}</strong>
                to <strong className="mx-1 text-accent">{paymentToRecordDetails.to}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
              <Textarea
                placeholder="Optional notes about this payment (e.g., paid via UPI, cash)"
                value={recordPaymentNotes}
                onChange={(e) => setRecordPaymentNotes(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => { setPaymentToRecordDetails(null); setRecordPaymentNotes(''); }}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRecordPayment} disabled={isRecordingPayment} className="bg-green-600 hover:bg-green-700 text-white">
                {isRecordingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm & Record Payment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
