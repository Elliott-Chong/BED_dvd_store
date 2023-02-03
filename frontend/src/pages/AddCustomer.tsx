import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useGlobalContext } from "../context";

type Props = {};

type Store = {
  store_id: number;
  address: string;
};

type City = {
  city_id: number;
  city: string;
};

const AddCustomer = (props: Props) => {
  const { setAlert } = useGlobalContext();
  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await axios.get(`/api/stores`);
      return response.data as Store[];
    },
  });
  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const response = await axios.get(`/api/cities`);
      return response.data as City[];
    },
  });
  const mutation = useMutation({
    mutationKey: ["addCustomer"],
    mutationFn: async (formData: any) => {
      const response = await axios.post(`/customers`, formData);
      return response.data;
    },
    onSuccess: () => {
      setAlert("success", "Customer added successfully!");
    },
    onError: (error: any) => {
      setAlert("error", error.response.data.error_msg);
    },
  });
  const [formData, setFormData] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    address_line1: "",
    address_line2: "",
    district: "",
    store_id: 0,
    city_id: 0,
    postal_code: 0,
    phone: 0,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      address_line1,
      address_line2,
      district,
      city_id,
      postal_code,
      phone,
      email,
      first_name,
      last_name,
      store_id,
    } = formData;
    let formatted = {
      first_name,
      last_name,
      store_id,
      email,
      address: {
        address_line1,
        address_line2,
        district,
        city_id,
        postal_code,
        phone,
      },
    };
    mutation.mutate(formatted);
  };

  return (
    <main className="center-it font-spacemono p-6">
      <div className="mt-2 flex flex-col gap-4 rounded-sm">
        <h1 className="text-4xl font-bold">Add Customer</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <select
                name="store_id"
                id="store_id"
                required
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    store_id: parseInt(e.target.value),
                  });
                }}
                className="select select-bordered w-full max-w-xs"
                defaultValue={""}
              >
                <option disabled value="">
                  Store
                </option>
                {stores?.map((store) => (
                  <option key={store.store_id} value={store.store_id}>
                    {store.address}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-control w-full">
            <select
              name="city_id"
              id="city_id"
              required
              onChange={(e) => {
                setFormData({
                  ...formData,
                  city_id: parseInt(e.target.value),
                });
              }}
              className="select select-bordered w-full"
              defaultValue={""}
            >
              <option disabled value="">
                City
              </option>
              {cities?.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary shadow-xl">Add!</button>
        </form>
      </div>
    </main>
  );
};

export default AddCustomer;
