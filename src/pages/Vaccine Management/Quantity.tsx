import { ChangeEvent, KeyboardEvent, useCallback, useReducer } from 'react';

export type Fn = (value: number) => void | boolean;
export type Action =
	| { type: 'set'; callback?: Fn; value: number }
	| { type: 'increment'; callback?: Fn }
	| { type: 'decrement'; callback?: Fn };
export type State = { qty: number; min: number; max: number; step: number };
export type Props = {
	defaultValue?: number;
	step?: number;
	min?: number;
	max?: number;
	name?: string;
	onChange?: Fn;
};

function fireClickEvent(element: Element, eventInit?: PointerEventInit) {
	const event =
		typeof PointerEvent !== 'undefined'
			? new PointerEvent('click', eventInit)
			: new MouseEvent('click', eventInit);
	return element.dispatchEvent(event);
}

function quantityPickerReducer(state: State, action: Action) {
	switch (action.type) {
		case 'set': {
			const qty = Math.min(Math.max(action.value, state.min), state.max);
			return { ...state, qty: !!action.callback?.(qty) ? qty : state.qty };
		}
		case 'increment': {
			const qty = Math.min(state.max, state.qty + state.step);
			return { ...state, qty: !!action.callback?.(qty) ? qty : state.qty };
		}
		case 'decrement': {
			const qty = Math.max(state.min, state.qty - state.step);
			return { ...state, qty: !!action.callback?.(qty) ? qty : state.qty };
		}
		default: {
			throw new Error(`Unhandled action type`);
		}
	}
}

export const QuantityPicker = (props: Props) => {
	const [state, dispatch] = useReducer(quantityPickerReducer, {
		qty: props.defaultValue ?? 0,
		min: props.min ?? 0,
		max: props.max ?? Number.MAX_SAFE_INTEGER,
		step: props.step ?? 1,
	});

	const onInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
		const allowedKeys = [
			'Tab',
			'Enter',
			'Delete',
			'Backspace',
			'ArrowLeft',
			'ArrowRight',
			'ArrowUp',
			'ArrowDown',
		];

		if (!allowedKeys.includes(event.key) && isNaN(Number(event.key))) {
			event.preventDefault();
			return false;
		}
	}, []);

	const onButtonKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
		const element = event.currentTarget;
		const isEnter = event.keyCode === 13;
		const isSpace = event.keyCode === 32;
	}, []);

	const onButtonClick = (type: 'increment' | 'decrement') => () => {
		dispatch({ type, callback: props.onChange });
	};

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			if (event.defaultPrevented) return;
			if (!event.defaultPrevented && event.target instanceof HTMLInputElement) {
				const value = Number(event.target.value);
				dispatch({ type: 'set', value, callback: props.onChange });
			}
		},
		[props.onChange],
	);

	return (
		<div className='QuantityPicker'>
			<button type='button' onClick={onButtonClick('decrement')} onKeyDown={onButtonKeyDown}>
				-
			</button>
			<input
				name={props.name}
				type='number'
				inputMode='decimal'
				value={state.qty}
				min={state.min}
				max={state.max}
				step={state.step}
				onChange={onChange}
				onKeyDown={onInputKeyDown}
			/>
			<button type='button' onClick={onButtonClick('increment')} onKeyDown={onButtonKeyDown}>
				+
			</button>
		</div>
	);
};
