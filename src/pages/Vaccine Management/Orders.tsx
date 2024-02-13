import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import Badge from '../../components/ui/Badge';
import priceFormat from '../../Services/utils/priceFormat.util';
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
	GridRowId,
} from '@mui/x-data-grid';

import {
	MoreVert as MoreVertIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, BoldOutlined } from '@ant-design/icons';
import { GridCellParams, GridRowParams } from '@mui/x-data-grid';
import { appPages } from '../../config/pages.config';
import { Orders } from '../../interface/order.interface';
import Modal, { ModalBody, ModalHeader, ModalFooter, TModalSize } from '../../components/ui/Modal';
import { UUID } from 'crypto';
import Validation from '../../components/form/Validation';
// import {
// 	handlevaccines,
// 	handleFacility,
// 	handleProduct,
// 	table,
// 	columnHelper,
// 	columns,
// 	Vaccine,
// } from '../../pages/Vaccine Management/AddOrder';
import { useFormik } from 'formik';
import Label from '../../components/form/Label';
import { orderApi } from '../../Apis/orderApi';
import { v4 as uuidv4 } from 'uuid';
import apiconfig from '../../config/apiconfig';
import Checkbox, { CheckboxGroup } from '../../components/form/Checkbox';
import tagsDb from '../../mocks/db/tags.db';
import toast, { Toaster } from 'react-hot-toast';
import Select from '../../components/form/Select';
import { number } from 'prop-types';
import { fontFamily, width } from '@mui/system';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownNavLinkItem,
	DropdownToggle,
} from '../../components/ui/Dropdown';
import TableTemplate, { TableCardFooterTemplate } from '../../templates/common/TableParts.template';
import { indexOf } from 'lodash';

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
type TModalStableSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const OrderManagement = () => {
	const [filteredFacility, setFilteredFacility] = useState([]);
	const [filteredProduct, setFilteredProduct] = useState([]);
	const navigate = useNavigate();
	const [editTouched, setEditTouched] = useState(false);
	const [editData, setEditData] = useState<any>([]);
	const classes = useStyles();
	const [Orders, setOrders] = useState<any[]>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false); // Track loading state
	const [rowCountState, setRowCountState] = useState<number>(0); // Total number of items
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 5,
	});
	const [openModal, setOpenModal] = useState(false);
	const [searchTouched, setSearchTouched] = useState(false);
	const [newOrderModal, setNewOrderModal] = useState(false);
	let generatedGUID: string;
	generatedGUID = uuidv4();
	const [value, setValue] = useState(localStorage.getItem('token'));
	const [filteredVaccine, setFilteredVaccine] = useState<Vaccine[]>([]);

	const [vaccineloading, setVaccineLoading] = useState<boolean>(false);
	const [rowcountstates, setRowCountstates] = useState<number>(0);
	const [sorting, setSorting] = useState<SortingState>([]);

	const handleFacility = async () => {
		const response = await orderApi(`/api/Vaccination/getallfacilities`, 'GET')
			.then((resp) => setFilteredFacility(resp?.data))
			.catch((err) => console.log('err', err));
	};
	const handleProduct = async () => {
		const response = await orderApi(`/api/Vaccination/getallproducts`, 'GET')
			.then((resp) => setFilteredProduct(resp?.data))
			.catch((err) => console.log('err', err));
	};

	type Vaccine = {
		product: string;
		vaccine: string;
		manufacturer: string;
		productid: string;
		vaccineid: string;
		manufacturerid: string;
		inventoryid: string;
	};
	const columnHelper = createColumnHelper<Vaccine>();
	const columns = [
		columnHelper.accessor('product', {
			cell: (info) => <div className='font-bold'>{info.getValue()}</div>,
			header: 'Product',
		}),
		columnHelper.accessor('vaccine', {
			cell: (info) => <div className='font-bold'>{info.getValue()}</div>,
			header: 'vaccine',
		}),
		columnHelper.accessor('manufacturer', {
			cell: (info) => <div className='font-bold'>{info.getValue()}</div>,
			header: 'manufacturer',
		}),
		columnHelper.display({
			cell: () => <Button>ADD TO CART</Button>,
			header: 'Actions',
		}),
	];
	const handlevaccines = async (facilityid: any) => {
		const pagenumber = paginationModel.page + 1;
		const pagesize = paginationModel.pageSize;
		axios
			.post(
				apiUrl +
					'api/Vaccination/getallvaccinesbyfacilityid?facilityid=' +
					facilityid +
					'&pagenumber=' +
					pagenumber +
					'&pagesize=' +
					pagesize,
			)
			.then((response) => {
				setVaccineLoading(true);
				const { items, totalCount } = response.data;
				setFilteredVaccine(response.data);

				if (items.length > paginationModel.pageSize) {
					console.warn('API returned more items than the requested page size.');
				}

				const totalRowCount = response.data.totalCount; // Assuming API returns totalCount
				setRowCountstates((prevRowCountState) =>
					totalRowCount !== undefined ? totalRowCount : prevRowCountState,
				);
				setVaccineLoading(false); // End loading
			})
			.catch((error) => {
				console.error('Error fetching data: ', error);
				setVaccineLoading(false); // End loading
			});
	};
	//const [data] = useState<TProduct[]>(() => [...productsDb]);
	//const [data] = useState<Vaccine[]>(() => [...filteredVaccine]);
	//const data = [...filteredVaccine[5]];

	const [data] = useState<any>(() => [
		{
			product: 'ACTHIB',
			vaccine: 'Hib (PRP-T)',
			manufacturer: 'Sanofi Pasteur',
			productid: '287a213a-6594-4361-8afb-f1fc2f5957f4',
			vaccineid: 'c3d7063d-4e99-404f-84c2-aa647be0e43a',
			manufacturerid: 'b0ba11e5-178e-428c-931c-e5906456dc05',
			inventoryid: 'ba54a09f-fe1d-45d1-b613-f25e0d35fbc3',
		},
		{
			product: 'ACAM2000',
			vaccine: 'vaccinia (smallpox)',
			manufacturer: 'Emergent BioSolutions',
			productid: 'e672d84a-b162-487b-8009-b2c9f12c0ea5',
			vaccineid: '8b8b06f5-9fe3-443a-9fee-115b433f4d76',
			manufacturerid: '42181174-a7b4-4713-bef0-f0e2593cffcf',
			inventoryid: '1802e62f-1060-44ac-94ab-c2506ac1ef09',
		},
		{
			product: 'ACAM2000',
			vaccine: 'vaccinia (smallpox)',
			manufacturer: 'Acambis, Inc',
			productid: '62a9c0f0-e1fc-4d76-b660-befabae88471',
			vaccineid: '8b8b06f5-9fe3-443a-9fee-115b433f4d76',
			manufacturerid: 'a8b44416-6af1-4639-a859-c150c743c27e',
			inventoryid: '97d5ee45-1a75-4a50-9d2a-c66de1aa4b9a',
		},
		{
			product: 'ABRYSVO',
			vaccine: 'RSV, bivalent, protein subunit RSVpreF, diluent reconstituted, 0.5 mL, PF',
			manufacturer: 'Pfizer, Inc',
			productid: 'df6171d0-1914-4e1e-aec2-3b8f0633ccce',
			vaccineid: '1f4b6f95-c003-4f80-aace-e6d1fbb2b70d',
			manufacturerid: '18084f08-c5d9-4774-afe9-ed73a8267bf0',
			inventoryid: 'd20ace8a-fcb2-42ee-bd67-3f828010d442',
		},
		{
			product: 'ABRYSVO',
			vaccine: 'RSV, bivalent, protein subunit RSVpreF, diluent reconstituted, 0.5 mL, PF',
			manufacturer: 'Pfizer, Inc',
			productid: 'df6171d0-1914-4e1e-aec2-3b8f0633ccce',
			vaccineid: '1f4b6f95-c003-4f80-aace-e6d1fbb2b70d',
			manufacturerid: '18084f08-c5d9-4774-afe9-ed73a8267bf0',
			inventoryid: 'c58e5617-880a-4bb7-9ad1-1b26a8800ffe',
		},
	]);
	//setData(filteredVaccine);
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),

		initialState: {
			pagination: { pageSize: 5 },
		},
		// debugTable: true,
	});

	const handleEditData = async (params: any, event: any) => {
		event.preventDefault();
		setNewOrderModal(true);
		setEditTouched(true);
		formik.setFieldValue('Facility', params.row.Facility);
		handleFacility();
		formik.setFieldValue('Product', params.row.Product);
		formik.setFieldValue('OrderDate', params.row.OrderDate);
		formik.setFieldValue('Quantity', params.row.Quantity);
		formik.setFieldValue('UnitPrice', params.row.UnitPrice);
		formik.setFieldValue('OrderTotal', params.row.OrderTotal);
		formik.setFieldValue('OrderStatus', params.row.OrderStatus);
		formik.setFieldValue('TaxAmount', params.row.TaxAmount);
		formik.setFieldValue('DiscountAmount', params.row.DiscountAmount);
		formik.setFieldValue('FacilityId', params.row.FacilityId);
		formik.setFieldValue('ProductId', params.row.ProductId);
		formik.setFieldValue('personType', params.row.personType);
	};
	const ordercolumns = [
		{ field: 'product', headerName: 'Product', width: 140 },
		{ field: 'orderItemDesc', headerName: 'OrderItem Desc', width: 140 },
		{ field: 'facility', headerName: 'Facility', width: 140 },
		{ field: 'orderDate', headerName: 'Order Date', width: 140 },
		{ field: 'quantity', headerName: 'Quantity', width: 140 },
		{ field: 'unitPrice', headerName: 'Unit Price', width: 140 },
		{ field: 'orderTotal', headerName: 'Order Total', width: 140 },
		{ field: 'orderStatus', headerName: 'Order Status', width: 140 },
		{
			field: 'actions',
			headerName: 'Actions',
			width: 100,
			renderCell: (params: GridCellParams) => {
				return (
					<div className='group relative'>
						{' '}
						{/* Ensure this div is relative for positioning context */}
						<MoreVertIcon className='cursor-pointer' />
						<div
							className='absolute left-10 top-full mt-1 hidden -translate-x-1/2 -translate-y-full 
                        transform flex-col items-center bg-white shadow-md group-hover:flex'>
							<Space size='middle'>
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
							</Space>
						</div>
					</div>
				);
			},
		},
	];

	const handleRowClick = (params: GridRowParams) => {
		// Ensure to use backticks for template literals
		navigate(`${appPages.crmAppPages.subPages.OrdersPage.to}/${params.id}`);
	};
	const apiUrl = apiconfig.apiHostUrl;
	const handleDelete = async (orderId: string, event: any) => {
		event.preventDefault();
		//console.log('this is orderId id ' + orderId);
		const formData = new FormData();
		formData.append('orderId', orderId); // Add the facility ID to the form data

		try {
			const response = await axios.put(
				apiUrl + 'api/Vaccination/deleteorder',
				formData, // Send the form data
				{
					headers: { 'Content-Type': 'multipart/form-data' }, // This matches the expected content type
				},
			);
			//console.log(response.data); // Handle the response as needed

			if (response.data.status === 'Success') {
				listOrders();
			}
		} catch (error) {
			console.error('Error deleting orders:', error);
		}
	};
	function CustomPagination() {
		return (
			<GridToolbarContainer className='flex w-full items-center justify-between'>
				<CardHeader>
					<CardHeaderChild>
						<CardTitle>All Orders</CardTitle>
					</CardHeaderChild>
				</CardHeader>
				<GridPagination />
			</GridToolbarContainer>
		);
	}

	const handlePaginationModelChange = (newModel: GridPaginationModel) => {
		setPaginationModel(newModel);
	};

	const listOrders = () => {
		setLoading(true);
		const requestData = {
			keyword: globalFilter || '',
			pagenumber: paginationModel.page + 1,
			pagesize: paginationModel.pageSize,
			date_of_order: '',
			order_status: '',
			order_item_desc: '',
		};

		axios
			.post(apiUrl + 'api/Vaccination/searchorders', requestData)
			.then((response) => {
				setLoading(true);
				const { items, totalCount } = response.data;

				if (items.length > paginationModel.pageSize) {
					console.warn('API returned more items than the requested page size.');
				}
				//console.log(items);
				setOrders(items);
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

	useEffect(() => {
		listOrders();
		listData();
	}, []);

	const listData = () => {
		async function callInitial() {
			await orderApi('/api/Vaccination/getallfacilities', 'GET')
				.then((response) => {
					setFilteredFacility(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
			await orderApi('/api/Vaccination/getallproducts', 'GET')
				.then((response) => {
					setFilteredProduct(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
		}
		callInitial();
	};
	type Order = {
		id: string;
		createdDate: string;
		createdBy: string;
		updatedBy: string;
		orderId: number;
		Facility: string;
		FacilityId: string;
		UserId: string;
		DiscountAmount: string;
		Incoterms: string;
		OrderDate: string;
		OrderStatus: string;
		OrderTotal: string;
		TaxAmount: string;
		TermsConditionsId: string;
		OrderItemDesc: string;
		OrderItemStatus: string;
		Product: string;
		ProductId: string;
		Quantity: string;
		UnitPrice: string;
	};
	const reset = () => {
		formik.setFieldValue('OrderItemDesc', '');
		formik.setFieldValue('Facility', '');
		formik.setFieldValue('Product', '');
		formik.setFieldValue('OrderItemStatus', '');
		formik.setFieldValue('UnitPrice', '');
		formik.setFieldValue('Quantity', '');
		formik.setFieldValue('DiscountAmount', '');
		formik.setFieldValue('Incoterms', '');
		formik.setFieldValue('OrderDate', '');
		formik.setFieldValue('OrderStatus', '');
		formik.setFieldValue('OrderTotal', '');
		formik.setFieldValue('TaxAmount', '');
	};

	const [modalStatus, setModalStatus] = useState<boolean>(false);
	const formik = useFormik({
		initialValues: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			orderId: 0,
			Facility: '',
			FacilityId: generatedGUID,
			UserId: generatedGUID,
			DiscountAmount: '',
			Incoterms: '',
			OrderDate: '',
			OrderStatus: '',
			OrderTotal: '',
			TaxAmount: '',
			TermsConditionsId: generatedGUID,
			OrderItemDesc: '',
			OrderItemStatus: '',
			ProductId: generatedGUID,
			Product: '',
			Quantity: '',
			UnitPrice: '',
			createdDate: '2024-01-17T18:25:24.798Z',
			createdBy: 'string',
			updatedBy: 'string',
		},

		validate: (values: Order) => {
			const errors: any = {};

			if (!values.Facility) {
				errors.Facility = 'Required';
			}
			if (!values.Product) {
				errors.Product = 'Required';
			}
			if (!values.OrderItemDesc) {
				errors.OrderItemDes = 'Required';
			}
			if (!values.OrderStatus) {
				errors.OrderStatus = 'Required';
			}
			if (!values.DiscountAmount) {
				errors.DiscountAmount = 'Required';
			}
			if (!values.TaxAmount) {
				errors.TaxAmount = 'Required';
			}
			if (!values.OrderDate) {
				errors.OrderDate = 'Required';
			}
			if (!values.OrderTotal) {
				errors.OrderTotal = 'Required';
			}
			if (!values.Quantity) {
				errors.Quantity = 'Required';
			}
			if (!values.UnitPrice) {
				errors.UnitPrice = 'Required';
			}
			return errors;
		},

		onSubmit: async (values: Order) => {
			//console.log('Request Payload: ', values);
			try {
				const postResponse = await axios.post(
					apiUrl + 'api/Vaccination/createorder',
					values,
					{
						headers: { 'Content-Type': 'application/json' },
					},
				);
				setNewOrderModal(false);
				setEditTouched(false);
				setTimeout(() => {
					toast.success(`Order ${editTouched ? 'updated' : 'added'} successfully!`);
				}, 2000);
				listOrders();
				formik.setFieldValue('id', '');
				formik.setFieldValue('Facility', '');
				formik.setFieldValue('FacilityId', '');
				formik.setFieldValue('UserId', '');
				formik.setFieldValue('DiscountAmount', '');
				formik.setFieldValue('TaxAmount', '');
				formik.setFieldValue('TermsConditionsId', '');
				formik.setFieldValue('Incoterms', '');
				formik.setFieldValue('OrderDate', '');
				formik.setFieldValue('OrderStatus', '');
				formik.setFieldValue('OrderTotal', '');
				formik.setFieldValue('OrderItemDesc', '');
				formik.setFieldValue('OrderItemStatus', '');
				formik.setFieldValue('Quantity', '');
				formik.setFieldValue('orderId', '');
				formik.setFieldValue('UnitPrice', '');
				formik.setFieldValue('Product', '');
			} catch (error) {
				console.error('Error: ', error);
			}
		},
	});

	return (
		<PageWrapper name='Order List'>
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
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					<Button
						variant='solid'
						icon='HeroPlus'
						onClick={() => {
							setNewOrderModal(true);
							setEditTouched(false);
							reset();
						}}>
						Order Vaccine
					</Button>
					<Modal
						isOpen={newOrderModal}
						setIsOpen={setNewOrderModal}
						size={'2xl'}
						isCentered={true}
						isAnimation={true}>
						<ModalHeader>
							{!editTouched ? 'Vaccine Order Form' : 'Edit Order'}
						</ModalHeader>
						<ModalBody>
							<PageWrapper name='Vaccine List'>
								<Container>
									<Card className='h-full'>
										<CardHeader>
											<CardHeaderChild>
												<CardTitle>All Vaccines</CardTitle>
											</CardHeaderChild>
											<CardHeaderChild>
												<div>
													<Label htmlFor='Facility'>Facility</Label>
													<Validation
														isValid={formik.isValid}
														isTouched={formik.touched.Facility}
														invalidFeedback={formik.errors.Facility}
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
																id='Facility'
																name='Facility'
																style={{ color: 'black' }}
																value={formik.values.Facility}
																onChange={(event) => {
																	formik.handleChange(event);
																	handleFacility();
																	handlevaccines(
																		event.target.value,
																	);
																}}
																onBlur={formik.handleBlur}
																placeholder='Select Facility'>
																{/* <option value={''}> Select</option> */}
																{filteredFacility?.map(
																	(facility: any) => (
																		<option
																			style={{
																				color: 'black',
																			}}
																			id={facility?.id}
																			key={facility?.id}
																			value={facility?.id}>
																			{facility?.facilityName}
																		</option>
																	),
																)}
															</Select>
														</FieldWrap>
													</Validation>
												</div>
											</CardHeaderChild>
										</CardHeader>
										<CardBody className='overflow-auto'>
											<TableTemplate
												className='table-fixed max-md:min-w-[50rem]'
												table={table}
											/>
										</CardBody>
										<TableCardFooterTemplate table={table} />
									</Card>
								</Container>
							</PageWrapper>
						</ModalBody>
						<ModalFooter>
							<Button
								variant='solid'
								onClick={() => {
									setNewOrderModal(false);
									setEditTouched(false);
								}}>
								Back to Orders
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
							rows={Orders}
							columns={ordercolumns}
							rowCount={rowCountState}
							loading={loading}
							pageSizeOptions={[5, 10, 25]}
							paginationModel={paginationModel}
							paginationMode='server'
							onPaginationModelChange={handlePaginationModelChange}
							checkboxSelection
							// onRowClick={handleRowClick}
							//getRowId={(row) => `${row.}-${row.personId}`}
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

export default OrderManagement;
