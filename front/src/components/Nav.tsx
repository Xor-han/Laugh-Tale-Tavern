import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <>
      <ul className="flex gap-8 text-sm text-center items-center">
        <li className="hover:text-yellow-400">
          <Link to={"/arcs"}>Arcs</Link>
        </li>
        <li className="hover:text-red-400">
          <Link to={"/personnages"}>Personnages</Link>
        </li>
        <li className="hover:text-blue-400">
          <Link to={"/équipages-pirates"}>Equipages Pirates</Link>
        </li>
        <li className="hover:text-slate-400">
          <Link to={"/organisations"}>Organisations</Link>
        </li>
        <li className="hover:text-purple-400">
          <Link to={"/fruits-du-démon"}>Fruits du démon</Link>
        </li>
      </ul>
    </>
  );
};
