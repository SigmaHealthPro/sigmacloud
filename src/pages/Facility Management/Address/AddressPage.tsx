import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { GridCellParams,GridRowParams } from '@mui/x-data-grid';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../../../components/ui/Modal';
import { TColors } from "../../../constants/facilitypage.constants";
import Button, { IButtonProps } from '../../../components/ui/Button';
import React from 'react'
import { LovMasterType } from "../../../interface/facility.interface";
import AddAddress from "./AddAddress";

const AddressPage = ({...props}) => {
    const id=props.id;
    const [entityAddressmodalStatus, entityAddresssetModalStatus] = useState<boolean>(false);
const [addressmodalStatus, addresssetModalStatus] = useState<boolean>(false);
const [showAlert, setShowAlert] = useState(false);
const [entityContactmodalStatus, setEntityContactmodalStatus] = useState<boolean>(false);
const [alertMessage, setAlertMessage] = useState('');
const [alertColor, setAlertColor] = useState<TColors>(TColors.Red);
const [alertTitle, setAlertTitle] = useState('');
const [addressData, setAddressData] = useState([]);
const addresscolumns: GridColDef[] = [
    { field: 'line1', headerName: 'Line 1', flex: 2 },
    { field: 'line2', headerName: 'Line 2', flex: 2 },
    { field: 'suite', headerName: 'Suite', flex: 1 },
    { field: 'countyName', headerName: 'County Name', flex: 1 },
    { field: 'countryName', headerName: 'Country Name', flex: 1 },
    { field: 'stateName', headerName: 'State Name', flex: 1 },
    { field: 'cityName', headerName: 'City Name', flex: 1 },
    { field: 'zipCode', headerName: 'ZIP Code', flex: 1 },
	{
		field: 'actions',
		headerName: 'Actions',
		width: 100,
		renderCell: (params: GridCellParams) => {
		  return (
			<div className="group relative"> {/* Ensure this div is relative for positioning context */}
				<MoreVertIcon className="cursor-pointer" />
				<div className="absolute hidden group-hover:flex flex-col items-center bg-white shadow-md 
					  -translate-y-full -translate-x-1/2 transform top-full left-10 mt-1">
						<Space size="middle">
					
					<Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(params.row.id)}>
						<AntButton icon={<DeleteOutlined />} />
					</Popconfirm>
					</Space>
				</div>
			</div>
		  );
		},
	  },
  ];
  const handleDelete = async (entityAddressId: string) => {
	try {
		console.log("this is facility id "+ entityAddressId);

		const response = await axios.delete('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Addresses/delete-entity-addresses', {
      headers: {
        'Accept': '*/*',
        'Content-Type': 'multipart/form-data',
      },
      data: {
        entityAddressId: entityAddressId,
      },
    });

	  if (response.data.status === 'Success') {

		console.log(response.data.message);
		setAlertMessage(response.data.message);
		setAlertColor(TColors.Lime);
		setAlertTitle('Success')
        setShowAlert(true);
		fetchAddressData();

	  } else if (response.data.status === 'Error') {

	   console.error('Failed to insert address:', response.data.message);
		setAlertColor(TColors.Red);
		setAlertTitle('Fail')
		setAlertMessage(response.data.message);
        setShowAlert(true);

	  } else {
			console.error('Unexpected response status. Please try again.', response.data.message);
		setAlertColor(TColors.Red);
		setAlertTitle('Fail')
		setAlertMessage('Error saving address.');
        setShowAlert(true);
		
	  }
	} catch (error) {

		console.error('Error deleting address:', error);
		setAlertColor(TColors.Red);
		setAlertTitle('Fail')
		setAlertMessage('Error deleting address.');
        setShowAlert(true);
	
	  
	}
  };
  const fetchAddressData = async () => {
    try {
      const response = await axios.post('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Addresses/get-entity-addresses', {
        entityId: id,
        identifier: null,
        recordCount: null,
      });

      if (response.data && response.data.status === 'Success') {
        setAddressData(response.data.dataList);
      } else {
        console.error('Error fetching address data');
      }
    } catch (error) {
      console.error('Error fetching address data', error);
    }
  };

  useEffect(() => {
    fetchAddressData();
  }, []);
  const [addressTypes, setAddressTypes] = useState<LovMasterType[]>([]);
  const [selectedAddressType, setSelectedAddressType] = useState<string>('');
  const fetchAddressTypes = async () => {
    try {
      const response = await axios.get(
        'https://dev-api-iis-sigmacloud.azurewebsites.net/api/MasterData/getlovmasterbylovtype?lovtype=AddressType'
      );

      console.log('Address Types API Response:', response);

      if (response.data && Array.isArray(response.data)) {
        // Adding a default item at the beginning
        const defaultItem = {
          id: 'default',
          key: 'default',
          value: 'Select an Address Type',
          lovType: 'AddressType',
          longDescription: 'Select an Address Type',
        };

        setAddressTypes([defaultItem, ...response.data]);
      } else {
        console.error('Error fetching address type data');
      }
    } catch (error) {
      console.error('Error fetching address type data', error);
    }
  };
  useEffect(() => {
fetchAddressTypes();
  }, []);



  
  return (
    <>
		<AddAddress id={id}/>
			<div style={{ height: 400, width: '100%' }}>
            <DataGrid
			className={props.classes.root}
              rows={addressData}
              columns={addresscolumns}
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

export default AddressPage
  