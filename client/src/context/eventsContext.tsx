"use client";
import { createContext, ReactNode, useContext } from "react";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { Event } from "@/types/types";
interface EventContext {
  events: Event[] | null;
  eventsChanges: number | null;
  editingEventId: string | null;
  setEventsChanges: Dispatch<SetStateAction<number>>;
  setEvents: Dispatch<SetStateAction<Event[] | null>>;
  eventAlertDialogOpen: string | null;
  setEventAlertDialogOpen: Dispatch<SetStateAction<string | null>>;
  setEditingEventId: Dispatch<SetStateAction<string | null>>;
}
const EventContext = createContext<EventContext | undefined>(undefined);

export default function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [eventsChanges, setEventsChanges] = useState<number>(0);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventAlertDialogOpen, setEventAlertDialogOpen] = useState<
    string | null
  >(null);

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        eventsChanges,
        setEventsChanges,
        editingEventId,
        setEditingEventId,
        eventAlertDialogOpen,
        setEventAlertDialogOpen,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useUserContext must be used within a ContextProvider");
  }
  return context;
};
