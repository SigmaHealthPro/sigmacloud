import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody } from '../../components/ui/Card';
import apiconfig from '../../config/apiconfig'; // Make sure this import is correct
import Button from '../../components/ui/Button';

const DeDuplicationPatientNewData = () => {
    const patientNewDataColumns = [
        { field: 'personType', headerName: 'Person Type', flex: 1 },
        { field: 'firstName', headerName: 'First Name', flex: 1 },
        { field: 'lastName', headerName: 'Last Name', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 1 },
        { field: 'dateOfBirth', headerName: 'Date of Birth', flex: 1 },
        { field: 'middleName', headerName: 'Middle Name', flex: 1 },
        { field: 'motherFirstName', headerName: 'Mother First Name', flex: 1 },
        { field: 'motherLastName', headerName: 'Mother Last Name', flex: 1 },
    ];
    const [patientnewData, setPatientnewData] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState<boolean>(false);

    useEffect(() => {
        const fetchPatientNewData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(apiconfig.apiHostUrl + 'api/MasterData/getlistofpatientnewdata');
                if (response.data && response.data.status === 'Success') {
                    setPatientnewData(response.data.dataList);
                } else {
                    setError('Error: Unable to fetch data');
                }
            } catch (error) {
                setError('Error: Unable to fetch data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchPatientNewData();
    }, []);
    
    const handleSelectionChange = (selection:any) => {
        setIsAnyCheckboxChecked(selection.length > 0);
    };
  
    return (
        <PageWrapper name='List'>
            <Container>
                <Card className='h-full'>
                <CardBody className='overflow-auto'>
    {isAnyCheckboxChecked && (
        <div className="button-container" style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant='solid' icon='HeroClipboardDocumentCheck'>
                    Keep Record
                </Button>
                <Button variant='solid' icon='HeroArchiveBoxXMark'>
                    Not Required
                </Button>
            </div>
        </div>
    )}
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={patientnewData}
                                columns={patientNewDataColumns}
                                checkboxSelection
                                onRowSelectionModelChange={handleSelectionChange}
                                sx={{
                                    '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontWeight: 'bold', // Bolding the column headers
                                    },
                                }}
                            />
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper>
    );
};

export default DeDuplicationPatientNewData;
