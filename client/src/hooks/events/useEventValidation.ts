import { useState } from "react";


const useEventValidation = (
 
) => {
  const [emptyFields, setEmptyFields] = useState<Record<string, boolean>>({})
  const eventValidation = ( e: React.FormEvent) => {
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const eventName: string | null = formData.get("eventName")?.toString() || "";
    const startDate: string | null = formData.get("startDate")?.toString() || "";
    const endDate: string | null = formData.get("endDate")?.toString() || "";
    const description: string | null =
      formData.get("description")?.toString() || "";
    if (!eventName || !startDate || !endDate || !description) {
      const newEmptyFields = {
        // Create a new errors object
        eventName: !eventName,
        startDate: !startDate,
        endDate: !endDate,
        description: !description,
      };
      setEmptyFields(newEmptyFields);

      console.log("All fields are required");
      return false;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      console.log("Start Date cannot be greater than end date");
      return false;
    }
    const eventObj = {
      title: eventName,
      start: formData.get("startDate")!,
      end: formData.get("endDate")!,
      description,
    };
    return eventObj;
  };
  return {eventValidation, emptyFields}
};

export default useEventValidation