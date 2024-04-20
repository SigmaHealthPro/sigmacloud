import { useCallback, useEffect, useState } from 'react';

import { QuantityPicker, Props as QuantityPickerProps } from './Quantity';

//type Props = Omit<QuantityPickerProps, 'onChange'>;
type Props = Omit<QuantityPickerProps, 'onChange'> & {
	rowId: string | number; // Identifier for the row
};

export default function QuantityUpdater({ rowId, ...props }: Props) {
	const [qty, setQty] = useState(props.defaultValue ?? 0);

	const onChange = useCallback(
		(value: number) => {
			console.log('props value=', value);
			localStorage.setItem('quantityselected:${rowId}:', value.toString());
			if (value !== qty) {
				setQty(value);
			}
			return true;
		},
		[rowId],
		//[qty, setQty],
	);

	return (
		<section className='QtySection'>
			<div>
				<QuantityPicker {...props} defaultValue={qty} onChange={onChange} />
				{/* <QuantityPicker {...props} onChange={onChange} /> */}
			</div>
		</section>
	);
}
