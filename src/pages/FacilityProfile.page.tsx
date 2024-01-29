import React, { useEffect, useState ,FormEvent,useCallback } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import PageWrapper from '../components/layouts/PageWrapper/PageWrapper';
import { useAuth } from '../context/authContext';
import Container from '../components/layouts/Container/Container';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../components/layouts/Subheader/Subheader';
import Card, { CardBody, CardFooter, CardFooterChild } from '../components/ui/Card';
import Button, { IButtonProps } from '../components/ui/Button';
import { TIcons } from '../types/icons.type';
import Label from '../components/form/Label';
import Input from '../components/form/Input';
import Select from '../components/form/Select';
import rolesDb from '../mocks/db/roles.db';
import Avatar from '../components/Avatar';
import useSaveBtn from '../hooks/useSaveBtn';
import FieldWrap from '../components/form/FieldWrap';
import Icon from '../components/icon/Icon';
import Checkbox from '../components/form/Checkbox';
import Badge from '../components/ui/Badge';
import RichText from '../components/RichText';
import Radio, { RadioGroup } from '../components/form/Radio';
import useDarkMode from '../hooks/useDarkMode';
import { TDarkMode } from '../types/darkMode.type';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { GridCellParams,GridRowParams } from '@mui/x-data-grid';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../components/ui/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import PlacesAutocomplete, {geocodeByAddress,getLatLng,} from 'react-places-autocomplete';
import Alert from '../components/ui/Alert';


