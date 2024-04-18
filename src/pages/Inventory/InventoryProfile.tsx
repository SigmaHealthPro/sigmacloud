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
    import { inventoryApi } from '../../Apis/inventoryApi';
    import { useSelector } from 'react-redux';


    
    import { RootState } from '../../components/redux/store';
    interface Inventory {
        facilityName: string;

        // Add other properties as per your data structure
        
    }
    // interface Props {
    //     inventoryId: string; // Define patientId as a prop
    // }
    
    
    function InventoryProfile() {
        const inventoryData = useSelector((state: RootState) => state.inventory.value);
        console.log("Count value",inventoryData)
        const [InventoryData, setInventoryData] =useState<Inventory | null>(null);
    
    
    useEffect(() => {
        
        // const fetchInventoryData = async (id: any) => {
        
        // 	try {
        // 		const response = await inventoryApi(`api/Inventory/inventoryDetailsById?inventoryId=${id}`, 'GET');
        		
        // 		console.log("Response from API:", response); // Debugging: Log the response
        // 		setInventoryData(response.data);
        // 	} catch (error) {
        // 		console.error('Error fetching Inventory data:', error);
        // 	}
        // };
        //  const inventoryId = '1802e62f-1060-44ac-94ab-c2506ac1ef09'; // Replace 'your_patient_id_here' with the actual patient ID
        //  fetchInventoryData(inventoryId);
    }, []);
    console.log("Inventory :", inventoryData); 
        
       
    
    
    
    
    
    
    
    
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
                    <Grid container spacing={2} >
                            <Grid item xs={12}>
                                <Paper style={{ padding: '8px' }}>
                                    <Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
                                    Facility Name

                                    </Typography>
                                    <Divider />
                                    <Typography variant='caption' color={'gray'}>
                                    {inventoryData ?.facility }

                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                           
    
                        <Grid container spacing={2} marginTop={1}>
                            <Grid item xs={12}>
                                <Paper elevation={3} style={{ padding: '8px' }}>
                                    <Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
                                    Site
                                    </Typography>
                                    <Divider />
                                    <Typography variant='caption' color={'gray'}>
                                    {inventoryData ?.site }
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
    
                        <Grid container spacing={2} marginTop={1}>
                            <Grid item xs={12}>
                                <Paper elevation={3} style={{ padding: '8px' }}>
                                    <Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
                                    Temp Recorded
                                    </Typography>
                                    <Divider />
                                    <Typography variant='caption' color={'gray'}>
                                    {inventoryData ?.tempRecorded }
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
                                    Product
                                    </Typography>
                                    <Divider />
                                    <Typography variant='caption' color={'gray'}>
                                    {inventoryData ?.product }
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
{/*     
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
                        </Grid> */}
    
                        <Grid container spacing={2} marginTop={1}>
                            <Grid item xs={12}>
                                <Paper style={{ padding: '8px' }}>
                                    <Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
                                    Unit Of Temp
                                    </Typography>
                                    <Divider />
                                    <Typography variant='caption' color={'gray'}>
                                    {inventoryData ?.unitOfTemp }
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
    
                        <Grid container spacing={2} marginTop={1}>
                            <Grid item xs={12}>
                                <Paper elevation={3} style={{ padding: '8px' }}>
                                    <Typography variant='subtitle2' fontWeight={600} color={'#597b9f'}>
                                    Quantity Remaining
                                    </Typography>
                                    <Divider />
                                    <Typography variant='caption' color={'gray'}>
                                    {inventoryData ?.quantityRemaining }
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </PageWrapper>
        );
    }

export default InventoryProfile
