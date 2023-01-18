import React from "react";

type Props = {};

const Login = (props: Props) => {
  return (
    <main className="center-it font-inter p-6">
      <div className="mt-2 text-white flex flex-col gap-4 rounded-sm">
        <h1 className="text-4xl text-black font-bold">Login</h1>
        <div className="form-control w-full max-w-xs">
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full max-w-xs text-black shadow-xl"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full max-w-xs text-black shadow-xl"
          />
        </div>
        <button className="shadow-xl float-anim w-fit px-4 py-2 border-black border-2 text-black font-bold">
          Login!
        </button>
      </div>
    </main>
  );
};

export default Login;
