import React from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";

type Props = {};

const AddActor = (props: Props) => {
  const { setAlert } = useGlobalContext();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    first_name: "",
    last_name: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const mutation = useMutation({
    mutationFn: (new_actor: { first_name: string; last_name: string }) => {
      return axios.post("/actors", new_actor);
    },
    onSuccess: () => {
      navigate("/");
      setAlert("success", "Actor added successfully!");
    },
  });

  return (
    <main className="center-it font-spacemono p-6">
      <div className="mt-2 flex flex-col gap-4 rounded-sm">
        <h1 className="text-2xl font-bold">Add new actor</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            let ans = window.confirm(
              `Are you sure you want to add this actor? - ${formData.first_name} ${formData.last_name}`
            );
            if (!ans) return;
            mutation.mutate(formData);
          }}
        >
          <div className="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="First name"
              name="first_name"
              className="input input-bordered w-full max-w-xs font-bold shadow-xl"
              onChange={handleChange}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <input
              type="text"
              name="last_name"
              onChange={handleChange}
              placeholder="Last name"
              className="input input-bordered w-full max-w-xs font-bold shadow-xl"
            />
          </div>
          <button className="btn btn-primary shadow-xl">Add!</button>
        </form>
      </div>
    </main>
  );
};

export default AddActor;
