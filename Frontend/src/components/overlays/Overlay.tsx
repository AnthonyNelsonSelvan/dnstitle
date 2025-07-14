import { X } from "lucide-react";

interface Props {
  title: string;
  message: string;
  onClose?: () => void;
  showClose: boolean;
  onLogout? : () => void;
  showLogout? : boolean;
}

const Overlay = ({ title, message, onClose, showClose = true,onLogout,showLogout = false }: Props) => {
  return (
    <div>
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="overlay-title"
        aria-describedby="overlay-message"
      >
        <div className="relative bg-yellow-400 text-black p-6 rounded shadow-lg max-w-md w-[90%] text-center">
          {showClose && onClose && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-black hover:text-red-600"
              aria-label="Close overlay"
            >
              <X size={20} />
            </button>
          )}
          <h1 id="overlay-title" className="text-2xl font-bold mb-2">
            {title}
          </h1>
          <p id="overlay-message" className="text-base">
            {message}
          </p>
          {showClose && onClose && (
            <button
              onClick={onClose}
              className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Close
            </button>
          )}
          {showLogout && (<button
                className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                onClick={onLogout}
              >
                Logout
              </button>)}
        </div>
      </div>
    </div>
  );
};

export default Overlay;
