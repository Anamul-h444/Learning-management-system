import { apiSlice } from "../api/apiSlice";
import { userRegistration } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //endpoints here
    register: builder.mutation({
      query: (data) => ({
        url: "/user/registration",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activationToken, activationCode }) => ({
        url: "user/activate",
        method: "POST",
        body: { activationToken, activationCode },
      }),
    }),
  }),
});

export const { useRegisterMutation, useActivationMutation } = authApi;
