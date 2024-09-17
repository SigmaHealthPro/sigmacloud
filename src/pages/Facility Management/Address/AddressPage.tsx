import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import axios from 'axios';
import { MoreVert as MoreVertIcon, DeleteOutlined } from '@mui/icons-material';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { LovMasterType } from "../../../interface/facility.interface";
import AddAddress from "./AddAddress";
import { TColors } from "../../../constants/facilitypage.constants";

const AddressPage = ({...props}) => {
  const id = props.id; // Get the ID from props

  // State variables
  const [addressData, setAddressData] = useState([]); // Stores address data for DataGrid
  const [alertMessage, setAlertMessage] = useState(''); // Stores alert message
  const [alertColor, setAlertColor] = useState<TColors>(TColors.Red); // Stores alert color
  const [alertTitle, setAlertTitle] = useState(''); // Stores alert title
  const [showAlert, setShowAlert] = useState(false); // Manages alert visibility

  // Columns definition for DataGrid
  const addresscolumns: GridColDef[] = [
    { field: 'line1', headerName: 'Line 1', flex: 2 },
    { field: 'line2', headerName: 'Line 2', flex: 2 },
    { field: 'suite', headerName: 'Suite', flex: 2 },
    { field: 'countyName', headerName: 'County Name', flex: 2 },
    { field: 'countryName', headerName: 'Country Name', flex: 2 },
    { field: 'stateName', headerName: 'State Name', flex: 2 },
    { field: 'cityName', headerName: 'City Name', flex: 2 },
    { field: 'zipCode', headerName: 'ZIP Code', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      // Render actions for each row (e.g., delete button)
      renderCell: (params: GridCellParams) => (
        <div className="group relative">
          <MoreVertIcon className="cursor-pointer" />
          <div className="absolute hidden group-hover:flex flex-col items-center bg-white shadow-md -translate-y-full -translate-x-1/2 transform top-full left-10 mt-1">
            <Space size="middle">
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(params.row.id)}>
                <AntButton icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          </div>
        </div>
      ),
    },
  ];



  
  // Function to handle deletion of an address
  const handleDelete = async (entityAddressId: string) => {
    try {
      const response = await axios.delete('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Addresses/delete-entity-addresses', {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        data: { entityAddressId: entityAddressId },
      });

      // Check the response status and update the alert state
      if (response.data.status === 'Success') {
        console.log("delete Successfull")
        setAlertMessage(response.data.message);
        setAlertColor(TColors.Lime);
        setAlertTitle('Success');
        setShowAlert(true);
        fetchAddressData(); // Refresh address data after deletion
      } else {
        setAlertColor(TColors.Red);
        setAlertTitle('Fail');
        setAlertMessage(response.data.message);
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setAlertColor(TColors.Red);
      setAlertTitle('Fail');
      setAlertMessage('Error deleting address.');
      setShowAlert(true);
    }
  };





  // Function to fetch address data from the API
  const fetchAddressData = async () => {
    try {
      const response = await axios.post('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Addresses/get-entity-addresses', {
        entityId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        identifier: null,
        recordCount: null,
      });

      // Update state with fetched address data
      if (response.data && response.data.status === 'Success') {
        console.log("RESULT" + response.data.message)
        setAddressData(response.data.dataList);
      } else {
        console.error('Error fetching address data');
      }
    } catch (error) {
      console.error('Error fetching address data', error);
    }
  };

  // Fetch address data when the component mounts or ID changes
  useEffect(() => {
    fetchAddressData();
  }, [id]);









  // State variables for address types
  const [addressTypes, setAddressTypes] = useState<LovMasterType[]>([]);
  const [selectedAddressType, setSelectedAddressType] = useState<string>('');

  // Function to fetch address types from the API
  const fetchAddressTypes = async () => {
    try {
      const response = await axios.get('https://dev-api-iis-sigmacloud.azurewebsites.net/api/MasterData/getlovmasterbylovtype?lovtype=AddressType');

      console.log('Address Types API Response:', response);

      // Add a default item and update address types state
      if (response.data && Array.isArray(response.data)) {
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

  // Fetch address types when the component mounts
  useEffect(() => {
    fetchAddressTypes();
  }, []);

  return (
    <>
      <AddAddress id={id} />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          className={props.classes.root}
          rows={addressData}
          columns={addresscolumns}
          checkboxSelection
          sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' }, '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' } }}
        />
      </div>
    </>
  );
};

export default AddressPage;
