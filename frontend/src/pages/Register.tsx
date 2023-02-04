import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";

type Props = {};

// const Register = (props: Props) => {
//   const { register, setAlert } = useGlobalContext();
//   const [formData, setFormData] = React.useState({
//     username: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <main className="center-it font-spacemono p-6">
//       <div className="mt-2 flex flex-col gap-4 rounded-sm">
//         <h1 className="text-4xl font-bold">Register</h1>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             if (formData.password !== formData.confirmPassword) {
//               setAlert("error", "Passwords do not match");
//               return;
//             }
//             register(
//               formData.username,
//               formData.password,
//               formData.confirmPassword
//             );
//           }}
//           className="flex flex-col gap-4"
//         >
//           <div className="form-control w-full max-w-xs">
//             <input
//               type="text"
//               placeholder="Username"
//               className="input input-bordered w-full font-bold max-w-xs shadow-xl"
//               name="username"
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-control w-full max-w-xs">
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               className="input input-bordered w-full max-w-xs text-black shadow-xl"
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-control w-full max-w-xs">
//             <input
//               type="password"
//               placeholder="Confirm password"
//               className="input input-bordered w-full max-w-xs text-black shadow-xl"
//               name="confirmPassword"
//               onChange={handleChange}
//             />
//           </div>
//           <button className="btn btn-primary shadow-xl">Register!</button>
//         </form>
//         <span>
//           Already have an account?{" "}
//           <Link to="/login" className="underline">
//             Login
//           </Link>
//         </span>
//       </div>
//     </main>
//   );
// };

// export default Register;
