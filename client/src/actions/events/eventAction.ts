import apiCall from "@/utils/backEndApiHandler";

export const addEvent = async (
  title: string,
  start: FormDataEntryValue,
  end: FormDataEntryValue,
  description: string
) => {
  const { data } = await apiCall(`/api/events/addEvent`, "POST", {
    title,
    start: start.toString(),
    end: end.toString(),
    description,
  });
  return data;
};

export const getEvents = async () => {
  const { data } = await apiCall(`/api/events/getEvents`, "GET", null);
  return data;
};

export const updateEvent = async (
  title: string,
  start: FormDataEntryValue,
  end: FormDataEntryValue,
  description: string,
  id: string | null
) => {
  const { data } = await apiCall(`/api/events/updateEvent`, "PATCH", {
    id,
    title,
    start: start.toString(),
    end: end.toString(),
    description,
  });
  return data;
};

export const deleteEvent = async (eventsToDelete: string[]) => {
  const { data } = await apiCall(`/api/events/deleteEvents`, "DELETE", {
    eventsToDelete,
  });
  return data;
};
