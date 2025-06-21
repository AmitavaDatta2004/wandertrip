
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, DollarSign, ListFilter, ArrowDownUp, UserSquare, Tag } from 'lucide-react';
import AddExpenseModal from '@/components/trips/add-expense-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Trip, Expense, Member } from '@/lib/types/trip';

const expenseCategoriesFilter = ['All Categories', 'Food', 'Transport', 'Accommodation', 'Activities', 'Shopping', 'Miscellaneous'];


interface ExpensesTabProps {
  trip: Trip;
  expenses: Expense[] | undefined;
  members: Member[] | undefined;
  tripCurrency: string;
  onExpenseAction: () => void;
  currentUser: FirebaseUser | null;
}

export default function ExpensesTab({ trip, expenses, members, tripCurrency, onExpenseAction, currentUser }: ExpensesTabProps) {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [sortOption, setSortOption] = useState('date-desc');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterPayerId, setFilterPayerId] = useState('all');
  const { toast } = useToast();
  const displayCurrencySymbol = tripCurrency === 'INR' ? '₹' : tripCurrency;
  const isTripOwner = currentUser?.uid === trip.ownerId;

  const getMemberName = useCallback((uid: string) => members?.find(m => m.id === uid)?.displayName || uid.substring(0, 6) + "...", [members]);

  const getParticipantShareDetails = (expense: Expense) => {
    if (!members || !expense.participants || expense.participants.length === 0) return 'N/A';
    const payerName = getMemberName(expense.paidBy);
    
    if (expense.splitType === 'unequally' && expense.splitDetails) {
        const details = Object.entries(expense.splitDetails)
            .filter(([_, amount]) => amount > 0)
            .map(([uid, amount]) => `${getMemberName(uid)}: ${displayCurrencySymbol}${amount.toFixed(2)}`)
            .join(', ');
        return `Unequal split: ${details}. Paid by ${payerName}.`;
    }

    // Fallback to equal split
    const participantNames = expense.participants.map(uid => getMemberName(uid)).join(', ');
    const shareAmount = (expense.amount / expense.participants.length).toFixed(2);
    if (expense.participants.length === 1 && expense.participants[0] === expense.paidBy) {
      return `Paid by ${payerName} for themself.`;
    }
    return `Equally split between ${participantNames}. Each owes ${displayCurrencySymbol}${shareAmount} to ${payerName}.`;
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    if (currentUser?.uid !== trip.ownerId && expenseToDelete.paidBy !== currentUser?.uid) {
        toast({ title: "Unauthorized", description: "Only the trip owner or the person who paid can delete this expense.", variant: "destructive" });
        setExpenseToDelete(null);
        return;
    }
    try {
      const expenseRef = doc(db, 'trips', trip.id, 'expenses', expenseToDelete.id);
      await deleteDoc(expenseRef);
      toast({ title: "Expense Deleted", description: `"${expenseToDelete.description}" has been removed.` });
      onExpenseAction();
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      toast({ title: "Error Deleting Expense", description: error.message || "Could not delete expense.", variant: "destructive" });
    } finally {
      setExpenseToDelete(null);
    }
  };

  const processedExpenses = useMemo(() => {
    let filtered = expenses ? [...expenses] : [];

    if (filterCategory !== 'All Categories') {
      filtered = filtered.filter(exp => exp.category === filterCategory);
    }

    if (filterPayerId !== 'all') {
      filtered = filtered.filter(exp => exp.paidBy === filterPayerId);
    }

    switch (sortOption) {
      case 'date-desc':
        filtered.sort((a, b) => (b.date instanceof Date ? b.date.getTime() : new Date(b.date.seconds * 1000).getTime()) - (a.date instanceof Date ? a.date.getTime() : new Date(a.date.seconds * 1000).getTime()));
        break;
      case 'date-asc':
        filtered.sort((a, b) => (a.date instanceof Date ? a.date.getTime() : new Date(a.date.seconds * 1000).getTime()) - (b.date instanceof Date ? b.date.getTime() : new Date(b.date.seconds * 1000).getTime()));
        break;
      case 'amount-desc':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case 'description-asc':
        filtered.sort((a, b) => a.description.localeCompare(b.description));
        break;
      case 'description-desc':
        filtered.sort((a, b) => b.description.localeCompare(a.description));
        break;
      default:
        break;
    }
    return filtered;
  }, [expenses, sortOption, filterCategory, filterPayerId]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Expenses</h2>
        <Button
          onClick={() => setIsAddExpenseModalOpen(true)}
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

      <Card className="p-4 shadow-sm border dark:bg-card/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full h-11">
              <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategoriesFilter.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPayerId} onValueChange={setFilterPayerId}>
            <SelectTrigger className="w-full h-11">
              <UserSquare className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by payer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payers</SelectItem>
              {members?.map(member => (
                <SelectItem key={member.id} value={member.id}>{member.displayName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full h-11 sm:col-span-2 lg:col-span-1">
              <ArrowDownUp className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Sort expenses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest First)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
              <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
              <SelectItem value="description-asc">Description (A-Z)</SelectItem>
              <SelectItem value="description-desc">Description (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>


      {isAddExpenseModalOpen && members && (
        <AddExpenseModal
          isOpen={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
          tripId={trip.id}
          members={members}
          tripCurrency={tripCurrency}
          onExpenseAdded={() => {
            onExpenseAction();
            setIsAddExpenseModalOpen(false);
          }}
        />
      )}

      {processedExpenses && processedExpenses.length > 0 ? (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {processedExpenses.map(exp => (
                <li key={exp.id} className="p-4 hover:bg-muted/30 group transition-colors duration-150">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                    <div className="flex-grow">
                      <p className="font-semibold text-base text-foreground">{exp.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Paid by <span className="font-medium text-primary/90">{getMemberName(exp.paidBy)}</span> on {exp.date instanceof Date ? exp.date.toLocaleDateString() : new Date(exp.date.seconds * 1000).toLocaleDateString()}
                      </p>
                      <div className="text-lg font-medium mt-1 flex items-center text-primary">
                        <span>{exp.currency === 'INR' ? '₹' : exp.currency} {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <Badge variant="outline" className="ml-2 text-xs border-primary/30 text-primary/80 bg-primary/5">{exp.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground/80 mt-1">
                        {getParticipantShareDetails(exp)}
                      </p>
                      {exp.notes && <p className="text-xs text-muted-foreground/80 mt-1">Notes: {exp.notes}</p>}
                    </div>
                    {(isTripOwner || exp.paidBy === currentUser?.uid) && (
                      <AlertDialog open={expenseToDelete?.id === exp.id} onOpenChange={(open) => { if (!open) setExpenseToDelete(null); }}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive group-hover:opacity-100 sm:opacity-0 transition-opacity flex-shrink-0"
                            onClick={() => setExpenseToDelete(exp)}
                            aria-label={`Delete expense: ${exp.description}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Expense: {expenseToDelete?.description}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this expense? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteExpense}
                              className={buttonVariants({ variant: "destructive" })}
                            >
                              Delete Expense
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-10 shadow-sm border-dashed border-border/70">
          <CardContent>
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/70 mb-4" />
            <p className="text-muted-foreground font-semibold">
                {expenses && expenses.length > 0 ? 'No expenses match your current filters.' : 'No expenses recorded yet.'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                {expenses && expenses.length > 0 ? 'Try adjusting your filter criteria.' : 'Start by adding the first shared cost!'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
