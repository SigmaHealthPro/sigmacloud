import React, { useEffect, useState ,FormEvent,useCallback } from 'react';
import Select from '../../../components/form/Select';
import Button, { IButtonProps } from '../../../components/ui/Button';
import Input from '../../../components/form/Input';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import axios from 'axios';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../../../components/ui/Modal';
import { makeStyles } from '@mui/styles';
import AddEvent from './AddEvent';

interface Provider {
    id: number;
    providerName: string;
  }
  
  interface Site {
    id: number;
    siteName: string;
  }
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
const EventsPage = () => {
    const classes = useStyles();
    const [eventData, setEventData] = useState([]);
     useEffect(() => {
            fetchEventData();
        }, []);
    const fetchEventData = async () => {
        try {
          const response = await fetch('https://localhost:7155/api/Event/searchevent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': '*/*'
            },
            body: JSON.stringify({
                    "keyword": null,
                    "pagenumber": 1,
                    "pagesize": 10,
                    "eventName": null,
                    "eventDate": null,
                    "vaccineName": null,
                    "providerName": null,
                    "siteName": null,
                    "orderby": null
            })
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
            console.log('response');
          }
          console.log('response',response);
          const data = await response.json();
          console.log('data',data);
          setEventData(data);
        } catch (error) {
          console.error('There was a problem fetching the data: ', error);
        }
      };
      const eventColumns = [
        { field: 'eventName', headerName: 'Event Name', width: 250 },
        {field: 'eventDate', headerName: 'Event Date', width: 250, },
        { field: 'providerName', headerName: 'Provider Name', width: 250 },
        { field: 'siteName', headerName: 'Site Name', width: 250 },
        // You can add more columns as needed
      ];
      
    function formatDateToBackend(date:any) {
        // Appends a dummy time to the date to match the backend's expected format
        return `${date}T00:00:00.000Z`;
      }
      
      
  return (
    <>
	<AddEvent/>
	<div style={{ height: 400, width: '100%' }}>
	<DataGrid
	className={classes.root}
	  rows={eventData}
	  columns={eventColumns}
	  checkboxSelection
	  sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
'& .MuiDataGrid-columnHeaderTitle': {
	fontWeight: 'bold',
},}}
	/>
	</div>
	</>
  )
}

export default EventsPage