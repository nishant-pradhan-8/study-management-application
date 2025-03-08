const TableLoadingSkeleton = () => {
    return (
      <table className="w-full rounded-xl border-spacing-y-2 border-separate">
       
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td>
                <div className="flex items-center">
                  <div className="bg-gray-300 rounded-[8px] p-2 mr-2 w-10 h-10"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                </div>
              </td>
              <td>
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
              </td>
              <td>
                <div className="h-4 w-12 bg-gray-300 rounded"></div>
              </td>
              <td>
                <div className="h-4 w-28 bg-gray-300 rounded"></div>
              </td>
              <td>
                <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default TableLoadingSkeleton;
  