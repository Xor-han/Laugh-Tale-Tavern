import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <>
      <ul className="flex gap-8 text-sm text-center items-center">
        <li className="hover:text-yellow-400">
          <Link to={"/"}>Arcs</Link>
        </li>
        <li className="hover:text-red-400">
          <Link to={"/"}>Personnages</Link>
        </li>
        <li className="hover:text-blue-400">
          <Link to={"/"}>Equipages Pirates</Link>
        </li>
        <li className="hover:text-slate-400">
          <Link to={"/"}>Organisations</Link>
        </li>
        <li className="hover:text-purple-400">
          <Link to={"/"}>Fruits du démon</Link>
        </li>
      </ul>
    </>
  );
};
