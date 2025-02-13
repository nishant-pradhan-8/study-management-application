'use client'

import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from "react";
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { useAppContext } from '@/context/context';
import EventInputCard from './eventInputCard';
import { Event } from '@/types/types';
import {format} from 'date-fns'
import { getEvents } from '@/actions/folderAction';
import UpdateEventCard from './updateEventCard';
import { updateEvent } from '@/actions/folderAction';
import DeleteEventCard from './deleteEventCard';
function CalendarApp() {
  const [eventsService] = useState(() => createEventsServicePlugin()); // Store eventsService separately
  const {eventAlertDialogOpen, setEvents, events, eventsChanges, editingEventId, setEventsChanges} = useAppContext()

   useEffect(()=>{
  
    const renderEvents = async()=>{
      const res = await getEvents();
      if(!res.data){
        console.log(res.error)
        return
      }
    
      const formattedRes = res.data.map((event: Event) => ({
       ...event,
       start: event.start ? format(new Date(event.start), "yyyy-MM-dd HH:mm") : "",
       end: event.end ? format(new Date(event.end), "yyyy-MM-dd HH:mm") : "",
     }));
    console.log(events)
     if(events.length>0){
      events.forEach((event:Event) => {
        eventsService.remove(event.id);
       });
     }
     
     formattedRes.forEach((event:Event) => {
      eventsService.add(event);
     });

      setEvents(formattedRes)
    }
     renderEvents()
  },[eventsChanges])


    
  const calendar = useNextCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
   
    plugins: [eventsService, createEventModalPlugin(), createDragAndDropPlugin()], 
    callbacks:{
        onEventUpdate(updatedData) {
             const update = async()=>{
              console.log(updatedData)
              if(!updatedData.title || !updatedData.description || !updatedData.id){
                console.log('All the fields are required!')
                return
              }
            const res = await updateEvent(updatedData.title, updatedData.start, updatedData.end, updatedData.description, updatedData.id.toString())
            if(!res.data) {
              console.log('Adding Event Failed')
              return
            }
            console.log("Events Added Sucessfully")
        
             }
            update()
          },
    }
  });

 
   
    
  useEffect(() => {
    if (eventsService) {
      eventsService.getAll(); 
    }
}, [eventsService]);

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
      {eventAlertDialogOpen ==="Create" && <EventInputCard />}
        {eventAlertDialogOpen === "Update" && <UpdateEventCard />}
        {eventAlertDialogOpen === "Delete" &&  <DeleteEventCard />}
       
    </div>
  )
}

export default CalendarApp;
