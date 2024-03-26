
import React, { useEffect, useState ,FormEvent,useCallback } from 'react';
import { useParams,useNavigate,NavigateFunction   } from 'react-router-dom';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import { useAuth } from '../../../context/authContext';
import Container from '../../../components/layouts/Container/Container';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import Card, { CardBody, CardFooter, CardFooterChild } from '../../../components/ui/Card';
import Button, { IButtonProps } from '../../../components/ui/Button';
import { TIcons } from '../../../types/icons.type';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import rolesDb from '../../../mocks/db/roles.db';
import Avatar from '../../../components/Avatar';
import useSaveBtn from '../../../hooks/useSaveBtn';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import Badge from '../../../components/ui/Badge';
import useDarkMode from '../../../hooks/useDarkMode';
import { TDarkMode } from '../../../types/darkMode.type';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { GridCellParams,GridRowParams } from '@mui/x-data-grid';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../../../components/ui/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import PlacesAutocomplete, {geocodeByAddress,getLatLng,} from 'react-places-autocomplete';
import Alert from '../../../components/ui/Alert';
import Providers from '../../Facility Management/Providers/Providers.page';
import EventsPage from '../../Facility Management/Events/EventsPage';
import {LovMasterType,Address} from '../../../interface/facility.interface';
import {TAB, TTab,TTabs, TColors} from '../../../constants/facilitypage.constants';
import SitesPage from '../../Facility Management/Sites/SitesPage';

