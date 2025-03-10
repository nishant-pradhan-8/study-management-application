"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import Image from "next/image";
import { useUserContext } from "@/context/userContext";
import { addEvent } from "@/actions/events/eventAction";
import useEventValidation from "@/hooks/events/useEventValidation";
import { useEventContext } from "@/context/eventsContext";
export default function EventInputCard() {

  const { eventValidation, emptyFields } = useEventValidation();
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const { setEventAlertDialogOpen, setEventsChanges } = useEventContext();
  const { setAlertDialogOpen } = useUserContext();
  const handlePickerOpen = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };
  const submitEventInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventObj = eventValidation(e);
    if (!eventObj) {
      return;
    }
    const res = await addEvent(
      eventObj.title,
      eventObj.start,
      eventObj.end,
      eventObj.description
    );

    if (!res.data) {
      console.log("Adding Event Failed");
      return;
    }
    setEventsChanges((val) => val + 1);
    setEventAlertDialogOpen(null);
    setAlertDialogOpen(false);
    if (e.currentTarget) {
      (e.currentTarget as HTMLFormElement).reset();
    }
  };
 

  const handleEventAddCancel = () => {
    setEventAlertDialogOpen(null);
    setAlertDialogOpen(false);
  };
  return (
    <Card
      className="bg-gray-900 p-4 rounded-xl fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 text-white w-[30rem] max-sm:!w-[18rem] max-md:w-[24rem] 
max-h-[80vh] overflow-y-auto"
    >
      <CardHeader>
        <CardTitle>Create Event</CardTitle>
        <CardDescription>To not forget any Upcoming Events</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={submitEventInfo}>
          <div className="grid w-full items-center gap-4">
            {/* Event Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                name="eventName"
                className={`placeholder:text-gray-400 ${
                  emptyFields.eventName ? "border-red-500" : ""
                }`}
                id="name"
                placeholder="Name of your event"
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-2 relative">
              <Label htmlFor="start-date">Start Date</Label>
              <input
                ref={startDateRef}
                type="datetime-local"
                id="start-date"
                name="startDate"
                className={`bg-transparent text-white px-3 py-[0.5rem] rounded-xl  border-[1px] placeholder:text-gray-400 appearance-none w-full ${
                  emptyFields.startDate ? "border-red-500" : "border-white"
                }`}
              />
              <button
                type="button"
                className="absolute icon-white right-[2%] top-[47%]"
                onClick={() => handlePickerOpen(startDateRef)}
              >
                <Image
                  alt="calendar"
                  src="/images/calendar.svg"
                  width={25}
                  height={25}
                />
              </button>
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-2 relative">
              <Label htmlFor="end-date">End Date</Label>
              <input
                ref={endDateRef}
                type="datetime-local"
                id="end-date"
                className={`bg-transparent text-white px-3 py-[0.5rem] rounded-xl  border-[1px] placeholder:text-gray-500 appearance-none w-full ${
                  emptyFields.endDate ? "border-red-500" : "border-white"
                }`}
                name="endDate"
              />
              <button
                type="button"
                className="absolute icon-white right-[2%] top-[47%] "
                onClick={() => handlePickerOpen(endDateRef)}
              >
                <Image
                  alt="calendar"
                  src="/images/calendar.svg"
                  width={25}
                  height={25}
                />
              </button>
            </div>

            {/* Event Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="text-area">Event Description</Label>
              <textarea
                id="text-area"
                className={`bg-transparent text-white px-3 py-[0.5rem] rounded-xl border-white border-[1px] placeholder:text-gray-500 ${
                  emptyFields.description ? "border-red-500" : "border-white"
                }`}
                placeholder="Enter Event Description"
                name="description"
              />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button type="button" onClick={() => handleEventAddCancel()}>
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn text-black font-normal"
            >
              Submit
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
