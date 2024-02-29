import { useCallback, useEffect, useState } from 'react';

import { QuantityPicker, Props as QuantityPickerProps } from './Quantity';

type Props = Omit<QuantityPickerProps, 'onChange'>;

export default function QuantityUpdater(props: Props) {
	const [qty, setQty] = useState(props.defaultValue ?? 0);

	const onChange = useCallback(
		(value: number) => {
			// if (value === 0) {
			// 	return window.confirm('Are you sure you want to remove the item from the cart?');
			// } else
			if (value !== qty) {
				setQty(value);
			}

			return true;
		},
		[qty, setQty],
	);

	return (
		<section className='QtySection'>
			<div>
				<QuantityPicker {...props} onChange={onChange} />
			</div>
		</section>
	);
}
