import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody } from '../../components/ui/Card';
import apiconfig from '../../config/apiconfig'; // Make sure this import is correct

// Define the interface for patient duplicate data

const DeDuplicationManagement = () => {
    const contactNumbpatientDuplicateDataColumns = [
        { field: 'personType', headerName: 'Person Type', flex: 1 },
        { field: 'firstName', headerName: 'First Name', flex: 1 },
        { field: 'lastName', headerName: 'Last Name', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 1 },
        { field: 'dateOfBirth', headerName: 'Date of Birth', flex: 1 },
        { field: 'middleName', headerName: 'Middle Name', flex: 1 },
        { field: 'motherFirstName', headerName: 'Mother First Name', flex: 1 },
        { field: 'motherLastName', headerName: 'Mother Last Name', flex: 1 },
    ];
    const [patientDuplicateData, setPatientDuplicateData] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchPatientDuplicateData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(apiconfig.apiHostUrl+'api/MasterData/getlistofpatientduplicatedata', {});
                if (response.data && response.data.status === 'Success') {
                    setPatientDuplicateData(response.data.dataList);
                } else {
                    setError('Error: Unable to fetch data');
                }
            } catch (error) {
                setError('Error: Unable to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientDuplicateData();
    }, []);

    return (
        <PageWrapper name='List'>
            <Container>
                <Card className='h-full'>
                    <CardBody className='overflow-auto'>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={patientDuplicateData}
                                columns={contactNumbpatientDuplicateDataColumns}
                                checkboxSelection
                                
                            />
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper>
    );
};

export default DeDuplicationManagement;
