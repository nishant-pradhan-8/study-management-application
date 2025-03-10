"use client";

import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import EventInputCard from "./eventInputCard";
import { Event } from "@/types/types";
import { format } from "date-fns";
import { getEvents } from "@/actions/events/eventAction";
import UpdateEventCard from "./updateEventCard";
import { updateEvent } from "@/actions/events/eventAction";
import DeleteEventCard from "./deleteEventCard";
import { useEventContext } from "@/context/eventsContext";
function CalendarApp() {
  const [eventsService] = useState(() => createEventsServicePlugin()); // Store eventsService separately
  const { eventAlertDialogOpen, setEvents,  eventsChanges } =
    useEventContext();

  useEffect(() => {
    const renderEvents = async () => {
      const res = await getEvents();
      if (!res.data) {
        console.log(res.error);
        return;
      }
     
      const formattedRes = res.data.map((event: Event) => ({
        ...event,
        start: event.start
          ? format(new Date(event.start), "yyyy-MM-dd HH:mm")
          : "",
        end: event.end ? format(new Date(event.end), "yyyy-MM-dd HH:mm") : "",
      }));

      const existingEvents = eventsService.getAll();
      existingEvents.forEach((event) => {
        eventsService.remove(event.id);
      });

      formattedRes.forEach((event: Event) => {
        eventsService.add(event);
      });

      setEvents(formattedRes);
    };
    renderEvents();
  }, [eventsChanges, eventsService, setEvents]);


  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],

    plugins: [
      eventsService,
      createEventModalPlugin(),
      createDragAndDropPlugin(),
    ],
    callbacks: {
      onEventUpdate(updatedData) {
        const update = async () => {
          if (
            !updatedData.title ||
            !updatedData.description ||
            !updatedData.id
          ) {
            console.log("All the fields are required!");
            return;
          }
          const res = await updateEvent(
            updatedData.title,
            updatedData.start,
            updatedData.end,
            updatedData.description,
            updatedData.id.toString()
          );
          if (!res.data) {
            console.log("Adding Event Failed");
            return;
          }
          console.log("Events Added Sucessfully");
        };
        update();
      },
    },
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
      {eventAlertDialogOpen === "Create" && <EventInputCard />}
      {eventAlertDialogOpen === "Update" && <UpdateEventCard />}
      {eventAlertDialogOpen === "Delete" && <DeleteEventCard />}
    </div>
  );
}

export default CalendarApp;
