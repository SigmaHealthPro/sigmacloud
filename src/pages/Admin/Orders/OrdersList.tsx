import React, { useState, useEffect, useMemo, ReactNode, useContext, FC } from 'react';
import axios from 'axios';
import { PublicBaseSelectProps } from 'react-select/base';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../components/ui/Card';
import Button, { IButtonProps } from '../../../components/ui/Button';
import Icon from '../../../components/icon/Icon';
// import Input from '../../../components/form/Input';
import { GridCellParams, GridRowParams } from '@mui/x-data-grid';
import { appPages } from '../../../config/pages.config';
import Modal, {
	ModalBody,
	ModalHeader,
	ModalFooter,
	TModalSize,
} from '../../../components/ui/Modal';
import { UUID } from 'crypto';
import Validation from '../../../components/form/Validation';
import { useFormik } from 'formik';
import Label from '../../../components/form/Label';
import { orderApi } from '../../../Apis/orderApi';
import { v4 as uuidv4 } from 'uuid';
import apiconfig from '../../../config/apiconfig';
import Checkbox, { CheckboxGroup } from '../../../components/form/Checkbox';
import tagsDb from '../../../mocks/db/tags.db';
import toast, { Toaster } from 'react-hot-toast';
import Select from '../../../components/form/Select';
import { number } from 'prop-types';
import { fontFamily, width } from '@mui/system';
import CustomDatecomp from '../../Vaccine Management/CustomDatecomp';
import ReactDOMServer from 'react-dom/server';
import {
	HeroCheck,
	HeroCursorArrowRays,
	HeroDocumentCheck,
	HeroDocumentMinus,
	HeroLockClosed,
	HeroMinus,
} from '../../../components/icon/heroicons';
import { TUser } from '../../../mocks/db/users.db';
import {
	MoreVert as MoreVertIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	ViewColumnOutlined,
	ViewCarousel,
	ViewComfyOutlined,
	ViewAgendaOutlined,
	ViewKanban,
	Close,
} from '@mui/icons-material';
import { Button as AntButton, Popconfirm, Space, Table, Input, Tooltip } from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	MoreOutlined,
	BoldOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import {
	DataContextProvider,
	useDataContext,
	DataContext,
	DataContextValue,
} from '../../../context/dataContext';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownNavLinkItem,
	DropdownToggle,
} from '../../../components/ui/Dropdown';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../templates/common/TableParts.template';
import { indexOf } from 'lodash';
import themeConfig from '../../../config/theme.config';
import SvgViewColumns from '../../../components/icon/heroicons/ViewColumns';
import { HeroEye } from '../../../components/icon/heroicons';
import { auto, left, right } from '@popperjs/core';

import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import {
	DataGrid,
	GridPaginationModel,
	GridToolbarContainer,
	gridClasses,
	GridPagination,
	GridRowId,
} from '@mui/x-data-grid';

