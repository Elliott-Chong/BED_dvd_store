type ActionInterface =
  | { type?: "SET_USER"; payload?: any }
  | { type?: "CLEAR_USER"; payload?: any }
  | { type?: "SET_LOADING"; payload?: boolean };

interface InitialStateInterface {
  token: string | null;
  loading: boolean;
  is_authenticated: boolean;
  user: {
    id: number;
    role: "user" | "admin";
    username: "";
    email?: string;
  };
}

const initialState: InitialStateInterface = {
  token: null,
  loading: true,
  is_authenticated: false,
  user: {
    id: 0,
    username: "",
    email: "",
    role: "user",
  },
};

// Our reducer function that uses a switch statement to handle our actions
function reducer(state: InitialStateInterface, action: ActionInterface) {
  const { type, payload } = action;
  switch (type) {
    case "SET_LOADING":
      state.loading = payload as boolean;
      return;

    case "SET_USER":
      state.user = payload;
      state.loading = false;
      state.is_authenticated = true;
      return;

    case "CLEAR_USER":
      localStorage.removeItem("token");
      state.loading = false;
      state.is_authenticated = false;
      state.user = initialState.user;
      return;

    default:
      return state;
  }
}

export { initialState, reducer };
export type { InitialStateInterface, ActionInterface };
