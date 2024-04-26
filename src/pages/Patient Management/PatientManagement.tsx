import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../components/form/FieldWrap';
import {
	DataGrid,
	GridPaginationModel,
	GridToolbarContainer,
	gridClasses,
	GridPagination,
} from '@mui/x-data-grid';
import {
	MoreVert as MoreVertIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Api,
} from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { makeStyles } from '@mui/styles';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { GridCellParams, GridRowParams } from '@mui/x-data-grid';
import { appPages } from '../../config/pages.config';
import { Patients } from '../../interface/Patients.interface';
import Modal, { ModalBody, ModalHeader, ModalFooter } from '../../components/ui/Modal';
import { UUID } from 'crypto';
import Validation from '../../components/form/Validation';
import { useFormik } from 'formik';
import Label from '../../components/form/Label';
import { patientApi } from '../../Apis/patientsApi';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../components/redux/store';
import { setUserProfile } from '../../components/redux/reducers/profileReducer';
import toast, { Toaster } from 'react-hot-toast';
import Select from '../../components/form/Select';
import popUp from '../../components/popup/popup';
import PatientProfile from './PatientProfile';
import { Autocomplete, TextField } from '@mui/material';
import endpoint from '../../config/endpoint';
import { get } from 'lodash';
import apiconfig from '../../config/apiconfig';


