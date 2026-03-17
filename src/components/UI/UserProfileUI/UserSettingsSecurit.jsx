import { KeyRoundIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../UI/PasswordInput";
import { useState } from "react";
import { changePassword } from "../../../APIs/profileAPI";
import Loading from "../../Layout/LoadingLayout";
import ErrorDialog from "../../Dialogs/ErrorDialog";

function UserSettingsSecurity() {
  const navigate = useNavigate();
  const [passwordchanging, setpasswordchanging] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChangePassword = async () => {
    const newErrors = {};
    if (!oldPassword) newErrors.oldPassword = "Old password is required.";
    if (!newPassword) newErrors.newPassword = "New password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        // Call API to change password
        const response = await changePassword({ oldPassword, newPassword, confirmPassword});
        console.log("Changing password...",response);
        navigate("/profile");
      } catch (error) {
        console.error("Error changing password:", error);
        const message =
          error.response?.data?.error ||
          "Something went wrong while changing password.";
        setDialogMessage(message);
        setopenDialog(true);
      }
        finally {
          setLoading(false);
        }
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Security</h2>
        <p className="text-sm text-slate-500">
          Protect your account with a strong password.
        </p>
      </div>

      <div className={`p-6 flex flex-col gap-6 ${ passwordchanging && 'border-b border-slate-200' }`}>
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <KeyRoundIcon color="#BB52E0" size={24} />
            </div>

            <div className="flex flex-col">
              <p className="font-semibold text-slate-900">Password</p>
              <p className="text-sm text-slate-500">
                
              </p>
            </div>
          </div>

          <button 
          onClick={()=>setpasswordchanging((prev)=>!prev)}
          className="px-4 py-2 text-sm font-bold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            Change
          </button>

        </div>
      </div>
      <div className={`p-6 flex flex-col gap-6 ${ !passwordchanging && 'hidden' }`}>

          {passwordchanging && (
            <div className="flex flex-col gap-6">
              <PasswordInput content="Old Password" id={"old-password"} password={oldPassword} setPassword={setOldPassword} errors={errors.oldPassword || null} />
              <PasswordInput content="New Password" id={"new-password"} password={newPassword} setPassword={setNewPassword} errors={errors.newPassword || null} />
              <PasswordInput content="Confirm Password" id={"confirm-password"} password={confirmPassword} setPassword={setConfirmPassword} errors={errors.confirmPassword || null} />
              <button 
              onClick={handleChangePassword}
              className="px-4 py-2 max-w-200 w-1/2 h-10 m-auto bg-linear-to-r from-primary to-secandry   text-white font-bold rounded-lg hover:opacity-90  hover:shadow-md transition-all duration-300 text-md ">
                Change Password
              </button>
            </div>
          )}
        
      </div>
          {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
          {loading && <Loading />}
    </section>
  );
}

export default UserSettingsSecurity;