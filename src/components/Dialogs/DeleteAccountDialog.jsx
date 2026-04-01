import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "../UI/Dialog";
import PasswordInput from "../UI/PasswordInput";
import { deleteMyProfile } from "../../APIs/profileAPI";
import { removeTokens } from "../../services/cookieTokenService";

export default function DeleteAccountDialog({ open, onClose }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    // ✅ validate password input
    if (!inputValue) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await deleteMyProfile(inputValue);
      console.log(response);

      removeTokens();

      alert("Your account has been deleted successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to delete account. Please check your password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInputValue("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>

      <p className="mb-4 font-bold text-red-500">
        This action cannot be undone. Please enter your password to confirm.
      </p>

      <PasswordInput
        content={"password"}
        id={"deleteAccountPassword"}
        password={inputValue}
        setPassword={(val) => {
          setInputValue(val);
          setError("");
        }}
        errors={error}
      />

      {error && (
        <small className="text-red-400 m-2 block">{error}</small>
      )}

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={handleClose}
          disabled={loading}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteAccount}
          disabled={loading || !inputValue}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Dialog>
  );
}