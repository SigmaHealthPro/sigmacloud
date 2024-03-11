import React, { useState } from 'react';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs'; // Import dayjs for date handling
import classNames from 'classnames';
const { Option } = Select;
const MonthPicker = () => {
	const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(null);

	const handleMonthChange = (date: any) => {
		if (date) {
			setSelectedMonth(dayjs(date).startOf('month'));
		} else {
			setSelectedMonth(null);
		}
	};

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]; // Array of month names

	return (
		<div>
			<Select
				className='custom-select-container'
				value={selectedMonth ? String(selectedMonth) : undefined}
				onChange={(value) => handleMonthChange(dayjs().month(Number(value) - 1))}
				style={{ width: '80%' }}
				getPopupContainer={(trigger) =>
					(trigger?.parentNode as HTMLElement) || document.body
				}>
				{months.map((month, index) => (
					<Option key={index} value={String(index + 1)}>
						{month}
					</Option>
				))}
			</Select>
		</div>
	);
};

export default MonthPicker;
