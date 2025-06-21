// src/lib/pdf-exporter.ts

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Trip, Expense, Member, ItineraryEvent, PackingListItem, MemberFinancials, SettlementTransaction } from './types/trip';
import { format } from 'date-fns';

interface TripPDFData {
    trip: Trip;
    expenses: Expense[];
    members: Member[];
    itineraryEvents: ItineraryEvent[];
    packingItems: PackingListItem[];
    memberFinancials: MemberFinancials[];
    settlementTransactions: SettlementTransaction[];
}

const getMemberName = (uid: string, members: Member[]) => members?.find(m => m.id === uid)?.displayName || uid.substring(0, 6) + "...";

export const generateTripPDF = (data: TripPDFData) => {
    const { trip, expenses, members, itineraryEvents, packingItems, memberFinancials, settlementTransactions } = data;
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let y = 15;

    // Title
    doc.setFontSize(22);
    doc.text(trip.name, 15, y);
    y += 8;
    doc.setFontSize(14);
    doc.text(`${trip.destination}`, 15, y);
    y += 6;
    doc.setFontSize(12);
    doc.setTextColor(100);
    const startDate = trip.startDate instanceof Date ? format(trip.startDate, 'PPP') : 'N/A';
    const endDate = trip.endDate instanceof Date ? format(trip.endDate, 'PPP') : 'N/A';
    doc.text(`Dates: ${startDate} - ${endDate}`, 15, y);
    y += 10;
    doc.setTextColor(0);

    const addSection = (title: string, bodyFunc: () => void) => {
        if (y > pageHeight - 40) { // check for page break
            doc.addPage();
            y = 20;
        }
        doc.setFontSize(16);
        doc.text(title, 15, y);
        y += 8;
        bodyFunc();
    };

    // Financial Summary Table
    addSection("Financial Summary", () => {
        autoTable(doc, {
            startY: y,
            head: [['Member', 'Total Paid', 'Total Share', 'Net Balance']],
            body: memberFinancials.map(mf => [
                mf.memberName,
                `${trip.baseCurrency} ${mf.totalPaid.toFixed(2)}`,
                `${trip.baseCurrency} ${mf.totalShare.toFixed(2)}`,
                `${trip.baseCurrency} ${mf.netBalance.toFixed(2)} (${mf.netBalance > 0.01 ? 'Owed' : mf.netBalance < -0.01 ? 'Owes' : 'Settled'})`
            ]),
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            willDrawPage: (data) => { y = data.cursor?.y || 20; }
        });
        y = (doc as any).lastAutoTable.finalY + 10;
    });

    // Settlement Plan Table
    if (settlementTransactions.length > 0) {
        addSection("Outstanding Settlement Plan", () => {
            autoTable(doc, {
                startY: y,
                head: [['From', 'To', 'Amount']],
                body: settlementTransactions.map(st => [
                    st.from,
                    st.to,
                    `${trip.baseCurrency} ${st.amount.toFixed(2)}`
                ]),
                theme: 'striped',
                headStyles: { fillColor: [231, 76, 60] },
                willDrawPage: (data) => { y = data.cursor?.y || 20; }
            });
            y = (doc as any).lastAutoTable.finalY + 10;
        });
    }

    // Expenses Log
    if (expenses.length > 0) {
        addSection("Expense Log", () => {
            autoTable(doc, {
                startY: y,
                head: [['Date', 'Description', 'Amount', 'Paid By', 'Participants']],
                body: expenses.sort((a,b) => (b.date as Date).getTime() - (a.date as Date).getTime()).map(exp => [
                    exp.date instanceof Date ? format(exp.date, 'PP') : 'N/A',
                    exp.description,
                    `${exp.currency} ${exp.amount.toFixed(2)}`,
                    getMemberName(exp.paidBy, members),
                    exp.participants.map(p => getMemberName(p, members)).join(', ')
                ]),
                theme: 'grid',
                willDrawPage: (data) => { y = data.cursor?.y || 20; }
            });
            y = (doc as any).lastAutoTable.finalY + 10;
        });
    }

    // Itinerary
    if (itineraryEvents.length > 0) {
        const groupedEvents = itineraryEvents.reduce((acc, event) => {
            const dateStr = event.date instanceof Date ? format(event.date, "eeee, MMMM do, yyyy") : 'Date Unknown';
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(event);
            return acc;
        }, {} as Record<string, ItineraryEvent[]>);

        addSection("Itinerary", () => {
            Object.entries(groupedEvents).forEach(([dateStr, eventsOnDate]) => {
                if (y > pageHeight - 30) {
                    doc.addPage();
                    y = 20;
                }
                autoTable(doc, {
                    startY: y,
                    head: [[{ content: dateStr, colSpan: 3, styles: { fontStyle: 'bold', fillColor: [240, 240, 240], textColor: 40, halign: 'center' } }]],
                    body: eventsOnDate.map(event => [
                        event.time || 'All Day',
                        event.title,
                        event.location || '-'
                    ]),
                    columns: [{header: 'Time'}, {header: 'Event'}, {header: 'Location'}],
                    theme: 'grid',
                });
                y = (doc as any).lastAutoTable.finalY + 5;
            });
        });
    }

    // Packing List
    if (packingItems.length > 0) {
        addSection("Packing List", () => {
            autoTable(doc, {
                startY: y,
                head: [['Item', 'Status']],
                body: packingItems.map(item => [
                    item.name,
                    item.packed ? 'Packed' : 'Not Packed'
                ]),
                theme: 'plain',
                willDrawPage: (data) => { y = data.cursor?.y || 20; }
            });
            y = (doc as any).lastAutoTable.finalY + 10;
        });
    }

    // Save PDF
    doc.save(`WanderLedger-${trip.name.replace(/\\s/g, '-')}.pdf`);
}
