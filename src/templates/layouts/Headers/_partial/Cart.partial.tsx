import React, { FC, ReactNode, useState, useContext, useEffect } from 'react';
import { DateRangePicker, Range } from 'react-date-range';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { appPages } from '../../../../config/pages.config';
import MonthPicker from './MonthPicker';
import YearPicker from './YearPicker';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../../components/ui/Dropdown';
import Button from '../../../../components/ui/Button';
import QuantityUpdater from '../../../../pages/Vaccine Management/QuantityUpdater';
import Avatar from '../../../../components/Avatar';
import { patientApi } from '../../../../Apis/patientsApi';
import { orderApi } from '../../../../Apis/orderApi';
import usersDb from '../../../../mocks/db/users.db';
import SvgBold from '../../../../components/icon/duotone/Bold';
import Icon from '../../../../components/icon/Icon';
import Select from '../../../../components/form/Select';
import Label from '../../../../components/form/Label';
import Validation from '../../../../components/form/Validation';
import { v4 as uuidv4 } from 'uuid';
import Input from '../../../../components/form/Input';
import FieldWrap from '../../../../components/form/FieldWrap';
import { useFormik } from 'formik';
import PeriodButtonsPartial from '../../../../pages/sales/SalesDashboardPage/_partial/PeriodButtons.partial';
import PERIOD, { TPeriod } from '../../../../constants/periods.constant';
import toast, { Toaster } from 'react-hot-toast';
import Modal, {
	ModalBody,
	ModalHeader,
	ModalFooter,
	TModalSize,
} from '../../../../components/ui/Modal';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Collapse from '../../../../components/utils/Collapse';
import { Cart } from '../../../../interface/cart.interface';
import { DataContext, useDataContext, DataContextValue } from '../../../../context/dataContext';
import { DisplaySettings } from '@mui/icons-material';
import { Badge } from 'antd';
import axios from 'axios';
import {
	DataGrid,
	GridPaginationModel,
	GridToolbarContainer,
	gridClasses,
	GridPagination,
	GridRowId,
} from '@mui/x-data-grid';
import apiconfig from '../../../../config/apiconfig';
interface AccordionState {
	showItems: boolean;
	showBillingAddress: boolean;
	showShippingDetails: boolean;
	showPaymentInfo: boolean;
}

