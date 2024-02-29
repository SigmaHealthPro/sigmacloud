import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../components/ui/Card';
import Button from '@mui/material/Button';
import Label from '../../components/form/Label';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Subheader from '../../components/layouts/Subheader/Subheader';
import { Grid, Paper, Typography } from '@mui/material';
import { Divider } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import MailIcon from '@mui/icons-material/Mail';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Person2Icon from '@mui/icons-material/Person2';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LockResetIcon from '@mui/icons-material/LockReset';
import Switch from '@mui/material/Switch';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import TireRepairIcon from '@mui/icons-material/TireRepair';
import BoyIcon from '@mui/icons-material/Boy';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import HeightIcon from '@mui/icons-material/Height';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import DownloadIcon from '@mui/icons-material/Download';
import CachedIcon from '@mui/icons-material/Cached';
import EditIcon from '@mui/icons-material/Edit';
import { Image1, Image11Thumb, Image22, User1, User1Thumb, User3Thumb, UserBrainThumb } from '../../assets/images';
import { patientApi } from '../../Apis/patientsApi';
import { useSelector } from 'react-redux';

import { RootState } from '../../components/redux/store';
interface Patient {
    firstName: string;
    lastName: string;
    // Add other properties as per your data structure
	
}
// interface Props {
//     patientId: string; // Define patientId as a prop
// }


