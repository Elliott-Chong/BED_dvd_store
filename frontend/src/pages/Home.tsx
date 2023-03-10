import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import useDebounce from "../hooks/useDebounce";
import FilmCard from "../components/FilmCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
type Props = {};
const PER_PAGE = 8;

const Home = (props: Props) => {
  const [page, setPage] = React.useState<number>(1);
  const [films, setFilms] = React.useState<any>([]);
  const [search, setSearch] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [rentalRate, setRentalRate] = React.useState<number | "">("");
  const debouncedSearch = useDebounce(search, 500);
  const debouncedRentalRate = useDebounce(rentalRate, 500);

  const { isLoading, isPreviousData } = useQuery({
    queryKey: ["films", page, debouncedSearch, category, debouncedRentalRate],
    queryFn: () => {
      return axios.get(
        `/api/films?per_page=${PER_PAGE}&page=${page}&search=${debouncedSearch}&category=${category}&rental_rate=${debouncedRentalRate}`
      );
    },
    keepPreviousData: true,
    onSuccess: (data: AxiosResponse) => {
      setFilms(data.data);
    },
  });
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <main className="px-12 pb-6">
        <SearchBar
          category={category}
          search={search}
          setSearch={setSearch}
          setCategory={setCategory}
          rentalRate={rentalRate}
          setRentalRate={setRentalRate}
        />
        <div className="grid mt-6 md:grid-cols-3 lg:grid-cols-4 gap-8 grid-cols-1">
          {films.length === 0 && (
            <h1 className="font-bold text-2xl">No results!</h1>
          )}
          {films.map((film: any) => {
            return <FilmCard key={film.id} film={film} />;
          })}
        </div>
        <div className="btn-group mt-6">
          <button
            disabled={page === 1 || isPreviousData}
            onClick={() => setPage(1)}
            className="btn"
          >
            ??
          </button>
          <button
            disabled={page === 1 || isPreviousData}
            onClick={() => setPage(page - 1)}
            className="btn"
          >
            {"<"}
          </button>
          <button onClick={() => setPage(1)} className="btn">
            Page {page} / {1000 / PER_PAGE}
          </button>
          <button
            disabled={isPreviousData}
            onClick={() => setPage(page + 1)}
            className="btn"
          >
            {">"}
          </button>
          <button
            disabled={isPreviousData}
            onClick={() => setPage(1000 / PER_PAGE)}
            className="btn"
          >
            ??
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
