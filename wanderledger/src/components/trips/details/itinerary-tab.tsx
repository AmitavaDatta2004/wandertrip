
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText, MapPinIcon, CalendarClock, ListFilter, CalendarRange, History as HistoryIcon, CalendarPlus } from 'lucide-react';
import AddEventModal from '@/components/trips/add-event-modal';
import { cn } from '@/lib/utils';
import type { ItineraryEvent, Member } from '@/lib/types/trip';
import { format, isSameDay, isValid, parseISO, isBefore, isAfter, isEqual } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';

interface ItineraryTabProps {
  tripId: string;
  itineraryEvents: ItineraryEvent[] | undefined;
  onEventAction: () => void;
  tripStartDate?: Date;
  tripEndDate?: Date;
  members: Member[] | undefined;
}

const eventTypesForFilter = ['All Types', 'Activity', 'Flight', 'Train', 'Bus', 'Accommodation', 'Meeting Point', 'Note', 'Custom'];
const timeframeFilters = [
    { value: 'all', label: 'All Events', icon: CalendarRange },
    { value: 'upcoming', label: 'Upcoming Events', icon: CalendarClock },
    { value: 'past', label: 'Past Events', icon: HistoryIcon },
];

const getEventTypeStyle = (type: string) => {
  switch (type.toLowerCase()) {
    case 'flight': return "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-700";
    case 'train': return "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700";
    case 'bus': return "bg-lime-100 text-lime-700 border-lime-300 dark:bg-lime-900/50 dark:text-lime-300 dark:border-lime-700";
    case 'accommodation': return "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700";
    case 'activity': return "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-700";
    case 'meeting point': return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700";
    case 'note': return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600";
    default: return "bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary/70 dark:border-primary/40";
  }
};

const ensureDateObject = (dateInput: any): Date | null => {
  if (dateInput instanceof Date && isValid(dateInput)) {
    return dateInput;
  }
  if (dateInput && typeof dateInput.seconds === 'number') {
    const d = new Date(dateInput.seconds * 1000 + (dateInput.nanoseconds || 0) / 1000000);
    return isValid(d) ? d : null;
  }
  if (typeof dateInput === 'string') {
    const d = parseISO(dateInput);
    return isValid(d) ? d : null;
  }
  if (typeof dateInput === 'number') { // Assuming milliseconds timestamp
    const d = new Date(dateInput);
    return isValid(d) ? d : null;
  }
  return null;
};


