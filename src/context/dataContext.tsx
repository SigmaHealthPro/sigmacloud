// DataContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart } from '../interface/cart.interface';

export interface DataContextValue {
	data: Cart[];
	setData: React.Dispatch<React.SetStateAction<Cart[]>>;
	addItemToCart: (item: Cart) => void; // Add addItemToCart function
}

export const DataContext = createContext<DataContextValue | undefined>(undefined);

export const useDataContext = () => {
	const context = useContext(DataContext);
	// console.log('Context value:', context);
	if (!context) {
		throw new Error('useDataContext must be used within a DataContextProvider');
	}

	return context as DataContextValue;
};

interface DataContextProviderProps {
	children: React.ReactNode;
}

interface DataContextProviderProps {
	children: React.ReactNode; // Define children as React.ReactNode
}
export const DataContextProvider: React.FC<DataContextProviderProps> = ({ children }) => {
	//const [data, setData] = useState<Cart[]>([]);
	const [data, setData] = useState<Cart[]>(() => {
		const storedData = localStorage.getItem('cartitemsData');
		return storedData ? JSON.parse(storedData) : [];
	});

	// Function to add item to cart
	const addItemToCart = (item: Cart) => {
		setData((prevData) => [...prevData, item]);
	};
	// Update local storage whenever data changes
	useEffect(() => {
		localStorage.setItem('cartitemsData', JSON.stringify(data));
	}, [data]);

	// Context value with data, setData, and addItemToCart
	const contextValue: DataContextValue = {
		data,
		setData,
		addItemToCart,
	};

	return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};
