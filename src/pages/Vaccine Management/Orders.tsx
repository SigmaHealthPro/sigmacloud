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
import { PDFViewer } from '@react-pdf/renderer';
import { InvoiceDocument } from './InvoiceDocument';
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
import ReactDOMServer from 'react-dom/server';
import { format } from 'date-fns';
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
	const [globalFilterOrder, setGlobalFilterOrder] = useState<any>('');
	const [OrderItemdes, setOrderItemDes] = useState<string>('');
	const [OrderItemPrice, setOrderItemPrice] = useState<string>('');
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
	const [showInvoice, setShowInvoice] = React.useState<boolean>(false);
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
		setShowInvoice(false);
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
			keyword: globalFilterOrder || '',
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

	useEffect(() => {
		//console.log('selectedorgid', localStorage.getItem('organizationidlogged'));
		const storedData = localStorage.getItem('apiData');
		if (storedData) {
			setLocalData(JSON.parse(storedData));
		}
		listOrders();
	}, [globalFilterOrder, paginationModel]);
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
	const yourOrderInfo = {
		OrderPlaced: formik.values.orderDate,
		manufacturername: formik.values.manufacturername,
		orderTotal: formik.values.GrandTotal,
		ShipmentDate: formik.values.ShipmentDate,
		OrderItemDesc: OrderItemdes,
		Price: OrderItemPrice,
	};

	const handlePrintInvoice = () => {
		const formikValues = {
			OrderPlaced: formik.values.orderDate,
			manufacturername: formik.values.manufacturername,
			orderTotal: formik.values.GrandTotal,
			ShipmentDate: formik.values.orderDate,
			OrderItemDesc: OrderItemdes,
			Price: OrderItemPrice,
			// Add other Formik values as needed
		};

		const pdfContent = ReactDOMServer.renderToStaticMarkup(
			<PDFViewer style={{ width: '100%', height: '100vh' }}>
				<InvoiceDocument formikValues={formikValues} />
			</PDFViewer>,
		);
		const dataUrl = `data:application/pdf;base64,${btoa(pdfContent)}`;

		const newWindow = window.open();
		if (newWindow) {
			newWindow.document.write('<html><head><title>Order Invoice</title></head><body>');
			newWindow.document.write(
				'<div style="text-align:center;margin-bottom:20px;">Order Invoice</div>',
			);
			// Use <object> to embed the PDF content
			newWindow.document.write(
				`<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>
				 <div style="text-align:center;">
				   <canvas id="pdfViewer" style="width:800px; height:600px;"></canvas>
				 </div>
				 <script>
				   const pdfData = atob('${btoa(pdfContent)}');
				   pdfjsLib.getDocument({ data: pdfData }).promise.then(pdf => {
					 pdf.getPage(1).then(page => {
					   const canvas = document.getElementById('pdfViewer');
					   const context = canvas.getContext('2d');
					   const viewport = page.getViewport({ scale: 1.5 });
					   canvas.width = viewport.width;
					   canvas.height = viewport.height;
					   const renderContext = {
						 canvasContext: context,
						 viewport: viewport,
					   };
					   page.render(renderContext);
					 });
				   });
				 </script>
				 </body></html>`,
			);
			newWindow.document.close();
		}

		// Now you can handle the PDF content as needed, such as displaying it in a modal or opening it in a new window
	};
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			listOrders();
		}
	};
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
							setFilteredVaccine([]);
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
																		formik.setFieldValue(
																			'manufacturername',
																			'',
																		);
																		formik.setFieldValue(
																			'manufacturerid',
																			'',
																		);
																		formik.setFieldValue(
																			'manufacturer',
																			'',
																		);
																		setFilteredVaccine([]);
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
								onClick={handlePrintInvoice}>
								View or Print Invoice
							</Button>
							{/* Render PDF viewer and invoice document when showInvoice is true */}
						</p>
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
																marginTop: '-125px',
																marginLeft: '440px',
																height: '200px',
																overflow: 'auto',
															}}>
															<p style={{ fontWeight: 'bold' }}>
																Shipping Address
															</p>
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
															<p style={{ fontWeight: 'bold' }}>
																Order Summary
															</p>
															<div style={{ height: '15px' }}></div>
															<div style={{ fontSize: '14px' }}>
																Item(s) Subtotal:
																<span
																	style={{ marginLeft: '50px' }}>
																	{formik.values.orderTotal}$
																</span>
															</div>
															<div style={{ fontSize: '14px' }}>
																Shipping & Handling:
																<span
																	style={{ marginLeft: '25px' }}>
																	{' '}
																	Free
																</span>
															</div>
															<div style={{ fontSize: '14px' }}>
																Tax Amount:
																<span
																	style={{ marginLeft: '75px' }}>
																	{formik.values.TaxAmount}$
																</span>
															</div>
															<div style={{ fontSize: '14px' }}>
																Discount:
																<span
																	style={{ marginLeft: '95px' }}>
																	{formik.values.DiscountAmount}$
																</span>
															</div>
															<div style={{ fontSize: '14px' }}>
																Grand Total:
																<span
																	style={{ marginLeft: '80px' }}>
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

								<div style={{ height: '15px' }}> </div>
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
								</div>
							</div>
						</ModalBody>
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
