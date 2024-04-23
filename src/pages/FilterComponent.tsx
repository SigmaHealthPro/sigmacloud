import React, { useEffect, useState } from 'react';
import Select from '../components/form/Select';
import Button from '../components/ui/Button';
import Input from '../components/form/Input';
import SelectReact from '../components/form/SelectReact';

  
const FilterComponent = () => {
    // Hard-coded table names and corresponding columns
    const [columns, setColumns] = useState<string[]>([]);

    const [FilterData, setFilterData] = useState([]);
    const tables = [
        { name: 'Patients', columns: ['PatientName', 'DateOfHistoryVaccine', 'PatientStatus', 'City', 'State', 'Country'] },
        { name: 'Events', columns: ['EventName', 'EventDate', 'VaccineName', 'ProviderName', 'SiteName'] },
        // Add more tables and their columns as needed
    ];
    const fetchFilterData = async (filter:any) => {
        try {
            const response = await fetch('https://localhost:7155/api/Filters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*'
                },
                body: JSON.stringify(filter)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFilterData(data);
        } catch (error) {
            console.error('There was a problem fetching the data: ', error);
        }
    };

    useEffect(() => {
        // Initial fetch without filters
        fetchFilterData({});
    }, []);

    // Handle filter submission
    const handleFilterSubmit = (filter:any) => {
        fetchFilterData(filter);
    };


    const [selectedTable, setSelectedTable] = useState('');

    const [selectedColumn, setSelectedColumn] = useState('');
    const [filterCondition, setFilterCondition] = useState('');

    const handleTableChange = (selectedOption: any) => {
        if (!selectedOption) {
            setSelectedTable('');
            setColumns([]);
            return;
        }
        const { value } = selectedOption;
        const table = tables.find(t => t.name === value);
        setSelectedTable(value);
        setColumns(table ? table.columns : []);
        setSelectedColumn('');
    };
    
    
    const handleColumnChange = (event:any) => {
        setSelectedColumn(event.target.value);
    };

    const handleConditionChange = (event:any) => {
        setFilterCondition(event.target.value);
    };

    const handleSubmit = (event:any) => {
        event.preventDefault();
        // onFilterSubmit({
        //     tableName: selectedTable,
        //     columnName: selectedColumn,
        //     filterCondition: filterCondition,
        // });
    };

    return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
        <div className="flex items-center space-x-4">
        <SelectReact
    value={selectedTable ? { label: selectedTable, value: selectedTable } : null}
    onChange={handleTableChange}
    options={tables.map((table) => ({ label: table.name, value: table.name }))}
    placeholder="Select a Table"
    name="table"
    className="flex-1"
    isClearable={true}
/>


<SelectReact
    name="columnName"
    value={selectedColumn ? { label: selectedColumn, value: selectedColumn } : null}
    onChange={handleColumnChange}
    options={columns.map((column) => ({ label: column, value: column }))}
    placeholder="Select a Column"
    isDisabled={!selectedTable}
    className="flex-1"
    isClearable={true}
    />
    

            <Input
                name="filterCondition"
                value={filterCondition}
                onChange={handleConditionChange}
                placeholder="Filter Condition"
                disabled={!selectedColumn}
                className="flex-1 p-2 border-2 border-gray-300 rounded-md"
            />
            <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Submit
            </Button>
        </div>
    </div>
);

    
};

export default FilterComponent;