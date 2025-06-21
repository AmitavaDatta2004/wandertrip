
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useMemo } from 'react';
import { CalendarIcon, Loader2, DollarSign, StickyNote, Users, Tag, UserSquare, DivideCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { Member } from '@/lib/types/trip';
import { useAuth } from '@/contexts/auth-context';

const expenseCategories = ['Food', 'Transport', 'Accommodation', 'Activities', 'Shopping', 'Miscellaneous'];

const expenseFormSchemaBase = z.object({
  description: z.string().min(1, { message: 'Description is required.' }).max(100),
  amount: z.coerce.number().min(0.01, { message: 'Amount must be greater than 0.' }),
  date: z.date({ required_error: 'Date is required.' }),
  paidBy: z.string().min(1, { message: 'Payer is required.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  participants: z.array(z.string()).min(1, { message: 'At least one participant is required.' }),
  notes: z.string().max(500).optional().default(''),
  splitType: z.enum(['equally', 'unequally']),
  unequalShares: z.record(z.string(), z.coerce.number().min(0).optional()).optional(),
});

const expenseFormSchema = expenseFormSchemaBase.refine((data) => {
    if (data.splitType === 'unequally') {
      const selectedParticipants = new Set(data.participants);
      if (!data.unequalShares || Object.keys(data.unequalShares).length === 0) return false;
      
      const totalShares = Object.entries(data.unequalShares)
        .filter(([participantId, _]) => selectedParticipants.has(participantId)) // Only sum shares of selected participants
        .reduce((sum, [, share]) => sum + (share || 0), 0);
        
      return Math.abs(totalShares - data.amount) < 0.01;
    }
    return true;
}, {
    message: "The sum of shares for selected participants must equal the total expense amount.",
    path: ['unequalShares'],
});


type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  members: Member[];
  tripCurrency: string;
  onExpenseAdded: () => void;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  tripId,
  members,
  tripCurrency,
  onExpenseAdded,
}: AddExpenseModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user: authUser } = useAuth();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date(),
      paidBy: authUser?.uid || '',
      category: expenseCategories[0],
      participants: members.map(m => m.id),
      notes: '',
      splitType: 'equally',
      unequalShares: {},
    },
  });

  const watchedAmount = useWatch({ control: form.control, name: 'amount' });
  const watchedSplitType = useWatch({ control: form.control, name: 'splitType' });
  const watchedParticipants = useWatch({ control: form.control, name: 'participants' });
  const watchedUnequalShares = useWatch({ control: form.control, name: 'unequalShares' });

  const unequalSplitSum = useMemo(() => {
    if (watchedSplitType !== 'unequally' || !watchedUnequalShares) return 0;
    const selectedParticipantsSet = new Set(watchedParticipants);
    return Object.entries(watchedUnequalShares)
      .filter(([id, _]) => selectedParticipantsSet.has(id))
      .reduce((sum, [, share]) => sum + (share || 0), 0);
  }, [watchedSplitType, watchedUnequalShares, watchedParticipants]);

  useEffect(() => {
    if (isOpen) {
      const initialParticipantIds = members.map(m => m.id);
      form.reset({
        description: '',
        amount: 0,
        date: new Date(),
        paidBy: authUser?.uid || (members.length > 0 ? members[0].id : ''),
        category: expenseCategories[0],
        participants: initialParticipantIds,
        notes: '',
        splitType: 'equally',
        unequalShares: initialParticipantIds.reduce((acc, id) => ({ ...acc, [id]: undefined }), {}),
      });
    }
  }, [isOpen, form, authUser, members]);


  const onSubmit = async (values: ExpenseFormValues) => {
    setIsLoading(true);
    if (!authUser) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
      setIsLoading(false);
      return;
    }
    
    const expenseDataPayload: { [key: string]: any } = {
      description: values.description.trim(),
      amount: values.amount,
      currency: tripCurrency,
      date: Timestamp.fromDate(values.date),
      paidBy: values.paidBy, // Payer can be other members
      category: values.category,
      participants: values.participants,
      splitType: values.splitType,
      notes: values.notes?.trim() || '',
      createdAt: serverTimestamp(),
    };
    
    if (values.splitType === 'unequally') {
      const selectedParticipantsSet = new Set(values.participants);
      expenseDataPayload.splitDetails = Object.fromEntries(
        Object.entries(values.unequalShares || {})
        .filter(([id, _]) => selectedParticipantsSet.has(id))
        .map(([id, share]) => [id, share || 0])
      );
    }
    
    try {
      const expensesCollectionRef = collection(db, 'trips', tripId, 'expenses');
      await addDoc(expensesCollectionRef, expenseDataPayload);
      
      toast({ title: 'Expense Added!', description: `"${values.description}" has been added.` });
      onExpenseAdded();
      onClose();
    } catch (error: any) {
      console.error("Error adding expense: ", error);
      toast({ 
        variant: 'destructive', 
        title: 'Error Adding Expense', 
        description: error.message || 'Failed to add expense. Check console for details.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Expense</DialogTitle>
          <DialogDescription>
            Enter the details of the expense for your trip.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 pr-2">
            {/* Standard fields */}
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><div className="relative"><StickyNote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="e.g., Lunch at the beach" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem> )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="amount" render={({ field }) => ( <FormItem><FormLabel>Amount ({tripCurrency})</FormLabel><FormControl><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="number" step="0.01" placeholder="0.00" {...field} className="pl-10" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></div></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="date" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date of Expense</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground" )}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="paidBy" render={({ field }) => ( <FormItem><FormLabel>Paid By</FormLabel><div className="relative"><UserSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" /><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="pl-10"><SelectValue placeholder="Select who paid" /></SelectTrigger></FormControl><SelectContent>{members.map(member => ( <SelectItem key={member.id} value={member.id}>{member.displayName}</SelectItem> ))}</SelectContent></Select></div><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Category</FormLabel><div className="relative"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" /><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="pl-10"><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>{expenseCategories.map(category => ( <SelectItem key={category} value={category}>{category}</SelectItem> ))}</SelectContent></Select></div><FormMessage /></FormItem> )} />
            </div>

            {/* Participants */}
            <FormField control={form.control} name="participants" render={() => ( <FormItem><div className="mb-2"><FormLabel className="text-base">Participants</FormLabel><FormDescription>Select who participated in this expense.</FormDescription></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 border rounded-md">{members.map((member) => ( <FormField key={member.id} control={form.control} name="participants" render={({ field }) => ( <FormItem key={member.id} className="flex flex-row items-center space-x-2 space-y-0 bg-muted/50 p-2 rounded-md"><FormControl><Checkbox checked={field.value?.includes(member.id)} onCheckedChange={(checked) => (checked ? field.onChange([...(field.value || []), member.id]) : field.onChange((field.value || []).filter((value) => value !== member.id)))} /></FormControl><FormLabel className="text-sm font-normal">{member.displayName}</FormLabel></FormItem> )} /> ))}</div><FormMessage /></FormItem> )} />

            {/* Split Type */}
            <FormField control={form.control} name="splitType" render={({ field }) => ( <FormItem className="space-y-3"><FormLabel className="text-base">Split Method</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 items-center"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="equally" /></FormControl><FormLabel className="font-normal">Split Equally</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="unequally" /></FormControl><FormLabel className="font-normal">Split Unequally</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem> )} />
            
            {/* Unequal Split Inputs */}
            {watchedSplitType === 'unequally' && (
              <div className="space-y-4 pt-2 border-t mt-4">
                <FormLabel>Enter Shares for Each Participant</FormLabel>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
                  {members
                    .filter(m => watchedParticipants.includes(m.id))
                    .map((member) => (
                    <FormField
                      key={member.id}
                      control={form.control}
                      name={`unequalShares.${member.id}`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormLabel className="w-1/3 truncate text-sm">{member.displayName}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                              className="h-9"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                 <div className={`p-2 rounded-md text-sm font-medium flex justify-between items-center ${Math.abs(unequalSplitSum - watchedAmount) > 0.01 ? 'bg-destructive/10 text-destructive' : 'bg-green-100/80 dark:bg-green-900/40 text-green-700 dark:text-green-300'}`}>
                    <div className="flex items-center gap-2">
                      <DivideCircle className="h-4 w-4"/>
                      <span>Sum of Shares: {unequalSplitSum.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4"/>
                      <span>Remaining: {(watchedAmount - unequalSplitSum).toFixed(2)}</span>
                    </div>
                </div>
                <FormMessage>{form.formState.errors.unequalShares?.message}</FormMessage>
              </div>
            )}

            {/* Notes */}
            <FormField control={form.control} name="notes" render={({ field }) => ( <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Any additional details about the expense..." className="resize-none" {...field} /></FormControl><FormMessage /></FormItem> )} />
            
            <DialogFooter className="pt-4">
              <DialogClose asChild><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
