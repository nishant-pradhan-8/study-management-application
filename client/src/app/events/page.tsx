import CalendarApp from "./components/calendar";
import CalendarHeading from "./components/calendarHeading";
export default function Calendar() {
  return (
    <div className="flex flex-col gap-4">
      <CalendarHeading />
      <CalendarApp />
    </div>
  );
} /*  />*/
