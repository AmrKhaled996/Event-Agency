import { useState } from "react";
import Dialog from "../UI/Dialog";


export default function DeleteAccountDialog({ open, onClose, onConfirm }) {
const [inputValue, setInputValue] = useState("");

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 ">
      
        <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-4 font-bold text-red-500">
          Are you sure you want to delete your account?
        </p>
        <input
          type="text"
          placeholder="Type 'delete' to confirm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        {(inputValue !== "delete" )&& (inputValue  !== "") && (
          <small className="text-red-400 m-2 block">
            This action cannot be undone. Please type "delete" to confirm.
          </small>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (inputValue === "delete") {
                onConfirm();
              } else {
                alert("You must type 'delete' to confirm!");
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
    </Dialog>
  );
}
