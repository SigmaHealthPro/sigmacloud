import { Select } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

interface YearPickerProps {
	selectedYear: number | undefined;
	handleYearChange: (year: number) => void;
}

const YearPicker: React.FC<YearPickerProps> = ({ selectedYear, handleYearChange }) => {
	// Generate a list of years, e.g., from 2000 to the current year
	const currentYear = dayjs().year();
	const years = Array.from({ length: currentYear - 1989 }, (_, index) => currentYear + index);

	return (
		<div>
			<Select
				value={selectedYear ? String(selectedYear) : undefined}
				onChange={(value) => handleYearChange(Number(value))}
				style={{ width: '80%' }}
				getPopupContainer={(trigger) =>
					(trigger?.parentNode as HTMLElement) || document.body
				}>
				{years.map((year) => (
					<Option key={year} value={String(year)}>
						{year}
					</Option>
				))}
			</Select>
		</div>
	);
};

export default YearPicker;
