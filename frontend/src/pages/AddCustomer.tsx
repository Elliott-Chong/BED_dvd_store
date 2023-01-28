import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";

type Props = {};

const AddCustomer = (props: Props) => {
  const { register } = useGlobalContext();
  const [formData, setFormData] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    address_line1: "",
    address_line2: "",
    district: "",
    city_id: "",
    postal_code: 0,
    phone: 0,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="center-it font-spacemono p-6">
      <div className="mt-2 flex flex-col gap-4 rounded-sm">
        <h1 className="text-4xl font-bold">Add Customer</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            register(formData);
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <input
                type="text"
                required
                placeholder="First name"
                className="input input-bordered w-full max-w-xs shadow-xl"
                name="first_name"
                onChange={handleChange}
              />
            </div>
            <div className="form-control w-full">
              <input
                type="text"
                required
                name="last_name"
                placeholder="Last name"
                className="input input-bordered w-full max-w-xs shadow-xl"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-control w-full">
            <input
              type="email"
              placeholder="Email"
              required
              className="input input-bordered w-fullblack shadow-xl"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <input
                type="text"
                placeholder="Address line 1"
                required
                className="input input-bordered w-full max-w-xs shadow-xl"
                name="address_line1"
                onChange={handleChange}
              />
            </div>
            <div className="form-control w-full">
              <input
                type="text"
                name="address_line2"
                placeholder="Address line 2"
                className="input input-bordered w-full max-w-xs shadow-xl"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <input
                type="number"
                placeholder="Postal code"
                required
                className="input input-bordered w-full max-w-xs shadow-xl"
                name="postal_code"
                onChange={handleChange}
              />
            </div>
            <div className="form-control w-full">
              <input
                type="tel"
                required
                name="phone"
                placeholder="Phone"
                className="input input-bordered w-full max-w-xs shadow-xl"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <input
                type="text"
                required
                placeholder="District"
                className="input input-bordered w-full max-w-xs shadow-xl"
                name="district"
                onChange={handleChange}
              />
            </div>
            <div className="form-control w-full">
              <select name="city_id" id="city_id"></select>
            </div>
          </div>
          <button className="btn btn-primary shadow-xl">Add!</button>
        </form>
        <span>
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </span>
      </div>
    </main>
  );
};

export default AddCustomer;
