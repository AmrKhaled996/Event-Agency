import ErrorDialog from "../Dialogs/ErrorDialog";
import Loading from "./LoadingLayout";

function UserProfileMainLayout({ children, openDialog, dialogMessage, loading ,setopenDialog}) {
  return (
    <main className="flex-1 max-w-5xl m-auto py-10 drop-shadow-lg">
      {children}
            {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
      {loading && <Loading />}
    </main>
  );
}

export default UserProfileMainLayout;