"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRef } from "react";
import { useUserContext } from "@/context/userContext";
import useEventValidation from "@/hooks/events/useEventValidation";
import { updateEvent } from "@/actions/events/eventAction";
import { Event } from "@/types/types";
import { useEventContext } from "@/context/eventsContext";
export default function UpdateEventCard() {
 
  const { eventValidation, emptyFields } = useEventValidation();
  const { setAlertDialogOpen } = useUserContext();
  const {
    events,
    editingEventId,
    setEditingEventId,
    setEventsChanges,
    setEventAlertDialogOpen,
  } = useEventContext();
  const [eventDetails, setEventDetails] = useState<Event>({
    id: "",
    title: "",
    start: "",
    end: "",
    description: "",
  });
  const handlePickerOpen = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current && !ref.current.readOnly) {
      ref.current.showPicker();
    }
  };
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const handleEventUpdate = async (e: React.FormEvent) => {
   
    e.preventDefault();
    const eventObj = eventValidation(e);
    if (!eventObj) {
      return;
    }

    const res = await updateEvent(
      eventObj.title,
      eventObj.start,
      eventObj.end,
      eventObj.description,
      editingEventId
    );
    if (!res.data) {
      console.log("Adding Event Failed");
      return;
    }
    setEventsChanges((val) => val + 1);

    setEditingEventId(null);
    if (e.currentTarget) {
      (e.currentTarget as HTMLFormElement).reset();
    }
  };
  const handleEventUpdateAlertClose = () => {
    setAlertDialogOpen(false)
    setEventAlertDialogOpen(null);
    if (editingEventId) {
      setEditingEventId(null);
    }
  };

  useEffect(() => {
   
    const selectedEvent: Event[] = events?.filter(
      (event) => event.id === editingEventId
    ) || [];
    if(!selectedEvent){
      return
    }
    if (selectedEvent.length > 0) {
      setEventDetails(selectedEvent[0]);
    }
  }, [editingEventId, events]);
  return (
    <Card className=" bg-gray-900 p-4 rounded-xl fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 text-white max-h-[80vh] overflow-y-auto">
      <CardHeader className="p-0 flex flex-row justify-between  w-[30rem] max-sm:!w-[18rem] max-md:w-[24rem] items-center">
        <div className="flex flex-col gap-2">
          <CardTitle>Update Event</CardTitle>
          <CardDescription>Update Your Existing Events!</CardDescription>
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
      <Accordion
        className="max-h-[28rem] event-update-accrodion overflow-y-scroll custom-scrollbar"
        type="single"
        collapsible
      >
        {events && events.length > 0 ? (
          events.map((event) => (
            <AccordionItem key={event.id} value={event.id}>
              <AccordionTrigger>{event.title}</AccordionTrigger>
              <AccordionContent>
                <div className=" rounded-xl w-full  max-w-lg bg-slate-200 border-[1px] border-gray-500 shadow-sm">
                  <div className="flex justify-between items-center border-b p-2 px-4 bg-slate-300 rounded-b-none rounded-xl">
                    <h3 className="font-semibold text-black  ">
                      Event details
                    </h3>

                    <button
                      onClick={() => setEditingEventId(event.id)}
                      className=" flex items-center gap-2 text-black text-sm hover:underline"
                    >
                      <Image
                        src="/images/pencil.svg"
                        alt="pencil"
                        width={20}
                        height={20}
                      />
                      Edit
                    </button>
                  </div>
                  <div className="px-4 py-4 bg-slate-200 rounded-b-xl">
                    <form
                      onSubmit={handleEventUpdate}
                      className=" flex flex-col gap-4"
                    >
                      <div className="flex flex-row gap-4 text-black items-center ">
                        <label htmlFor="title" className="text-[1rem]">
                          Title:
                        </label>
                        <input
                          name="eventName"
                          id="title"
                          type="text"
                          readOnly={!(editingEventId === event.id)}
                          onChange={(e) =>
                            setEventDetails((val) => ({
                              ...val,
                              title: e.target.value,
                            }))
                          }
                          value={
                            editingEventId === event.id
                              ? eventDetails.title
                              : event.title
                          }
                          className={`p-2 px-4 w-full rounded-xl border-black border-[1px] ${
                            editingEventId === event.id
                              ? "bg-slate-100"
                              : "bg-slate-300"
                          } outline-none `}
                        />
                      </div>
                      <div className="flex flex-row gap-4 text-black items-center relative">
                        <Label htmlFor="start-date">Start Date:</Label>
                        <input
                          value={
                            editingEventId === event.id
                              ? eventDetails.start
                              : event.start
                          }
                          ref={startDateRef}
                          type="datetime-local"
                          id="start-date"
                          name="startDate"
                          readOnly={!(editingEventId === event.id)}
                          onChange={(e) =>
                            setEventDetails((val) => ({
                              ...val,
                              start: e.target.value,
                            }))
                          }
                          className={`bg-transparent text-black  px-3 py-[0.5rem] rounded-xl border-black border-[1px] placeholder:text-gray-400 appearance-none w-[80%] ${
                            editingEventId === event.id
                              ? "bg-slate-100"
                              : "bg-slate-300"
                          } ${emptyFields.startDate ? "border-red-500" : ""}`}
                        />
                        <button
                          type="button"
                          className="absolute right-[5%] top-[20%]"
                          onClick={() => handlePickerOpen(startDateRef)}
                        >
                          <Image
                            alt="calendar"
                            src="/images/calendar-black.svg"
                            width={25}
                            height={25}
                          />
                        </button>
                      </div>
                      <div className="flex flex-row gap-4 text-black items-center relative">
                        <Label htmlFor="start-date">End Date:</Label>
                        <input
                          value={
                            editingEventId === event.id
                              ? eventDetails.end
                              : event.end
                          }
                          onChange={(e) =>
                            setEventDetails((val) => ({
                              ...val,
                              end: e.target.value,
                            }))
                          }
                          readOnly={!(editingEventId === event.id)}
                          ref={endDateRef}
                          type="datetime-local"
                          id="end-date"
                          name="endDate"
                          className={`bg-transparent text-black px-3 py-[0.5rem] rounded-xl border-black border-[1px] placeholder:text-gray-400 appearance-none w-[80%] ${
                            editingEventId === event.id
                              ? "bg-slate-100"
                              : "bg-slate-300"
                          } ${emptyFields.startDate ? "border-red-500" : ""}`}
                        />
                        <button
                          type="button"
                          className="absolute right-[5%] top-[20%]"
                          onClick={() => handlePickerOpen(endDateRef)}
                        >
                          <Image
                            alt="calendar"
                            src="/images/calendar-black.svg"
                            width={25}
                            height={25}
                          />
                        </button>
                      </div>
                      <div className="flex flex-row gap-4 text-black items-center ">
                        <label htmlFor="description" className="text-[1rem]">
                          Description:
                        </label>
                        <textarea
                          onChange={(e) =>
                            setEventDetails((val) => ({
                              ...val,
                              description: e.target.value,
                            }))
                          }
                          id="description"
                          name="description"
                          readOnly={!(editingEventId === event.id)}
                          value={
                            editingEventId === event.id
                              ? eventDetails.description
                              : event.description
                          }
                          className={`p-2 max-h-[4rem] px-4 border-black border-[1px] rounded-xl w-full ${
                            editingEventId === event.id
                              ? "bg-slate-100"
                              : "bg-slate-300"
                          } outline-none `}
                        />
                      </div>

                      {editingEventId === event.id && (
                        <div className="flex flex-row justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => setEditingEventId(null)}
                            className="primary-btn bg-slate-300  text-black font-normal"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="primary-btn bg-slate-300  text-black font-normal"
                          >
                            Update
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <p className="mt-4 text-center">No Events To update</p>
        )}
      </Accordion>
    </Card>
  );
}
