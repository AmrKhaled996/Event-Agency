import { useNavigate, useParams } from "react-router-dom";

export default function useAppNavigate() {
  const navigate = useNavigate();
  const { lang } = useParams();

  return (path, options) => {
    // لو path already فيه lang سيبه
    if (path.startsWith(`/${lang}`)) {
      return navigate(path, options);
    }

    return navigate(`/${lang}${path}`, options);
  };
}
