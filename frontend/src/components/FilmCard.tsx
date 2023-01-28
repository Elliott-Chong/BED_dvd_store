import React from "react";
import { Link } from "react-router-dom";

type Props = {
  film: any;
};

const FilmCard = ({ film }: Props) => {
  const slug = film.title.toLowerCase().replace(/ /g, "-");
  return (
    <div className="card bg-base-100 rounded-sm ring ring-primary shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{film.title}</h2>
        <p className="text-sm">{film.description}</p>
        <div className="flex gap-2">
          {/* category */}
          <div className="badge badge-secondary">{film.name}</div>
          <div className="badge badge-primary badge-outline">{film.rating}</div>
        </div>
        <div className="card-actions mt-2 justify-start">
          <Link
            to={`/films/${slug}`}
            className="btn btn-primary btn-sm rounded-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FilmCard;
