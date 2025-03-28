import React from "react";
import Cookies from "js-cookie";

function DeleteModule({ showModal, handleClose, handleDelete, id }) {
  const lang = Cookies.get('lang') || 'en';

  return (
    <div
    className={`fixed inset-0 z-50 flex items-center justify-center ${showModal ? "block" : "hidden"}`}
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // semi-transparent background
    onClick={handleClose} // Close on background click
  >    <div className="relative p-4 w-full max-w-md max-h-full">
    <div
        className="relative p-4 w-full max-w-md bg-white rounded-lg shadow"
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
      >            <button onClick={handleClose}type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor"  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>           
            </button>

            <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor"   d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{lang ==='ar'? "هل انت متاكد من حذف هذا العنصر" : "Are you sure you want to delete this item?  "}</h3>
                <button onClick={() => { 
  handleDelete(id); 
  handleClose(); 
}} className="bg-red-600 text-white px-4 py-2 rounded m-2">
   {lang ==='ar'? "حذف" : " Delete "}
</button>

                <button onClick={handleClose} className="bg-gray-300 px-4 py-2 rounded">
           {lang ==='ar'? "الغاء" : " Cancel  "}
          </button>            </div>
        </div>
    </div>
</div>
  );
}

export default DeleteModule;
