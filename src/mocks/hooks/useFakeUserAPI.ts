import { useEffect, useState } from 'react';
import { constant, method } from 'lodash';
import { TUser } from '../db/users.db';
import apiconfig from '../../config/apiconfig';

const useFakeUserAPI = (username: string) => {
	// const allUserData = usersDb;
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [response, setResponse] = useState<TUser | undefined>();
	const [data, setData] = useState(null);
	const getCheckUser = (userNameOrMail: string, password: string) => {
		username = userNameOrMail;
		const apiUrl = apiconfig.apiHostUrl;
		//console.log('apiurl=' + apiUrl);
		return new Promise((resolve, reject) => {
			fetch(
				apiUrl +
					'api/User/Authenticate/Authenticate?username=' +
					username +
					'&password=' +
					password,
				{
					method: 'POST',
					mode: 'cors',
					headers: {
						authorization: localStorage.token,
						'Access-Control-Allow-Origin': '*',
					},
				},
			)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}

					return response.json();
				})
				.then((data) => {
					resolve(data);
					setResponse(data as TUser);
					console.log('loggedindata:', data);
					localStorage.setItem('apiData', JSON.stringify(data));
					localStorage.setItem('birthdate', JSON.stringify(data.birthdate));
					localStorage.setItem('userid', data.UserId);
					localStorage.setItem('loggedinid', data.id);
					localStorage.setItem('loggedinname', data.username);
					localStorage.setItem('position', data.position);
					localStorage.setItem('facilityname', data.facility);
					localStorage.setItem('juridictionname', data.juridiction);
					localStorage.setItem('juridictionidlogged', data.juridictionid);
					localStorage.setItem('organizationidlogged', data.organizationid);
				})
				.catch((error) => {
					reject(error.message);
				});
		});
	};
	// Function to retrieve data from localStorage
	const getDataFromLocalStorage = () => {
		return new Promise((resolve, reject) => {
			const storedData = localStorage.getItem('apiData');
			if (storedData) {
				resolve(JSON.parse(storedData));
			} else {
				reject(new Error('No data found in localStorage'));
			}
		});
	};

	useEffect(() => {
		setTimeout(() => {
			setResponse(response);
			setIsLoading(false);
			getDataFromLocalStorage();
		}, 500);

		// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username]);

	return { response, isLoading, getCheckUser, getDataFromLocalStorage };
};

export default useFakeUserAPI;
