
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PenLine, Image, Lock, Book } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type JournalEntry = {
  id?: string;
  date: string;
  content: string;
  mood: string;
  isPrivate: boolean;
};

type MoodJournalProps = {
  tripId?: number;
};

const MoodJournal = ({ tripId }: MoodJournalProps) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState<JournalEntry>({
    date: new Date().toISOString().split('T')[0],
    content: '',
    mood: 'happy',
    isPrivate: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const moodOptions = [
    { value: 'excited', label: '😃 Excited' },
    { value: 'relaxed', label: '😌 Relaxed' }, 
    { value: 'happy', label: '😊 Happy' },
    { value: 'tired', label: '😴 Tired' },
    { value: 'stressed', label: '😓 Stressed' },
    { value: 'amazed', label: '😲 Amazed' }
  ];

  const handleEntryChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };

  const handlePrivacyToggle = () => {
    setNewEntry(prev => ({ ...prev, isPrivate: !prev.isPrivate }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to save journal entries",
        variant: "destructive"
      });
      return;
    }
    
    if (!newEntry.content.trim()) {
      toast({
        title: "Entry cannot be empty",
        description: "Please write something in your journal",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, we would save this to the database
      // For now, we'll just add it to the local state
      const entry = {
        ...newEntry,
        id: Date.now().toString()
      };
      
      setJournalEntries(prev => [entry, ...prev]);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        content: '',
        mood: 'happy',
        isPrivate: true
      });
      
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been saved.",
      });
    } catch (error) {
      toast({
        title: "Failed to save entry",
        description: "There was an error saving your journal entry.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border-none mb-8">
      <CardHeader>
        <CardTitle className="text-2xl dark:text-white">Mood Journal</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Keep track of your travel experiences and emotions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="write">
              <PenLine className="h-4 w-4 mr-2" /> Write
            </TabsTrigger>
            <TabsTrigger value="entries">
              <Book className="h-4 w-4 mr-2" /> Entries
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newEntry.date}
                    onChange={handleEntryChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="mood" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mood
                  </label>
                  <select
                    id="mood"
                    name="mood"
                    value={newEntry.mood}
                    onChange={handleEntryChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {moodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Journal Entry
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={newEntry.content}
                  onChange={handleEntryChange}
                  placeholder="Write about your day..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePrivacyToggle}
                  >
                    <Lock className={`h-4 w-4 mr-2 ${newEntry.isPrivate ? 'text-amber-500' : 'text-gray-400'}`} />
                    {newEntry.isPrivate ? 'Private' : 'Public'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Add Photos
                  </Button>
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting || !newEntry.content.trim()}
                >
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="entries">
            {journalEntries.length === 0 ? (
              <div className="text-center py-10">
                <Book className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No entries yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Start writing about your travel experiences
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {journalEntries.map(entry => (
                  <div 
                    key={entry.id} 
                    className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {moodOptions.find(m => m.value === entry.mood)?.label.split(' ')[0]}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      {entry.isPrivate && (
                        <Lock className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MoodJournal;
