import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="bg-black text-white py-6 px-12 font-inter">
      <Link to="/" className="text-2xl font-bold">
        DeeVeeDee
      </Link>
    </nav>
  );
};

export default Navbar;
