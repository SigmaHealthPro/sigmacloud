import React, { useState, useEffect, useMemo, ReactNode, useContext, FC } from 'react';
import axios from 'axios';
import { PublicBaseSelectProps } from 'react-select/base';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../components/ui/Card';
import Button, { IButtonProps } from '../../components/ui/Button';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import CartPartial from '../../templates/layouts/Headers/_partial/Cart.partial';
import { TUser } from '../../mocks/db/users.db';
import DefaultHeaderRightCommon from '../../templates/layouts/Headers/_common/DefaultHeaderRight.common';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	createTable,
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
	ViewColumnOutlined,
	ViewCarousel,
	ViewComfyOutlined,
	ViewAgendaOutlined,
	ViewKanban,
} from '@mui/icons-material';
import QuantityUpdater from './QuantityUpdater';
import { makeStyles } from '@mui/styles';
import { Button as AntButton, Popconfirm, Space, Table } from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	MoreOutlined,
	BoldOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { GridCellParams, GridRowParams } from '@mui/x-data-grid';
import { appPages } from '../../config/pages.config';
import { Orders } from '../../interface/order.interface';
import { Cart } from '../../interface/cart.interface';
import Modal, { ModalBody, ModalHeader, ModalFooter, TModalSize } from '../../components/ui/Modal';
import { UUID } from 'crypto';
import Validation from '../../components/form/Validation';
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
import CustomDatecomp from './CustomDatecomp';
import {
	DataContextProvider,
	useDataContext,
	DataContext,
	DataContextValue,
} from '../../context/dataContext';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownNavLinkItem,
	DropdownToggle,
} from '../../components/ui/Dropdown';
import TableTemplate, { TableCardFooterTemplate } from '../../templates/common/TableParts.template';
import { indexOf } from 'lodash';
import themeConfig from '../../config/theme.config';
import SvgViewColumns from '../../components/icon/heroicons/ViewColumns';
import { HeroEye } from '../../components/icon/heroicons';
import { left, right } from '@popperjs/core';

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
interface ShipmentAddressModel {
	username: string;
	id: string;
	addressid: string;
	line1: string;
	line2: string;
	suite: string;
	cityname: string;
	countyname: string;
	statename: string;
	countryname: string;
	countyid: string;
	countryid: string;
	stateid: string;
	cityid: string;
	zipCode: string;
}
interface Orderitemmodel {
	id: string;
	itemid: string;
	quantity: string;
	orderitemdesc: string;
	typeofpackage: string;
	unitprice: string;
}
const OrderManagement: React.FC = () => {
	var productname = '';
	var vaccinename = '';
	var manufacturername = '';
	const [filteredFacility, setFilteredFacility] = useState([]);
	const [filteredManufacturer, setFilteredManufacturer] = useState([]);
	const [filteredProduct, setFilteredProduct] = useState([]);
	const navigate = useNavigate();
	const [editTouched, setEditTouched] = useState(false);
	const [editData, setEditData] = useState<any>([]);
	const classes = useStyles();
	const [Orders, setOrders] = useState<any[]>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false); // Track loading state
	const [rowCountState, setRowCountState] = useState<number>(0); // Total number of items
	const [shipmentAddress, setShipmentAddress] = useState<ShipmentAddressModel | null>(null);
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 5,
	});
	const [orderitemsData, setorderitemsData] = useState<Orderitemmodel[]>([]);
	var Itemadded = 0;
	const [openModal, setOpenModal] = useState(false);
	const [searchTouched, setSearchTouched] = useState(false);
	const [newOrderModal, setNewOrderModal] = useState(false);
	const [newCartItem, setNewCart] = useState(false);
	let generatedGUID: string;
	generatedGUID = uuidv4();
	const [value, setValue] = useState(localStorage.getItem('token'));
	const [filteredVaccine, setFilteredVaccine] = useState<Vaccine[]>([]);

	const [vaccineloading, setVaccineLoading] = useState<boolean>(false);
	const [rowcountstates, setRowCountstates] = useState<number>(0);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
	const [cartItems, setCartItems] = useState<Cart[]>([]);
	const { setData } = useDataContext();
	const [viewOrderModal, setViewOrderModal] = useState(false);
	const [localData, setLocalData] = useState<TUser | null>(null);

	const handleQuantityChange = (quantity: number) => {
		setSelectedQuantity(quantity);
	};
	const { addItemToCart } = useContext(DataContext) as DataContextValue;

	type Vaccine = {
		product: string;
		vaccine: string;
		manufacturer: string;
		productid: string;
		vaccineid: string;
		manufacturerid: string;
		inventoryid: string;
		quantity: string;
		price: string;
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
		columnHelper.accessor('quantity', {
			cell: (row) => (
				<div>
					<QuantityUpdater
						rowId={row.row.id}
						defaultValue={1}
						step={1}
						min={0}
						max={999}
					/>
				</div>
			),

			header: 'quantity',
		}),
		columnHelper.display({
			cell: (info) => (
				<Button
					variant='solid'
					icon='HeroShoppingCart'
					onClick={() => {
						localStorage.setItem('productname', info.row.original.product);
						localStorage.setItem('vaccinename', info.row.original.vaccine);
						localStorage.setItem('manufacturername', info.row.original.manufacturer);
						addItemToCart({
							productid: info.row.original.productid,
							product: info.row.original.product,
							vaccine: info.row.original.vaccine,
							manufacturer: info.row.original.manufacturer,
							quantity: localStorage.getItem('quantityselected:${rowId}:') ?? '0',
							price: info.row.original.price,
						});
						<CartPartial />;
					}}>
					ADD TO CART
				</Button>
			),
			header: 'Actions',
		}),
	];
	const handlevaccines = async (facilityid: any, manufacturerid: any) => {
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
					pagesize +
					'&manufacturerid=' +
					manufacturerid,
			)
			.then((response) => {
				setVaccineLoading(true);
				const { items, totalCount } = response.data;
				setFilteredVaccine(response.data?.items);

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
	const data = useMemo(() => {
		// Create a copy of the source array
		if (filteredVaccine == null) {
			return []; // Return an empty array
		}
		return [...filteredVaccine];
	}, [filteredVaccine]);
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

	const ordercolumns = [
		//{ field: 'id', headerName: 'Order ID', width: 250, hide: true }, // Hidden Order ID field
		{ field: 'product', headerName: 'Product', width: 140 },
		{ field: 'manufacturername', headerName: 'Manufacturer', width: 250, hide: true }, // Hidden Order ID field
		//{ field: 'createdBy', headerName: 'CreatedBy', width: 250, hide: true },
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
							<Space size='small'>
								<AntButton
									icon={
										<EyeOutlined
											onClick={(event) => handleViewData(params, event)}
										/>
									}
								/>
							</Space>
						</div>
					</div>
				);
			},
		},
	];
	const handleViewData = async (params: any, event: any) => {
		const orderid = params.row.id;
		const postResponse = await axios
			.post(apiUrl + 'api/Vaccination/getaddressbyorderid?orderid=' + orderid)
			.then((response) => {
				setShipmentAddress(response?.data.data);
				console.log('shipment', response.data.data);
			})
			.catch((err) => console.log('Error has occured', err));
		const itemslist = await axios
			.post(apiUrl + 'api/Vaccination/getitemsbyorderid?orderid=' + orderid)
			.then((response) => {
				setorderitemsData(response?.data.data);
				console.log('itemsdata', response.data.data);
			})
			.catch((err) => console.log('Error has occured', err));
		event.preventDefault();
		setEditTouched(false);
		setViewOrderModal(true);
		formik.setFieldValue('product', params.row.product);
		formik.setFieldValue('manufacturername', params.row.manufacturername);
		formik.setFieldValue('orderDate', params.row.orderDate);
		formik.setFieldValue('orderTotal', params.row.orderTotal);
		formik.setFieldValue('CreatedBy', params.row.createdBy);
		formik.setFieldValue('orderItemDesc', params.row.orderItemDesc);
		formik.setFieldValue('facility', params.row.facility);
		formik.setFieldValue('orderDate', params.row.orderDate);
		formik.setFieldValue('quantity', params.row.quantity);
		formik.setFieldValue('unitPrice', params.row.unitPrice);
		formik.setFieldValue('orderTotal', params.row.orderTotal);
		formik.setFieldValue('orderStatus', params.row.orderStatus);
	};

	const handleRowClick = (params: GridRowParams) => {
		// Ensure to use backticks for template literals
		navigate(`${appPages.crmAppPages.subPages.OrdersPage.to}/${params.id}`);
	};
	const apiUrl = apiconfig.apiHostUrl;

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
				console.log('searchordersdata', response.data);

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
		console.log('selectedorgid', localStorage.getItem('organizationidlogged'));
		const storedData = localStorage.getItem('apiData');
		if (storedData) {
			setLocalData(JSON.parse(storedData));
		}
		listOrders();
	}, [globalFilter, paginationModel]);
	let jurdid = localStorage.getItem('juridictionidlogged')?.toString();

	const listData = () => {
		async function callInitial() {
			await axios
				.post(apiUrl + 'api/Vaccination/getallfacilitiesbyjurdid?jurdid=' + jurdid)
				.then((response) => {
					setFilteredFacility(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
			await orderApi('/api/Vaccination/getallproducts', 'GET')
				.then((response) => {
					setFilteredProduct(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
			await orderApi('/api/Vaccination/getallmvx', 'GET')
				.then((response) => {
					setFilteredManufacturer(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
		}
		callInitial();
	};

	type Order = {
		id: string;
		createdDate: string;
		CreatedBy: string;
		updatedBy: string;
		orderId: number;
		facility: string;
		facilityId: string;
		UserId: string;
		DiscountAmount: string;
		Incoterms: string;
		orderDate: string;
		orderStatus: string;
		orderTotal: string;
		TaxAmount: string;
		TermsConditionsId: string;
		orderItemDesc: string;
		OrderItemStatus: string;
		product: string;
		ProductId: string;
		quantity: string;
		unitPrice: string;
		manufacturername: string;
		manufacturer: string;
		manufacturerid: string;
	};
	const reset = () => {
		formik.setFieldValue('orderItemDesc', '');
		formik.setFieldValue('facility', '');
		formik.setFieldValue('product', '');
		formik.setFieldValue('OrderItemStatus', '');
		formik.setFieldValue('unitPrice', '');
		formik.setFieldValue('quantity', '');
		formik.setFieldValue('DiscountAmount', '');
		formik.setFieldValue('Incoterms', '');
		formik.setFieldValue('orderDate', '');
		formik.setFieldValue('orderStatus', '');
		formik.setFieldValue('orderTotal', '');
		formik.setFieldValue('TaxAmount', '');
	};

	const formik = useFormik({
		initialValues: {
			id: '',
			orderId: 0,
			facility: '',
			facilityId: '',
			UserId: generatedGUID,
			DiscountAmount: '',
			Incoterms: '',
			orderDate: '',
			orderStatus: '',
			orderTotal: '',
			TaxAmount: '',
			TermsConditionsId: generatedGUID,
			orderItemDesc: '',
			OrderItemStatus: '',
			ProductId: generatedGUID,
			product: '',
			quantity: '',
			unitPrice: '',
			createdDate: '2024-01-17T18:25:24.798Z',
			CreatedBy: '',
			updatedBy: 'string',
			manufacturername: '',
			manufacturer: '',
			manufacturerid: '',
		},

		validate: (values: Order) => {
			const errors: any = {};

			if (!values.facility) {
				errors.Facility = 'Required';
			}
			if (!values.product) {
				errors.product = 'Required';
			}
			if (!values.orderItemDesc) {
				errors.OrderItemDes = 'Required';
			}
			if (!values.orderStatus) {
				errors.orderStatus = 'Required';
			}
			if (!values.DiscountAmount) {
				errors.DiscountAmount = 'Required';
			}
			if (!values.TaxAmount) {
				errors.TaxAmount = 'Required';
			}
			if (!values.orderDate) {
				errors.OrderDate = 'Required';
			}
			if (!values.orderTotal) {
				errors.OrderTotal = 'Required';
			}
			if (!values.quantity) {
				errors.Quantity = 'Required';
			}
			if (!values.unitPrice) {
				errors.UnitPrice = 'Required';
			}
			return errors;
		},

		onSubmit: async (values: Order) => {
			//console.log('Request Payload: ', values);
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
							// localStorage.removeItem('itemcount');
							setNewCart(false);
							setNewOrderModal(true);
							reset();
							listData();
						}}>
						Order Vaccine
					</Button>
					<Modal
						isOpen={newOrderModal}
						setIsOpen={setNewOrderModal}
						size={'2xl'}
						isCentered={true}
						isAnimation={true}>
						<ModalHeader>{'Order Vaccines'}</ModalHeader>
						<ModalBody>
							<PageWrapper name='Vaccine List'>
								<Container>
									<Card className='h-full'>
										<CardHeader>
											<CardHeaderChild>
												<div className='grid grid-cols-12 gap-6'>
													<div className='col-span-12 lg:col-span-3'>
														<Label htmlFor='Facility'>Facility</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.facility}
															invalidFeedback={formik.errors.facility}
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
																	name='facility'
																	style={{ color: 'black' }}
																	value={formik.values.facility}
																	onChange={(event) => {
																		formik.handleChange(event);
																		localStorage.setItem(
																			'selectedfacility:',
																			event.target.value,
																		);
																		formik.setFieldValue(
																			'facilityId',
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
																				value={
																					facility?.id
																				}>
																				{
																					facility?.facilityName
																				}
																			</option>
																		),
																	)}
																</Select>
															</FieldWrap>
														</Validation>
													</div>
													<div className='col-span-12 lg:col-span-3'>
														<Label htmlFor='Manufacturer'>
															Manufacturer
														</Label>
														<Validation
															isValid={formik.isValid}
															isTouched={formik.touched.manufacturer}
															invalidFeedback={
																formik.errors.manufacturer
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
																	id='Manufacturer'
																	name='manufacturer'
																	style={{ color: 'black' }}
																	value={
																		formik.values.manufacturer
																	}
																	onChange={(event) => {
																		formik.handleChange(event);
																		localStorage.setItem(
																			'selectedmanufacturer:',
																			event.target.value,
																		);
																		formik.setFieldValue(
																			'manufacturerid',
																			event.target.value,
																		);
																		handlevaccines(
																			formik.values
																				.facilityId,
																			event.target.value,
																		);
																	}}
																	onBlur={formik.handleBlur}
																	placeholder='Select Manufacturer'>
																	{/* <option value={''}> Select</option> */}
																	{filteredManufacturer?.map(
																		(manufacturer: any) => (
																			<option
																				style={{
																					color: 'black',
																				}}
																				id={
																					manufacturer?.Id
																				}
																				key={
																					manufacturer?.Id
																				}
																				value={
																					manufacturer?.id
																				}>
																				{
																					manufacturer?.manufacturerName
																				}
																			</option>
																		),
																	)}
																</Select>
															</FieldWrap>
														</Validation>
													</div>
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
									setNewCart(false);
									setNewOrderModal(false);
									setEditTouched(false);
								}}>
								Back to Orders
							</Button>
						</ModalFooter>
					</Modal>
					<Modal isOpen={viewOrderModal} size={'xl'} setIsOpen={setViewOrderModal}>
						<ModalHeader> {'Order Details'}</ModalHeader>
						<hr></hr>
						<ModalBody>
							<div className='col-span-12 lg:col-span-9'>
								<div className='grid grid-cols-12 gap-4'>
									<div className='col-span-12' style={{ height: '250px' }}>
										<Card>
											<CardBody>
												<div className='OrderDet'>
													<div>
														<span
															style={{
																fontSize: '18px',
																marginBottom: '5px',
																paddingBottom: '10px',
															}}>
															Order Information
														</span>
														<div style={{ height: '15px' }}></div>

														<div style={{ width: '200px' }}>
															<span
																style={{
																	fontSize: '14px',
																	display: 'inline-block',
																}}>
																Buyer:
															</span>
															<span
																style={{
																	marginLeft: '85px',
																	textAlign: right,
																	fontSize: '14px',
																}}>
																{' '}
																{formik.values.CreatedBy}
															</span>
														</div>
														<div></div>
														<div>
															<span style={{ fontSize: '14px' }}>
																Seller:{' '}
															</span>
															<span
																style={{
																	marginLeft: '85px',
																	textAlign: right,
																	fontSize: '14px',
																}}>
																{' '}
																{formik.values.manufacturername}
															</span>
														</div>
														<div></div>
														<div>
															<span style={{ fontSize: '14px' }}>
																Order placed on:{' '}
															</span>
															<span
																style={{
																	marginLeft: '20px',
																	textAlign: right,
																	fontSize: '14px',
																}}>
																{' '}
																<CustomDatecomp
																	orderDate={
																		formik.values.orderDate
																	}></CustomDatecomp>
															</span>
														</div>
														<div></div>
														<div>
															<span style={{ fontSize: '14px' }}>
																Payment Method:{' '}
															</span>
															<span
																style={{
																	marginLeft: '12px',
																	textAlign: right,
																	fontSize: '14px',
																}}>
																{' '}
																PayPal
															</span>
														</div>
														<div></div>
														<div>
															<span style={{ fontSize: '14px' }}>
																Payment date:{' '}
															</span>
															<span
																style={{
																	marginLeft: '30px',
																	textAlign: right,
																	fontSize: '14px',
																}}>
																{' '}
																<CustomDatecomp
																	orderDate={
																		formik.values.orderDate
																	}></CustomDatecomp>
															</span>
														</div>
														<div
															style={{
																fontSize: '18px',
																marginTop: '-145px',
																marginLeft: '440px',
																height: '200px',
																overflow: 'auto',
															}}>
															Shipping Information
															<div style={{ height: '15px' }}></div>
															<div
																key={shipmentAddress?.id}
																style={{ fontSize: '14px' }}>
																<p style={{ fontSize: '14px' }}>
																	{shipmentAddress?.username}
																</p>
																<p style={{ fontSize: '14px' }}>
																	{shipmentAddress?.suite}
																	{'#'}

																	{shipmentAddress?.line2}
																</p>
																<p style={{ fontSize: '14px' }}>
																	{shipmentAddress?.line1}
																</p>

																<p style={{ fontSize: '14px' }}>
																	{shipmentAddress?.cityname}
																</p>
																<p style={{ fontSize: '14px' }}>
																	{shipmentAddress?.countyname}
																</p>
																<p style={{ fontSize: '14px' }}>
																	{shipmentAddress?.statename}{' '}
																	{shipmentAddress?.zipCode}
																</p>
																<p style={{ fontSize: '14px' }}>
																	{shipmentAddress?.countryname}
																</p>
															</div>
														</div>
														<div
															style={{
																fontSize: '18px',
																marginTop: '-200px',
																marginLeft: '740px',
																height: '160px',
																overflow: 'auto',
															}}>
															Order Total
															<div style={{ height: '15px' }}></div>
															<div style={{ fontSize: '14px' }}>
																Subtotal:
																<span
																	style={{ marginLeft: '70px' }}>
																	USD {formik.values.orderTotal}
																</span>
															</div>
															<div style={{ fontSize: '14px' }}>
																Shippingcharges:
																<span
																	style={{ marginLeft: '15px' }}>
																	{' '}
																	Free
																</span>
															</div>
															<div style={{ fontSize: '14px' }}>
																Total:
																<span
																	style={{ marginLeft: '90px' }}>
																	USD {formik.values.orderTotal}
																</span>
															</div>
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
								</div>
							</div>
							<hr></hr>
							<div className='col-span-12' style={{ height: '150px' }}>
								<span style={{ fontSize: '20px' }}>
									Item(s) bought from {formik.values.manufacturername}
								</span>
								<div>Order Number 13-04666</div>
								<div style={{ height: '15px' }}> </div>
								<div className='OrderitemDet'>
									{orderitemsData.length > 0 &&
										orderitemsData.map((item) => (
											<div>
												<div>
													<span
														style={{
															fontSize: '18px',
															marginBottom: '5px',
															paddingBottom: '10px',
															marginLeft: '20px',
															fontFamily: 'sans-serif',
														}}>
														Quantity
													</span>
													<div style={{ height: '15px' }}></div>
													<div style={{ width: '200px' }}>
														<span
															style={{
																fontSize: '14px',
																display: 'inline-block',
																marginLeft: '40px',
																fontFamily: 'sans-serif',
															}}>
															{item?.quantity}
														</span>
													</div>
													<div
														style={{
															fontSize: '18px',
															marginTop: '-60px',
															marginLeft: '140px',
															height: '100px',
															overflow: 'auto',
														}}>
														ItemDescription
														<div style={{ height: '8px' }}></div>
														<div style={{ width: '200px' }}>
															<span
																style={{
																	fontSize: '14px',
																	display: 'inline-block',
																	marginLeft: '2px',
																	fontFamily: 'sans-serif',
																}}>
																{item?.orderitemdesc}
															</span>
														</div>
													</div>
													<div
														style={{
															fontSize: '18px',
															marginTop: '-100px',
															marginLeft: '390px',
															height: '100px',
															overflow: 'auto',
															fontFamily: 'sans-serif',
														}}>
														TypeofPackage
														<div style={{ height: '10px' }}></div>
														<div style={{ width: '200px' }}>
															<span
																style={{
																	fontSize: '14px',
																	display: 'inline-block',
																	marginLeft: '15px',
																	fontFamily: 'sans-serif',
																}}>
																{item?.typeofpackage}
															</span>
														</div>
													</div>

													<div
														style={{
															fontSize: '18px',
															marginTop: '-100px',
															marginLeft: '620px',
															height: '100px',
															overflow: 'auto',
															fontFamily: 'sans-serif',
														}}>
														UnitPrice
														<div style={{ height: '10px' }}></div>
														<div style={{ width: '200px' }}>
															<span
																style={{
																	fontSize: '14px',
																	display: 'inline-block',
																	marginLeft: '15px',
																}}>
																{item?.unitprice}
															</span>
														</div>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>
						</ModalBody>

						<ModalFooter>
							{/* <Button
								variant='solid'
								onClick={() => {
									setViewOrderModal(false);
									setEditTouched(false);
								}}>
								Cancel
							</Button> */}
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
