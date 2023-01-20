import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { useGlobalContext } from "../context";

type Props = {};

const Navbar = (props: Props) => {
  const { logOut, state } = useGlobalContext();
  const { is_authenticated } = state;

  const authenticated_titles = React.useMemo(() => {
    return (
      <ArrowLeftOnRectangleIcon
        className="h-6 w-6 cursor-pointer float-anim"
        onClick={logOut}
      />
    );
  }, []);

  return (
    <nav className="text-white py-6 px-12 font-inter flex">
      <Link to="/" className="text-2xl font-bold">
        DeeVeeDee
      </Link>
      <div className="ml-auto">{is_authenticated && authenticated_titles}</div>
    </nav>
  );
};

export default Navbar;