interface AddressType {
	id: string;
	key: string;
	value: string;
	lovType: string;
	longDescription: string;
  }
  interface Address {
	id: string;
	addressId: string;
	line1: string;
	line2: string;
	suite: string;
	countyName: string;
	countryName: string;
	stateName: string;
	cityName: string;
	zipCode: string;
	fullAddress: string;
  }
  enum TColors {
	Red = 'red',
	Lime = 'lime',
	Blue = 'blue',
	// Add other colors as needed
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


type TTab = {
	text:
		| 'Edit Profile'
		| 'Addresses'
		| 'Contacts'
		| '2FA'
		| 'Newsletter'
		| 'Sessions'
		| 'Connected'
		| 'Appearance';
	icon: TIcons;
};
type TTabs = {
	[key in
		| 'EDIT'
		| 'Addresses'
		| 'Contacts'
		| '2FA'
		| 'NEWSLETTER'
		| 'SESSIONS'
		| 'CONNECTED'
		| 'APPEARANCE']: TTab;
};
const TAB: TTabs = {
	EDIT: {
		text: 'Edit Profile',
		icon: 'HeroPencil',
	},
	Addresses: {
		text: 'Addresses',
		icon: 'HeroBuildingOffice2',
	},
	Contacts: {
		text: 'Contacts',
		icon: 'HeroPhoneArrowDownLeft',
	},
	'2FA': {
		text: '2FA',
		icon: 'HeroShieldExclamation',
	},
	NEWSLETTER: {
		text: 'Newsletter',
		icon: 'HeroBell',
	},
	SESSIONS: {
		text: 'Sessions',
		icon: 'HeroQueueList',
	},
	CONNECTED: {
		text: 'Connected',
		icon: 'HeroLink',
	},
	APPEARANCE: {
		text: 'Appearance',
		icon: 'HeroSwatch',
	},
};

const FacilityProfile = () => {
	
	const classes = useStyles();
	const [entityAddressmodalStatus, entityAddresssetModalStatus] = useState<boolean>(false);
	const [addressmodalStatus, addresssetModalStatus] = useState<boolean>(false);
	const [showAlert, setShowAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState<TColors>(TColors.Red);
  const [alertTitle, setAlertTitle] = useState('');
  const [addressData, setAddressData] = useState([]);
  const addresscolumns: GridColDef[] = [
    { field: 'addressId', headerName: 'Address ID', flex: 1 },
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
					<AntButton icon={<EditOutlined />} />
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
   useEffect(() => {
    // Auto-close the alert after 10 seconds
    const timeoutId = setTimeout(() => {
      setShowAlert(false);
    }, 10000);

    // Clear the timeout when the component unmounts or when showAlert changes
    return () => clearTimeout(timeoutId);
  }, [showAlert]);

  const handleDelete = (_id: string) => {
	// Assuming you want to show a confirmation dialog before deleting the contact
	//const isConfirmed = window.confirm('Are you sure you want to delete this contact?');
  
	
  };
  const fetchAddressData = async () => {
    try {
      const response = await axios.post('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Addresses/get-entity-addresses', {
        entityId: 'dbfb63ca-058c-4e96-b485-4652d8fa9776',
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

  const [contactNumberData, setContactData] = useState([]);

  const contactNumberColumns: GridColDef[] = [
    { field: 'contactValue', headerName: 'Contact Value', flex: 2 },
    { field: 'createdDate', headerName: 'Created Date', flex: 1 },
    { field: 'createdBy', headerName: 'Created By', flex: 1 },
    { field: 'contactType', headerName: 'Contact Type', flex: 1 },
  ];
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await axios.post('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Contact/get-entity-contact', {
          entityId: '9e5806b4-b96e-49e4-9220-1b512d15eb71',
          identifier: null,
          recordCount: null,
        });

        if (response.data && response.data.status === 'Success') {
			setContactData(response.data.dataList);
        } else {
          // Handle error
          console.error('Error fetching contact data');
        }
      } catch (error) {
        // Handle error
        console.error('Error fetching contact data', error);
      }
    };

    fetchContactData();
  }, []);

  const [addressTypes, setAddressTypes] = useState<AddressType[]>([]);
  const [selectedAddressType, setSelectedAddressType] = useState<string>('');

  useEffect(() => {
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

    fetchAddressTypes();
  }, []);



  const handleAddressTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddressType(event.target.value);
  };
 const [addresses, setAddresses] = useState<Address[]>([]);
 const [inputValue, setInputValue] = useState<string>('');
 const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
 const [SelectedAddressId, setSelectedAddressId] = useState<string>('');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.post(
          'https://dev-api-iis-sigmacloud.azurewebsites.net/api/Addresses/get-addresses',
          {
            identifier: inputValue,
            recordCount: 1000,
          }
        );

        if (response.data && response.data.status === 'Success') {
          setAddresses(response.data.dataList || []);
        } else {
          console.error('Error fetching addresses data');
        }
      } catch (error) {
        console.error('Error fetching addresses data', error);
      }
    };

    if (inputValue !== '') {
      fetchAddresses();
    } else {
      setAddresses([]); 
    }
  }, [inputValue]);

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
useEffect(() => {
   
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDDn0VVkgVc71AYGU_3gh-1tviPHiWUGbg&libraries=places`;
script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
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
		EntityId: 'dbfb63ca-058c-4e96-b485-4652d8fa9776',
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
  const handleEntityAddressSave = () => {
	saveEntityAddress();
	entityAddresssetModalStatus(false);
	fetchAddressData();
  };

	const { i18n } = useTranslation();

	const { setDarkModeStatus } = useDarkMode();

	const { userData, isLoading } = useAuth();
	const [activeTab, setActiveTab] = useState<TTab>(TAB.EDIT);
	
	

	const defaultProps: IButtonProps = {
		color: 'zinc',
	};
	const activeProps: IButtonProps = {
		...defaultProps,
		isActive: true,
		color: 'blue',
		colorIntensity: '500',
	};
    const navigate = useNavigate();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			fileUpload: '',
			username: userData?.username,
			email: userData?.email,
			firstName: userData?.firstName,
			lastName: userData?.lastName,
			position: userData?.position,
			role: userData?.role,
			oldPassword: '',
			newPassword: '',
			newPasswordConfirmation: '',
			twitter: userData?.socialProfiles?.twitter,
			facebook: userData?.socialProfiles?.facebook,
			instagram: userData?.socialProfiles?.instagram,
			github: userData?.socialProfiles?.github,
			twoFactorAuth: userData?.twoFactorAuth,
			weeklyNewsletter: userData?.newsletter?.weeklyNewsletter || false,
			lifecycleEmails: userData?.newsletter?.lifecycleEmails || false,
			promotionalEmails: userData?.newsletter?.promotionalEmails || false,
			productUpdates: userData?.newsletter?.productUpdates || false,
			bio: (userData?.bio && (JSON.parse(userData.bio) as Descendant[])) || [],
			gender: 'Male',
			theme: 'light',
			birth: '1987-12-21',
		},
		onSubmit: () => {},
	});

	useEffect(() => {
		setDarkModeStatus(formik.values.theme as TDarkMode);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.theme]);

	const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);
	const [passwordNewShowStatus, setPasswordNewShowStatus] = useState<boolean>(false);
	const [passwordNewConfShowStatus, setPasswordNewConfShowStatus] = useState<boolean>(false);

	const { saveBtnText, saveBtnColor, saveBtnDisable } = useSaveBtn({
		isNewItem: false,
		isSaving,
		isDirty: formik.dirty,
	});

	return (
		<PageWrapper name={formik.values.firstName}>
			<Subheader>
		
				<SubheaderLeft>
                <Button onClick={() => navigate(-1)}>Back to List</Button>
					{`${userData?.firstName} ${userData?.lastName}`}{' '}
					<Badge
						color='blue'
						variant='outline'
						rounded='rounded-full'
						className='border-transparent'>
						Edit User
					</Badge>
				</SubheaderLeft>
				<SubheaderRight>
					<Button
						icon='HeroServer'
						variant='solid'
						color={saveBtnColor}
						isDisable={saveBtnDisable}
						onClick={() => formik.handleSubmit()}>
						{saveBtnText}
					</Button>
					{showAlert && (
						 <div
						 style={{
						   position: 'fixed',
						   top: 0,
						   left: 0,
						   right: 0,
						 }}
					   >
						<Alert
			className='border-transparent'
			color={alertColor}
			icon='HeroCheck'
			title={alertTitle}
			variant='solid'>
			 {alertMessage}
			
		</Alert>
        
     </div> )}
				</SubheaderRight>
			</Subheader>
			<Container className='h-full'>
				<Card className='h-full'>
					<CardBody>
						<div className='grid grid-cols-12 gap-4'>
							<div className='col-span-12 flex gap-4 max-sm:flex-wrap sm:col-span-4 sm:flex-col md:col-span-2'>
								{Object.values(TAB).map((i) => (
									<div key={i.text}>
										<Button
											icon={i.icon}
											// eslint-disable-next-line react/jsx-props-no-spreading
											{...(activeTab.text === i.text
												? {
														...activeProps,
												  }
												: {
														...defaultProps,
												  })}
											onClick={() => {
												setActiveTab(i);
											}}>
											{i.text}
										</Button>
									</div>
								))}
								<div className='border-zinc-500/25 dark:border-zinc-500/50 max-sm:border-s sm:border-t sm:pt-4'>
									<Button icon='HeroTrash' color='red'>
										Delete Account
									</Button>
								</div>
							</div>
							<div className='col-span-12 flex flex-col gap-4 sm:col-span-8 md:col-span-10'>
								{activeTab === TAB.EDIT && (
									<>
										<div className='text-4xl font-semibold'>Edit Facility</div>
										<div className='flex w-full gap-4'>
											<div className='flex-shrink-0'>
												<Avatar
													src={userData?.image?.thumb}
													className='!w-24'
													// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
													name={`${userData?.firstName} ${userData?.lastName}`}
												/>
											</div>
											<div className='flex grow items-center'>
												<div>
													<div className='w-full'>
														<Label
															htmlFor='fileUpload'
															className=''
															description='At least 800x800 px recommended. JPG or PNG and GIF is allowed'>
															Upload new image
														</Label>
														<Input
															id='fileUpload'
															name='fileUpload'
															type='file'
															onChange={formik.handleChange}
															value={formik.values.fileUpload}
														/>
													</div>
												</div>
											</div>
										</div>
										<div className='grid grid-cols-12 gap-4'>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='username'>Jurisdiction</Label>
												<FieldWrap
													firstSuffix={
														<Icon icon='HeroUser' className='mx-2' />
													}>
													<Input
														id='username'
														name='username'
														onChange={formik.handleChange}
														value={formik.values.username}
														autoComplete='username'
													/>
												</FieldWrap>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='email'>Organization</Label>
												<FieldWrap
													firstSuffix={
														<Icon
															icon='HeroEnvelope'
															className='mx-2'
														/>
													}>
													<Input
														id='email'
														name='email'
														onChange={formik.handleChange}
														value={formik.values.email}
														autoComplete='email'
													/>
												</FieldWrap>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='firstName'>Facility Name</Label>
												<Input
													id='firstName'
													name='firstName'
													onChange={formik.handleChange}
													value={formik.values.firstName}
													autoComplete='given-name'
													autoCapitalize='words'
												/>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='lastName'>Address</Label>
												<Input
													id='lastName'
													name='lastName'
													onChange={formik.handleChange}
													value={formik.values.lastName}
													autoComplete='family-name'
													autoCapitalize='words'
												/>
											</div>

											

											<div className='col-span-12'>
												<Label htmlFor='position'>Role</Label>
												<FieldWrap
													firstSuffix={
														<Icon
															icon='HeroShieldCheck'
															className='mx-2'
														/>
													}
													lastSuffix={
														<Icon
															icon='HeroChevronDown'
															className='mx-2'
														/>
													}>
													<Select
														name='role'
														onChange={formik.handleChange}
														value={formik.values.role}
														placeholder='Select role'>
														{rolesDb.map((role) => (
															<option key={role.id} value={role.id}>
																{role.name}
															</option>
														))}
													</Select>
												</FieldWrap>
											</div>
											<div className='col-span-12'>
												<Label htmlFor='position'>Position</Label>

												<FieldWrap
													firstSuffix={
														<Icon
															icon='HeroBriefcase'
															className='mx-2'
														/>
													}>
													<Input
														id='position'
														name='position'
														onChange={formik.handleChange}
														value={formik.values.position}
													/>
												</FieldWrap>
											</div>
										
										</div>
									</>
								)}
								{activeTab === TAB.Addresses && (
									<>
										<div className='flex items-center justify-between mb-4'>
        <div className='text-4xl font-semibold'>Facility Addresses</div>
        {/* Add your button here */}
        <Button variant='solid' onClick={() => entityAddresssetModalStatus(true)} icon='HeroPlus'>
              New
            </Button>
      </div>
										<div style={{ height: 400, width: '100%' }}>
            <DataGrid
			className={classes.root}
              rows={addressData}
              columns={addresscolumns}
              checkboxSelection
			  sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
        },}}
            />
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

												<FieldWrap
													>
													
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
          </div>
										
									</>
								)}
								{activeTab === TAB.Contacts && (
									<>
										<div className='text-4xl font-semibold'>Contacts</div>
										<div style={{ height: 400, width: '100%' }}>
            <DataGrid
			className={classes.root}
              rows={contactNumberData}
              columns={contactNumberColumns}
              checkboxSelection
			  sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
        },}}
            />
          </div>
									</>
								)}
								{activeTab === TAB['2FA'] && (
									<>
										<div className='text-4xl font-semibold'>2FA</div>
										<div className='flex flex-wrap divide-y divide-dashed divide-zinc-500/50 [&>*]:py-4'>
											<div className='flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<div className='w-full text-xl font-semibold'>
														Authenticator App
													</div>
												</div>
												<div className='flex-shrink-0'>
													<Button
														variant='outline'
														isDisable={!formik.values.twoFactorAuth}>
														Set up
													</Button>
												</div>
											</div>
											<div className='flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<div className='w-full text-xl font-semibold'>
														Security Keys
													</div>
												</div>
												<div className='flex-shrink-0'>
													<Button
														color='red'
														className='!px-0'
														isDisable={!formik.values.twoFactorAuth}>
														Deactivate
													</Button>
												</div>
											</div>
											<div className='flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<div className='w-full text-xl font-semibold'>
														Telephone Number
													</div>
												</div>
												<div className='flex flex-shrink-0 items-center gap-4'>
													<span className='text-zinc-500'>
														{userData?.phone}
													</span>
													<Button
														variant='outline'
														color='zinc'
														isDisable={!formik.values.twoFactorAuth}>
														Edit
													</Button>
												</div>
											</div>
										</div>
									</>
								)}
								{activeTab === TAB.NEWSLETTER && (
									<>
										<div className='text-4xl font-semibold'>Newsletter</div>
										<div className='flex flex-wrap divide-y divide-dashed divide-zinc-500/50 [&>*]:py-4'>
											<div className='flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<Label
														htmlFor='weeklyNewsletter'
														className='!mb-0'>
														<div className='text-xl font-semibold'>
															Weekly newsletter
														</div>
														<div className='text-zinc-500'>
															Get notified about articles, discounts
															and new products.
														</div>
													</Label>
												</div>
												<div className='flex flex-shrink-0 items-center'>
													<Checkbox
														variant='switch'
														id='weeklyNewsletter'
														name='weeklyNewsletter'
														onChange={formik.handleChange}
														checked={formik.values.weeklyNewsletter}
													/>
												</div>
											</div>
											<div className='flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<Label
														htmlFor='lifecycleEmails'
														className='!mb-0'>
														<div className='text-xl font-semibold'>
															Lifecycle emails
														</div>
														<div className='text-zinc-500'>
															Get personalized offers and emails based
															on your activity.
														</div>
													</Label>
												</div>
												<div className='flex flex-shrink-0 items-center'>
													<Checkbox
														variant='switch'
														id='lifecycleEmails'
														name='lifecycleEmails'
														onChange={formik.handleChange}
														checked={formik.values.lifecycleEmails}
													/>
												</div>
											</div>
											<div className='flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<Label
														htmlFor='promotionalEmails'
														className='!mb-0'>
														<div className='text-xl font-semibold'>
															Promotional emails
														</div>
														<div className='text-zinc-500'>
															Get personalized offers and emails based
															on your orders & preferences.
														</div>
													</Label>
												</div>
												<div className='flex flex-shrink-0 items-center'>
													<Checkbox
														variant='switch'
														id='promotionalEmails'
														name='promotionalEmails'
														onChange={formik.handleChange}
														checked={formik.values.promotionalEmails}
													/>
												</div>
											</div>
											<div className='flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<Label
														htmlFor='productUpdates'
														className='!mb-0'>
														<div className='text-xl font-semibold'>
															Product updates
														</div>
														<div className='text-zinc-500'>
															Checking this will allow us to notify
															you when we make updates to products you
															have downloaded/purchased.
														</div>
													</Label>
												</div>
												<div className='flex flex-shrink-0 items-center'>
													<Checkbox
														variant='switch'
														id='productUpdates'
														name='productUpdates'
														onChange={formik.handleChange}
														checked={formik.values.productUpdates}
													/>
												</div>
											</div>
										</div>
									</>
								)}
								{activeTab === TAB.SESSIONS && (
									<>
										<div className='text-4xl font-semibold'>Newsletter</div>
										<div className='flex flex-wrap divide-y divide-dashed divide-zinc-500/50 [&>*]:py-4'>
											<div className='group flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<div>
														<div className='text-xl font-semibold'>
															Chrome
														</div>
														<div className='text-zinc-500'>
															MacOS 13.4.1
														</div>
													</div>
													<Button
														className='invisible group-hover:visible'
														color='red'>
														Delete
													</Button>
												</div>
												<div className='flex flex-shrink-0 items-center gap-4'>
													<Icon icon='CustomUSA' size='text-3xl' />
													<Badge
														variant='outline'
														rounded='rounded-full'
														className='border-transparent'>
														3 hours ago
													</Badge>
												</div>
											</div>
											<div className='group flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<div>
														<div className='text-xl font-semibold'>
															Safari
														</div>
														<div className='text-zinc-500'>
															MacOS 13.4.1
														</div>
													</div>
													<Button
														className='invisible group-hover:visible'
														color='red'>
														Delete
													</Button>
												</div>
												<div className='flex flex-shrink-0 items-center gap-4'>
													<Icon icon='CustomUSA' size='text-3xl' />
													<Badge
														variant='outline'
														rounded='rounded-full'
														className='border-transparent'>
														1 day ago
													</Badge>
												</div>
											</div>
											<div className='group flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<div>
														<div className='text-xl font-semibold'>
															App
														</div>
														<div className='text-zinc-500'>
															iOS 16.5.1
														</div>
													</div>
													<Button
														className='invisible group-hover:visible'
														color='red'>
														Delete
													</Button>
												</div>
												<div className='flex flex-shrink-0 items-center gap-4'>
													<Icon icon='CustomUSA' size='text-3xl' />
													<Badge
														variant='outline'
														rounded='rounded-full'
														className='border-transparent'>
														3 days ago
													</Badge>
												</div>
											</div>
											<div className='group flex basis-full gap-4'>
												<div className='flex grow items-center'>
													<div>
														<div className='text-xl font-semibold'>
															Safari
														</div>
														<div className='text-zinc-500'>
															iPadOS 16.5.1
														</div>
													</div>
													<Button
														className='invisible group-hover:visible'
														color='red'>
														Delete
													</Button>
												</div>
												<div className='flex flex-shrink-0 items-center gap-4'>
													<Icon icon='CustomUSA' size='text-3xl' />
													<Badge
														variant='outline'
														rounded='rounded-full'
														color='red'
														className='border-transparent'>
														Expired
													</Badge>
												</div>
											</div>
										</div>
									</>
								)}
								{activeTab === TAB.CONNECTED && (
									<>
										<div className='text-4xl font-semibold'>Connected</div>
										<div className='flex flex-wrap divide-y divide-dashed divide-zinc-500/50 [&>*]:py-4'>
											{userData?.socialAuth &&
												Object.keys(userData?.socialAuth).map((i) => {
													// @ts-ignore
													// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
													const status = userData?.socialAuth[i];
													return (
														<div
															key={i}
															className='flex basis-full gap-4'>
															<div className='flex grow items-center'>
																<div className='text-xl font-semibold capitalize'>
																	{i}
																</div>
															</div>
															<div className='flex flex-shrink-0 items-center gap-4'>
																<Button
																	icon={
																		status
																			? 'HeroTrash'
																			: 'HeroCog8Tooth'
																	}
																	color={status ? 'red' : 'blue'}>
																	{status ? 'Delete' : 'Set up'}
																</Button>
															</div>
														</div>
													);
												})}
										</div>
									</>
								)}
								{activeTab === TAB.APPEARANCE && (
									<>
										<div className='text-4xl font-semibold'>Appearance</div>
										<div className='grid grid-cols-12 gap-4'>
											<div className='col-span-12'>
												<Label htmlFor='theme'>Theme</Label>
												<RadioGroup isInline>
													<Radio
														name='theme'
														value='dark'
														selectedValue={formik.values.theme}
														onChange={formik.handleChange}>
														<div className='relative'>
															<div className='flex h-2 w-full items-center gap-1 bg-zinc-500 p-1'>
																<div className='h-1 w-1 rounded-full bg-red-500' />
																<div className='h-1 w-1 rounded-full bg-amber-500' />
																<div className='h-1 w-1 rounded-full bg-emerald-500' />
															</div>
															<div className='flex aspect-video w-56 bg-zinc-950'>
																<div className='h-full w-1/4 border-e border-zinc-800/50 bg-zinc-900/75' />
																<div className='h-full w-3/4'>
																	<div className='h-4 w-full border-b border-zinc-800/50 bg-zinc-900/75' />
																	<div />
																</div>
															</div>
														</div>
													</Radio>
													<Radio
														name='theme'
														value='light'
														selectedValue={formik.values.theme}
														onChange={formik.handleChange}>
														<div className='relative'>
															<div className='flex h-2 w-full items-center gap-1 bg-zinc-500 p-1'>
																<div className='h-1 w-1 rounded-full bg-red-500' />
																<div className='h-1 w-1 rounded-full bg-amber-500' />
																<div className='h-1 w-1 rounded-full bg-emerald-500' />
															</div>
															<div className='flex aspect-video w-56 bg-zinc-100'>
																<div className='h-full w-1/4 border-e border-zinc-300/25 bg-white' />
																<div className='h-full w-3/4'>
																	<div className='h-4 w-full border-b border-zinc-300/25 bg-white' />
																	<div />
																</div>
															</div>
														</div>
													</Radio>
												</RadioGroup>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					</CardBody>
					<CardFooter>
						<CardFooterChild>
							<div className='flex items-center gap-2'>
								<Icon icon='HeroDocumentCheck' size='text-2xl' />
								<span className='text-zinc-500'>Last saved:</span>
								<b>{dayjs().locale(i18n.language).format('LLL')}</b>
							</div>
						</CardFooterChild>
						<CardFooterChild>
							<Button
								icon='HeroServer'
								variant='solid'
								color={saveBtnColor}
								isDisable={saveBtnDisable}
								onClick={() => formik.handleSubmit()}>
								{saveBtnText}
							</Button>
						</CardFooterChild>
					</CardFooter>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default FacilityProfile;