interface LovMasterType {
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
const useStyles = makeStyles({
	root: {
		// Increase specificity by repeating the class
		'& .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-menuIcon, .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-sortIcon':
			{
				visibility: 'visible !important', // ensure it overrides other styles
			},
		'& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader': {
			color: 'inherit', // Just an example to ensure color is consistent
		},
	},
});

const PatientManagement = () => {
	const [countryData, setCountryData] = useState([]);
	const [stateData, setStateData] = useState([]);
	const [genderData, setGenderData] = useState([]);
	const [filteredState, setFilteredState] = useState([]);
	const [filteredCity, setFilteredCity] = useState([]);

	const [addresses, setAddresses] = useState<Address[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [SelectedAddressId, setSelectedAddressId] = useState<string>('');
	const [addressmodalStatus, addresssetModalStatus] = useState<boolean>(false);


	const navigate = useNavigate();
	const [editTouched, setEditTouched] = useState(false);
	const [editData, setEditData] = useState<any>([]);
	const dispatch = useDispatch()
  
	let generatedGUID: string;
	generatedGUID = uuidv4();
	const handleEditData = async (params: any, event: any) => {
		event.preventDefault();
		// setEditData(params.row);
		setNewPatientModal(true);
		setEditTouched(true);
		formik.setFieldValue('id', params.row.id);
		formik.setFieldValue('personId', params.row.personId);
		formik.setFieldValue('firstName', params.row.firstName);
		formik.setFieldValue('middleName', params.row.middleName);
		formik.setFieldValue('lastName', params.row.lastName);
		formik.setFieldValue('gender', params.row.genderId);
		formik.setFieldValue('dateOfBirth', params.row.dateOfBirth);
		formik.setFieldValue('dateOfHistoryVaccine1', params.row.dateOfHistoryVaccine1);
		formik.setFieldValue('motherFirstName', params.row.motherFirstName);
		formik.setFieldValue('motherMaidenLastName', params.row.motherMaidenLastName);
		formik.setFieldValue('motherLastName', params.row.motherLastName);
		formik.setFieldValue('patientStatus', params.row.patientStatus);
		formik.setFieldValue('personType', params.row.personType);
		// const data = stateData?.filter((item: any) => item.countryId === params.row.countryId);
		formik.setFieldValue('country', params.row.countryId);
		handleState(params.row.countryId);
		formik.setFieldValue('state', params.row.stateId);
		handleCity(params.row.stateId);
		formik.setFieldValue('city', params.row.cityId);
		formik.setFieldValue('contactValue', params.row.contactType);
		formik.setFieldValue('contactType', params.row.contactValue);
		formik.setFieldValue('address', params.row.address);
		formik.setFieldValue('addressType', params.row.addressType);
		formik.setFieldValue('isEdit', true);
	};

	const columns = [
		{ field: 'firstName', headerName: 'Patient Name', width: 140 },
		{ field: 'dateOfHistoryVaccine', headerName: 'Date Of History Vaccine', width: 140 },
		{ field: 'patientStatus', headerName: 'Patient Status', width: 140 },
		{ field: 'personId', headerName: 'Person', width: 140 },
		{ field: 'country', headerName: 'Country', width: 140 },
		{ field: 'city', headerName: 'City', width: 140 },
		{ field: 'state', headerName: 'State', width: 140 },
		{
			field: 'actions',
			headerName: 'Actions',
			width: 140,
			renderCell: (params: GridCellParams) => {
				return (
					<div className='group relative'>
						{' '}
						{/* Ensure this div is relative for positioning context */}
						<MoreVertIcon className='cursor-pointer' />
						<div
							className='absolute left-10 top-full mt-1 hidden -translate-x-1/2 -translate-y-full 
                        transform flex-col items-center bg-white shadow-md group-hover:flex'>
							<Space size={0}>
								<AntButton
									icon={
										<EditOutlined
											onClick={(event) => handleEditData(params, event)}
										/>
									}
								/>
								<Popconfirm title='Sure to delete?'>
									<AntButton
										icon={
											<DeleteOutlined
												onClick={(event) =>
													handleDelete(params.row.id, event)
												}
											/>
										}
									/>
								</Popconfirm>
								<div>
						<Link to={`../${appPages.PatientManagement.subPages.PatientProfile.to}`}>
							<AntButton 	icon={
						<VisibilityIcon  />	}  onClick={()=>{dispatch(setUserProfile((params.row)))}}
							/>
													{/* <VisibilityIcon  />	}  onClick={()=>{debugger;dispatch(setUserProfile((params.row)))}} */}

							</Link>
					</div>
							</Space>
						</div>
					</div>
				);
			},
		},
		// {
		// 	field: 'view',
		// 	headerName: 'View',
		// 	width: 140,
		// 	renderCell: (params: GridCellParams) => {
		// 		return (
		// 			<div>
		// 				<Link to={`../${appPages.PatientManagement.subPages.PatientProfile.to}`}>
		// 					<AntButton 	icon={
		// 				<VisibilityIcon  />	}  onClick={()=>{dispatch(setUserProfile((params.row)))}}
		// 					/>
		// 											{/* <VisibilityIcon  />	}  onClick={()=>{debugger;dispatch(setUserProfile((params.row)))}} */}

		// 					</Link>
		// 			</div>
		// 		);
		// 	},
		// },
	];
	const classes = useStyles();
	const [patients, setPatients] = useState<any[]>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false); // Track loading state
	const [rowCountState, setRowCountState] = useState<number>(0); // Total number of items
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 5,
	});
	const [searchTouched, setSearchTouched] = useState(false);
	const [newPatientModal, setNewPatientModal] = useState(false);
	const [searchData, setSearchData] = useState<Patients[]>([]);
	const handleRowClick = (params: GridRowParams) => {
		// Ensure to use backticks for template literals
		navigate(`${appPages.PatientManagement.to}/${params.id}`);
	};

	function removeDublicates(array: any[], key: any) {
		const seen = new Set();
		return array.filter((item) => {
			const itemKey = key ? item[key] : item;
			const stringifiedItem = JSON.stringify(itemKey);
			if (!seen.has(stringifiedItem)) {
				seen.add(stringifiedItem);
				return true;
			}
			return false;
		});
	}

	const handleDelete = async (patientId: string, event: any) => {
		event.preventDefault();
		console.log('this is Patient id ' + patientId);
		const formData = new FormData();
		formData.append('patientId', patientId); // Add the facility ID to the form data

		try {
			const response = await axios.put(
				apiconfig.apiHostUrl+endpoint.deletepatient,
				formData, // Send the form data
				{
					headers: { 'Content-Type': 'multipart/form-data' }, // This matches the expected content type
				},
			);
			console.log(response.data); // Handle the response as needed

			if (response.data.status === 'Success') {
				listPatients();
			}
		} catch (error) {
			console.error('Error deleting facility:', error);
		}
	};

	function CustomPagination() {
		return (
			<GridToolbarContainer className='flex w-full items-center justify-between'>
				<CardHeader>
					<CardHeaderChild>
						<CardTitle>All Patients </CardTitle>
					</CardHeaderChild>
				</CardHeader>
				<GridPagination />
			</GridToolbarContainer>
		);
	}
	const getRowId = (row: Patients) => {
		return `${row.patientName}-${row.patientStatus}`;
	};

	const handlePaginationModelChange = (newModel: GridPaginationModel) => {
		setPaginationModel(newModel);
	};

	const listPatients = () => {
		setLoading(true);
		const requestData = {
			keyword: globalFilter || '',
			pagenumber: paginationModel.page + 1,
			pagesize: paginationModel.pageSize,
			patient_name: '',
			dateOfHistoryVaccine1: '',
			date_of_history_vaccine: '',
			dateOfBirth:'',
			patient_status: '',
			gender: '',
			genderId:'',
			motherFirstName: '',
			motherMaidenLastName: '',
			motherLastName: '',
			personType: '',
			address: '',
			person: '',
			city: '',
			cityId: '',
			state: '',
			country: '',
			countryId: '',
			stateId: '',
			zip_code: '',
			orderby: 'patient_name',
			isEdit: false
		};

		axios
			.post(apiconfig.apiHostUrl+endpoint.searchpatient, requestData)
			.then((response) => {
				setLoading(true);
				const { items, totalCount } = response.data;

				if (items.length > paginationModel.pageSize) {
					console.warn('API returned more items than the requested page size.');
				}
				setPatients(items);
				const totalRowCount = response.data.totalCount; // Assuming API returns totalCount
				setRowCountState((prevRowCountState) =>
					totalRowCount !== undefined ? totalRowCount : prevRowCountState,
				);
				setLoading(false); // End loading
			})
			.catch((error) => {
				console.error('Error fetching data: ', error);
				setLoading(false); // End loading
			});
	};
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGlobalFilter(e.target.value);
		if (e.target.value !== '') {
			const searchDataFilter = patients.filter(
				(item: any) => item?.firstName.startsWith(e.target.value),
			);
			setPatients(searchDataFilter);
		} else {
			listPatients();
		}
	};

	useEffect(() => {
		listPatients();
	}, [globalFilter, paginationModel]);

	useEffect(() => {
		async function callInitial() {
			await axios.get(apiconfig.apiHostUrl+endpoint.Countries)
				.then((response) => {
					setCountryData(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
			await axios.get(apiconfig.apiHostUrl+endpoint.States)
				.then((response) => {
					setStateData(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
			await axios.get(apiconfig.apiHostUrl+endpoint.Gender)
				.then((response) => {
					setGenderData(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
		}
		callInitial();
	}, []);

	
	const [addressTypes, setAddressTypes] = useState<LovMasterType[]>([]);
	//const [selectedAddressType, setSelectedAddressType] = useState<string>('');

	useEffect(() => {
		const fetchAddressTypes = async () => {
		  try {
			const response = await axios.get(
				apiconfig.apiHostUrl+endpoint.AddressType
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

	  useEffect(() => {
		const fetchAddresses = async () => {
		  try {
			const response = await axios.post(
				apiconfig.apiHostUrl+endpoint.addresses,
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
	setNewPatientModal(true);
	
  };
 
  

	

	type Patient = {
		id: string;
		createdDate: string;
		createdBy: string;
		updatedBy: string;
		patientId: number;
		patientStatus: string;
		firstName: string;
		middleName: string;
		lastName: string;
		
		gender: string;
		genderId: string;
		dateOfBirth: string;
		dateOfHistoryVaccine1: string;
		motherFirstName: string;
		motherMaidenLastName: string;
		motherLastName: string;
		city: string;
		cityId: string;
		state: string;
		stateId: string;
		country: string;
		countryId: string;
		zipCode: string;
		personId: string;
		personType: string;
		addressId: any;
		addressType: string;
		entityType: string;
		contactValue:string;
		contactType:string;
		isEdit:boolean;
		
	};

	const openModal = () => {
		setNewPatientModal(true);
	};

	const closeModal = () => {
		setNewPatientModal(false);
	};

	const handleState = async (country: any) => {
		console.log('Selectd state ID', country);
		const data = stateData?.filter((item: any) => item.countryId === country);
		console.log('Filtered state', data);
		setFilteredState(data);
	};

	const reset = () => {
		formik.setFieldValue('firstName', '');
		formik.setFieldValue('middleName', '');
		formik.setFieldValue('lastName', '');
		formik.setFieldValue('gender', '');
		formik.setFieldValue('dateOfBirth', '');
		formik.setFieldValue('date_of_history_vaccine1', '');
		formik.setFieldValue('motherFirstName', '');
		formik.setFieldValue('motherMaidenLastName', '');
		formik.setFieldValue('motherLastName', '');
		formik.setFieldValue('patientStatus', '');
		formik.setFieldValue('personType', '');
		formik.setFieldValue('city', '');
		formik.setFieldValue('state', '');
		formik.setFieldValue('country', '');
		formik.setFieldValue('address', '');
		formik.setFieldValue('addressType', '');
		formik.setFieldValue('contactValue', '');
		formik.setFieldValue('contactType', '');
	};

	const handleCity = async (state: any) => {
		console.log('Selected State ID', state);
		const response = await axios.get(
			apiconfig.apiHostUrl+endpoint.getcitiesbystateid+`?stateid=${state}`,
			
		)
			.then((resp) => setFilteredCity(resp?.data))
			.catch((err) => console.log('err', err));
	};

	
	// const handleAddressTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
	// 	setSelectedAddressType(event.target.value);
	//   };

	console.log('Patients Data:', patients); 

	const [modalStatus, setModalStatus] = useState<boolean>(false);

	const formik = useFormik({
		initialValues: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			createdDate: '2024-01-17T18:25:24.798Z',
			createdBy: 'string',
			updatedBy: 'string',
			patientId: 0,
			firstName: '',
			middleName: '',
			lastName: '',
		
			dateOfBirth: '',
			dateOfHistoryVaccine1: '',
			motherFirstName: '',
			motherMaidenLastName: '',
			motherLastName: '',
			patientStatus: '',
			personType: '',
			city: '',
			cityId: generatedGUID,
			state: '',
			stateId: generatedGUID,
			country: '',
			countryId: generatedGUID,
			zipCode: 'string',
			personId: generatedGUID,
			addressId: generatedGUID,
			addressType: '',
			entityType: "Patient",
			contactValue:'',
			contactType:'',
			isEdit: false,
			gender: '',
			genderId: Math.random().toString(36).slice(2, 7)
		},

		validate: (values: Patient) => {
			const errors: any = {};

			if (!values.firstName) {
				errors.firstName = 'Required';
			}
			if (!values.middleName) {
				errors.middleName = 'Required';
			}
			if (!values.lastName) {
				errors.lastName = 'Required';
			}
			if (!values.gender) {
				errors.gender = 'Required';
			}
			if (!values.dateOfBirth) {
				errors.dateOfBirth = 'Required';
			}
			if (!values.dateOfHistoryVaccine1) {
				errors.dateOfHistoryVaccine1 = 'Required';
			}
			if (!values.motherFirstName) {
				errors.motherFirstName = 'Required';
			}
			if (!values.motherMaidenLastName) {
				errors.motherMaidenLastName = 'Required';
			}
			if (!values.motherLastName) {
				errors.motherLastName = 'Required';
			}
			if (!values.patientStatus) {
				errors.patientStatus = 'Required';
			}
			if (!values.personType) {
				errors.personType = 'Required';
			}
			if (!values.country) {
				errors.countryName = 'Required';
			}
			if (!values.state) {
				errors.stateName = 'Required';
			}
			if (!values.city) {
				errors.cityName = 'Required';
			}

			return errors;
		},

		onSubmit: async (values: Patient) => {
			
			console.log('Request Payload: ', values);
			try {
				const postResponse = await axios.post(
					apiconfig.apiHostUrl+endpoint.createpatient,
					  { ...values, address: SelectedAddressId },
					
					{
						headers: { 'Content-Type': 'application/json' },
					},
				);
				setNewPatientModal(false);
				setEditTouched(false);
				popUp(`Patient ${editTouched ? 'updated' : 'added'} successfully!`);
				listPatients();
				formik.setFieldValue('id', '');
				formik.setFieldValue('firstName', '');
				formik.setFieldValue('middleName', '');
				formik.setFieldValue('lastName', '');
				formik.setFieldValue('gender', '');
				formik.setFieldValue('dateOfBirth', '');
				formik.setFieldValue('date_of_history_vaccine', '');
				formik.setFieldValue('motherFirstName', '');
				formik.setFieldValue('motherMaidenLastName', '');
				formik.setFieldValue('motherLastName', '');
				formik.setFieldValue('patientStatus', '');
				formik.setFieldValue('personType', '');
				formik.setFieldValue('city', '');
				formik.setFieldValue('state', '');
				formik.setFieldValue('country', '');
				formik.setFieldValue('address', '');
				formik.setFieldValue('addressType', '');
				formik.setFieldValue('contactValue', '');
				formik.setFieldValue('contactType', '');
			} catch (error) {
				console.error('Error: ', error);
			}
		},
	});

	return (
		<PageWrapper name='Customer List'>
			<Subheader>
				<Toaster />
				<SubheaderLeft>
					<FieldWrap
						firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
						lastSuffix={
							globalFilter && (
								<Icon
									icon='HeroXMark'
									color='red'
									className='mx-2 cursor-pointer'
									onClick={() => setGlobalFilter('')}
								/>
							)
						}>
						<Input
							id='globalFilter'
							name='globalFilter'
							placeholder='Search...'
							value={globalFilter}
							onChange={handleInputChange} // Modified to use the new handler
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					{/* <Link to={`${appPages.PatientManagement.subPages.AddPatient.to}`}> */}
					<Button
						variant='solid'
						icon='HeroPlus'
						onClick={() => {
							openModal();
							setEditTouched(false);
							reset();
						}}>
						New Patients
					</Button>
					<Modal isOpen={newPatientModal} setIsOpen={setNewPatientModal}>
						<ModalHeader>
							{' '}
							{!editTouched ? 'Add New Patient' : 'Modification'}
						</ModalHeader>
						<ModalBody>
							<div className='col-span-12 lg:col-span-9'>
								<div className='grid grid-cols-12 gap-4'>
									<div className='col-span-12'>
										<Card>
											<CardBody>
												<div className='grid grid-cols-12 gap-4'>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='firstName'>
															First Name{' '}
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.firstName}
															invalidFeedback={
																formik.errors.firstName
															}
															validFeedback='Good'>
															<Input
																id='firstnName'
																name='firstName'
																onChange={formik.handleChange}
																value={formik.values.firstName}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='middleName'>
															Middle Name
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.middleName}
															invalidFeedback={
																formik.errors.middleName
															}
															validFeedback='Good'>
															<Input
																id='middleName'
																name='middleName'
																onChange={formik.handleChange}
																value={formik.values.middleName}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='lastName'>Last Name</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.lastName}
															invalidFeedback={formik.errors.lastName}
															validFeedback='Good'>
															<Input
																id='lastName'
																name='lastName'
																onChange={formik.handleChange}
																value={formik.values.lastName}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='gender'>Gender</Label>
														
															<FieldWrap
																style={{ color: 'black' }}
																lastSuffix={
																	<Icon
																		icon='HeroChevronDown'
																		className='mx-2'
																	/>
																}>
																<Select
																	id='gender'
																	name='gender'
																	style={{ color: 'black' }}
																	value={formik.values.gender}
																	onChange={(event) => {
																		formik.handleChange(event);
																	
																	}}
																	onBlur={formik.handleBlur}
																	placeholder='Select Gender'>
																	{/* <option value={''}> Select</option> */}
																	{genderData?.map(
																		(gender: any) => (
																			<option
																				style={{
																					color: 'black',
																				}}
																				id={gender?.id}
																				key={gender?.id}
																				value={gender?.id}>
																				{gender?.value}
																			</option>
																		),
																	)}
																</Select>
															</FieldWrap>
														
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='dateOfBirth'>
															Date Of Birth
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.dateOfBirth}
															invalidFeedback={
																formik.errors.dateOfBirth
															}
															validFeedback='Good'>
															<Input
																type='date'
																id='dateOfBirth'
																name='dateOfBirth'
																onChange={formik.handleChange}
																value={formik.values.dateOfBirth}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>

													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='dateOfHistoryVaccine1'>
															{' '}
															Date Of History Vaccine
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={
																formik.touched.dateOfHistoryVaccine1
															}
															invalidFeedback={
																formik.errors.dateOfHistoryVaccine1
															}
															validFeedback='Good'>
															<Input
																type='date'
																id=' dateOfHistoryVaccine1'
																name='dateOfHistoryVaccine1'
																onChange={formik.handleChange}
																value={
																	formik.values
																		.dateOfHistoryVaccine1
																}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='motherFirstName'>
															Mother First Name
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={
																formik.touched.motherFirstName
															}
															invalidFeedback={
																formik.errors.motherFirstName
															}
															validFeedback='Good'>
															<Input
																id='motherFirstName'
																name='motherFirstName'
																onChange={formik.handleChange}
																value={
																	formik.values.motherFirstName
																}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='motherMaidenLastName'>
															Mother Maiden Last Name
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={
																formik.touched.motherMaidenLastName
															}
															invalidFeedback={
																formik.errors.motherMaidenLastName
															}
															validFeedback='Good'>
															<Input
																id='motherMaidenLastName'
																name='motherMaidenLastName'
																onChange={formik.handleChange}
																value={
																	formik.values
																		.motherMaidenLastName
																}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='motherLastName'>
															Mother Last Name
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={
																formik.touched.motherLastName
															}
															invalidFeedback={
																formik.errors.motherLastName
															}
															validFeedback='Good'>
															<Input
																id='motherLastName'
																name='motherLastName'
																onChange={formik.handleChange}
																value={formik.values.motherLastName}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='contactValue'>
														Contact Number														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={
																formik.touched.contactValue
															}
															invalidFeedback={
																formik.errors.contactValue
															}
															validFeedback='Good'>
															<Input
																id='contactValue'
																name='contactValue'
																onChange={formik.handleChange}
																value={formik.values.contactValue}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='contactType'>
														Email														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={
																formik.touched.contactType
															}
															invalidFeedback={
																formik.errors.contactType
															}
															validFeedback='Good'>
															<Input
																id='contactType'
																name='contactType'
																onChange={formik.handleChange}
																value={formik.values.contactType}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='patientStatus'>
															Patient Status
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.patientStatus}
															invalidFeedback={
																formik.errors.patientStatus
															}
															validFeedback='Good'>
															<Input
																id='patientStatus'
																name='patientStatus'
																onChange={formik.handleChange}
																value={formik.values.patientStatus}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='personType'>
															Person Type
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.personType}
															invalidFeedback={
																formik.errors.personType
															}
															validFeedback='Good'>
															<Input
																id='personType'
																name='personType'
																onChange={formik.handleChange}
																value={formik.values.personType}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='country'>Country</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.country}
															invalidFeedback={formik.errors.country}
															validFeedback='Good'>
															<FieldWrap
																style={{ color: 'black' }}
																lastSuffix={
																	<Icon
																		icon='HeroChevronDown'
																		className='mx-2'
																	/>
																}>
																<Select
																	id='country'
																	name='country'
																	style={{ color: 'black' }}
																	value={formik.values.country}
																	onChange={(event) => {
																		formik.handleChange(event);
																		handleState(
																			event.target.value,
																		);
																	}}
																	onBlur={formik.handleBlur}
																	placeholder='Select Country'>
																	{/* <option value={''}> Select</option> */}
																	{countryData?.map(
																		(country: any) => (
																			<option
																				style={{
																					color: 'black',
																				}}
																				id={country?.id}
																				key={country?.id}
																				value={country?.id}>
																				{
																					country?.countryName
																				}
																			</option>
																		),
																	)}
																</Select>
															</FieldWrap>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='state'>State</Label>

														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.state}
															invalidFeedback={formik.errors.state}
															validFeedback='Good'>
															<FieldWrap
																style={{ color: 'black' }}
																lastSuffix={
																	<Icon
																		icon='HeroChevronDown'
																		className='mx-2'
																	/>
																}>
																<Select
																	id='state'
																	name='state'
																	style={{ color: 'black' }}
																	value={formik.values.state}
																	onChange={(event) => {
																		formik.handleChange(event);
																		handleCity(
																			event.target.value,
																		);
																	}}
																	onBlur={formik.handleBlur}
																	placeholder='Select State'>
																	{/* <option value={''}> Select</option> */}
																	{filteredState?.map(
																		(state: any) => (
																			<option
																				style={{
																					color: 'black',
																				}}
																				id={state?.id}
																				key={state?.id}
																				value={state?.id}>
																				{state?.stateName}
																			</option>
																		),
																	)}
																</Select>
															</FieldWrap>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='city'>City</Label>

														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.city}
															invalidFeedback={formik.errors.city}
															validFeedback='Good'>
															<FieldWrap
																style={{ color: 'black' }}
																lastSuffix={
																	<Icon
																		icon='HeroChevronDown'
																		className='mx-2'
																	/>
																}>
																<Select
																	id='city'
																	name='city'
																	style={{ color: 'black' }}
																	value={formik.values.city}
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	placeholder='Select City'>
																	{/* <option value={''}> Select</option> */}
																	{filteredCity?.map(
																		(city: any) => (
																			<option
																				style={{
																					color: 'black',
																				}}
																				id={city?.id}
																				key={city?.id}
																				value={city?.id}>
																				{city?.cityName}
																			</option>
																		),
																	)}
																</Select>
															</FieldWrap>
														</Validation>
													</div>
													<div className='col-span-12'>
														<Label htmlFor='entityType'>
														Entity Type
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={
																formik.touched.entityType
															}
															invalidFeedback={
																formik.errors.entityType
															}
															validFeedback='Good'>
															<Input
																id='entityType'
																name='entityType'
																onChange={formik.handleChange}
																value={
																	formik.values.entityType
																}
																onBlur={formik.handleBlur}
															/>
														</Validation>
													</div>
													
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='addressType'>Address Type</Label>
												<FieldWrap
													lastSuffix={
														<Icon
															icon='HeroChevronDown'
															className='mx-2'
														/>
													}>
													 <Select
													 id='addressType'
        name='addressType'
		onChange={formik.handleChange}

        value={formik.values.addressType}
        
      >
        {addressTypes.map((addressType) => (
          <option key={addressType.id} value={addressType.value}>
            {addressType.value}
          </option>
        ))}
      </Select>
												</FieldWrap>
											</div>
											<div className='col-span-12 lg:col-span-6'>
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
												</div>
											</CardBody>
										</Card>
									</div>
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								variant='solid'
								onClick={() => {
									setNewPatientModal(false);
									setEditTouched(false);
								}}>
								Cancel
							</Button>
							<Button variant='solid' onClick={() => formik.handleSubmit()}>
								{!editTouched ? 'Save' : 'Update'}
							</Button>
						</ModalFooter>
					</Modal>
				</SubheaderRight>
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardBody className='overflow-auto'>
						<DataGrid
							className={classes.root}
							rows={patients}
							columns={columns}
							rowCount={rowCountState}
							loading={loading}
							pageSizeOptions={[5, 10, 25]}
							paginationModel={paginationModel}
							paginationMode='server'
							onPaginationModelChange={handlePaginationModelChange}
							checkboxSelection
							// onRowClick={handleRowClick}
							getRowId={(row) => `${row.patientName}-${row.personId}`}
							sx={{
								'& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
								'& .MuiDataGrid-columnHeaderTitle': {
									fontWeight: 'bold', // Bolding the column headers
								},
							}}
							slots={{
								toolbar: CustomPagination, // 'toolbar' should be all lowercase
							}}
						/>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default PatientManagement;