import { makeStyles } from '@mui/styles';
var TotalOrder = 0;
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
const OrdersList: React.FC = () => {
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [editData, setEditData] = useState<any>([]);
	const [globalFilterOrder, setGlobalFilterOrder] = useState<any>('');
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 5,
	});
	let generatedGUID: string;
	generatedGUID = uuidv4();
	const [Orders, setOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false); // Track loading state
	const [rowCountState, setRowCountState] = useState<number>(0); // Total number of items
	const classes = useStyles();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [comment, setComment] = useState('');
	const [approvalcmt, setApproval] = useState('');
	const [currentParams, setCurrentParams] = useState<GridCellParams | null>(null);
	const apiUrl = apiconfig.apiHostUrl;
	const [shipmentAddress, setShipmentAddress] = useState<ShipmentAddressModel | null>(null);
	const [orderitemsData, setorderitemsData] = useState<Orderitemmodel[]>([]);
	const [OrderItemdes, setOrderItemDes] = useState<string>('');
	const [OrderItemPrice, setOrderItemPrice] = useState<string>('');
	const [editTouched, setEditTouched] = useState(false);
	const [viewOrderModal, setViewOrderModal] = useState(false);
	const [localData, setLocalData] = useState<TUser | null>(null);
	const navigate = useNavigate();
	function CustomPagination() {
		return (
			<GridToolbarContainer className='flex w-full items-center justify-between'>
				<CardHeader>
					<CardHeaderChild>
						<CardTitle>Review Orders</CardTitle>
					</CardHeaderChild>
				</CardHeader>
				<GridPagination />
			</GridToolbarContainer>
		);
	}

	const handleOk = async () => {
		if (currentParams) {
			//const orderid = currentParams.row.id;
			// Add your rejection logic here, including handling the comment
			setIsModalVisible(false);
			toast.success(`Order rejected with comment: ${comment}`);
		} else {
			toast.error('Error: Unable to reject order. Please try again.');
		}
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handlePaginationModelChange = (newModel: GridPaginationModel) => {
		setPaginationModel(newModel);
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
		GrandTotal: string;
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
		ShipmentDate: string;
	};
	const reset = () => {
		formik.setFieldValue('orderItemDesc', '');
		formik.setFieldValue('facility', '');
		formik.setFieldValue('manufacturername', '');
		formik.setFieldValue('manufacturer', '');
		formik.setFieldValue('manufacturerid', '');
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
			GrandTotal: '',
			TaxAmount: '',
			ShipmentDate: '',
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
			console.log('Request Payload: ', values);
		},
	});
	const Columns = [
		{ field: 'id', headerName: 'Order ID', width: 250, hide: true }, // Hidden Order ID field
		{ field: 'product', headerName: 'Product', width: 140 },
		{ field: 'manufacturername', headerName: 'Manufacturer', width: 250, hide: true }, // Hidden Order ID field
		//{ field: 'createdBy', headerName: 'CreatedBy', width: 250, hide: true },
		{ field: 'orderItemDesc', headerName: 'OrderItemDesc', width: 140 },
		{ field: 'facility', headerName: 'Facility', width: 140 },
		{ field: 'orderDate', headerName: 'OrderDate', width: 140 },
		{ field: 'quantity', headerName: 'Quantity', width: 140 },
		{ field: 'unitPrice', headerName: 'UnitPrice', width: 140 },
		{ field: 'orderTotal', headerName: 'OrderTotal', width: 140 },
		{ field: 'orderStatus', headerName: 'OrderStatus', width: 140 },
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
								<Tooltip title='Approve'>
									<AntButton
										icon={
											<HeroCheck
												onClick={(event) => handleViewData(params, event)}
											/>
										}
									/>
								</Tooltip>
								<Tooltip title='Reject'>
									<AntButton
										icon={
											<Close onClick={(event) => showModal(params, event)} />
										}
									/>
								</Tooltip>
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
			})
			.catch((err) => console.log('Error has occured', err));
		const itemslist = await axios
			.post(apiUrl + 'api/Vaccination/getitemsbyorderid?orderid=' + orderid)
			.then((response) => {
				setorderitemsData(response?.data.data);
				setOrderItemDes(response.data.data.orderitemdesc);
				setOrderItemPrice(response.data.data.unitprice);
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
		formik.setFieldValue('id', params.row.id);
		formik.setFieldValue(
			'orderDate',
			<CustomDatecomp orderDate={params.row.orderDate}></CustomDatecomp>,
		);
		formik.setFieldValue('quantity', params.row.quantity);
		formik.setFieldValue('unitPrice', params.row.unitPrice);
		formik.setFieldValue('TaxAmount', params.row.taxAmount);
		formik.setFieldValue('DiscountAmount', params.row.discountAmount);
		formik.setFieldValue('orderTotal', params.row.orderTotal);
		formik.setFieldValue('orderStatus', params.row.orderStatus);
		TotalOrder =
			parseInt(params.row.orderTotal) +
			parseInt(params.row.taxAmount) -
			parseInt(params.row.discountAmount);
		formik.setFieldValue('GrandTotal', TotalOrder);
		formik.setFieldValue('ShipmentDate', params.row.ShipmentDate);
	};
	const Approve = async (params: any, event: any) => {
		const orderid = params.row.id;
		event.preventDefault();
		toast.success(`Order approved successfully!`);
	};
	const Approveorder = () => {
		async function callInitial() {
			const ordid = formik.values.id;
			try {
				const response = await axios.post(
					`${apiUrl}api/Vaccination/approveorder`,
					null, // No body for GET request
					{
						params: {
							status: 'Approved',
							orderid: ordid,
							comments: '',
						},
					},
				);
				const success = response.data;
				toast.success('Order approved successfully!');
			} catch (err) {
				console.log('Error has occurred', err);
			}
		}
		callInitial();
	};
	const showModal = async (params: any, event: any) => {
		const orderid = params.row.id;
		event.stopPropagation();
		setCurrentParams(params);
		setIsModalVisible(true);
	};
	const Reject = async (params: any, event: any) => {
		const orderid = params.row.id;
		event.preventDefault();
		toast.success(`Order rejected!`);
	};
	const listOrders = () => {
		setLoading(true);
		const requestData = {
			pagenumber: paginationModel.page + 1,
			pagesize: paginationModel.pageSize,
		};

		axios
			.post(
				apiUrl +
					'api/Vaccination/getpendingorders?pagenumber=' +
					(paginationModel.page + 1) +
					'&pagesize=' +
					paginationModel.pageSize,
			)
			.then((response) => {
				setLoading(true);
				const { items, totalCount } = response.data;

				if (items.length > paginationModel.pageSize) {
					console.warn('API returned more items than the requested page size.');
				}

				setOrders(items);
				console.log('pending orders:', items);
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
		setGlobalFilterOrder(e.target.value);
		if (e.target.value !== '') {
			const searchDataFilter = Orders.filter(
				(item: any) =>
					item?.Product.startsWith(e.target.value) ||
					item?.Manufacturer.startsWith(e.target.value) ||
					item?.OrderItemDesc.startsWith(e.target.value) ||
					item?.Facility.startsWith(e.target.value) ||
					item?.OrderDate.startsWith(e.target.value) ||
					item?.Quantity.startsWith(e.target.value) ||
					item?.UnitPrice.startsWith(e.target.value) ||
					item?.OrderTotal.startsWith(e.target.value) ||
					item?.OrderStatus.startsWith(e.target.value),
			);
			setOrders(searchDataFilter);
		} else {
			listOrders();
		}
	};
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			listOrders();
		}
	};

	useEffect(() => {
		//console.log('selectedorgid', localStorage.getItem('organizationidlogged'));
		const storedData = localStorage.getItem('apiData');
		if (storedData) {
			setLocalData(JSON.parse(storedData));
		}
		listOrders();
	}, [globalFilterOrder, paginationModel]);

	return (
		<PageWrapper name='Order List'>
			<Subheader>
				<Toaster />
				<SubheaderLeft>
					<FieldWrap
						firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
						lastSuffix={
							globalFilterOrder && (
								<Icon
									icon='HeroXMark'
									color='red'
									className='mx-2 cursor-pointer'
									onClick={() => setGlobalFilterOrder('')}
								/>
							)
						}>
						<Input
							id='globalFilterOrder'
							name='globalFilterOrder'
							placeholder='Search...'
							value={globalFilterOrder}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
						/>
					</FieldWrap>
				</SubheaderLeft>
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardBody className='overflow-auto'>
						<DataGrid
							className={classes.root}
							rows={Orders}
							columns={Columns}
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
						<Modal isOpen={viewOrderModal} size={'xl'} setIsOpen={setViewOrderModal}>
							<ModalHeader style={{ fontWeight: 'bold', fontSize: '24px' }}>
								{' '}
								{'Order Details'}
							</ModalHeader>
							<p style={{ marginLeft: '10px' }}>
								{'Ordered on'} {formik.values.orderDate}
								<Button
									variant='outline'
									icon='HeroPrinter'
									style={{ marginLeft: '635px' }}
									// onClick={handlePrintInvoice}
								>
									View or Print Invoice
								</Button>
								{/* Render PDF viewer and invoice document when showInvoice is true */}
							</p>
							<hr></hr>
							<ModalBody>
								<div className='col-span-12 lg:col-span-9'>
									<div className='grid grid-cols-12 gap-4'>
										<div className='col-span-12' style={{ height: '850px' }}>
											<Card>
												<CardBody>
													<div className='OrderDet'>
														<div>
															<span
																style={{
																	fontSize: '18px',
																	marginBottom: '5px',
																	paddingBottom: '10px',
																	fontWeight: 'bold',
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
																	{formik.values.orderDate}
																</span>
															</div>
															<div
																style={{
																	fontSize: '18px',
																	marginTop: '25px',
																	marginLeft: '2px',
																	height: '200px',
																	overflow: 'auto',
																}}>
																<p style={{ fontWeight: 'bold' }}>
																	Shipping Address
																</p>

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
																		{
																			shipmentAddress?.countyname
																		}
																	</p>
																	<p style={{ fontSize: '14px' }}>
																		{shipmentAddress?.statename}{' '}
																		{shipmentAddress?.zipCode}
																	</p>
																	<p style={{ fontSize: '14px' }}>
																		{
																			shipmentAddress?.countryname
																		}
																	</p>
																</div>
															</div>
															<div
																style={{
																	fontSize: '18px',
																	marginTop: '-350px',
																	marginLeft: '440px',
																	height: '160px',
																	overflow: 'auto',
																}}>
																<p style={{ fontWeight: 'bold' }}>
																	Order Summary
																</p>
																<div
																	style={{
																		height: '15px',
																	}}></div>
																<div style={{ fontSize: '14px' }}>
																	Item(s) Subtotal:
																	<span
																		style={{
																			marginLeft: '50px',
																		}}>
																		{formik.values.orderTotal}$
																	</span>
																</div>
																<div style={{ fontSize: '14px' }}>
																	Shipping & Handling:
																	<span
																		style={{
																			marginLeft: '25px',
																		}}>
																		{' '}
																		Free
																	</span>
																</div>
																<div style={{ fontSize: '14px' }}>
																	Tax Amount:
																	<span
																		style={{
																			marginLeft: '75px',
																		}}>
																		{formik.values.TaxAmount}$
																	</span>
																</div>
																<div style={{ fontSize: '14px' }}>
																	Discount:
																	<span
																		style={{
																			marginLeft: '95px',
																		}}>
																		{
																			formik.values
																				.DiscountAmount
																		}
																		$
																	</span>
																</div>
																<div style={{ fontSize: '14px' }}>
																	Grand Total:
																	<span
																		style={{
																			marginLeft: '80px',
																		}}>
																		{formik.values.GrandTotal}$
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
								<div
									style={{
										width: '300px',
										marginTop: '-600px',
									}}>
									<span>
										<p style={{ marginLeft: '350px', fontSize: '16px' }}>
											Comments:
										</p>
										<Input
											type='text'
											placeholder='Please provide comments'
											style={{
												marginLeft: '440px',
												width: '400px',
												height: '130px',
												marginTop: '-65px',
												textAlign: 'start',
											}}
											value={approvalcmt}
											onChange={(e) => setApproval(e.target.value)}
										/>
									</span>
								</div>
								<hr></hr>
								<div className='col-span-12' style={{ height: 'auto' }}>
									<span style={{ fontSize: '20px' }}>
										Item(s) bought from {formik.values.manufacturername}
									</span>
									<div style={{ height: '15px' }}></div>
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
									<span
										style={{
											fontSize: '18px',
											marginBottom: '5px',
											paddingBottom: '10px',
											marginLeft: '50px',
											fontFamily: 'sans-serif',
										}}>
										ItemDescription
									</span>
									<span
										style={{
											fontSize: '18px',
											marginBottom: '5px',
											paddingBottom: '10px',
											marginLeft: '100px',
											fontFamily: 'sans-serif',
										}}>
										TypeofPackage
									</span>
									<span
										style={{
											fontSize: '18px',
											marginBottom: '5px',
											paddingBottom: '10px',
											marginLeft: '130px',
											fontFamily: 'sans-serif',
										}}>
										UnitPrice
									</span>

									<div style={{ height: '5px' }}> </div>
									<div className='OrderitemDet'>
										{orderitemsData.length > 0 &&
											orderitemsData.map((item) => (
												<div>
													<div>
														<div style={{ height: '8px' }}></div>
														<div style={{ width: '1000px' }}>
															<span
																style={{
																	fontSize: '14px',
																	display: 'inline-block',
																	marginLeft: '40px',
																	fontFamily: 'sans-serif',
																}}>
																{item?.quantity}
															</span>
															<span
																style={{
																	fontSize: '14px',
																	display: 'inline-block',
																	marginLeft: '100px',
																	width: '150px',
																	fontFamily: 'sans-serif',
																}}>
																{item?.orderitemdesc}
															</span>
															<span
																style={{
																	fontSize: '14px',
																	display: 'inline-block',
																	marginLeft: '80px',
																	fontFamily: 'sans-serif',
																}}>
																{item?.typeofpackage}
															</span>
															<span
																style={{
																	fontSize: '14px',
																	display: 'inline-block',
																	marginLeft: '200px',
																}}>
																{item?.unitprice}
															</span>
														</div>
													</div>
												</div>
											))}
										<hr></hr>
										<div style={{ height: '30px' }}></div>
									</div>
									<Button
										variant='solid'
										style={{ marginLeft: '800px', width: '150px' }}
										onClick={() => {
											Approveorder();
										}}>
										Approve Order
									</Button>
								</div>
							</ModalBody>
						</Modal>
						<Modal isOpen={isModalVisible} size={'l'} setIsOpen={setIsModalVisible}>
							<ModalHeader style={{ fontWeight: 'bold', fontSize: '24px' }}>
								{' '}
								{'Reject Order'}
							</ModalHeader>
							<ModalBody>
								<div className='col-span-12 lg:col-span-9'>
									<div className='grid grid-cols-12 gap-4'>
										<Card>
											<CardBody>
												<div>
													<textarea
														placeholder='Please provide a reason for rejection'
														value={comment}
														onChange={(e) => setComment(e.target.value)}
													/>
												</div>
											</CardBody>
										</Card>
									</div>
								</div>
							</ModalBody>
						</Modal>
						{/* <Modal
							title='Comments'
							visible={isModalVisible}
							onOk={handleOk}
							onCancel={handleCancel}
							okButtonProps={{
								style: {
									backgroundColor: 'green',
									color: 'white',
									borderColor: 'green',
								},
							}}
							cancelButtonProps={{
								style: {
									backgroundColor: 'green',
									color: 'white',
									borderColor: 'green',
								},
							}}>
							<Input.TextArea
								placeholder='Please provide a reason for rejection'
								value={comment}
								onChange={(e) => setComment(e.target.value)}
							/>
						</Modal> */}
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};
export default OrdersList;
