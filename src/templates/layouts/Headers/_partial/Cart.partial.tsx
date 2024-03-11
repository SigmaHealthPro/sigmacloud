import React, { FC, ReactNode, useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { appPages } from '../../../../config/pages.config';
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
	const productName = localStorage.getItem('productname');
	const [selectedItem, setSelectedItem] = useState<Cart | null>(null);
	const [countryData, setCountryData] = useState([]);
	const [stateData, setStateData] = useState([]);
	const [filteredState, setFilteredState] = useState([]);
	const [filteredCity, setFilteredCity] = useState([]);
	const [filteredVaccine, setFilteredVaccine] = useState<Vaccine[]>([]);
	const [vaccineloading, setVaccineLoading] = useState<boolean>(false);
	const [rowcountstates, setRowCountstates] = useState<number>(0);
	const [filteredFacility, setFilteredFacility] = useState([]);
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 5,
	});
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
	type checkoutitems = {
		id: string;
		city: string;
		cityId: string;
		state: string;
		stateId: string;
		country: string;
		countryId: string;
		zipCode: string;
		phonenumber: number;
		Facility: string;
		FacilityId: string;
		line1: string;
		line2: string;
		suite: string;
	};
	const formik = useFormik({
		initialValues: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			city: '',
			cityId: generatedGUID,
			state: '',
			stateId: generatedGUID,
			country: '',
			countryId: generatedGUID,
			zipCode: '',
			phonenumber: 0,
			Facility: '',
			FacilityId: generatedGUID,
			line1: '',
			line2: '',
			suite: '',
		},
		validate: (values: checkoutitems) => {
			const errors: any = {};

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
		onSubmit: async (values: checkoutitems) => {},
	});
	const reset = () => {
		formik.setFieldValue('firstName', '');

		formik.setFieldValue('phonenumber', '');
		formik.setFieldValue('personType', '');
		formik.setFieldValue('city', '');
		formik.setFieldValue('state', '');
		formik.setFieldValue('country', '');
	};
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
			await patientApi('/api/MasterData/Countries', 'GET')
				.then((response) => {
					setCountryData(response?.data);
				})
				.catch((err) => console.log('Error has occured', err));
			await patientApi('/api/MasterData/States', 'GET')
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
	const handleCity = async (state: any) => {
		console.log('Selected State ID', state);
		const response = await patientApi(
			`/api/MasterData/getcitiesbystateid?stateid=${state}`,
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
							proceedtocheckout(true);
						}}>
						Proceed to Checkout
					</Button>
				</ModalFooter>
			</Modal>
			<Modal
				isOpen={checkout}
				setIsOpen={proceedtocheckout}
				size={'lg'}
				isCentered={true}
				isAnimation={true}>
				<ModalHeader>Checkout</ModalHeader>
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
																handleState(event.target.value);
															}}
															onBlur={formik.handleBlur}
															placeholder='Select Country'>
															{/* <option value={''}> Select</option> */}
															{countryData?.map((country: any) => (
																<option
																	style={{
																		color: 'black',
																	}}
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
												<Label htmlFor='phonenumber'>Phone Number</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={formik.touched.phonenumber}
													invalidFeedback={formik.errors.phonenumber}
													validFeedback='Good'>
													<Input
														id='phone'
														name='phonenumber'
														onChange={formik.handleChange}
														value={formik.values.phonenumber}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='address'>Street Address</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={formik.touched.line1}
													invalidFeedback={formik.errors.line1}
													validFeedback='Good'>
													<Input
														id='phone'
														name='phonenumber'
														onChange={formik.handleChange}
														value={formik.values.line1}
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
													isTouched={formik.touched.line2}
													invalidFeedback={formik.errors.line2}
													validFeedback='Good'>
													<Input
														id='phone'
														name='phonenumber'
														onChange={formik.handleChange}
														value={formik.values.line2}
														onBlur={formik.handleBlur}
													/>
												</Validation>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='suite'>Apt/Suite/Other</Label>
												<Validation
													isValid={formik.isValid}
													isTouched={formik.touched.suite}
													invalidFeedback={formik.errors.suite}
													validFeedback='Good'>
													<Input
														id='phone'
														name='phonenumber'
														onChange={formik.handleChange}
														value={formik.values.suite}
														onBlur={formik.handleBlur}
													/>
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
																handleCity(event.target.value);
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
													isTouched={formik.touched.zipCode}
													invalidFeedback={formik.errors.zipCode}
													validFeedback='Good'>
													<Input
														id='zipcode'
														name='zipcode'
														onChange={formik.handleChange}
														value={formik.values.zipCode}
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
						}}>
						Back to Orders
					</Button>
					<Button
						variant='solid'
						onClick={() => {
							proceedtocheckout(false);
						}}>
						Shippment
					</Button>
				</ModalFooter>
			</Modal>
			<Modal
				isOpen={checkout}
				setIsOpen={proceedtocheckout}
				size={'lg'}
				isCentered={true}
				isAnimation={true}>
				<ModalHeader>Items and Shippment</ModalHeader>
				<ModalBody>
					<div className='col-span-12 lg:col-span-9'>
						<div className='grid grid-cols-12 gap-4'>
							<div className='col-span-12'></div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter></ModalFooter>
			</Modal>
		</div>
	);
};
export default CartPartial;
