import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const facilityApi = createApi({
  reducerPath: 'facilityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dev-api-iis-sigmacloud.azurewebsites.net/api/',
  }),
  endpoints: (builder) => ({
    searchFacilities: builder.mutation({
      query: (searchParams) => ({
        url: 'Facility/search',
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: searchParams,
      }),
    }),
    // You can add more endpoints here for other operations
  }),
});

export const { useSearchFacilitiesMutation } = facilityApi;
export default facilityApi;