"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { useState } from "react";
import { useUserContext } from "@/context/userContext";
import { deleteEvent } from "@/actions/events/eventAction";
import { useEventContext } from "@/context/eventsContext";
export default function DeleteEventCard() {
  const [eventsToDelete, setEventsToDelete] = useState<string[]>([]);
  const {
    events,
    editingEventId,
    setEditingEventId,
    setEventsChanges,
    setEventAlertDialogOpen,
  } = useEventContext();
  const { setAlertDialogOpen } = useUserContext();

  const handleEventUpdateAlertClose = () => {
    setAlertDialogOpen(false);
    setEventAlertDialogOpen(null);
    if (editingEventId) {
      setEditingEventId(null);
    }
  };

  const handleDeleteEventsSelect = (eventId: string) => {
    setEventsToDelete((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleEventDelete = async () => {
    const res = await deleteEvent(eventsToDelete);

    if (res.status === "error") {
      console.log("Event Deletion Failed");
      return;
    }
    setEventsChanges((val) => val + 1);
    setAlertDialogOpen(false)
     setEventAlertDialogOpen(null);
  };
  return (
    <Card className=" bg-gray-900 p-4 rounded-xl fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 text-white  w-[30rem] max-sm:!w-[18rem] max-md:w-[24rem] max-h-[80vh] overflow-y-auto">
      <CardHeader className="p-0 flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <CardTitle>Delete Events</CardTitle>
          <CardDescription>Delete Your Existing Events!</CardDescription>
        </div>
        <a className="cursor-pointer" onClick={handleEventUpdateAlertClose}>
          <Image
            src="/images/cross-white.svg"
            alt="cross"
            width={25}
            height={25}
          />
        </a>
      </CardHeader>
      <CardContent className="p-0 max-h-[28rem] overflow-y-scroll custom-scrollbar">
        {events && events.length > 0 ? (
          events.map((event) => (
            <label
              key={event.id}
              htmlFor={event.id}
              className="w-full friends-share-checkbox rounded-xl peer-checked:border-2 flex flex-row justify-between items-center cursor-pointer"
            >
              <div className="mt-4 flex flex-row items-center gap-2">
                <div className="text-white">
                  <p className="font-semibold">{event.title}</p>
                </div>
              </div>
              <input
                onChange={() => handleDeleteEventsSelect(event.id)}
                id={event.id}
                type="checkbox"
              />
            </label>
          ))
        ) : (
          <p>No Events to Display</p>
        )}
      </CardContent>
      <CardFooter className="p-0 mt-4">
        <div className="flex flex-row justify-end w-full">
          <button
            onClick={handleEventDelete}
            className="primary-btn text-black"
          >
            Delete
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
/*
      
    
          <CardContent>
            <form >
              <div className="grid w-full items-center gap-4">
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input name="eventName" className={`placeholder:text-gray-400 ${emptyField.eventName ? 'border-red-500' : ''}`} id="name" placeholder="Name of your event" />
                </div>
    
                <div className="flex flex-col gap-2 relative">
                  <Label htmlFor="start-date">Start Date</Label>
                  <input
                    
                    type="datetime-local"
                    id="start-date"
                    name="startDate"
                    className={`bg-transparent text-white px-3 py-[0.5rem] rounded-xl border-white border-[1px] placeholder:text-gray-400 appearance-none w-full ${emptyField.startDate ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    className="absolute icon-white right-[2%] top-[47%]"
                    
                  >
                    <Image
                      alt="calendar"
                      src="/images/calendar.svg"
                      width={25}
                      height={25}
                    />
                  </button>
                </div>
    
                <div className="flex flex-col gap-2 relative">
                  <Label htmlFor="end-date">End Date</Label>
                  <input
                   
                    type="datetime-local"
                    id="end-date"
                    className={`bg-transparent text-white px-3 py-[0.5rem] rounded-xl border-white border-[1px] placeholder:text-gray-500 appearance-none w-full ${emptyField.endDate ? 'border-red-500' : ''}`}
                    name="endDate"
                  />
                  <button
                    type="button"
                    className="absolute icon-white right-[2%] top-[47%] "
                   
                  >
                    <Image
                      alt="calendar"
                      src="/images/calendar.svg"
                      width={25}
                      height={25}
                    />
                  </button>
                </div>
    
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="text-area">Event Description</Label>
                  <textarea
                    id="text-area"
                    className={`bg-transparent text-white px-3 py-[0.5rem] rounded-xl border-white border-[1px] placeholder:text-gray-500 ${emptyField.description ? 'border-red-500' : ''}`}
                    placeholder="Enter Event Description"
                      name="description"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-4">
            <button type="button"  >Cancel</button>
            <button type="submit" className="primary-btn text-black font-normal">Submit</button>
          </div >
            </form>
          </CardContent>
    
        
        </Card>*/
