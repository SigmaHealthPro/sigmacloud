import { Link, useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../components/layouts/Subheader/Subheader";
import Button from "../../components/ui/Button";
import Container from "../../components/layouts/Container/Container";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../components/ui/Card";
import Label from "../../components/form/Label";
import Input from "../../components/form/Input";
import { appPages } from "../../config/pages.config";
import { useFormik } from "formik";
import { values } from "lodash";
import { error } from "console";
import { patientApi } from "../../Apis/patientsApi";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { UUID } from "crypto";
import Validation from "../../components/form/Validation";

function AddPatient() {
	const navigate = useNavigate()
	const [countryData, setCountryData] = useState([]);
	const [stateData, setStateData] = useState([]);
	const [filteredState, setFilteredState] = useState([]);
	const [cityData, setCityData] = useState([]);
	const [filteredCity, setFilteredCity] = useState([]);
	const [value, setValue] = useState(localStorage.getItem("token"));

	let generatedGUID: string;
	generatedGUID = uuidv4();

	useEffect(() => {
		async function callInitial() {
			await patientApi('/api/MasterData/Countries', "GET")
				.then(response => {
					setCountryData(response?.data)
				})
				.catch(err => console.log("Error has occured", err))
			await patientApi('/api/MasterData/States', "GET")
				.then(response => {
					setStateData(response?.data)
				})
				.catch(err => console.log("Error has occured", err))
		}
		callInitial();
	}, []);

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
		dateOfBirth: string;
		dateOfHistoryVaccine1: string;
		motherFirstName:string;
		motherMaidenLastName: string;
		motherLastName: string;
		city: string;
		state: string;
		country: string;
		zipCode: string;
		personId: string;
		personType: string;
	};

	const handleState = async (country: any) => {
		console.log('Selectd state ID', country);
		const data = stateData?.filter((item: any) => item.countryId === country);
		console.log('Filtered state', data);
		setFilteredState(data);
	}

	const handleCity = async (state: any) => {
		console.log('Selected State ID', state);
		const response = await patientApi(`/api/MasterData/getcitiesbystateid?stateid=${state}`, "GET");
		setFilteredCity(response?.data);
	}

	const formik = useFormik({
		initialValues: {
			id: generatedGUID,
			createdDate: "2024-01-17T18:25:24.798Z",
			createdBy: "string",
			updatedBy: "string",
			patientId: 0,
			firstName: '',
			middleName: '',
			lastName: '',
			gender: '',
			dateOfBirth: '',
			dateOfHistoryVaccine1: '',
			motherFirstName: '',
			motherMaidenLastName: '',
			motherLastName: '',
			patientStatus: '',
			personType: '',
			city: '',
			state: '',
			country: '',
			zipCode: "string",
			personId: generatedGUID
		},

		validate:(values:Patient)=>{
			const errors : any = {};

			if(!values.firstName){
				errors.firstName='Required';
			}
			if(!values.middleName){
				errors.middleName='Required';
			}
			if(!values.lastName){
				errors.lastName='Required';
			}
			if(!values.gender){
				errors.gender='Required';
			}
			if(!values.dateOfBirth){
				errors.dateOfBirth='Required';
			}
			if(!values.dateOfHistoryVaccine1){
				errors.dateOfHistoryVaccine1='Required';
			}
			if(!values.motherFirstName){
				errors.motherFirstName='Required';
			}
			if(!values.motherMaidenLastName){
				errors.motherMaidenLastName='Required';
			}
			if(!values.motherLastName){
				errors.motherLastName='Required';
			}
			if(!values.patientStatus){
				errors.patientStatus='Required';
			}
			if(!values.personType){
				errors.personType='Required';
			}
			if(!values.country){
				errors.countryName='Required';
			}
			if(!values.state){
				errors.stateName='Required';
			}
			if(!values.city){
				errors.cityName='Required';
			}
            
            return errors;
		},

		onSubmit: async (values: Patient) => {
			console.log("Request Payload: ", values);
			try {
				const postResponse = await axios.post("https://localhost:7155/api/Patients/createpatient", values, {
					headers: { 'Content-Type': 'application/json' },
				});
				toast.success("Patient added successfully!");
				setTimeout(() => {
					navigate("/patient-management");
				}, 2000);

				console.log("Response: ", postResponse.data);
			} catch (error) {
				console.error("Error: ", error);
			}
		},
	});
	return (
		<div>
			<Toaster />
			<PageWrapper name=" Patients">
				<Subheader>
					<SubheaderLeft>
						<Link to={`../${appPages.PatientManagement.to}`}>
							<Button icon='HeroArrowLeft' className='!px-0'>Back to List</Button>
						</Link>
						<SubheaderSeparator />
						{/* {formik.values.p ? `${formik.values.productName} - Edit` : 'New Product'} */}
					</SubheaderLeft>
					<SubheaderRight>
						<Button variant='solid' onClick={() => formik.handleSubmit()}>Save</Button>
					</SubheaderRight>
				</Subheader>
				<Container>
					<div className='grid grid-cols-12 gap-4'>
						<div className='col-span-12'>
							<h1 className='my-4 font-bold'>Add Patient</h1>
						</div>
						<div className='col-span-12 lg:col-span-9'>
							<div className='grid grid-cols-12 gap-4'>
								<div className='col-span-12'>
									<Card>
										<CardHeader>
											<CardHeaderChild>
												<CardTitle>General Info</CardTitle>
											</CardHeaderChild>
										</CardHeader>
										<CardBody>
											<div className='grid grid-cols-12 gap-4'>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='firstName'>First Name </Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.firstName}
													invalidFeedback={formik.errors.firstName}
													validFeedback='Good'>												
														<Input id='firstnName' name='firstName'
														onChange={formik.handleChange} value={formik.values.firstName} onBlur={formik.handleBlur}														
													/>
													</Validation>
	
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='middleName'>Middle Name</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.middleName}
													invalidFeedback={formik.errors.middleName}
													validFeedback='Good'>
													<Input id='middleName' name='middleName'
														onChange={formik.handleChange} value={formik.values.middleName} onBlur={formik.handleBlur}
													
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
													<Input id='lastName' name='lastName'
														onChange={formik.handleChange} value={formik.values.lastName} onBlur={formik.handleBlur}
													/>
													</Validation>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='gender'>Gender</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.gender}
													invalidFeedback={formik.errors.gender}
													validFeedback='Good'>
													<Input id='gender' name='gender'
														onChange={formik.handleChange} value={formik.values.gender} onBlur={formik.handleBlur}
													/>
													</Validation>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='dateOfBirth'>Date Of Birth</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.dateOfBirth}
													invalidFeedback={formik.errors.dateOfBirth}
													validFeedback='Good'>
													<Input type='date' id='dateOfBirth' name='dateOfBirth'
														onChange={formik.handleChange} value={formik.values.dateOfBirth} onBlur={formik.handleBlur}
													/>
													</Validation>
												</div>

												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='dateOfHistoryVaccine1'> Date Of History Vaccine</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.dateOfHistoryVaccine1}
													invalidFeedback={formik.errors.dateOfHistoryVaccine1}
													validFeedback='Good'>
													<Input type='date' id=' dateOfHistoryVaccine1' name='dateOfHistoryVaccine1'
														onChange={formik.handleChange} value={formik.values.dateOfHistoryVaccine1}  onBlur={formik.handleBlur}
													/>
													</Validation>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='motherFirstName'>Mother First Name</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.motherFirstName}
													invalidFeedback={formik.errors.motherFirstName}
													validFeedback='Good'>
													<Input id='motherFirstName' name='motherFirstName'
														onChange={formik.handleChange} value={formik.values.motherFirstName} onBlur={formik.handleBlur}
													/>
													</Validation>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='motherMaidenLastName'>Mother Maiden Last Name</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.motherMaidenLastName}
													invalidFeedback={formik.errors.motherMaidenLastName}
													validFeedback='Good'>
													<Input id='motherMaidenLastName' name='motherMaidenLastName'
														onChange={formik.handleChange} value={formik.values.motherMaidenLastName} onBlur={formik.handleBlur}
													/>
													</Validation>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='motherLastName'>Mother Last Name</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.motherLastName}
													invalidFeedback={formik.errors.motherLastName}
													validFeedback='Good'>
													<Input id='motherLastName' name='motherLastName'
														onChange={formik.handleChange} value={formik.values.motherLastName} onBlur={formik.handleBlur}
													/>
													</Validation>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='patientStatus'>Patient Status</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.patientStatus}
													invalidFeedback={formik.errors.patientStatus}
													validFeedback='Good'>
													<Input id='patientStatus' name='patientStatus'
														onChange={formik.handleChange} value={formik.values.patientStatus} onBlur={formik.handleBlur}
													/>
													</Validation>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='personType'>Person Type</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.personType}
													invalidFeedback={formik.errors.personType}
													validFeedback='Good'>
													<Input id='personType' name='personType'
														onChange={formik.handleChange} value={formik.values.personType} onBlur={formik.handleBlur}
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
													<select id='country' name='country' style={{ color: 'black' }} value={formik.values.country} onChange={(event) => { formik.handleChange(event); handleState(event.target.value) }}  onBlur={formik.handleBlur} >
														<option value={""}> Select</option>
														{
															countryData?.map((country: any) => {
																return (
																	<option style={{ color: 'black' }} id={country?.id} key={country?.id} value={country?.id}>{country?.countryName}</option>
																)
															})
														}
													</select>
													</Validation>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='state'>State</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.state}
													invalidFeedback={formik.errors.state}
													validFeedback='Good'>
													<select id='state' name='state' style={{ color: 'black' }} value={formik.values.state} onChange={(event) => { formik.handleChange(event); handleCity(event.target.value) }}   onBlur={formik.handleBlur} >
														<option value={""}> Select</option>
														{
															filteredState?.map((state: any) => {
																return (
																	<option style={{ color: 'black' }} id={state?.id} key={state?.id} value={state?.id}>{state?.stateName}</option>
																)
															})
														}
													</select>
													</Validation>
												</div>
												{/* <div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='county'>County</Label>
													<Input id='county' name='county'
													// onChange={formik.handleChange} value={formik.values.city}
													/>
												</div> */}
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='city'>City</Label>
													<Validation 
													isValid={formik.isValid}
													isTouched={formik.touched.city}
													invalidFeedback={formik.errors.city}
													validFeedback='Good'>
													<select id='city' name='city' style={{ color: 'black' }} value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} >
														<option value={""}> Select</option>
														{
															filteredCity?.map((city: any) => {
																return (
																	<option style={{ color: 'black' }} id={city?.id} key={city?.id} value={city?.id}>{city?.cityName}</option>
																)
															})

														}
													</select>
													</Validation>
												</div>
											</div>
										</CardBody>
									</Card>
								</div>
							</div>
						</div>
					</div>
				</Container>
			</PageWrapper>
		</div>
	);
}
export default AddPatient;