export default function ItineraryTab({ tripId, itineraryEvents, onEventAction, tripStartDate, tripEndDate, members }: ItineraryTabProps) {
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [filterEventType, setFilterEventType] = useState('All Types');
  const [filterTimeframe, setFilterTimeframe] = useState('all'); // 'all', 'upcoming', 'past'
  const { user: currentUser } = useAuth();

  const handleAddToCalendar = (event: ItineraryEvent & { validStartDate: Date | null, validEndDate: Date | null }) => {
    if (!event.validStartDate) return;

    // Google Calendar link format is YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS without any punctuation.
    const formatDateToGoogle = (date: Date): string => {
        return format(date, "yyyyMMdd'T'HHmmss");
    };

    const startDateStr = formatDateToGoogle(event.validStartDate);
    // Use end date if available and valid, otherwise default to one hour after start
    const endDateForCalendar = event.validEndDate && event.validEndDate > event.validStartDate 
        ? event.validEndDate 
        : new Date(event.validStartDate.getTime() + 60 * 60 * 1000);
    const endDateStr = formatDateToGoogle(endDateForCalendar);

    const details = [
        event.notes || '',
        `\n\nEvent from WanderLedger trip.`,
    ].join('\n');
    
    const guestEmails = members
        ?.map(m => m.email)
        .filter((email): email is string => !!email && email !== currentUser?.email) // filter out nulls and current user
        .join(',');

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${startDateStr}/${endDateStr}`,
        details: details,
        location: event.location || '',
    });
    
    if (guestEmails) {
        params.append('add', guestEmails);
    }

    const url = `https://www.google.com/calendar/render?${params.toString()}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredAndSortedEvents = useMemo(() => {
    if (!itineraryEvents) return [];
    
    let processedEvents = itineraryEvents
      .map(event => ({
        ...event,
        validStartDate: ensureDateObject(event.date),
        validEndDate: event.endDate ? ensureDateObject(event.endDate) : null,
      }))
      .filter(event => event.validStartDate !== null);

    if (filterEventType !== 'All Types') {
      processedEvents = processedEvents.filter(event => event.type === filterEventType);
    }

    if (filterTimeframe !== 'all') {
        const today = new Date();
        const todayStartOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        processedEvents = processedEvents.filter(event => {
            const eventStartDate = event.validStartDate!; // We've already filtered out nulls
            const eventEndDate = event.validEndDate || eventStartDate; // Use start date if end date isn't set (single day event)

            if (filterTimeframe === 'upcoming') {
                // Event is upcoming if its end date is today or later
                return isEqual(eventEndDate, todayStartOfDay) || isAfter(eventEndDate, todayStartOfDay);
            } else if (filterTimeframe === 'past') {
                // Event is past if its end date is before today
                return isBefore(eventEndDate, todayStartOfDay);
            }
            return true;
        });
    }

    return processedEvents.sort((a, b) => {
        if (a.validStartDate!.getTime() !== b.validStartDate!.getTime()) {
          return a.validStartDate!.getTime() - b.validStartDate!.getTime();
        }
        // If dates are the same, sort by time (if available)
        const timeA = typeof a.time === 'string' ? a.time : "00:00";
        const timeB = typeof b.time === 'string' ? b.time : "00:00";
        return timeA.localeCompare(timeB);
      });
  }, [itineraryEvents, filterEventType, filterTimeframe]);


  const groupedEvents = useMemo(() => {
    return filteredAndSortedEvents.reduce((acc, event) => {
      const dateStr = format(event.validStartDate!, "eeee, MMMM do, yyyy");
      if (!acc[dateStr]) {
        acc[dateStr] = { events: [], originalDate: event.validStartDate! };
      }
      acc[dateStr].events.push(event);
      return acc;
    }, {} as Record<string, { events: (ItineraryEvent & { validStartDate: Date | null; validEndDate: Date | null; })[], originalDate: Date }>);
  }, [filteredAndSortedEvents]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-semibold tracking-tight">Trip Itinerary</h2>
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <Select value={filterEventType} onValueChange={setFilterEventType}>
            <SelectTrigger className="w-full xs:w-[180px] h-11">
              <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypesForFilter.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
            <SelectTrigger className="w-full xs:w-[220px] h-11">
              {React.createElement(timeframeFilters.find(f => f.value === filterTimeframe)?.icon || CalendarRange, { className: "mr-2 h-4 w-4 text-muted-foreground"})}
              <SelectValue placeholder="Filter by timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeframeFilters.map(tf => (
                <SelectItem key={tf.value} value={tf.value}>
                  <div className="flex items-center">
                    <tf.icon className="mr-2 h-4 w-4" />
                    {tf.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setIsAddEventModalOpen(true)}
            className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 h-11 bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Add Event
          </Button>
        </div>
      </div>

      {isAddEventModalOpen && (
        <AddEventModal
          isOpen={isAddEventModalOpen}
          onClose={() => setIsAddEventModalOpen(false)}
          tripId={tripId}
          onEventAdded={() => {
            onEventAction();
            setIsAddEventModalOpen(false);
          }}
        />
      )}

      {Object.keys(groupedEvents).length > 0 ? (
        Object.entries(groupedEvents).map(([dateStr, { events: eventsOnDate, originalDate }]) => (
          <div key={dateStr} className="relative pl-8 py-4 group animate-fade-in-up">
            <div className="absolute left-0 top-5 w-8 h-8 bg-primary text-primary-foreground rounded-full flex flex-col items-center justify-center shadow-md -translate-x-1/2 group-hover:scale-110 transition-transform">
                <span className="text-xs font-semibold">{format(originalDate, 'MMM')}</span>
                <span className="text-sm font-bold -mt-1">{format(originalDate, 'dd')}</span>
            </div>
            <h3 className="text-xl font-semibold mb-4 ml-4 text-primary group-hover:text-accent transition-colors">{dateStr}</h3>
            <div className="space-y-4 ml-4 border-l-2 border-border dark:border-gray-700 pl-8 group-hover:border-accent/50 transition-colors">
              {eventsOnDate.map(event => {
                return (
                  <Card key={event.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group/item dark:bg-card/90 border-l-4" style={{ borderColor: getEventTypeStyle(event.type).match(/border-([a-z]+)-[0-9]+/) ? `hsl(var(--${getEventTypeStyle(event.type).match(/border-([a-z]+)-[0-9]+/)?.[1]}))` : 'hsl(var(--border))' }}>
                    <CardContent className="p-5 pl-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex-grow">
                          <div className="flex items-center mb-1.5 flex-wrap gap-x-3 gap-y-1">
                            {event.time && <p className="text-sm font-semibold text-primary flex items-center"><CalendarClock className="h-4 w-4 mr-1.5 opacity-80"/>{event.time}{event.endTime && ` - ${event.endTime}`}</p>}
                            <Badge variant="outline" className={`${getEventTypeStyle(event.type)} font-medium text-xs px-2.5 py-1 shadow-sm`}>{event.type}</Badge>
                          </div>
                          <h4 className="font-semibold text-lg text-foreground dark:text-gray-100 group-hover/item:text-primary transition-colors">{event.title}</h4>
                          {event.location && <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1 flex items-center"><MapPinIcon className="h-4 w-4 mr-1.5 opacity-70" /> {event.location}</p>}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-3 right-3 h-8 group-hover/item:opacity-100 sm:opacity-0 transition-opacity flex items-center gap-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            onClick={() => handleAddToCalendar(event)}
                        >
                            <CalendarPlus className="h-4 w-4"/>
                            <span className="hidden lg:inline">Add to Calendar</span>
                        </Button>
                      </div>
                      {event.notes && <p className="text-sm text-muted-foreground/90 dark:text-gray-300 mt-2.5 pt-2.5 border-t border-dashed dark:border-gray-700 whitespace-pre-wrap">{event.notes}</p>}
                      {event.validEndDate && event.validStartDate && !isSameDay(event.validStartDate, event.validEndDate) && !event.time &&
                        <p className="text-xs text-muted-foreground/80 dark:text-gray-500 mt-2">Until: {format(event.validEndDate, "MMMM do, yyyy")}</p>
                      }
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <Card className="text-center py-16 shadow-sm border-dashed dark:bg-card/80 dark:border-gray-700 mt-8">
          <CardContent>
            <FileText className="mx-auto h-16 w-16 text-muted-foreground/70 dark:text-gray-500 mb-6" />
            <p className="text-xl text-muted-foreground dark:text-gray-400 font-semibold">
                {itineraryEvents && itineraryEvents.length > 0 ? 'No events match your current filters.' : 'Your itinerary is looking a bit empty.'}
            </p>
            <p className="text-base text-muted-foreground dark:text-gray-500 mt-2">
                {itineraryEvents && itineraryEvents.length > 0 ? 'Try adjusting your event type or timeframe filters.' : 'Start planning by adding flights, accommodations, or activities!'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
