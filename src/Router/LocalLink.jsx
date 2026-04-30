import { Link, useParams } from "react-router-dom";

export default function LocalLink({ to, ...props }) {
  const { lang } = useParams();

  const newTo = to.startsWith(`/${lang}`) ? to : `/${lang}${to}`;

  return <Link to={newTo} {...props} />;
}