const FolderSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="folder-card w-full relative animate-pulse flex flex-col gap-4">
        <div className="folder-icon-div w-full flex items-center space-x-2">
          <div className="bg-gray-300 rounded w-6 h-6"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="folder-card w-full relative animate-pulse flex flex-col gap-4">
        <div className="folder-icon-div w-full flex items-center space-x-2">
          <div className="bg-gray-300 rounded w-6 h-6"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default FolderSkeleton;