function PatientProfile() {
	const profileData = useSelector((state: RootState) => state.profile.value);
	console.log("Count value",profileData)
	const [patientData, setPatientData] = useState<Patient | null>(null);


useEffect(() => {
	
	// const fetchPatientData = async (id: any) => {
	
	// 	try {
	// 		const response = await patientApi(`/api/Patients/patientDetailsById?patientId=${id}`, 'GET');
	// 		debugger;
	// 		console.log("Response from API:", response); // Debugging: Log the response
	// 		setPatientData(response.data.data);
	// 	} catch (error) {
	// 		console.error('Error fetching patient data:', error);
	// 	}
	// };
	//  const patientId = 'f49909f4-8717-4fd7-8e24-a7f647709874'; // Replace 'your_patient_id_here' with the actual patient ID
	// fetchPatientData(patientId);
}, []);
console.log("Patient Data:", patientData); 
	
   








	return (
		<PageWrapper name='Patient Profile'>
			<Grid container spacing={2} width={'98%'} alignSelf={'center'} marginTop={'0.5px'}>
				<Grid item alignSelf={'left'}>
					<h5 style={{color : 'gray'}}> Profile Summary</h5>
				</Grid>
				<Grid item alignSelf={'right'} marginLeft={'auto'}>
					<Button
						variant='contained'
						color='success'
						size='small'
						style={{ marginRight: '10px' }}>
						<DownloadIcon />
						CCDA
					</Button>
					<Button
						variant='contained'
						color='success'
						size='small'
						style={{ marginRight: '10px' }}>
						<CachedIcon />
						DE-ACTIVATE
					</Button>
					<Button variant='contained' color='success' size='small'>
						<EditIcon />
						Profile
					</Button>
				</Grid>
			</Grid>
			<Grid container spacing={2} width='98%' alignSelf={'center'} marginTop={'0.5px'}>
				<Grid item xs={6}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Paper elevation={3} style={{ padding: '8px' }}>
								<Grid container spacing={1}>
									<Grid item xs={3}>
										<Paper
											elevation={4}
											style={{
												padding: '65px',
												backgroundImage:`url(${User1Thumb})`,
												backgroundRepeat: 'no-repeat',
												backgroundSize: 'cover',
												width: '75%',
												height: '25vh',
											}}></Paper>
									</Grid>
									<Grid item xs={7} ml={1}>
										
									<Typography variant='subtitle1' color={'gray'}>
										
									
	
										{profileData ? profileData.firstName : 'Loading...'}
										</Typography>
										<Person2Icon
											style={{
												color: 'gray',
												fontSize: '17px',
												marginRight: '5px',
											}}
										/>{' '}
										{profileData?.gender}<br></br>
										<CalendarMonthIcon
											style={{
												color: 'gray',
												fontSize: '17px',
												marginRight: '5px',
											}}
										/>{' '}
										1 year <br></br>
										<LockResetIcon
											style={{
												color: 'gray',
												fontSize: '17px',
												marginRight: '5px',
											}}
										/>{' '}
										SSN : 1234534532344<br></br>
										<MedicalServicesIcon
											style={{
												color: 'gray',
												fontSize: '17px',
												marginRight: '5px',
											}}
										/>{' '}
										MRN : 235-234-2342<br></br>
										<div style={{ marginTop: '5px', marginBottom: '5px' }}>
											<Switch defaultChecked size='small' /> Active <br></br>
											<Switch size='small' /> Lock Account
										</div>
										<Button
											variant='contained'
											color='success'
											size='small'
											style={{ marginRight: '5px', marginLeft: 'auto' }}>
											Update Availablity
										</Button>
										<Button variant='contained' color='success' size='small'>
											View Eligibility
										</Button>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>

					<Grid container spacing={2} marginTop={1}>
						<Grid item xs={12}>
							<Paper elevation={3} style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Vitals
								</Typography>
								<Divider />
								<Grid container spacing={2}>
									<Grid item xs={4}>
										<Paper elevation={0} style={{ padding: '8px' }}>
											<Typography
												variant='subtitle2'
												style={{ color: '#ff0000' }}>
												Heart Beat
											</Typography>
											<MonitorHeartIcon style={{ color: '#ff0000' }} />
										</Paper>
									</Grid>
									<Grid item xs={4}>
										<Paper elevation={0} style={{ padding: '8px' }}>
											<Typography
												variant='subtitle2'
												style={{ color: '#30ae4b' }}>
												Blood Pressure
											</Typography>
											<TireRepairIcon style={{ color: '#30ae4b' }} />
										</Paper>
									</Grid>
									<Grid item xs={4}>
										<Paper elevation={0} style={{ padding: '8px' }}>
											<Typography variant='subtitle2'>BMI</Typography>
											<BoyIcon />
										</Paper>
									</Grid>

									{/* Second Row */}
									<Grid item xs={4}>
										<Paper elevation={0} style={{ padding: '8px' }}>
											<Typography variant='subtitle2'>Temperature</Typography>
											<DeviceThermostatIcon />
										</Paper>
									</Grid>
									<Grid item xs={4}>
										<Paper elevation={0} style={{ padding: '8px' }}>
											<Typography
												variant='subtitle2'
												style={{ color: '#c1c143' }}>
												Height
											</Typography>
											<HeightIcon style={{ color: '#c1c143' }} />
										</Paper>
									</Grid>
									<Grid item xs={4}>
										<Paper elevation={0} style={{ padding: '8px' }}>
											<Typography
												variant='subtitle2'
												style={{ color: 'purple' }}>
												Weight
											</Typography>
											<MonitorWeightIcon style={{ color: 'purple' }} />
										</Paper>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>

					<Grid container spacing={2} marginTop={1}>
						<Grid item xs={12}>
							<Paper elevation={3} style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Tags
								</Typography>
								<Divider />
								<Typography variant='caption' color={'gray'}>
									No Tags Available
								</Typography>
							</Paper>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={6}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Paper elevation={3} style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Patient Details
								</Typography>
								<Divider />
								<CallIcon
									style={{ color: 'gray', fontSize: '16px', marginRight: '7px' }}
								/>
								{profileData?.contactValue}<br></br>
								<MailIcon
									style={{ color: 'gray', fontSize: '16px', marginRight: '7px' }}
								/>
								{profileData?.contactType}<br></br>
								<LocationOnIcon
									style={{ fontSize: '16px', color: 'gray', marginRight: '7px' }}
								/>{' '}
								{profileData?.address}<br></br>
							</Paper>
						</Grid>
					</Grid>

					<Grid container spacing={2} marginTop={3}>
						<Grid item xs={12}>
							<Paper elevation={3} style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Appointment Details
								</Typography>
								<Divider />
								<Grid container spacing={2} width={'90%'} alignItems={'center'}>
									<Grid item xs={6} mt={1}>
										<Typography
											variant='subtitle2'
											fontWeight={550}
											color={'gray'}>
											Upcoming Appointments
										</Typography>
										<Typography variant='caption' color={'gray'}>
											No appointments Found.
										</Typography>
									</Grid>
									<Grid item xs={6} mt={1}>
										<Typography
											variant='subtitle2'
											fontWeight={550}
											color={'gray'}>
											Last Appointments
										</Typography>
										<Typography variant='caption' color={'gray'}>
											No appointments Found.
										</Typography>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>

					<Grid container spacing={2} marginTop={3}>
						<Grid item xs={12}>
							<Paper style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Diagnosis
								</Typography>
								<Divider />
								<Typography variant='caption' color={'gray'}>
									No diagnosis Found.
								</Typography>
							</Paper>
						</Grid>
					</Grid>

					<Grid container spacing={2} marginTop={3}>
						<Grid item xs={12}>
							<Paper elevation={3} style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Allergies
								</Typography>
								<Divider />
								<Typography variant='caption' color={'gray'}>
									No allergies Found.
								</Typography>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</PageWrapper>
	);
}

export default PatientProfile;