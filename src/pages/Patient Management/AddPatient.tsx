import { Link, useParams } from "react-router-dom";
import PageWrapper from "../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../components/layouts/Subheader/Subheader";
import Button from "../../components/ui/Button";
import Container from "../../components/layouts/Container/Container";

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

function AddPatient() {

	const [countryData, setCountryData] = useState([]);
	const [stateData, setStateData] = useState([]);
	const [filteredState, setFilteredState] = useState([]);
	const [cityData, setCityData] = useState([]);
	const [filteredCity, setFilteredCity]=useState([]);
	const [value, setValue]=useState(localStorage.getItem("token"));

	let generatedGUID: string;
	generatedGUID =uuidv4();

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
	},  []);

	type Patient = {
		id: number;
		createdDate: string;
		createdBy: string;
		updatedBy: string;
		patientId: number;
		dateOfHistoryVaccine: string;
		patientStatus: string;
		patientName: string;
		cityName: string;
		stateName: string;
		countryName: string;
		zipCode: string;
		personId: UUID;
		personType: string;
	};

	const handleState =async (country: any) => {
		console.log('Selectd state ID', country);
		const data =  stateData?.filter((item: any) => item.countryId === country);
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
			 id : generatedGUID,
			 createdDate : "2024-01-17T18:25:24.798Z",
			 createdBy : "string",
			 updatedBy : "string",
			 patientId : 0,
			 firstName : '',
			 middleName : '',
			 lastName : '',
			 gender : '',
			 dateOfBirth : '',
			 dateOfHistoryVaccine1 : '',
			 motherFirstName : '',
			 motherMaidenLastName : '',
			 motherLastName : '',
			 patientStatus : '',
			 personType : '',
			 city : '',
			 state : '',
			 country : '',
			 zipCode : "string",
			 personId : generatedGUID
		},

		onSubmit: async (values: any) => {
			console.log("Request Payload: ", values);
			try {
				const postResponse = await axios.post("https://localhost:7155/api/Patients/createpatient", values, {
					headers: { 'Content-Type': 'application/json' },
				  });
				  
			  console.log("Response: ", postResponse.data);
			} catch (error) {
			  console.error("Error: ", error);
			}
		  },
	});
	return (
		<div>
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
													<Input id='firstnName' name='firstName'
														onChange={formik.handleChange} value={formik.values.firstName}
														validFeedback="Good"
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='middleName'>Middle Name</Label>
													<Input id='middleName' name='middleName'
														onChange={formik.handleChange} value={formik.values.middleName}
														validFeedback="Good"
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='lastName'>Last Name</Label>
													<Input id='lastName' name='lastName'
														onChange={formik.handleChange} value={formik.values.lastName}
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='gender'>Gender</Label>
													<Input id='gender' name='gender'
														onChange={formik.handleChange} value={formik.values.gender}
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='dateOfBirth'>Date Of Birth</Label>
													<Input type='date' id='dateOfBirth' name='dateOfBirth'
														onChange={formik.handleChange} value={formik.values.dateOfBirth}
													/>
												</div>
											
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='dateOfHistoryVaccine1'> Date Of History Vaccine</Label>
													<Input type='date' id=' dateOfHistoryVaccine1' name='dateOfHistoryVaccine1'
														onChange={formik.handleChange}  value={formik.values.dateOfHistoryVaccine1}
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='motherFirstName'>Mother First Name</Label>
													<Input id='motherFirstName' name='motherFirstName'
														onChange={formik.handleChange} value={formik.values.motherFirstName}
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='motherMaidenLastName'>Mother Maiden Last Name</Label>
													<Input id='motherMaidenLastName' name='motherMaidenLastName'
														onChange={formik.handleChange} value={formik.values.motherMaidenLastName}
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='motherLastName'>Mother Last Name</Label>
													<Input id='motherLastName' name='motherLastName'
														onChange={formik.handleChange} value={formik.values.motherLastName}
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='patientStatus'>Patient Status</Label>
													<Input id='patientStatus' name='patientStatus'
														onChange={formik.handleChange} value={formik.values.patientStatus}
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='personType'>Person Type</Label>
													<Input id='personType' name='personType'
														onChange={formik.handleChange} value={formik.values.personType}
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='country'>Country</Label>
														<select id='country' name='country' style={{ color: 'black' }} value={formik.values.country} onChange={(event) => { formik.handleChange(event); handleState(event.target.value) }} > 
														 <option value={""}> Select</option>
														{
															countryData?.map((country: any) => {
																return (
																	<option style={{ color: 'black' }} id={country?.id} key={country?.id} value={country?.id}>{country?.countryName}</option>
																)
															})
														}
													</select>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='state'>State</Label>
													<select id='state' name='state' style={{ color: 'black' }} value={formik.values.state}onChange={(event) => { formik.handleChange(event); handleCity(event.target.value) }}  >
														<option value={""}> Select</option>
														{
															filteredState?.map((state: any) => {
																return (
																	<option style={{ color: 'black' }} id={state?.id} key={state?.id} value={state?.id}>{state?.stateName}</option>
																)
															})
														}
													</select>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='county'>County</Label>
													<Input id='county' name='county'
														// onChange={formik.handleChange} value={formik.values.city}
													/>
												</div>
												<div className='col-span-12 lg:col-span-6'>
													<Label htmlFor='city'>City</Label>
													<select id='city' name='city' style={{ color: 'black' }} value={formik.values.city} onChange={ formik.handleChange} >
														<option value={""}> Select</option>
														{
															filteredCity?.map((city: any) => {
																return (
																	<option style={{ color: 'black' }} id={city?.id} key={city?.id} value={city?.id}>{city?.cityName}</option>
																)
															})

														}
													</select>
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
