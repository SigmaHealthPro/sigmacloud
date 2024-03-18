import React, { useEffect, useState ,FormEvent,useCallback } from 'react';
import Button, { IButtonProps } from '../../../components/ui/Button';
import Input from '../../../components/form/Input';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import axios from 'axios';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../../../components/ui/Modal';
import { makeStyles } from '@mui/styles';
import AddProvider from './AddProvider';

const useStyles = makeStyles({
    root: {
        // Increase specificity by repeating the class
        '& .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-menuIcon, .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-sortIcon': {
            visibility: 'visible !important', // ensure it overrides other styles
        },
        '& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader': {
            color: 'inherit', // Just an example to ensure color is consistent
        },
    },
});
const Providers = () => {

    const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
    const [providerData, setProviderData] = useState([]);
    
    const classes = useStyles();
    const providerColumns = [
        { field: 'providerName', headerName: 'Provider Name', width: 200 },
        { field: 'providerType', headerName: 'Provider Type', width: 150 },
        { field: 'facilityName', headerName: 'Facility Name', width: 200 },
        { field: 'contactNumber', headerName: 'Contact Number', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'cityName', headerName: 'City', width: 150 },
        { field: 'stateName', headerName: 'State', width: 150 },
        { field: 'zipCode', headerName: 'Zip Code', width: 130 },
        
      ];
      
    useEffect(() => {
        fetchProviderData();
    }, []);
    const fetchProviderData = async () => {
        try {
        const response = await fetch('https://localhost:7155/api/Provider/searchprovider', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
            },
            body: JSON.stringify({
                "keyword": null,
                "pagenumber": 1,
                "pagesize": 10,
                "providerName": null,
                "providerType": null,
                "email": null,
                "speciality": null,
                "facilityid": null,
                "facility_name": null,
                "city": null,
                "contact_number": null,
                "state": null,
                "zipcode": null,
                "orderby": null
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
            console.log('response');
        }
        console.log('response',response);
        const data = await response.json();
        setProviderData(data);
        } catch (error) {
        console.error('There was a problem fetching the data: ', error);
        }
    };
    
    

  

  return (
    <>
        
        <AddProvider/>
        <div style={{ height: 400, width: '100%' }}>
            {<DataGrid
                className={classes.root}
                rows={providerData}
                columns={providerColumns}
                checkboxSelection
                sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
                '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                },}}
            />}
        </div>
    </>

  )
}

export default Providers