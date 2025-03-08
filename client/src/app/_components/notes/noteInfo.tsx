import { Info } from "@/hooks/useViewInfo";
export default function NoteInfo({ info }: { info: Info[] | null }) {
  return (
    <div className="bg-slate-200 w-[18rem] max-sm:w-[12rem] top-0 z-10 px-4  absolute right-[0rem] rounded-xl">
      <ul>
        {info &&
          info.map((inf) => (
            <li
              key={inf.id}
              className={`flex flex-row max-sm:py-2 items-center gap-2 py-3 border-b-[1px] last:border-none border-gray-400  cursor-pointer`}
            >
              <p className="font-semibold  max-sm:text-[0.8rem]">
                {inf.infoName}:
              </p>
              <p className="w-[9rem] text-ellipsis overflow-hidden max-sm:text-[0.8rem]">
                {inf.info}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}
