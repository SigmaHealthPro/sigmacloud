import React from 'react';

const formatDate = (orderDate: string) => {
	const date = new Date(orderDate);
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long', // Displays the full name of the weekday (e.g., "Friday")
		month: 'short', // Displays the abbreviated name of the month (e.g., "Mar")
		day: '2-digit', // Displays the day of the month as a two-digit number (e.g., "13")
		year: 'numeric', // Displays the year as a four-digit number (e.g., "2020")
	};
	return date.toLocaleDateString('en-US', options);
};

const CustomDatecomp = ({ orderDate }: { orderDate: string }) => {
	const formattedDate = formatDate(orderDate);

	return formattedDate;
};

export default CustomDatecomp;
