import { Dispatch, useState } from "react";
import { User } from "@/types/types";
import nextBackEndApiCall from "@/utils/nextBackEndApi";
import { updateProfile } from "@/actions/users/usersAction";
import { SetStateAction } from "preact/compat";
import { useEffect } from "react";
export default function useProfileUpdate({
  user,
  setUser,
}: {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}) {
  const [update, setUpdate] = useState<User | null>(null);
  const [changedFields, setChangedFields] = useState<Partial<User>>({});
  const [profilePictureChanged, setProfilePictureChanged] = useState<
    File | string | null
  >(null);
  const [tempUrl, setTempUrl] = useState<string>();
  const [saving, setSaving] = useState<boolean>(false);
  const [imageSizeExceeded, setImageSizeExceeded] = useState<boolean>(false);

  const handleUpdateProfileDetails = async (e: React.FormEvent) => {
    if (!user) {
      return console.log("No user found");
    }
    e.preventDefault();
    setSaving(true);
    let updates = changedFields;

    if (profilePictureChanged) {
      if (profilePictureChanged === "Delete") {
        const res = await nextBackEndApiCall("/api/user", "DELETE", {
          downloadUrl: user.profilePicture,
        });
        if (res.status === "success") {
          updates = { ...updates, profilePicture: "" };
        } else {
          setSaving(false);
          return;
        }
      } else {
        const formData = new FormData();
        formData.append("profilePicture", profilePictureChanged);
        formData.append("userId", user._id);
        const res = await nextBackEndApiCall("/api/user", "POST", formData);
        const data = res.data;
        if (data) {
          updates = { ...updates, profilePicture: data.data };
        } else {
          setSaving(false);
          return;
        }
      }
    }

    const res = await updateProfile(updates);
    if (res.status === "error") {
      return console.log("Unexpected Error Occured");
    }

    setUser(
      (val) =>
        ({
          ...val,
          ...updates,
        } as User)
    );
    setProfilePictureChanged(null);
    setTempUrl(undefined);
    setSaving(false);
    setChangedFields({});
  };

  const handleProfilePictureUpdate = (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = function () {
          if (img.width <= 600 && img.height <= 600) {
            console.log("Image is under 600x600.");
            setTempUrl(e.target?.result as string);
            setImageSizeExceeded(false);
            setProfilePictureChanged(file);
          } else {
            setImageSizeExceeded(true);
            console.log("Image exceeds 600x600.");
          }
        };

        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureDelete = async () => {
    setUpdate((val) => ({ ...val, profilePicture: "" } as User));
    setProfilePictureChanged("Delete");
  };

  useEffect(() => {
    setUpdate(user);
  }, [user]);

  const handleUpdate = (field: keyof User, value: string) => {
    setUpdate((val) => (val ? { ...val, [field]: value } : null));
    
    setChangedFields((prev) => {
      const isSameAsOriginal = user && user[field] === value;
    
      return isSameAsOriginal
        ? Object.fromEntries(Object.entries(prev).filter(([key]) => key !== field))
        : { ...prev, [field]: value };
    });
    
  };

  return {
    changedFields,
    update,
    tempUrl,
    saving,
    imageSizeExceeded,
    profilePictureChanged,
    handleUpdateProfileDetails,
    handleUpdate,
    handleProfilePictureDelete,
    handleProfilePictureUpdate,
  };
}