const AddAddress = ({...props}) => {
    const {id}=props;
    const [googleAddress, setGoogleAddress] = useState('');
  const [googleCountry, setGoogleCountry] = useState('');
  const [googleCounty, setGoogleCounty] = useState('');
  const [googleState, setGoogleState] = useState('');
  const [googleCity, setGoogleCity] = useState('');
  const [googleZipcode, setGoogleZipcode] = useState('');
  const [googleAddressLine1, setGoogleAddressLine1] = useState('');
  const [googleAddressLine2, setGoogleAddressLine2] = useState('');
  const [googleSuite, setGoogleSuite] = useState('');
  const handleChange = (address:string) => {
    setGoogleAddress(address);
  };
    const [showAlert, setShowAlert] = useState(false);
    const [entityContactmodalStatus, setEntityContactmodalStatus] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState<TColors>(TColors.Red);
    const [alertTitle, setAlertTitle] = useState('');
    const [addressData, setAddressData] = useState([]);
    const [addressTypes, setAddressTypes] = useState<LovMasterType[]>([]);

    const [selectedAddressType, setSelectedAddressType] = useState<string>('');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [entityAddressmodalStatus, entityAddresssetModalStatus] = useState<boolean>(false);
    const [addressmodalStatus, addresssetModalStatus] = useState<boolean>(false);
    const handleSelect = async (address: string, _placeId: string) => {
	try {
	  const results = await geocodeByAddress(address);
	  console.log('Google Places API Response:', results);
	  const latLng = await getLatLng(results[0]);
	   console.log('Coordinates:', results);
	  const addressComponents = results[0].address_components;
	  for (const component of addressComponents) {
		for (const type of component.types) {
		  switch (type) {
			case 'country':
			  setGoogleCountry(component.long_name || '');
			  break;
			case 'administrative_area_level_2':
			  setGoogleCounty(component.long_name || '');
			  break;
			case 'locality':
			  setGoogleCity(component.long_name || '');
			  break;
			case 'postal_code':
			  setGoogleZipcode(component.long_name || '');
			  break;
			  case 'administrative_area_level_1':
				setGoogleState(component.long_name || '');
				break;
			  case 'street_number':
                setGoogleAddressLine1(component.long_name || '');
               break;
			   case 'route':
				setGoogleAddressLine2(component.long_name || '');
               break;
			   case 'subpremise':
			   setGoogleSuite(component.long_name || '');
              break;
			
		  }
		}
	  }
  
	} catch (error) {
	  console.error('Error fetching details:', error);
	}
  };
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
  const saveGoogleAddress = async () => {
	try {
	  const response = await axios.post('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Addresses/create-master-addresses', {
		line1: googleAddressLine1,
		line2: googleAddressLine2,
		suite: googleSuite,
		createdBy: 'system',
		countyName: googleCounty,
		countryName: googleCountry,
		stateName: googleState,
		cityName: googleCity,
		zipCode: googleZipcode,
	  });
  
	  console.log(response.data);
  
	  if (response.data.status === 'Success') {
		console.log('Address inserted successfully.');
		setAlertMessage('Address inserted successfully.');
		setAlertColor(TColors.Lime);
		setAlertTitle('Success')
        setShowAlert(true);
	
	  } else {
		console.error('Failed to insert address:', response.data.message);
		setAlertColor(TColors.Red);
		setAlertTitle('Fail')
		setAlertMessage('Error saving address.');
        setShowAlert(true);
	  }
	} catch (error) {
	  console.error('Error saving address:', error);
	}
  };
  
  const handleSave = () => {
	saveGoogleAddress();
	setGoogleAddressLine1('');
    setGoogleAddressLine2('');
    setGoogleSuite('');
    setGoogleCountry('');
    setGoogleCounty('');
    setGoogleState('');
    setGoogleCity('');
    setGoogleZipcode('');

	addresssetModalStatus(false);
	
  };
const saveEntityAddress = async () => {
	try {
	  const response = await axios.post('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Addresses/create-entity-addresses', {
		EntityType: 'Entity',
		AddressType: selectedAddressType,
		Addressid: SelectedAddressId,
		CreatedBy: 'system',
		EntityId: id,
		Isprimary: false,
	  });
  
	  console.log(response.data);
  
	  if (response.data.status === 'Success') {
		console.log('Entity Address inserted successfully.');
		setAlertMessage('Entity Address inserted successfully.');
		setAlertColor(TColors.Lime);
		setAlertTitle('Success')
        setShowAlert(true);
	
	  } else {
		console.error('Failed to insert entity address:', response.data.message);
		setAlertColor(TColors.Red);
		setAlertTitle('Fail')
		setAlertMessage('Error saving address.');
        setShowAlert(true);
	  }
	} catch (error) {
	  console.error('Error saving address:', error);
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
const handleEntityAddressSave = () => {
	saveEntityAddress();
	entityAddresssetModalStatus(false);
	fetchAddressData();
  };
 const [SelectedAddressId, setSelectedAddressId] = useState<string>('');
    const handleAddressChange = (_event: React.ChangeEvent<{}>, value: Address | null) => {
        setInputValue(value ? value.fullAddress : '');
        setSelectedAddress(value ? { ...value, id: value.id } : null);
        setSelectedAddressId(value ? value.id : '');
        entityAddresssetModalStatus(true);
      };
      const handleAddressPopupOpen = () => {
        entityAddresssetModalStatus(false);
        addresssetModalStatus(true);
      };
    const handleAddressTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAddressType(event.target.value);
      };
  return (
    
    <>
    <div className='flex items-center justify-between mb-4'>
        <div className='text-4xl font-semibold'>Facility Addresses</div>
        {/* Add your button here */}
        <Button variant='solid' onClick={() => entityAddresssetModalStatus(true)} icon='HeroPlus'>
              New
            </Button>
      </div>
    <Modal isOpen={entityAddressmodalStatus} setIsOpen={entityAddresssetModalStatus}>
        <ModalHeader>Add Facility Address</ModalHeader>
        <ModalBody>
            <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-12'>
                    <Label htmlFor='position'>Address Type</Label>
                    <FieldWrap
                        lastSuffix={
                            <Icon
                                icon='HeroChevronDown'
                                className='mx-2'
                            />
                        }>
                        <Select
                            name='addressType'
                            onChange={handleAddressTypeChange}
                            value={selectedAddressType}
                        >
                            {addressTypes.map((addressType) => (
                            <option key={addressType.id} value={addressType.value}>
                                {addressType.value}
                            </option>
                            ))}
                        </Select>
                    </FieldWrap>
                </div>
                <div className='col-span-8'>
                    <Label htmlFor='position'>Address</Label>
                        <FieldWrap>
                            <Autocomplete
                                options={addresses}
                                getOptionLabel={(option) => option.fullAddress}
                                value={selectedAddress}
                                onChange={handleAddressChange}
                                inputValue={inputValue}
                                onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
                                renderInput={(params) => (
                                <TextField {...params} label="Select Address"   size="small" className='w-full appearance-none outline-0 text-black dark:text-white transition-all duration-300 ease-in-out border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 focus:border-zinc-300 dark:focus:border-zinc-800 focus:bg-transparent dark:focus:bg-transparent px-1.5 py-1.5 text-base rounded-lg' />
                                )}
                            
                            />
                        </FieldWrap>
                </div>
                <div className='col-span-4'>
                    <Label htmlFor='position'>.</Label>
                    <FieldWrap>
                        <Button variant='outline' color='zinc' onClick={handleAddressPopupOpen} icon='HeroPlus'>New</Button>
                    </FieldWrap>
                </div>
            </div>

                                    
        </ModalBody>
        <ModalFooter>
            <ModalFooterChild></ModalFooterChild>
            <ModalFooterChild>
                <Button variant='solid' onClick={handleEntityAddressSave}>Save</Button>
            </ModalFooterChild>
        </ModalFooter>
    </Modal>
	<Modal isOpen={addressmodalStatus} setIsOpen={addresssetModalStatus}>
		<ModalHeader>Add  Address</ModalHeader>
		<ModalBody>
            <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-12'>
				<Label htmlFor='position'>.</Label>
                <FieldWrap>
                    <PlacesAutocomplete
                        value={googleAddress}
                        onChange={handleChange}
                        onSelect={handleSelect}
                        searchOptions={{
                            componentRestrictions: { country: ['us'] }, // Restrict to USA
                        }}
                        >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <input
                                {...getInputProps({ placeholder: 'Search address' })}
                                className='w-full appearance-none outline-0 text-black dark:text-white transition-all duration-300 ease-in-out border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 focus:border-zinc-300 dark:focus:border-zinc-800 focus:bg-transparent dark:focus:bg-transparent px-1.5 py-1.5 text-base rounded-lg'
                                style={{ width: '100%',
                                padding: '10px',
                                fontSize: '14px',
                                borderRadius: '4px',
                                border: '1px solid #ccc', }}
                                />
                                <div className="suggestions-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map((suggestion) => (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                className: 'suggestion-item',
                                                style: {
                                                    padding: '5px',
                                                    borderBottom: '1px solid #ddd',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.3s',
                                                },
                                                })}
                                            >
                                            <div>
                                            {suggestion.description}
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
				</FieldWrap>
			</div>	
			<div className='col-span-6'>
				<Label htmlFor='position'>Address Line 1 </Label>
                <FieldWrap>
                    <Input
                        id='Addressline1'
                        name='Addressline1'
                        value={googleAddressLine1} 
                        readOnly
                    />
                </FieldWrap>
            </div>
            <div className='col-span-6'>
                <Label htmlFor='position'>Address Line 2 </Label>

                <FieldWrap>
                    <Input
                        id='Addressline2'
                        name='Addressline2'
                        value={googleAddressLine2} 
                        readOnly
                    />
                </FieldWrap>
            </div>
            <div className='col-span-6'>
                <Label htmlFor='position'>Suite </Label>

                <FieldWrap>
                    <Input
                        id='Suite'
                        name='Suite'
                        value={googleSuite} 
                    />
                </FieldWrap>
            </div>
										
            <div className='col-span-6'>
                <Label htmlFor='position'>Country</Label>

                <FieldWrap
                    >
                    
                    <Input
                        id='Country'
                        name='Country'
                        value={googleCountry}
                        readOnly
                    />
                </FieldWrap>
            </div>	
            <div className='col-span-6'>
                <Label htmlFor='position'>County </Label>

                <FieldWrap>
                    <Input
                        id='County'
                        name='County'
                        value={googleCounty} 
                        readOnly
                    />
                </FieldWrap>
            </div>
            <div className='col-span-6'>
                <Label htmlFor='position'>State</Label>

                <FieldWrap>
                    <Input
                        id='State'
                        name='State'
                        value={googleState} 
                        readOnly
                    />
                </FieldWrap>
            </div>		
            <div className='col-span-6'>
                <Label htmlFor='position'>City</Label>

                <FieldWrap>
                    <Input
                        id='City'
                        name='City'
                        value={googleCity}
                        readOnly
                    />
                </FieldWrap>
            </div>		
            <div className='col-span-6'>
                <Label htmlFor='position'>Zipcode</Label>

                <FieldWrap>
                    <Input
                        id='Zipcode'
                        name='Zipcode'
                        value={googleZipcode}
                        readOnly
                    />
                </FieldWrap>
            </div>
		</div>
										
	    </ModalBody>
		<ModalFooter>
            <ModalFooterChild></ModalFooterChild>
            <ModalFooterChild>
                <Button variant='solid' onClick={handleSave}>Save</Button>
            </ModalFooterChild>
        </ModalFooter>
	</Modal>
          
										
    </>
  )
}

export default AddAddress