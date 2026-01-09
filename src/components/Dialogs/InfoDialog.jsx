import Dialog from "../UI/Dialog";

export default function InfoDialog({ open, onClose, event }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">Event Details</h3>
      <p className="text-gray-600 mb-4">Event ID: {event}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}
