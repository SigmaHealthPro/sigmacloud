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

const CartPartial: React.FC = () => {
	const contextValue = useContext(DataContext);
	const data = (contextValue as DataContextValue).data;
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
		productId: string;
		quantity: string;
		OrderItemDesc: string;
		UnitPrice: string;
	};
	const orderItems: OrderItem[] = data.map((item) => ({
		productId: item.productid,
		quantity: item.quantity,
		OrderItemDesc: item.vaccine,
		UnitPrice: item.price,
	}));
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
			// Parse the UnitPrice as a number and add it to the total
			total += parseFloat(item.UnitPrice);
		}

		// Return the total as a string
		return total.toString();
	};
	const orderTotal: string = calculateOrderTotal(orderItems);
	type checkoutitems = {
		userid: string;
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
		orderItems: OrderItem[];
		address: Address;
		shipment: Shipment;
		// Add other order fields as needed
	};

	const formik = useFormik<checkoutitems>({
		initialValues: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			Facility: '',
			FacilityId: generatedGUID,
			userid: '',
			OrderDate: '',
			TermsConditionsId: '',
			DiscountAmount: '',
			Incoterms: '',
			OrderStatus: 'Active',
			OrderTotal: orderTotal,
			TaxAmount: '',
			address: {
				City: '',
				Cityid: generatedGUID,
				State: '',
				Stateid: generatedGUID,
				Country: '',
				Countryid: generatedGUID,
				County: '',
				Countyid: generatedGUID,
				ZipCode: '',
				Line1: '',
				Line2: '',
				Suite: '',
			},
			shipment: {
				Expecteddeliverydate: '',
				IsSignatureneeded: '',
				NoofPackages: '',
				PackageHeight: '',
				PackageLength: '',
				PackageSize: '',
				PackageWidth: '',
				RecieverId: '',
				RecievingHours: '',
				ShipmentDate: '',
				ShippmentAddressId: '',
				SizeUnitofMesure: '',
				Status: '',
				Storingtemparature: '',
				TemperatureUnitofmeasure: '',
				TrackingNumber: '',
				TypeofPackage: '',
				TypeofPackagingMaterial: '',
				WeightUnitofMeasure: '',
			},
			orderItems: [],
		},
		validate: (values: checkoutitems) => {
			const errors: any = {};

			if (!values.address.Country) {
				errors.countryName = 'Required';
			}
			if (!values.address.State) {
				errors.stateName = 'Required';
			}
			if (!values.address.County) {
				errors.countyName = 'Required';
			}
			if (!values.address.City) {
				errors.cityName = 'Required';
			}

			return errors;
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
		const response = await patientApi(
			`/api/MasterData/getcitiesbystateidandcountyid?stateid=${state}&countyid=${county}`,
			'GET',
		)
			.then((resp) => setFilteredCity(resp?.data))
			.catch((err) => console.log('err', err));
	};

	const apiUrl = apiconfig.apiHostUrl;
	return (
		<div className='relative'>
			<Dropdown>
				<DropdownToggle hasIcon={false}>
					<Button icon='HeroShoppingCart' aria-label='Messages' />
				</DropdownToggle>

				<DropdownMenu
					className='flex flex-col flex-wrap divide-y divide-dashed divide-zinc-500/50 p-4 [&>*]:py-4'
					placement='bottom-end'>
					<div>
						{data.map((item) => (
							<div className='flex min-w-[24rem] gap-2'>
								<div className='relative flex-shrink-0'>
									<Avatar src='https://i.ebayimg.com/00/s/MTYwMFgxMTcz/z/5gwAAOSwfEVk-6CG/$_57.JPG?set_id=880000500F' />
								</div>
								<div className='grow-0'>
									<div className='flex gap-2 font-bold'>{item.product}</div>
									<div className='flex w-[18rem] gap-2 text-zinc-500'>
										{item.vaccine}
										{item.manufacturer}
										<div className='flex w-[11rem] gap-2 text-zinc-500'>
											Qty: {item.quantity}
											<div className='text-zinc-500'>{item.price}</div>
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
									setNewCart(true);
								}}>
								Proceed to Cart
							</Button>
						</div>
					</div>
				</DropdownMenu>
			</Dropdown>

			<span className='absolute end-0 top-0 flex h-3 w-3'>
				<span className='relative inline-flex h-3 w-0 rounded-full'></span>
				<span className='absolute inline-flex h-full w-full' />
				{data.length}
				<span className='relative inline-flex h-3 w-3'></span>
			</span>
			<Modal
				isOpen={newCartItem}
				setIsOpen={setNewCart}
				size={'lg'}
				isCentered={true}
				isAnimation={true}>
				<ModalHeader>Add Item to Cart</ModalHeader>
				<ModalBody className='cartitems'>
					<PageWrapper name='Vaccine List'>
						<Container>
							<Card className='h-full'>
								<CardHeader>
									<CardHeaderChild>
										<div></div>
									</CardHeaderChild>
									<CardBody className='overflow-auto'>
										<div>
											{data.map((item) => (
												<div>
													<div className='listsummary-content'>
														<div className='grid-item-information'>
															<div className=' font-bold'>
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
																				rowId={
																					item.productid
																				}
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
																			Price
																			{' : ' + item.price}
																		</Label>
																	</span>
																</span>
															</div>

															<Label
																className='item-vaccine'
																htmlFor='VaccineName'>
																Vaccine
																{' :         ' + item.vaccine}
															</Label>
															<Label
																className='item-manufacturer'
																htmlFor='ManufacturerName'>
																Manufacturer
																{' :         ' + item.manufacturer}
															</Label>
														</div>
													</div>
												</div>
											))}
										</div>
									</CardBody>
								</CardHeader>
							</Card>
						</Container>
					</PageWrapper>
				</ModalBody>
				<ModalFooter>
					<Button
						variant='solid'
						onClick={() => {
							setNewCart(false);
						}}>
						Back to Orders
					</Button>
					<Button
						variant='solid'
						onClick={() => {
							setNewCart(false);
							listData();
							proceedtopayment(true);
						}}>
						Proceed to Payment
					</Button>
				</ModalFooter>
			</Modal>
			<Modal
				isOpen={checkout}
				setIsOpen={proceedtocheckout}
				size={'lg'}
				isCentered={true}
				isAnimation={true}>
				<ModalHeader>Billing Address</ModalHeader>
				<ModalBody>
					<div className='col-span-12 lg:col-span-9'>
						<div className='grid grid-cols-12 gap-4'>
							<div className='col-span-12'>
								<Card>
									<CardBody>
										<div className='grid grid-cols-12 gap-4'>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='Facilityname'>Facility Name </Label>
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
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='country'>Country</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={formik.touched?.address?.Country}
													invalidFeedback={
														formik.errors?.address?.Country
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
															id='country'
															name='address.Country'
															style={{ color: 'black' }}
															value={formik.values.address.Country}
															onChange={(event) => {
																formik.handleChange(event);
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
														formik.touched.address
															? formik.touched.address.Line1
															: undefined
													}
													invalidFeedback={
														formik.errors.address
															? formik.errors.address.Line1
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='Line1'
														name='Line1'
														onChange={formik.handleChange}
														value={formik.values.address.Line1}
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
														formik.touched.address
															? formik.touched.address.Line2
															: undefined
													}
													invalidFeedback={
														formik.errors.address
															? formik.errors.address.Line2
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='Line2'
														name='Line2'
														onChange={formik.handleChange}
														value={formik.values.address.Line2}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='suite'>Apt/Suite/Other</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.address
															? formik.touched.address.Suite
															: undefined
													}
													invalidFeedback={
														formik.errors.address
															? formik.errors.address.Suite
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='phone'
														name='phonenumber'
														onChange={formik.handleChange}
														value={formik.values.address.Suite}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='state'>State</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={formik.touched?.address?.State}
													invalidFeedback={formik.errors.address?.State}
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
															name='address.State'
															style={{ color: 'black' }}
															value={formik.values.address.State}
															onChange={(event) => {
																formik.handleChange(event);
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
													isTouched={formik.touched.address?.County}
													invalidFeedback={formik.errors.address?.County}
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
															name='address.County'
															style={{ color: 'black' }}
															value={formik.values.address.County}
															onChange={(event) => {
																formik.handleChange(event);
																handleCity(
																	formik.values.address.Stateid,
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
													isTouched={formik.touched.address?.City}
													invalidFeedback={formik.errors.address?.City}
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
															name='address.City'
															style={{ color: 'black' }}
															value={formik.values.address.City}
															onChange={formik.handleChange}
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
														formik.touched.address
															? formik.touched.address.ZipCode
															: undefined
													}
													invalidFeedback={
														formik.errors.address
															? formik.errors.address.ZipCode
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='zipcode'
														name='zipcode'
														onChange={formik.handleChange}
														value={formik.values.address.ZipCode}
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
							proceedtocheckout(false);
							proceedtopayment(false);
						}}>
						Back to Orders
					</Button>
					<Button
						variant='solid'
						onClick={() => {
							proceedtocheckout(false);
							proceedtopayment(false);
							addShippment(true);
						}}>
						Continue
					</Button>
				</ModalFooter>
			</Modal>
			<Modal
				isOpen={payment}
				setIsOpen={proceedtopayment}
				size={'lg'}
				isCentered={true}
				isAnimation={true}>
				<ModalHeader>Payment Information</ModalHeader>
				<ModalBody className='paymentclass'>
					<div className='col-span-12 lg:col-span-9'>
						<div className='grid grid-cols-12 gap-4'>
							<div className='col-span-12'>
								<Card>
									<CardBody>
										Credit/Debit card/FSA
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
							proceedtopayment(false);
						}}>
						Back to Orders
					</Button>
					<Button
						variant='solid'
						onClick={() => {
							proceedtopayment(false);
							proceedtocheckout(true);
						}}>
						Continue to Checkout
					</Button>
				</ModalFooter>
			</Modal>
			<Modal
				isOpen={shippment}
				setIsOpen={addShippment}
				size={'lg'}
				isCentered={true}
				isAnimation={true}>
				<ModalHeader>Items and Shippment</ModalHeader>
				<ModalBody className='shipments'>
					<div className='col-span-12 lg:col-span-9'>
						<div className='grid grid-cols-12 gap-4'>
							<div className='col-span-12'>
								<Card>
									<CardBody>
										<div className='grid grid-cols-12 gap-4'>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor={`shipment_date`}>
													Shipment Date:
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment?.ShipmentDate
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment.ShipmentDate
															: undefined
													}
													validFeedback='Good'>
													<Input
														type='date'
														id='ShipmentDate'
														name='shipment.ShipmentDate'
														onChange={formik.handleChange}
														value={formik.values.shipment.ShipmentDate}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='packagesize'>Package Size</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment?.PackageSize
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment.PackageSize
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='packagesize'
														name='shipment.PackageSize'
														onChange={formik.handleChange}
														value={formik.values.shipment.PackageSize}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='packagelength'>
													Package length
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment?.PackageLength
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment.PackageLength
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='packagelength'
														name='shipment.PackageLength'
														onChange={formik.handleChange}
														value={formik.values.shipment.PackageLength}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='packagewidth'>Package width</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment?.PackageWidth
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment.PackageWidth
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='packagewidth'
														name='shipment.PackageWidth'
														onChange={formik.handleChange}
														value={formik.values.shipment.PackageWidth}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='packageheight'>
													Package height
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment?.PackageHeight
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment.PackageHeight
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='packageheight'
														name='shipment.PackageHeight'
														onChange={formik.handleChange}
														value={formik.values.shipment.PackageHeight}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='type of package'>
													Type of package
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment?.TypeofPackage
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment.TypeofPackage
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='packagetype'
														name='shipment.TypeofPackage'
														onChange={formik.handleChange}
														value={formik.values.shipment.TypeofPackage}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='packagematerial'>
													Type of Package Material
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment
																	?.TypeofPackagingMaterial
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment
																	.TypeofPackagingMaterial
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='packagematerial'
														name='shipment
														.TypeofPackagingMaterial'
														onChange={formik.handleChange}
														value={
															formik.values.shipment
																.TypeofPackagingMaterial
														}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='storingtemperature'>
													Storing Temperaure
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment
																	?.Storingtemparature
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment
																	.Storingtemparature
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='storingtemp'
														name='shipment
														.Storingtemparature'
														onChange={formik.handleChange}
														value={
															formik.values.shipment
																.Storingtemparature
														}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='temperatureuom'>
													Temperaure Unit of Measure
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment
																	?.TemperatureUnitofmeasure
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment
																	.TemperatureUnitofmeasure
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='tempuom'
														name='shipment
														.TemperatureUnitofmeasure'
														onChange={formik.handleChange}
														value={
															formik.values.shipment
																.TemperatureUnitofmeasure
														}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='sizeuom'>
													Size Unit of Measure
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment
																	?.SizeUnitofMesure
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment
																	.SizeUnitofMesure
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='sizeuom'
														name='shipment.SizeUnitofMesure'
														onChange={formik.handleChange}
														value={
															formik.values.shipment.SizeUnitofMesure
														}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='weightuom'>
													Weight Unit of Measure
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment
																	?.WeightUnitofMeasure
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment
																	.WeightUnitofMeasure
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='weightuom'
														name='shipment
														.WeightUnitofMeasure'
														onChange={formik.handleChange}
														value={
															formik.values.shipment
																.WeightUnitofMeasure
														}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='noofpackages'>No of Packages</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment?.NoofPackages
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment.NoofPackages
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='noofpkgs'
														name='shipment.NoofPackages'
														onChange={formik.handleChange}
														value={formik.values.shipment.NoofPackages}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='Tracking Number'>
													Tracking Number
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment
																	?.TrackingNumber
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment.TrackingNumber
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='trackingno'
														name='shipment.TrackingNumber'
														onChange={formik.handleChange}
														value={
															formik.values.shipment.TrackingNumber
														}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='delivery_date'>
													Expected Delivery Date:
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment
																	?.Expecteddeliverydate
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment
																	.Expecteddeliverydate
															: undefined
													}
													validFeedback='Good'>
													<Input
														type='date'
														id='shipment
														.Expecteddeliverydate'
														name='expecteddeliverydt'
														onChange={formik.handleChange}
														value={
															formik.values.shipment
																.Expecteddeliverydate
														}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='recieving hours'>
													Recieving Hours
												</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={
														formik.touched.shipment
															? formik.touched.shipment
																	?.RecievingHours
															: undefined
													}
													invalidFeedback={
														formik.errors.shipment
															? formik.errors.shipment.RecievingHours
															: undefined
													}
													validFeedback='Good'>
													<Input
														id='recievinghrs'
														name='shipment.RecievingHours'
														onChange={formik.handleChange}
														value={
															formik.values.shipment.RecievingHours
														}
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
							addShippment(false);
						}}>
						Back to Orders
					</Button>
					<Button
						variant='solid'
						onClick={() => {
							formik.handleSubmit();
							addShippment(false);
						}}>
						Submit Order
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};
export default CartPartial;
