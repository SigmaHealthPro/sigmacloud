// DataContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface DataContextValue {
	data: any[] | null;
	setData: React.Dispatch<React.SetStateAction<any[] | null>>;
}

const defaultContextValue: DataContextValue = {
	data: null,
	setData: () => null,
};

const DataContext = createContext<DataContextValue>(defaultContextValue);

export const useDataContext = () => {
	const context = useContext(DataContext);
	console.log('Context value:', context);
	if (!context) {
		throw new Error('useDataContext must be used within a DataContextProvider');
	}

	return context;
};

interface DataContextProviderProps {
	children: React.ReactNode;
}

export const DataContextProvider: React.FC<DataContextProviderProps> = ({ children }) => {
	const [data, setData] = useState<any[] | null>(null);

	return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>;
};
