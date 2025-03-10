import { Dispatch, SetStateAction } from "react";
const useFileValidation = () => {
  const fileValidation = (
    files: File[],
    acceptedFileTypes: string[],
    setPopUpMessage: Dispatch<
      SetStateAction<{ success: boolean; message: string } | null>
    >
  ) => {
    const formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const fileSizeInMB = Number((files[i].size / (1024 * 1024)).toFixed(2));
      if (acceptedFileTypes.includes(files[i].type) && fileSizeInMB < 25) {

        formData.append("file", files[i]);
      } else {
        if (!acceptedFileTypes.includes(files[i].type)) {
          setPopUpMessage({
            success: false,
            message: "Some File couldn't be Uploaded due to Unsupported Format",
          });
        } else {
          setPopUpMessage({
            success: false,
            message: "Some File couldn't be Uploaded due to Large Size",
          });
        }
      }
    }
    setInterval(() => {
      setPopUpMessage(null);
    }, 5000);
    return formData;
  };

  return { fileValidation };
};
export default useFileValidation;