const CartPartial: React.FC = () => {
	const contextValue = useContext(DataContext);
	const data = (contextValue as DataContextValue).data;
	//const { data: cartData, setData: setCartData } = useContext(DataContext);
	const [newCartItem, setNewCart] = useState(false);
	const [checkout, proceedtocheckout] = useState(false);
	const [payment, proceedtopayment] = useState(false);
	const [shippment, addShippment] = useState(false);
	const productName = localStorage.getItem('productname');
	const [selectedItem, setSelectedItem] = useState<Cart | null>(null);
	const [countryData, setCountryData] = useState([]);
	const [stateData, setStateData] = useState([]);
	const [filteredState, setFilteredState] = useState([]);
	const [filteredCounty, setFilteredCounty] = useState([]);
	const [filteredCity, setFilteredCity] = useState([]);
	const [editTouched, setEditTouched] = useState(false);
	const [filteredVaccine, setFilteredVaccine] = useState<Vaccine[]>([]);
	const [vaccineloading, setVaccineLoading] = useState<boolean>(false);
	const [rowcountstates, setRowCountstates] = useState<number>(0);
	const [filteredFacility, setFilteredFacility] = useState([]);
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 5,
	});
	// Provide a default value if contextValue is undefined
	const { data: cartData, setData: setCartData } = contextValue || {
		data: [],
		setData: () => {},
		addItemToCart: () => {},
	};

	const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

	// Handler function to handle year change
	const handleYearChange = (year: number) => {
		setSelectedYear(year);
		// Do whatever you need to do with the selected year
	};

	let generatedGUID: string;
	generatedGUID = uuidv4();
	console.log('in cart page itemcount=', localStorage.getItem('itemcount'));
	var totalprice = 0;
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
	type OrderItem = {
		productid: string;
		Quantity: string;
		OrderItemDesc: string;
		UnitPrice: string;
		OrderItemStatus: string;
	};
	const orderItems: OrderItem[] = Array.isArray(data)
		? data.map((item) => ({
				productid: item.productid,
				Quantity: item.quantity,
				OrderItemDesc: item.vaccine,
				UnitPrice: item.price,
				OrderItemStatus: 'Active',
		  }))
		: [];
	type Shipment = {
		ShipmentDate: string;
		PackageSize: string;
		SizeUnitofMesure: string;
		PackageLength: string;
		PackageWidth: string;
		PackageHeight: string;
		WeightUnitofMeasure: string;
		TypeofPackagingMaterial: string;
		TypeofPackage: string;
		Storingtemparature: string;
		TemperatureUnitofmeasure: string;
		NoofPackages: string;
		Expecteddeliverydate: string;
		ShippmentAddressId: string;
		RecievingHours: string;
		RecieverId: string;
		IsSignatureneeded: string;
		TrackingNumber: string;
		Status: string;
	};
	type Address = {
		Line1: string;
		Line2: string;
		Suite: string;
		Countyid: string;
		County: string;
		Country: string;
		Countryid: string;
		State: string;
		Stateid: string;
		City: string;
		Cityid: string;
		ZipCode: string;
	};
	const calculateOrderTotal = (orderItems: OrderItem[]): string => {
		// Initialize the total to 0
		let total = 0;
		// Iterate over each OrderItem
		for (const item of orderItems) {
			// Parse the UnitPrice as a number
			const unitPrice = parseFloat(item.UnitPrice.replace(/[^0-9.]/g, ''));

			// Check if unitPrice is a valid number
			if (!isNaN(unitPrice)) {
				// Add unitPrice to the total
				total += unitPrice;
			} else {
				// Log a warning for invalid UnitPrice
				console.warn(`Invalid UnitPrice found: ${item.UnitPrice}`);
			}
		}
		// Return the total as a string
		return total.toString();
	};
	const orderTotal: string = calculateOrderTotal(orderItems);
	const currentDate = new Date();
	const currentDateFormatted = currentDate.toISOString();
	const [isOpen, setIsOpen] = useState(false);
	const [accordionState, setAccordionState] = useState<AccordionState>({
		showItems: false,
		showBillingAddress: false,
		showShippingDetails: false,
		showPaymentInfo: false,
	});

	const toggleAccordion = (section: keyof AccordionState) => {
		setAccordionState({
			...accordionState,
			[section]: !accordionState[section],
		});
	};

	type checkoutitems = {
		UserId: string;
		id: string;
		Facility: string;
		FacilityId: string;
		OrderDate: string;
		OrderTotal: string;
		TaxAmount: string;
		DiscountAmount: string;
		Incoterms: string;
		TermsConditionsId: string;
		OrderStatus: string;
		createdDate: string;
		createdBy: string;
		updatedBy: string;
		OrderofItems: OrderItem[];
		Address: Address;
		Shiping: Shipment;
		// Add other order fields as needed
	};
	const loggedinid = localStorage.getItem('userid');
	const selectedfacilityid = localStorage.getItem('selectedfacility:');
	console.log('selectedfacilityid', selectedfacilityid);
	const formik = useFormik<checkoutitems>({
		initialValues: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			Facility: '',
			FacilityId: selectedfacilityid
				? selectedfacilityid.toString()
				: '4c7c7967-23d8-45e4-80e6-3363ef7ea5aa',
			UserId: loggedinid ? loggedinid.toString() : '9e5806b4-b96e-49e4-9220-1b512d15eb71',
			OrderDate: currentDateFormatted,
			TermsConditionsId: generatedGUID,
			DiscountAmount: '100',
			Incoterms: '1',
			OrderStatus: 'Active',
			OrderTotal: orderTotal,
			TaxAmount: '100',
			createdDate: currentDateFormatted,
			createdBy: 'system',
			updatedBy: 'system',

			Address: {
				City: '',
				Cityid: '',
				State: '',
				Stateid: '',
				Country: '',
				Countryid: '',
				County: '',
				Countyid: '',
				ZipCode: '',
				Line1: '',
				Line2: '',
				Suite: '',
			},
			Shiping: {
				Expecteddeliverydate: '',
				IsSignatureneeded: 'Yes',
				NoofPackages: '',
				PackageHeight: '',
				PackageLength: '',
				PackageSize: '',
				PackageWidth: '',
				RecieverId: '1',
				RecievingHours: '',
				ShipmentDate: '',
				ShippmentAddressId: generatedGUID,
				SizeUnitofMesure: '',
				Status: 'Active',
				Storingtemparature: '',
				TemperatureUnitofmeasure: '',
				TrackingNumber: '',
				TypeofPackage: '',
				TypeofPackagingMaterial: '',
				WeightUnitofMeasure: '',
			},
			OrderofItems: orderItems,
		},
		onSubmit: async (values: checkoutitems) => {
			try {
				const postResponse = await axios.post(
					apiUrl + 'api/Vaccination/createorder',
					values,
					{
						headers: { 'Content-Type': 'application/json' },
					},
				);
				setEditTouched(false);
				setTimeout(() => {
					toast.success(`Order ${editTouched ? 'updated' : 'added'} successfully!`);
				}, 2000);

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

				// Handle response
			} catch (error) {
				console.error('Error: ', error);
				// Handle error
			}
		},
	});

	const listData = () => {
		async function callInitial() {
			await orderApi('/api/Vaccination/getallfacilities', 'GET')
				.then((response) => {
					setFilteredFacility(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
		}
		callInitial();
	};

	useEffect(() => {
		async function callInitial() {
			await orderApi('/api/MasterData/Countries', 'GET')
				.then((response) => {
					setCountryData(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
			await orderApi('/api/MasterData/States', 'GET')
				.then((response) => {
					setStateData(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
		}
		callInitial();
	}, []);

	const handleItemClick = (item: Cart) => {
		setSelectedItem(item);
	};
	const handleClosePopup = () => {
		setSelectedItem(null);
	};
	const handleState = async (country: any) => {
		console.log('Selectd state ID', country);
		const data = stateData?.filter((item: any) => item.countryId === country);
		console.log('Filtered state', data);
		setFilteredState(data);
	};
	const handleCounty = async (state: any) => {
		console.log('Selected State ID', state);
		const response = await orderApi(
			`/api/MasterData/getcountiesbystateid?stateid=${state}`,
			'GET',
		)
			.then((resp) => setFilteredCounty(resp?.data))
			.catch((err) => console.log('err', err));
	};

	const handleCity = async (state: any, county: any) => {
		console.log('Selected State ID', state);
		const response = await orderApi(
			`/api/MasterData/getcitiesbystateidandcountyid?stateid=${state}&countyid=${county}`,
			'GET',
		)
			.then((resp) => setFilteredCity(resp?.data))
			.catch((err) => console.log('err', err));
	};
	const removeItemFromCart = (productid: string) => {
		const updatedCartData = cartData.filter((item) => item.productid !== productid);
		setCartData(updatedCartData);
	};

	const apiUrl = apiconfig.apiHostUrl;
	var selectedstateid = '';
	return (
		<div className='relative'>
			<Dropdown>
				<DropdownToggle hasIcon={false}>
					<Button icon='HeroShoppingCart' aria-label='Messages' />
				</DropdownToggle>
				{data && data.length > 0 ? (
					<DropdownMenu
						className='flex flex-col flex-wrap divide-y divide-dashed divide-zinc-500/50 p-4 [&>*]:py-4'
						placement='bottom-end'>
						<div>
							{cartData.map((item) => (
								<div className='flex min-w-[24rem] gap-2'>
									<div className='relative flex-shrink-0'>
										<Avatar src='https://i.ebayimg.com/00/s/MTYwMFgxMTcz/z/5gwAAOSwfEVk-6CG/$_57.JPG?set_id=880000500F' />
									</div>
									<div className='grow-0'>
										<div className='flex gap-2 font-bold'>{item.product}</div>
										<div className='flex w-[18rem] gap-2 text-zinc-500'>
											{item.vaccine}
											{item.manufacturer}
											<div className='flex w-[11rem] gap-2 text-zinc-800'>
												Qty: {item.quantity}
												<div className='text-zinc-500'>{item.price}</div>
												<Button
													variant='default'
													icon='HeroTrash'
													id='cart_trash_items'
													onClick={() =>
														removeItemFromCart(item.productid)
													}></Button>
											</div>
										</div>
									</div>
								</div>
							))}

							<div className='gh-minicart-action'>
								<Button
									variant='solid'
									icon='HeroShoppingBag'
									id='proceed-to_checkout'
									onClick={() => {
										setIsOpen(true);
									}}>
									Proceed to Cart
								</Button>
							</div>
						</div>
					</DropdownMenu>
				) : (
					<>{/* Empty fragment */}</>
				)}
			</Dropdown>
			<span className='absolute end-0 top-0 flex h-3 w-3'>
				<span className='relative inline-flex h-3 w-0 rounded-full'></span>
				<span className='absolute inline-flex h-full w-full' />
				{data.length}
				<span className='relative inline-flex h-3 w-3'></span>
			</span>
			<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
				<ModalHeader setIsOpen={setIsOpen}>{'Checkout'}</ModalHeader>
				<ModalBody>
					<div className='accordion-buttons'>
						<Button
							onClick={() => toggleAccordion('showItems')}
							variant='outline'
							style={{ marginBottom: '10px', textAlign: 'left' }}>
							Shopping Cart Items
						</Button>
						<Collapse isOpen={accordionState.showItems}>
							{accordionState.showItems && (
								<div className='collapse-content'>
									{data.length > 0 &&
										data.map((item) => (
											<div key={item.productid}>
												<div className='listsummary-content'>
													<div className='grid-item-information'>
														<div className='font-bold'>
															<Label
																className='item-product'
																htmlFor='ProductName'>
																{item.product}
															</Label>
														</div>
														<div>
															<span>
																<Avatar
																	className='image-display'
																	src='https://i.ebayimg.com/00/s/MTYwMFgxMTcz/z/5gwAAOSwfEVk-6CG/$_57.JPG?set_id=880000500F'></Avatar>
																<span>
																	<Label
																		className='grid-item-quantity'
																		htmlFor='Quantity'>
																		<QuantityUpdater
																			rowId={item.productid}
																			defaultValue={parseInt(
																				item.quantity,
																			)}
																			step={1}
																			min={0}
																			max={999}
																		/>
																	</Label>
																	<Label
																		className='grid-item-price'
																		htmlFor='price'>
																		Price: {item.price}
																	</Label>
																</span>
															</span>
														</div>

														<Label
															className='item-vaccine'
															htmlFor='VaccineName'>
															Vaccine: {item.vaccine}
														</Label>
														<Label
															className='item-manufacturer'
															htmlFor='ManufacturerName'>
															Manufacturer: {item.manufacturer}
														</Label>
													</div>
												</div>
											</div>
										))}
								</div>
							)}
						</Collapse>
						<Button
							onClick={() => toggleAccordion('showBillingAddress')}
							variant='outline'
							style={{ marginBottom: '10px', textAlign: 'left' }}>
							Billing Address
						</Button>
						<Collapse isOpen={accordionState.showBillingAddress}>
							{accordionState.showBillingAddress && (
								<div className='collapse-content'>
									<div className='grid grid-cols-12 gap-4'>
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='country'>Country</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={formik.touched?.Address?.Country}
												invalidFeedback={formik.errors?.Address?.Country}
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
														name='Address.Country'
														style={{ color: 'black' }}
														value={formik.values.Address.Country}
														onChange={(event) => {
															formik.handleChange(event);
															formik.setFieldValue(
																'Address.Countryid',
																event.target.value,
															);
															event.target.value;
															handleState(event.target.value);
														}}
														onBlur={formik.handleBlur}
														placeholder='Select Country'>
														{countryData?.map((country: any) => (
															<option
																style={{ color: 'black' }}
																id={country?.id}
																key={country?.id}
																value={country?.id}>
																{country?.countryName}
															</option>
														))}
													</Select>
												</FieldWrap>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='address'>Street Address</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Address
														? formik.touched.Address.Line1
														: undefined
												}
												invalidFeedback={
													formik.errors.Address
														? formik.errors.Address.Line1
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='Line1'
													name='Address.Line1'
													onChange={formik.handleChange}
													value={formik.values.Address.Line1}
													onBlur={formik.handleBlur}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='addressline2'>
												Street Address line2
											</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Address
														? formik.touched.Address.Line2
														: undefined
												}
												invalidFeedback={
													formik.errors.Address
														? formik.errors.Address.Line2
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='Line2'
													name='Address.Line2'
													onChange={formik.handleChange}
													value={formik.values.Address.Line2}
													onBlur={formik.handleBlur}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='suite'>Apt/Suite/Other</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Address
														? formik.touched.Address.Suite
														: undefined
												}
												invalidFeedback={
													formik.errors.Address
														? formik.errors.Address.Suite
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='Suite'
													name='Address.Suite'
													onChange={formik.handleChange}
													value={formik.values.Address.Suite}
													onBlur={formik.handleBlur}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='state'>State</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={formik.touched?.Address?.State}
												invalidFeedback={formik.errors.Address?.State}
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
														name='Address.State'
														style={{ color: 'black' }}
														value={formik.values.Address.State}
														onChange={(event) => {
															formik.handleChange(event);
															formik.setFieldValue(
																'Address.Stateid',
																event.target.value,
															);
															selectedstateid = event.target.value;
															handleCounty(event.target.value);
														}}
														onBlur={formik.handleBlur}
														placeholder='Select State'>
														{/* <option value={''}> Select</option> */}
														{filteredState?.map((state: any) => (
															<option
																style={{
																	color: 'black',
																}}
																id={state?.id}
																key={state?.id}
																value={state?.id}>
																{state?.stateName}
															</option>
														))}
													</Select>
												</FieldWrap>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='county'>County</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={formik.touched.Address?.County}
												invalidFeedback={formik.errors.Address?.County}
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
														id='county'
														name='Address.County'
														style={{ color: 'black' }}
														value={formik.values.Address.County}
														onChange={(event) => {
															formik.handleChange(event);
															formik.setFieldValue(
																'Address.Countyid',
																event.target.value,
															);

															handleCity(
																formik.values.Address.State,
																event.target.value,
															); // Pass both state and county
														}}
														onBlur={formik.handleBlur}
														placeholder='Select County'>
														{/* <option value={''}> Select</option> */}
														{filteredCounty?.map((county: any) => (
															<option
																style={{
																	color: 'black',
																}}
																id={county?.id}
																key={county?.id}
																value={county?.id}>
																{county?.countyName}
															</option>
														))}
													</Select>
												</FieldWrap>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='city'>City</Label>

											<Validation
												isValid={formik.isValid}
												isTouched={formik.touched.Address?.City}
												invalidFeedback={formik.errors.Address?.City}
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
														name='Address.City'
														style={{ color: 'black' }}
														value={formik.values.Address.City}
														onChange={(event) => {
															formik.handleChange(event);
															formik.setFieldValue(
																'Address.Cityid',
																event.target.value,
															);
														}}
														onBlur={formik.handleBlur}
														placeholder='Select City'>
														{/* <option value={''}> Select</option> */}
														{filteredCity?.map((city: any) => (
															<option
																style={{
																	color: 'black',
																}}
																id={city?.id}
																key={city?.id}
																value={city?.id}>
																{city?.cityName}
															</option>
														))}
													</Select>
												</FieldWrap>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='zipcode'>Zip Code</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Address
														? formik.touched.Address.ZipCode
														: undefined
												}
												invalidFeedback={
													formik.errors.Address
														? formik.errors.Address.ZipCode
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='zipcode'
													name='Address.ZipCode'
													onChange={formik.handleChange}
													value={formik.values.Address.ZipCode}
													onBlur={formik.handleBlur}
												/>
											</Validation>
										</div>
									</div>
								</div>
							)}
						</Collapse>

						<Button
							onClick={() => toggleAccordion('showPaymentInfo')}
							variant='outline'
							style={{ marginBottom: '10px', textAlign: 'left' }}>
							Payment Information
						</Button>
						<Collapse isOpen={accordionState.showPaymentInfo}>
							{accordionState.showPaymentInfo && (
								<div className='collapse-content'>
									<div className='grid grid-cols-12 gap-4'>
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='Cardnumber'>Card Number</Label>
											<Input
												id='cardno'
												name='cardnumber'
												value={'Credit/Debit number'}></Input>
										</div>
										<div className='col-span-12 lg:col-span-6'></div>
										<div className='col-span-12 lg:col-span-6'>
											Card Expiration Date
										</div>
										<div className='col-span-12 lg:col-span-6'></div>
										<div className='col-span-12 lg:col-span-4'>
											<Label htmlFor='month'>Month</Label>
											<MonthPicker />
										</div>
										<div className='col-span-12 lg:col-span-4'>
											<Label htmlFor='year'>Year</Label>
											<YearPicker
												selectedYear={selectedYear}
												handleYearChange={handleYearChange}
											/>
										</div>
										<div className='col-span-12 lg:col-span-3'>
											<Label htmlFor='securitycode'>Security Code</Label>
											<Input id='cvv' name='cvv' value={'CVV'}></Input>
										</div>
									</div>
								</div>
							)}
						</Collapse>

						<Button
							onClick={() => toggleAccordion('showShippingDetails')}
							variant='outline'
							style={{ marginBottom: '10px', textAlign: 'left' }}>
							Shipping Details
						</Button>
						<Collapse isOpen={accordionState.showShippingDetails}>
							{accordionState.showShippingDetails && (
								<div className='collapse-content'>
									<div className='grid grid-cols-12 gap-4'>
										<div className='col-span-12 lg:col-span-3'>
											<Label htmlFor={`shipment_date`}>Shipment Date:</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.ShipmentDate
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.ShipmentDate
														: undefined
												}
												validFeedback='Good'>
												<Input
													type='date'
													id='ShipmentDate'
													name='Shiping.ShipmentDate'
													onChange={formik.handleChange}
													value={formik.values.Shiping.ShipmentDate}
													onBlur={formik.handleBlur}
													style={{ width: '120px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-2'>
											<Label htmlFor='packagesize'>Package Size</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.PackageSize
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.PackageSize
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='packagesize'
													name='Shiping.PackageSize'
													onChange={formik.handleChange}
													value={formik.values.Shiping.PackageSize}
													onBlur={formik.handleBlur}
													style={{ width: '70px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-2'>
											<Label htmlFor='packagelength'>Package length</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.PackageLength
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.PackageLength
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='packagelength'
													name='Shiping.PackageLength'
													onChange={formik.handleChange}
													value={formik.values.Shiping.PackageLength}
													onBlur={formik.handleBlur}
													style={{ width: '70px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-2'>
											<Label htmlFor='packagewidth'>Package width</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.PackageWidth
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.PackageWidth
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='packagewidth'
													name='Shiping.PackageWidth'
													onChange={formik.handleChange}
													value={formik.values.Shiping.PackageWidth}
													onBlur={formik.handleBlur}
													style={{ width: '70px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-2'>
											<Label htmlFor='packageheight'>Package height</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.PackageHeight
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.PackageHeight
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='packageheight'
													name='Shiping.PackageHeight'
													onChange={formik.handleChange}
													value={formik.values.Shiping.PackageHeight}
													onBlur={formik.handleBlur}
													style={{ width: '70px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-2'>
											<Label htmlFor='type of package'>Type of package</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.TypeofPackage
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.TypeofPackage
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='packagetype'
													name='Shiping.TypeofPackage'
													onChange={formik.handleChange}
													value={formik.values.Shiping.TypeofPackage}
													onBlur={formik.handleBlur}
													style={{ width: '80px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-3'>
											<Label htmlFor='packagematerial'>
												Type of Package Material
											</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping
																?.TypeofPackagingMaterial
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping
																.TypeofPackagingMaterial
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='packagematerial'
													name='Shiping.TypeofPackagingMaterial'
													onChange={formik.handleChange}
													value={
														formik.values.Shiping
															.TypeofPackagingMaterial
													}
													onBlur={formik.handleBlur}
													style={{ width: '130px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-3'>
											<Label htmlFor='storingtemperature'>
												Storing Temperaure
											</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.Storingtemparature
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.Storingtemparature
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='storingtemp'
													name='Shiping.Storingtemparature'
													onChange={formik.handleChange}
													value={formik.values.Shiping.Storingtemparature}
													onBlur={formik.handleBlur}
													style={{ width: '120px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-4'>
											<Label htmlFor='temperatureuom'>
												Temperaure Unit of Measure
											</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping
																?.TemperatureUnitofmeasure
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping
																.TemperatureUnitofmeasure
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='tempuom'
													name='Shiping.TemperatureUnitofmeasure'
													onChange={formik.handleChange}
													value={
														formik.values.Shiping
															.TemperatureUnitofmeasure
													}
													onBlur={formik.handleBlur}
													style={{ width: '100px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-2'>
											<Label htmlFor='sizeuom'>Size Unit of Measure</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.SizeUnitofMesure
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.SizeUnitofMesure
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='sizeuom'
													name='Shiping.SizeUnitofMesure'
													onChange={formik.handleChange}
													value={formik.values.Shiping.SizeUnitofMesure}
													onBlur={formik.handleBlur}
													style={{ width: '70px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-2'>
											<Label htmlFor='weightuom'>
												Weight Unit of Measure
											</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping
																?.WeightUnitofMeasure
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.WeightUnitofMeasure
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='weightuom'
													name='Shiping.WeightUnitofMeasure'
													onChange={formik.handleChange}
													value={
														formik.values.Shiping.WeightUnitofMeasure
													}
													onBlur={formik.handleBlur}
													style={{ width: '70px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-1'>
											<Label htmlFor='noofpackages'>No of Packages</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.NoofPackages
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.NoofPackages
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='noofpkgs'
													name='Shiping.NoofPackages'
													onChange={formik.handleChange}
													value={formik.values.Shiping.NoofPackages}
													onBlur={formik.handleBlur}
													style={{ width: '70px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-1'></div>
										<div className='col-span-12 lg:col-span-1'>
											<Label htmlFor='Tracking Number'>Tracking Number</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.TrackingNumber
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.TrackingNumber
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='trackingno'
													name='Shiping.TrackingNumber'
													onChange={formik.handleChange}
													value={formik.values.Shiping.TrackingNumber}
													onBlur={formik.handleBlur}
													style={{ width: '70px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-1'></div>
										<div className='col-span-12 lg:col-span-2'>
											<Label htmlFor='delivery_date'>
												Expected Delivery Date:
											</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping
																?.Expecteddeliverydate
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.Expecteddeliverydate
														: undefined
												}
												validFeedback='Good'>
												<Input
													type='date'
													id='Expecteddeliverydate'
													name='Shiping.Expecteddeliverydate'
													onChange={formik.handleChange}
													value={
														formik.values.Shiping.Expecteddeliverydate
													}
													onBlur={formik.handleBlur}
													style={{ width: '110px' }}
												/>
											</Validation>
										</div>
										<div className='col-span-12 lg:col-span-3'>
											<Label htmlFor='recieving hours'>Recieving Hours</Label>
											<Validation
												isValid={formik.isValid}
												isTouched={
													formik.touched.Shiping
														? formik.touched.Shiping?.RecievingHours
														: undefined
												}
												invalidFeedback={
													formik.errors.Shiping
														? formik.errors.Shiping.RecievingHours
														: undefined
												}
												validFeedback='Good'>
												<Input
													id='recievinghrs'
													name='Shiping.RecievingHours'
													onChange={formik.handleChange}
													value={formik.values.Shiping.RecievingHours}
													onBlur={formik.handleBlur}
													style={{ width: '90px' }}
												/>
											</Validation>
										</div>
									</div>
								</div>
							)}
						</Collapse>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button onClick={() => setIsOpen(false)} variant='solid'>
						Cancel
					</Button>
					<Button
						variant='solid'
						onClick={() => {
							formik.handleSubmit();
							//addShippment(false);
						}}>
						Checkout
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};
export default CartPartial;
