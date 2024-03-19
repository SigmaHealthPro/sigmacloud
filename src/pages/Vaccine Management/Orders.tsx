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

const OrderManagement: React.FC = () => {
	var productname = '';
	var vaccinename = '';
	var manufacturername = '';
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
		event.preventDefault();
		setEditTouched(false);
		setViewOrderModal(true);
		formik.setFieldValue('product', params.row.product);
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
	}, [globalFilter, paginationModel]);

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
		facility: string;
		FacilityId: string;
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
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			orderId: 0,
			facility: '',
			FacilityId: generatedGUID,
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
			createdBy: 'string',
			updatedBy: 'string',
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
																	localStorage.setItem(
																		'selectedfacility:',
																		event.target.value,
																	);
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
									setNewCart(false);
									setNewOrderModal(false);
									setEditTouched(false);
								}}>
								Back to Orders
							</Button>
						</ModalFooter>
					</Modal>
					<Modal isOpen={viewOrderModal} setIsOpen={setViewOrderModal}>
						<ModalHeader> {'Selected Order History'}</ModalHeader>
						<ModalBody>
							<div className='col-span-12 lg:col-span-9'>
								<div className='grid grid-cols-12 gap-4'>
									<div className='col-span-12'>
										<Card>
											<CardBody>
												<div className='grid grid-cols-12 gap-4'>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='Product'>Product </Label>

														<Input
															id='product'
															name='product'
															value={formik.values.product}
															onBlur={formik.handleBlur}
														/>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='OrderitemDesc'>
															OrderitemDesc
														</Label>

														<Input
															id='orderItemDesc'
															name='orderItemDesc'
															value={formik.values.orderItemDesc}
															onBlur={formik.handleBlur}
														/>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='Facility'>Facility</Label>

														<Input
															id='facility'
															name='facility'
															value={formik.values.facility}
															onBlur={formik.handleBlur}
														/>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='OrderDate'>
															Order Date
														</Label>

														<Input
															id='OrderDate'
															name='OrderDate'
															value={
																formik.values.orderDate
																	? formik.values.orderDate
																			.toString()
																			.split('T')[0]
																	: ''
															}
															onBlur={formik.handleBlur}
														/>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='Quantity'>Quantity</Label>

														<Input
															id='quantity'
															name='quantity'
															value={formik.values.quantity}
															onBlur={formik.handleBlur}
														/>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='UnitPrice'>
															Unit Price
														</Label>

														<Input
															id='unitPrice'
															name='unitPrice'
															value={formik.values.unitPrice}
															onBlur={formik.handleBlur}
														/>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='OrderTotal'>
															Order Total
														</Label>

														<Input
															id='orderTotal'
															name='orderTotal'
															value={formik.values.orderTotal}
															onBlur={formik.handleBlur}
														/>
													</div>
													<div className='col-span-12 lg:col-span-6'>
														<Label htmlFor='OrderStatus'>
															Order Status
														</Label>
														<Input
															id='orderStatus'
															name='orderStatus'
															value={formik.values.orderStatus}
															onBlur={formik.handleBlur}
														/>
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
									setViewOrderModal(false);
									setEditTouched(false);
								}}>
								Cancel
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
