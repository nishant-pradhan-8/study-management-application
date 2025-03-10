import { useRef, useState, useEffect } from "react";
export default function useMenu() {
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [infoVisible, setInfoVisible] = useState(false)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setSelectedMenuId(null);
       if (infoVisible) {
        setInfoVisible(false);
        }
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedMenuId, infoVisible]);
  return{selectedMenuId, setSelectedMenuId, menuRef,infoVisible, setInfoVisible }
}
