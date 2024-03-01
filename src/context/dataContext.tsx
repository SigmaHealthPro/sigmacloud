// DataContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Cart } from '../interface/cart.interface';

interface DataContextValue {
	data: Cart[]; // Adjust the type accordingly
	setData: React.Dispatch<React.SetStateAction<Cart[]>>;
	//data: Cart[] | null;
	//setData: React.Dispatch<React.SetStateAction<any[] | null>>;
}

const defaultContextValue: DataContextValue = {
	data: [],
	setData: () => {},
};

export const DataContext = createContext<DataContextValue>(defaultContextValue);

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

export const DataContextProvider: React.FC<DataContextProviderProps> = ({ children }) => {
	const [data, setData] = useState<Cart[]>([]);

	return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>;
};
