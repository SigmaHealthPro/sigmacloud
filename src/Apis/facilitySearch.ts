import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
  reducerPath: "facilitySearch",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dev-api-iis-sigmacloud.azurewebsites.net/api/",
  }),
  endpoints: (builder) => ({
    facilitySearch: builder.mutation({
      query: (userData) => ({
        url: "/Facility/search",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: userData,
      }),
    }),
  }),
});

export const { useRegisterUserMutation= } = facilitySearch;
export default facilitySearch;