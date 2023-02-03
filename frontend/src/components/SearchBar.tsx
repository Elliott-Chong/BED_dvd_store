import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  setSearch: Dispatch<SetStateAction<string>>;
  setCategory: Dispatch<SetStateAction<string>>;
  search: string;
  category: string;
  rentalRate: number | "";
  setRentalRate: Dispatch<SetStateAction<number | "">>;
};

const SearchBar = ({
  setCategory,
  setSearch,
  search,
  category,
  rentalRate,
  setRentalRate,
}: Props) => {
  const [categories, setCategories] = React.useState<{ name: string }[]>([]);
  useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return axios.get(`/api/categories`);
    },
    onSuccess: (data: AxiosResponse) => {
      setCategories(data.data);
    },
  });
  return (
    <div className="flex gap-4">
      <div className="form-control w-full max-w-xs">
        <input
          autoFocus
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search for a film..."
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <input
          autoFocus
          onChange={(e) => setRentalRate(parseFloat(e.target.value))}
          value={rentalRate}
          type="number"
          placeholder="Max rental rate..."
          className="input input-bordered w-fit"
        />
      </div>
      <div className="form-control w-full max-w-fit">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered"
        >
          <option value={""}>All</option>
          {categories.map((category) => {
            return (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            );
          })}
        </select>
      </div>
      <button
        onClick={() => {
          setSearch("");
          setCategory("");
        }}
        className="btn btn-error"
      >
        Clear
      </button>
    </div>
  );
};

export default SearchBar;
