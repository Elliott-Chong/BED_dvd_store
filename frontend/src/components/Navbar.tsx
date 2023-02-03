import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { useGlobalContext } from "../context";

type Props = {};

const Navbar = (props: Props) => {
  const { logOut, state, setAlert } = useGlobalContext();
  const { is_authenticated } = state;

  const authenticated_titles = React.useMemo(() => {
    return (
      <div className="flex gap-4 items-center">
        {state.user && (
          <>
            <Link className="btn btn-sm btn-secondary" to="/add/actor">
              Add actor
            </Link>
            <Link className="btn btn-sm btn-secondary" to="/add/customer">
              Add customer
            </Link>
            <Link className="btn btn-outline btn-sm" to="/transactions">
              Transactions
            </Link>
          </>
        )}
        <ArrowLeftOnRectangleIcon
          className="h-6 w-6 cursor-pointer float-anim"
          onClick={logOut}
        />
      </div>
    );
  }, []);
  const unauthenticated_titles = React.useMemo(() => {
    return (
      <div className="flex gap-4 items-center">
        <Link to="/login" className="btn btn-outline btn-sm">
          Login
        </Link>
      </div>
    );
  }, []);

  return (
    <nav className="text-white items-center py-6 px-12 font-inter gap-6 flex">
      <Link
        to="/"
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
      >
        BED DVD
      </Link>
      <button
        onClick={() => {
          let themes = [
            "light",
            "dark",
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "black",
            "luxury",
            "dracula",
            "cmyk",
            "autumn",
            "business",
            "acid",
            "lemonade",
            "night",
            "coffee",
            "winter",
          ];
          let theme = themes[Math.floor(Math.random() * themes.length)];
          setAlert("success", `Theme changed to ${theme}!`);
          document.documentElement.setAttribute("data-theme", theme);
        }}
        className="btn btn-sm"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
          Random theme
        </span>
      </button>
      <select
        onChange={(e) => {
          let theme = e.target.value;
          setAlert("success", `Theme changed to ${theme}!`);
          document.documentElement.setAttribute("data-theme", theme);
        }}
        name="theme"
        id="theme"
        className="select select-bordered w-fit select-sm"
      >
        {[
          "light",
          "dark",
          "cupcake",
          "bumblebee",
          "emerald",
          "corporate",
          "synthwave",
          "retro",
          "cyberpunk",
          "valentine",
          "halloween",
          "garden",
          "forest",
          "aqua",
          "lofi",
          "pastel",
          "fantasy",
          "wireframe",
          "black",
          "luxury",
          "dracula",
          "cmyk",
          "autumn",
          "business",
          "acid",
          "lemonade",
          "night",
          "coffee",
          "winter",
        ].map((theme, idx) => {
          return (
            <option key={idx} value={theme}>
              {theme}
            </option>
          );
        })}
      </select>
      <div className="ml-auto">
        {is_authenticated ? authenticated_titles : unauthenticated_titles}
      </div>
    </nav>
  );
};

export default Navbar;
