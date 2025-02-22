export default function NotesSkeleton(){
    return(
        <div className="w-full animate-pulse">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex flex-row items-center gap-4  py-2 w-full"
          >
            {/* Icon Placeholder */}
            <div className="w-[25px] h-[25px] bg-gray-300 rounded mr-2"></div>
    
            {/* Text Placeholder */}
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
}