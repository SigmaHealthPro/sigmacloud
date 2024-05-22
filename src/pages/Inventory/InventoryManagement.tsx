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
import { setInventory } from '../../components/redux/reducers/InventoryReducer';

import toast, { Toaster } from 'react-hot-toast';
import Select from '../../components/form/Select';
import popUp from '../../components/popup/popup';
// import InventoryProfile from './InventoryProfile';
import { Autocomplete, TextField } from '@mui/material';
import apiconfig from '../../config/apiconfig';
import endpoint from '../../config/endpoint';
interface Fundingsource {
	id: string;
	fundingsource: string;
}

const useStyles = makeStyles({
	root: {
		'& .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-menuIcon, .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-sortIcon':
			{
				visibility: 'visible !important', // ensure it overrides other styles
			},
		'& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader': {
			color: 'inherit', // Just an example to ensure color is consistent
		},
	},
});

const InventoryManagement = () => {
	const [siteOptions, setSiteOptions] = useState([]);
	const [facility, setFacility] = useState([]);
	const [product, setProduct] = useState([]);
	const [fundingsource, setFundingsource] = useState<Fundingsource[]>([]);

	// Sample options for the fundingsource state
	const options: Fundingsource[] = [
		{ id: 'public', fundingsource: 'Public' },
		{ id: 'private', fundingsource: 'Private' },
	];
	const [lotnumber, setLotnumber] = useState([]);
	const [filteredState, setFilteredState] = useState([]);
	const [filteredCity, setFilteredCity] = useState([]);

	const [inputValue, setInputValue] = useState<string>('');

	const navigate = useNavigate();
	const [editTouched, setEditTouched] = useState(false);
	const [editData, setEditData] = useState<any>([]);
	const dispatch = useDispatch();
	// Function to update the fundingsource state
	const handleSetFundingsource = (options: Fundingsource[]) => {
		setFundingsource(options);
	};

	let generatedGUID: string;
	generatedGUID = uuidv4();
	const handleEditData = async (params: any, event: any) => {
		event.preventDefault();
		setNewInventoryModal(true);
		setEditTouched(true);
		formik.setFieldValue('id', params.row.id);
		formik.setFieldValue('inventoryId', params.row.inventoryId);
		formik.setFieldValue('inventoryDate', params.row.inventoryDate);
		formik.setFieldValue('quantityRemaining', params.row.quantityRemaining);
		formik.setFieldValue('expirationDate', params.row.expirationDate);
		formik.setFieldValue('tempRecorded', params.row.tempRecorded);
		formik.setFieldValue('unitOfTemp', params.row.unitOfTemp);
		formik.setFieldValue('facility', params.row.facilityId);
		formik.setFieldValue('product', params.row.productId);
		formik.setFieldValue('site', params.row.siteId);
		formik.setFieldValue('isEdit', true);
	};

	const columns = [
		{ field: 'inventoryId', headerName: 'Inventory Id', width: 100 },
		{ field: 'inventoryDate', headerName: 'Date Of Inventory', width: 140 },
		{ field: 'facility', headerName: 'Facility Name', width: 140 },
		{ field: 'site', headerName: 'Site', width: 120 },
		{ field: 'product', headerName: 'Product Name', width: 140 },
		{ field: 'expirationDate', headerName: 'Expiration Date', width: 140 },
		{ field: 'quantityRemaining', headerName: 'Quantity Remaining', width: 100 },
		{ field: 'unitOfTemp', headerName: 'Unit Of Temp', width: 100 },
		{ field: 'tempRecorded', headerName: 'Temp Recorded', width: 100 },

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
									<Link
										to={`#`}>
										<AntButton
											icon={<VisibilityIcon />}
											onClick={() => {
												dispatch(setInventory(params.row));
											}}
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
	];
	const classes = useStyles();
	const [inventory, setInventories] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [rowCountState, setRowCountState] = useState<number>(0); // Total number of items
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 5,
	});
	const [searchTouched, setSearchTouched] = useState(false);
	const [newInventoryModal, setNewInventoryModal] = useState(false);
	const [searchData, setSearchData] = useState<Patients[]>([]);
	const handleRowClick = () => {
		navigate(`#`);
	};
	useEffect(() => {
		setFundingsource(options);
	}, []);

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

	const handleDelete = async (inventoryId: string, event: any) => {
		event.preventDefault();
		console.log('this is Inventory id ' + inventoryId);
		const formData = new FormData();
		formData.append('inventoryId', inventoryId); // Add the facility ID to the form data

		try {
			const response = await axios.put(
				apiconfig.apiHostUrl + endpoint.deleteinventory,
				formData, // Send the form data
				{
					headers: { 'Content-Type': 'multipart/form-data' }, // This matches the expected content type
				},
			);
			console.log(response.data); // Handle the response as needed

			if (response.data.status === 'Success') {
				listInventory();
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
						<CardTitle>All Inventories </CardTitle>
					</CardHeaderChild>
				</CardHeader>
				<GridPagination />
			</GridToolbarContainer>
		);
	}
	const getRowId = (row: Inventory) => {
		return `${row.inventoryId}-${row.inventoryDate}`;
	};

	const handlePaginationModelChange = (newModel: GridPaginationModel) => {
		setPaginationModel(newModel);
	};

	const listInventory = () => {
		setLoading(true);
		const requestData = {
			keyword: globalFilter || '',
			pagenumber: paginationModel.page + 1,
			pagesize: paginationModel.pageSize,
			facilityName: '',
			inventoryId: 0,
			inventorctId: '',
			quantityDate: '',
			produyRemaining: '',
			tempRecorded: '',
			unitOfTemp: '',
			siteName: '',
		};
		axios
			.post(apiconfig.apiHostUrl + endpoint.searchInventory, requestData)
			.then((response) => {
				setLoading(true);
				const { items, totalCount } = response.data;

				if (items.length > paginationModel.pageSize) {
					console.warn('API returned more items than the requested page size.');
				}
				setInventories(items);
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
			const searchDataFilter = inventory.filter(
				(item: any) => item?.firstName.startsWith(e.target.value),
			);
			setInventories(searchDataFilter);
		} else {
			listInventory();
		}
	};

	useEffect(() => {
		listInventory();
	}, [globalFilter, paginationModel]);

	useEffect(() => {
		async function callInitial() {
			axios
				.get(apiconfig.apiHostUrl + endpoint.getallfacilities)
				.then((response) => {
					setFacility(response.data);
				})
				.catch((error) => {
					console.error('Error fetching Facility:', error);
				});
			axios
				.get(apiconfig.apiHostUrl + endpoint.AllSites)
				.then((response) => {
					setSiteOptions(response.data);
				})
				.catch((error) => {
					console.error('Error fetching sites:', error);
				});
			axios
				.get(apiconfig.apiHostUrl + endpoint.getallproducts)
				.then((response) => {
					setProduct(response.data);
				})
				.catch((error) => {
					console.error('Error fetching Product:', error);
				});
		}
		callInitial();
	}, []);

	type Inventory = {
		id: string;
		createdDate: string;
		createdBy: string;
		updatedBy: string;
		inventoryId: number;
		inventoryDate: string;
		productId: string;
		quantityRemaining: string;
		expirationDate: string;
		tempRecorded: string;
		unitOfTemp: string;
		facilityId: string;
		facility: string;
		product: string;
		lotnumber: string;
		fundingsource: string;
		user: string;
		site: string;
		siteId: string;
		isEdit: boolean;
	};

	const openModal = () => {
		setNewInventoryModal(true);
	};

	const closeModal = () => {
		setNewInventoryModal(false);
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

	const [modalStatus, setModalStatus] = useState<boolean>(false);

	const formik = useFormik({
		initialValues: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			createdDate: '2024-01-17T18:25:24.798Z',
			createdBy: 'string',
			updatedBy: 'string',
			inventoryId: 0,
			inventoryDate: '',
			productId: generatedGUID,
			quantityRemaining: '',
			expirationDate: '',
			tempRecorded: '',
			unitOfTemp: '',
			facilityId: generatedGUID,
			facility: '',
			product: '',
			lotnumber: '',
			fundingsource: '',
			user: '5465ed1a-1fe4-4f88-998f-711955fff422',
			site: '',
			siteId: generatedGUID,
			isEdit: false,
		},

		validate: (values: Inventory) => {
			const errors: any = {};

			if (!values.facility) {
				errors.facility = 'Required';
			}
			if (!values.product) {
				errors.product = 'Required';
			}
			if (!values.lotnumber) {
				errors.lotnumber = 'Required';
			}
			if (!values.fundingsource) {
				errors.fundingsource = 'Required';
			}
			if (!values.site) {
				errors.site = 'Required';
			}
			if (!values.inventoryDate) {
				errors.inventoryDate = 'Required';
			}
			if (!values.expirationDate) {
				errors.expirationDate = 'Required';
			}
			if (!values.quantityRemaining) {
				errors.quantityRemaining = 'Required';
			}
			if (!values.tempRecorded) {
				errors.tempRecorded = 'Required';
			}
			if (!values.unitOfTemp) {
				errors.unitOfTemp = 'Required';
			}
			return errors;
		},

		onSubmit: async (values: Inventory) => {
			console.log('Request Payload: ', values);
			try {
				const postResponse = await axios.post(
					apiconfig.apiHostUrl + endpoint.createInventory,
					{ ...values },

					{
						headers: { 'Content-Type': 'application/json' },
					},
				);
				setNewInventoryModal(false);
				setEditTouched(false);
				popUp(`Inventory ${editTouched ? 'updated' : 'added'} successfully!`);
				listInventory();
				formik.setFieldValue('id', '');
				formik.setFieldValue('inventoryDate', '');
				formik.setFieldValue('quantityRemaining', '');
				formik.setFieldValue('expirationDate', '');
				formik.setFieldValue('tempRecorded', '');
				formik.setFieldValue('unitOfTemp', '');
				formik.setFieldValue('facility', '');
				formik.setFieldValue('product', '');
				formik.setFieldValue('lotnumber', '');
				formik.setFieldValue('fundingsource', '');
				formik.setFieldValue('site', '');
			} catch (error) {
				console.error('Error: ', error);
			}
		},
	});

	return (
		<div>
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
							New Inventory
						</Button>
						<Modal isOpen={newInventoryModal} setIsOpen={setNewInventoryModal}>
							<ModalHeader>
								{' '}
								{!editTouched ? 'Add New Inventory' : 'Modification'}
							</ModalHeader>
							<ModalBody>
								<div className='col-span-12 lg:col-span-9'>
									<div className='grid grid-cols-12 gap-4'>
										<div className='col-span-12'>
											<Card>
												<CardBody>
													<div className='grid grid-cols-12 gap-4'>
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='facility'>
																Facility Name{' '}
															</Label>
															<Validation
																isValid={formik.isValid}
																isTouched={formik.touched.facility}
																invalidFeedback={
																	formik.errors.facility
																}
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
																		id='facility'
																		name='facility'
																		style={{ color: 'black' }}
																		value={
																			formik.values.facility
																		}
																		onChange={(event) => {
																			formik.handleChange(
																				event,
																			);
																			// handleState(
																			// 	event.target.value,
																			// );
																		}}
																		onBlur={formik.handleBlur}
																		placeholder='Select Facility'>
																		{/* <option value={''}> Select</option> */}
																		{facility?.map(
																			(setfacility: any) => (
																				<option
																					style={{
																						color: 'black',
																					}}
																					id={
																						setfacility?.id
																					}
																					key={
																						setfacility?.id
																					}
																					value={
																						setfacility?.id
																					}>
																					{
																						setfacility.facilityName
																					}
																				</option>
																			),
																		)}
																	</Select>
																</FieldWrap>
															</Validation>
														</div>
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='site'>Site Name</Label>
															<Validation
																isValid={formik.isValid}
																isTouched={formik.touched.site}
																invalidFeedback={formik.errors.site}
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
																		id='site'
																		name='site'
																		style={{ color: 'black' }}
																		value={formik.values.site}
																		onChange={(event) => {
																			formik.handleChange(
																				event,
																			);
																			// handleState(
																			// 	event.target.value,
																			// );
																		}}
																		onBlur={formik.handleBlur}
																		placeholder='Select site'>
																		{/* <option value={''}> Select</option> */}
																		{siteOptions?.map(
																			(setsite: any) => (
																				<option
																					style={{
																						color: 'black',
																					}}
																					id={setsite?.id}
																					key={
																						setsite?.id
																					}
																					value={
																						setsite?.id
																					}>
																					{
																						setsite?.siteName
																					}
																				</option>
																			),
																		)}
																	</Select>
																</FieldWrap>
															</Validation>
														</div>
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='product'>Product</Label>
															<Validation
																isValid={formik.isValid}
																isTouched={formik.touched.product}
																invalidFeedback={
																	formik.errors.product
																}
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
																		id='product'
																		name='product'
																		style={{ color: 'black' }}
																		value={
																			formik.values.product
																		}
																		onChange={(event) => {
																			formik.handleChange(
																				event,
																			);
																			// handleState(
																			// 	event.target.value,
																			// );
																		}}
																		onBlur={formik.handleBlur}
																		placeholder='Select Product'>
																		{/* <option value={''}> Select</option> */}
																		{product?.map(
																			(setproduct: any) => (
																				<option
																					style={{
																						color: 'black',
																					}}
																					id={
																						setproduct?.id
																					}
																					key={
																						setproduct?.id
																					}
																					value={
																						setproduct?.id
																					}>
																					{
																						setproduct.productName
																					}
																				</option>
																			),
																		)}
																	</Select>
																</FieldWrap>
															</Validation>
														</div>
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='lotnumber'>
																Lot Number
															</Label>
															<Validation
																isValid={formik.isValid}
																isTouched={formik.touched.lotnumber}
																invalidFeedback={
																	formik.errors.lotnumber
																}
																validFeedback='Good'>
																<Input
																	type='text'
																	id='lotnumber'
																	name='lotnumber'
																	onChange={formik.handleChange}
																	value={formik.values.lotnumber}
																	onBlur={formik.handleBlur}
																/>
															</Validation>
														</div>
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='fundingsource'>
																Funding Source
															</Label>
															<Validation
																isValid={formik.isValid}
																isTouched={
																	formik.touched.fundingsource
																}
																invalidFeedback={
																	formik.errors.fundingsource
																}
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
																		id='fundingsource'
																		name='fundingsource'
																		style={{ color: 'black' }}
																		value={
																			formik.values
																				.fundingsource
																		}
																		onChange={(event) => {
																			formik.handleChange(
																				event,
																			);
																		}}
																		onBlur={formik.handleBlur}
																		placeholder='Select fundingsource'>
																		{fundingsource.map(
																			(
																				option: Fundingsource,
																			) => (
																				<option
																					style={{
																						color: 'black',
																					}}
																					id={option.id}
																					key={option.id}
																					value={
																						option.id
																					}>
																					{
																						option.fundingsource
																					}
																				</option>
																			),
																		)}
																	</Select>
																</FieldWrap>
															</Validation>
														</div>
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='inventoryDate'>
																Inventory Date
															</Label>
															<Validation
																isValid={formik.isValid}
																isTouched={
																	formik.touched.inventoryDate
																}
																invalidFeedback={
																	formik.errors.inventoryDate
																}
																validFeedback='Good'>
																<Input
																	type='date'
																	id='inventoryDate'
																	name='inventoryDate'
																	onChange={formik.handleChange}
																	value={
																		formik.values.inventoryDate
																	}
																	onBlur={formik.handleBlur}
																/>
															</Validation>
														</div>
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='expirationDate'>
																Expiration Date
															</Label>
															<Validation
																isValid={formik.isValid}
																isTouched={
																	formik.touched.expirationDate
																}
																invalidFeedback={
																	formik.errors.expirationDate
																}
																validFeedback='Good'>
																<Input
																	type='date'
																	id='expirationDate'
																	name='expirationDate'
																	onChange={formik.handleChange}
																	value={
																		formik.values.expirationDate
																	}
																	onBlur={formik.handleBlur}
																/>
															</Validation>
														</div>
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='quantityRemaining'>
																Quantity Remaining
															</Label>
															<Validation
																isValid={formik.isValid}
																isTouched={
																	formik.touched.quantityRemaining
																}
																invalidFeedback={
																	formik.errors.quantityRemaining
																}
																validFeedback='Good'>
																<Input
																	type='text'
																	id='quantityRemaining'
																	name='quantityRemaining'
																	onChange={formik.handleChange}
																	value={
																		formik.values
																			.quantityRemaining
																	}
																	onBlur={formik.handleBlur}
																/>
															</Validation>
														</div>
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='tempRecorded'>
																Temp Recorded
															</Label>
															<Validation
																isValid={formik.isValid}
																isTouched={
																	formik.touched.tempRecorded
																}
																invalidFeedback={
																	formik.errors.tempRecorded
																}
																validFeedback='Good'>
																<Input
																	type='text'
																	id='tempRecorded'
																	name='tempRecorded'
																	onChange={formik.handleChange}
																	value={
																		formik.values.tempRecorded
																	}
																	onBlur={formik.handleBlur}
																/>
															</Validation>
														</div>
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='unitOfTemp'>
																Unit Of Temp
															</Label>
															<Validation
																isValid={formik.isValid}
																isTouched={
																	formik.touched.unitOfTemp
																}
																invalidFeedback={
																	formik.errors.unitOfTemp
																}
																validFeedback='Good'>
																<Input
																	type='text'
																	id='unitOfTemp'
																	name='unitOfTemp'
																	onChange={formik.handleChange}
																	value={formik.values.unitOfTemp}
																	onBlur={formik.handleBlur}
																/>
															</Validation>
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
										setNewInventoryModal(false);
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
								rows={inventory}
								columns={columns}
								rowCount={rowCountState}
								loading={loading}
								pageSizeOptions={[5, 10, 25]}
								paginationModel={paginationModel}
								paginationMode='server'
								onPaginationModelChange={handlePaginationModelChange}
								checkboxSelection
								// onRowClick={handleRowClick}
								getRowId={(row) => `${row.facilityName}-${row.inventoryId}`}
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
		</div>
	);
};

export default InventoryManagement;
