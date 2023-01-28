import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";

type Props = {};

const Login = (props: Props) => {
  const { login } = useGlobalContext();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <main className="center-it font-spacemono p-6">
      <div className="mt-2 flex flex-col gap-4 rounded-sm">
        <h1 className="text-4xl font-bold">Admin Login</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            login(formData.email, formData.password);
          }}
        >
          <div className="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Email"
              name="email"
              className="input input-bordered w-full max-w-xs font-bold shadow-xl"
              onChange={handleChange}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className="input input-bordered w-full max-w-xs text-black shadow-xl"
            />
          </div>
          <button className="btn btn-primary shadow-xl">Login!</button>
        </form>
        <span>
          <Link to="/register" className="underline">
            Customer login
          </Link>
        </span>
      </div>
    </main>
  );
};

export default Login;
