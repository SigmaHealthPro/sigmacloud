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
import apiconfig from '../../config/apiconfig';
import endpoint from '../../config/endpoint';
import {
	Image1,
	Image11Thumb,
	Image22,
	User1,
	User1Thumb,
	User3Thumb,
	UserBrainThumb,
} from '../../assets/images';
import { inventoryApi } from '../../Apis/inventoryApi';
import { useSelector } from 'react-redux';

import { RootState } from '../../components/redux/store';
import { HeroBuildingOffice, HeroBuildingOffice2 } from '../../components/icon/heroicons';
import axios from 'axios';
import {
	LocalHospital,
	LocalHospitalTwoTone,
	LocalPharmacy,
	LocalPharmacyTwoTone,
	MedicalInformation,
	MedicalServices,
	MedicalServicesOutlined,
	MedicalServicesTwoTone,
} from '@mui/icons-material';
interface Inventory {
	facilityName: string;

	// Add other properties as per your data structure
}
// interface Props {
//     inventoryId: string; // Define patientId as a prop
// }

function InventoryProfile() {
	type vaccineinfo = {
		cvxnotes: string;
		cvxcode: string;
		manufacturername: string;
		mvxcode: string;
		mvxnotes: string;
		nonvaccine: string;
		productname: string;
		vaccinename: string;
		vaccinestatus: string;
	};
	const inventoryData = useSelector((state: RootState) => state.inventory.value);
	console.log('Count value', inventoryData);
	const [InventoryData, setInventoryData] = useState<Inventory | null>(null);
	const [vaccinedetails, setvaccinedetails] = useState<vaccineinfo[]>([]);
	const [vaccinename, setvaccinename] = useState<string>('');
	const [mvxname, setmvxname] = useState<string>('');

	useEffect(() => {
		console.log('productidis:', inventoryData?.productId);
		listvaccineinfobyproduct();
		console.log('productvaccinedetails:', vaccinedetails);
		// const fetchInventoryData = async (id: any) => {
		// 	try {
		// 		const response = await inventoryApi(`api/Inventory/inventoryDetailsById?inventoryId=${id}`, 'GET');
		// 		console.log("Response from API:", response) ; // Debugging: Log the response
		// 		setInventoryData(response.data);
		// 	} catch (error) {
		// 		console.error('Error fetching Inventory data:', error);
		// 	}
		// };
		//  const inventoryId = '1802e62f-1060-44ac-94ab-c2506ac1ef09'; // Replace 'your_patient_id_here' with the actual patient ID
		//  fetchInventoryData(inventoryId);
	}, []);
	console.log('Inventory :', inventoryData);

	const listvaccineinfobyproduct = () => {
		async function callInitial() {
			await axios
				.post(
					apiconfig.apiHostUrl +
						endpoint.getvaccineinfobyproduct +
						inventoryData?.productId,
				)
				.then((response) => {
					console.log('setvaccinedetails:', response?.data.data);
					setvaccinedetails(response?.data.data);
					setvaccinename(response.data.data[0].vaccinename);
					setmvxname(response.data.data[0].manufacturername);
				})
				.catch((err) => console.log('Error has occured', err));
		}
		callInitial();
	};

	return (
		<PageWrapper name='Patient Profile'>
			<Grid container spacing={2} width={'98%'} alignSelf={'center'} marginTop={'0.5px'}>
				<Grid item alignSelf={'left'}>
					<h5 style={{ color: 'gray' }}> Inventory Summary</h5>
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
							<Paper style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Facility Details:<LocalPharmacyTwoTone></LocalPharmacyTwoTone>
								</Typography>
								<Divider />
								<br />
								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									Facility:{' '}
									<Typography variant='caption' color={'gray'}>
										{' '}
										<span style={{ marginRight: '23px' }}></span>
										{inventoryData?.facility} {''}
									</Typography>
								</Typography>
								<br />

								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									<span>Site Name: </span>
									<Typography variant='caption' color={'gray'}>
										{' '}
										<span style={{ marginRight: '8px' }}></span>
										{inventoryData?.site}
									</Typography>
								</Typography>
								<br />
								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									<span>Juridiction: </span>
									<Typography variant='caption' color={'gray'}>
										{' '}
										<span style={{ marginRight: '8px' }}></span>
										JD TEST
									</Typography>
								</Typography>
								<br />
								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									<span>Address: </span>
									<Typography variant='caption' color={'gray'}>
										{' '}
										<span style={{ marginRight: '8px' }}></span>
										<LocationOnIcon
											style={{
												fontSize: '16px',
												color: 'gray',
											}}
										/>
										1411 Sand Lake Road suiteA Niger (the) Florida Orlando 32809
										{/* {inventoryData?.addressline2} */}
										<br></br>
									</Typography>
								</Typography>
							</Paper>
						</Grid>
					</Grid>
					{/* 
					<Grid container spacing={2} marginTop={1}>
						<Grid item xs={12}>
							<Paper elevation={3} style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Site
								</Typography>
								<Divider />
								<Typography variant='caption' color={'gray'}>
									{inventoryData?.site}
								</Typography>
							</Paper>
						</Grid>
					</Grid> */}

					<Grid container spacing={2} marginTop={1}>
						<Grid item xs={12}>
							<Paper elevation={3} style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Inventory Details
								</Typography>
								<Divider />
								<br />
								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									Vaccine group Name:{' '}
									<Typography variant='caption' color={'gray'}>
										<span style={{ marginRight: '10px' }}></span>
										{vaccinename}
									</Typography>
								</Typography>
								<br />
								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									Temparature Recorded:{' '}
									<Typography variant='caption' color={'gray'}>
										{inventoryData?.tempRecorded}
									</Typography>
								</Typography>
								<br />
								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									Unit Of Temparature:{' '}
									<Typography variant='caption' color={'gray'}>
										<span style={{ marginRight: '12px' }}></span>
										{inventoryData?.unitOfTemp}
									</Typography>
								</Typography>
								<br />
								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									Quantity Remaining:{''}
									<Typography variant='caption' color={'gray'}>
										{' '}
										<span style={{ marginRight: '16px' }}></span>
										{inventoryData?.quantityRemaining}
									</Typography>
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
									Vaccine Information
								</Typography>
								<Divider />
								<br />
								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									Vaccine Name:{' '}
									<Typography variant='caption' color={'gray'}>
										{vaccinename}
									</Typography>
								</Typography>
								<br />
								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									Product Name:{' '}
									<Typography variant='caption' color={'gray'}>
										{inventoryData?.product}
									</Typography>
								</Typography>
								<br />
								<Typography variant='subtitle2' fontWeight={550} color={'gray'}>
									Manufacturer Name:{' '}
									<Typography variant='caption' color={'gray'}>
										{mvxname}
									</Typography>
								</Typography>
							</Paper>
						</Grid>
					</Grid>

					<Grid container spacing={2} marginTop={6}>
						<Grid item xs={12}>
							<Paper style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Lot Number
								</Typography>
								<Divider />
								<Typography variant='caption' color={'gray'}>
									{inventoryData?.unitOfTemp}
								</Typography>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									SaleNDC Number
								</Typography>
								<Divider />
								<Typography variant='caption' color={'gray'}>
									{inventoryData?.unitOfTemp}
								</Typography>
							</Paper>
						</Grid>
					</Grid>

					{/* <Grid container spacing={2} marginTop={1}>
						<Grid item xs={12}>
							<Paper elevation={3} style={{ padding: '8px' }}>
								<Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
									Quantity Remaining
								</Typography>
								<Divider />
								<Typography variant='caption' color={'gray'}>
									{inventoryData?.quantityRemaining}
								</Typography>
							</Paper>
						</Grid>
					</Grid> */}
				</Grid>
			</Grid>
		</PageWrapper>
	);
}

export default InventoryProfile;
