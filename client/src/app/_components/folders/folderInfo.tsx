import { Info } from "@/hooks/useViewInfo";
import { useFolderContext } from "@/context/folderContext";

export default function FolderInfo({ info }: { info: Info[] | null }) {
  const { infoPosition } = useFolderContext();

  return (
    <div
      className="bg-slate-200 w-[16rem] top-0 z-10 px-4  absolute  rounded-xl"
      style={{ right: infoPosition.right }}
    >
      <ul>
        {info &&
          info.map((inf) => (
            <li
              key={inf.id}
              className={`flex flex-row items-center gap-2 py-3 border-b-[1px] last:border-none border-gray-400  cursor-pointer`}
            >
              <p className="font-semibold">{inf.infoName}:</p>
              <p>{inf.info}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}
