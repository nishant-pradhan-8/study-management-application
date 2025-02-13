import CalendarApp from "./components/calendar";
import CalendarHeading from "./components/calendarHeading";
import EventInputCard from "./components/eventInputCard";
import UpdateEventCard from "./components/updateEventCard";
export default function Calendar(){
    return(
        <div className="flex flex-col gap-4">
            <CalendarHeading />
            <CalendarApp />
          
        </div>
    )
}/*  />*/