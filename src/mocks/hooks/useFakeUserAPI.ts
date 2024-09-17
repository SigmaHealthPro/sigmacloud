import { useEffect, useState } from 'react';
import axios from 'axios';
import { TUser } from '../db/users.db';
import apiconfig from '../../config/apiconfig';

const useFakeUserAPI = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<TUser | undefined>();
  const [error, setError] = useState<string>("");


  const apiconfigurl = `${apiconfig.apiHostUrl}/api/User/Authenticate`

  const getCheckUser = async (username: string, password: string) => {
    const apiUrl = apiconfigurl;

    try {
      
      const result = await axios.post(apiUrl, {}, {
        params: {
          username: username,
          password: password,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      console.log(result.data);
      setResponse(result.data);

      // Store user-related data in localStorage
      localStorage.setItem('apiData', JSON.stringify(result.data));
      localStorage.setItem('birthdate', JSON.stringify(result.data.birthdate));
      localStorage.setItem('userid', result.data.UserId);
      localStorage.setItem('loggedinid', result.data.id);
      localStorage.setItem('loggedinname', result.data.username);
      localStorage.setItem('position', result.data.position);
      localStorage.setItem('facilityname', result.data.facility);
      localStorage.setItem('juridictionname', result.data.juridiction);
      localStorage.setItem('juridictionidlogged', result.data.juridictionid);
      localStorage.setItem('organizationidlogged', result.data.organizationid);

      return result.data;
    } catch (error: any) {
      setError(error.message);
      console.error('Error during API call:', error);
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDataFromLocalStorage = async () => {
    try {
      const storedData = localStorage.getItem('apiData');
      if (storedData) {
        return JSON.parse(storedData);
      } else {
        return null; // No data found
      }
    } catch (error: any) {
      setError('Error parsing data from localStorage');
      throw new Error('Error parsing data from localStorage');
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataFromLocalStorage();
        if (data) {
          setResponse(data as TUser);
        }
      } catch (error: any) {
        console.error('Error retrieving data from localStorage:', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  return { response, isLoading, getCheckUser, getDataFromLocalStorage, error };
};

export default useFakeUserAPI;
