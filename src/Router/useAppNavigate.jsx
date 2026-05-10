import { useNavigate, useParams } from "react-router-dom";

export default function useAppNavigate() {
  const navigate = useNavigate();
  const { lang } = useParams();

  return (path, options) => {
    if(path==-1) return navigate(path, options);
    if (path.startsWith(`/${lang}`)) {
      return navigate(path, options);
    }

    return navigate(`/${lang}${path}`, options);
  };
}
