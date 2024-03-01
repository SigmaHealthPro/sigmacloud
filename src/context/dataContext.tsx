// DataContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Cart } from '../interface/cart.interface';

// interface DataContextValue {
// 	data: Cart[]; // Adjust the type accordingly
// 	setData: React.Dispatch<React.SetStateAction<Cart[]>>;
// 	//data: Cart[] | null;
// 	//setData: React.Dispatch<React.SetStateAction<any[] | null>>;
// }
export interface DataContextValue {
	data: Cart[];
	setData: React.Dispatch<React.SetStateAction<Cart[]>>;
	addItemToCart: (item: Cart) => void; // Add addItemToCart function
}

// const defaultContextValue: DataContextValue = {
// 	data: [],
// 	setData: () => {},
// 	addItemToCart: (item: Cart) => {},
// };

export const DataContext = createContext<DataContextValue | undefined>(undefined);

export const useDataContext = () => {
	const context = useContext(DataContext);
	console.log('Context value:', context);
	if (!context) {
		throw new Error('useDataContext must be used within a DataContextProvider');
	}

	return context as DataContextValue;
};

interface DataContextProviderProps {
	children: React.ReactNode;
}

// export const DataContextProvider: React.FC<DataContextProviderProps> = ({ children }) => {
// 	const [data, setData] = useState<Cart[]>([]);

// 	return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>;
// };
interface DataContextProviderProps {
	children: React.ReactNode; // Define children as React.ReactNode
}
export const DataContextProvider: React.FC<DataContextProviderProps> = ({ children }) => {
	const [data, setData] = useState<Cart[]>([]);

	// Function to add item to cart
	const addItemToCart = (item: Cart) => {
		setData((prevData) => [...prevData, item]);
	};

	// Context value with data, setData, and addItemToCart
	const contextValue: DataContextValue = {
		data,
		setData,
		addItemToCart,
	};

	return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};
