import React, { createContext, useContext, useReducer } from "react";
import {
  ActionInterface,
  initialState,
  InitialStateInterface,
  reducer,
} from "./reducer";

import toast from "react-hot-toast";
import produce from "immer";
import axios from "axios";

interface AppContextInterface {
  setAlert(type: "success" | "error", message: string): void;
  state: InitialStateInterface;
  dispatch(arg0: ActionInterface): void;
  login(username: string, password: string): void;
  register(formData: {
    first_name: string;
    last_name: string;
    email: string;
    address_line1: string;
    address_line2: string;
    district: string;
    postal_code: number;
    phone: number;
  }): void;
  logOut(): void;
  loadUser(): void;
}

const AppContext = createContext<AppContextInterface>({
  dispatch: () => null,
  setAlert: () => null,
  login: () => null,
  register: () => null,
  loadUser: () => null,
  logOut: () => null,
  state: initialState,
});

// Provider in your app

export const AppContextWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(produce(reducer), initialState);
  React.useEffect(() => {
    console.log(state);
  }, [state]);

  const setAlert: AppContextInterface["setAlert"] = (type, message) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        toast(message);
    }
  };

  const loadUser: AppContextInterface["loadUser"] =
    React.useCallback(async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        } else {
          delete axios.defaults.headers.common["Authorization"];
          dispatch({ type: "CLEAR_USER" });
        }
        const response = await axios.get("/auth/users/me/");
        dispatch({ type: "SET_USER", payload: response.data });
      } catch (error) {
        dispatch({ type: "CLEAR_USER" });
      }
      dispatch({ type: "SET_LOADING", payload: false });
    }, []);

  const login: AppContextInterface["login"] = async (email, password) => {
    const body = { email, password };
    try {
      const response = await axios.post("/auth/login", body);
      localStorage.setItem("token", response.data.token);
      loadUser();
      setAlert("success", "Logged in!");
    } catch (error) {
      const err = error as any;
      for (let message of err.response?.data?.errors || []) {
        setAlert("error", message.msg);
      }
      console.log(err.response?.data);
      dispatch({ type: "CLEAR_USER" });
    }
  };

  const register: AppContextInterface["register"] = async ({
    first_name,
    address_line1,
    address_line2,
    last_name,
    email,
    district,
    phone,
    postal_code,
  }) => {
    const body = {
      first_name,
      last_name,
      address_line1,
      address_line2,
    };
    try {
      await axios.post("/auth/register", body);

      // login(username, password);
    } catch (error) {
      const err = error as any;
      for (let message of err.response?.data?.errors || []) {
        setAlert("error", message.msg);
      }
      dispatch({ type: "CLEAR_USER" });
    }
  };
  const logOut = () => {
    localStorage.removeItem("token");
    dispatch({ type: "CLEAR_USER" });
    setAlert("success", "Logged out!");
  };

  const AppContextValue: AppContextInterface = {
    state,
    logOut,
    dispatch,
    setAlert,
    login,
    register,
    loadUser,
  };
  return (
    <AppContext.Provider value={AppContextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = (): AppContextInterface => {
  return useContext(AppContext);
};
