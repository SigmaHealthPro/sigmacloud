import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarContainer,GridCellParams,GridRowParams } from '@mui/x-data-grid';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../components/ui/Card';
import apiconfig from '../../config/apiconfig'; // Make sure this import is correct
import { EditOutlined, DeleteOutlined, SwapOutlined  } from '@ant-design/icons';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import Button from '../../components/ui/Button';
import Modal, { ModalBody, ModalHeader, ModalFooter } from '../../components/ui/Modal';
import Label from '../../components/form/Label';
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
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params: GridCellParams) => {
              return (
                <div className="group relative"> {/* Ensure this div is relative for positioning context */}
                  <MoreVertIcon className="cursor-pointer" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-white shadow-md -translate-y-full -translate-x-1/2 transform top-full left-10 mt-1">
                    <AntButton
                      onClick={() => handleCompare(params.row.id, params.row.duplicatePersonId)}
                      icon={<SwapOutlined  />}
                    />
                  </div>
                </div>
              );
            },
          },
    ];
    const [patientDuplicateData, setPatientDuplicateData] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [compareModalVisible, setCompareModalVisible] = useState(false);
    const [comparisonDataleft, setComparisonDataleft] = useState({
        id: '',
        duplicatePersonId: '',
        personType: '',
        firstName: '',
        lastName: '',
        gender: '',
        createdDate: '',
        updatedDate: '',
        createdBy: '',
        updatedBy: '',
        dateOfBirth: '',
        middleName: '',
        motherFirstName: '',
        motherLastName: '',
        motherMaidenLastName: '',
        birthOrder: '',
        birthStateId: '',
    });
    const [comparisonDataRight, setcomparisonDataRight] = useState({
        id: '',
        duplicatePersonId: '',
        personType: '',
        firstName: '',
        lastName: '',
        gender: '',
        createdDate: '',
        updatedDate: '',
        createdBy: '',
        updatedBy: '',
        dateOfBirth: '',
        middleName: '',
        motherFirstName: '',
        motherLastName: '',
        motherMaidenLastName: '',
        birthOrder: '',
        birthStateId: '',
    });


    useEffect(() => {
        const fetchPatientDuplicateData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(apiconfig.apiHostUrl + 'api/MasterData/getlistofpatientduplicatedata');
                if (response.data && response.data.status === 'Success') {
                    // Bind the dataList to state
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
    
    
    const handleCompare = (id: string, duplicatePersonId: string) => {
        
        console.log(`Comparing records with id: ${id} and duplicate person id: ${duplicatePersonId}`);
        setCompareModalVisible(true);
        fetchPatientDuplicateDataById(id);
        fetchPersonsById(duplicatePersonId);
    };
    const fetchPatientDuplicateDataById = async (id: string) => {
        try {
            // Fetch data from the API
            const response = await axios.get(`${apiconfig.apiHostUrl}api/MasterData/getlistofpatientduplicatedatabyid?Id=${id}`);
                
            if (response.data.status=== "Success" && response.data) {
                setComparisonDataleft(response.data.data);
               
            } else {
                
                console.error('Error: Unable to fetch or process data.');
            }
        } catch (error) {
            console.error('Error: Unable to fetch data.', error);
        }
    };
    const fetchPersonsById= async (id: string) => {
        try {
            // Fetch data from the API
            const response = await axios.get(`${apiconfig.apiHostUrl}api/User/getpersonsbyid?Id=${id}`);
                
            if (response.data.status=== "Success" && response.data) {
                setcomparisonDataRight(response.data.data);
               
            } else {
                
                console.error('Error: Unable to fetch or process data.');
            }
        } catch (error) {
            console.error('Error: Unable to fetch data.', error);
        }
    };
    type FormData = {
        id: string;
        duplicatePersonId: string;
        personType: string;
        firstName: string;
        lastName: string;
        gender: string;
        createdDate: string;
        updatedDate: string;
        createdBy: string;
        updatedBy: string;
        dateOfBirth: string;
        middleName: string;
        motherFirstName: string;
        motherLastName: string;
        motherMaidenLastName: string;
        birthOrder: string;
        birthStateId: string;
    };

   
    const ModalLeftSide: React.FC<{ data: FormData }> = ({ data }) => {
        return (
            <div className='col-span-12 lg:col-span-9'>
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-12'>
                        <div className='col-span-12'>
                            <Card>
                            <div className="mb-4 pr-4 border-b">
                                    <h2 className="text-xl font-bold mb-2">New Data</h2>
                                </div>
                                    <div className='grid grid-cols-12 gap-4'>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='personTypeNewData'>
                                                <strong>Person Type:</strong>
                                            </Label>
                                            <Label htmlFor='personTypeNewData'>
                                                {data.personType}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='firstNameNewData'>
                                                <strong>First Name:</strong>
                                            </Label>
                                            <Label htmlFor='firstNameNewData'>
                                                {data.firstName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='lastNameNewData'>
                                                <strong>Last Name:</strong>
                                            </Label>
                                            <Label htmlFor='lastNameNewData'>
                                                {data.lastName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='genderNewData'>
                                                <strong>Gender:</strong>
                                            </Label>
                                            <Label htmlFor='genderNewData'>
                                                {data.gender}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='createdDateNewData'>
                                                <strong>Created Date:</strong>
                                            </Label>
                                            <Label htmlFor='createdDateNewData'>
                                                {data.createdDate}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='updatedDateNewData'>
                                                <strong>Updated Date:</strong>
                                            </Label>
                                            <Label htmlFor='updatedDateNewData'>
                                                {data.updatedDate}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='createdByNewData'>
                                                <strong>Created By:</strong>
                                            </Label>
                                            <Label htmlFor='createdByNewData'>
                                                {data.createdBy}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='updatedByNewData'>
                                                <strong>Updated By:</strong>
                                            </Label>
                                            <Label htmlFor='updatedByNewData'>
                                                {data.updatedBy}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='dateOfBirthNewData'>
                                                <strong>Date of Birth:</strong>
                                            </Label>
                                            <Label htmlFor='dateOfBirthNewData'>
                                                {data.dateOfBirth}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='middleNameNewData'>
                                                <strong>Middle Name:</strong>
                                            </Label>
                                            <Label htmlFor='middleNameNewData'>
                                                {data.middleName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='motherFirstNameNewData'>
                                                <strong>Mother First Name:</strong>
                                            </Label>
                                            <Label htmlFor='motherFirstNameNewData'>
                                                {data.motherFirstName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='motherLastNameNewData'>
                                                <strong>Mother Last Name:</strong>
                                            </Label>
                                            <Label htmlFor='motherLastNameNewData'>
                                                {data.motherLastName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='motherMaidenLastNameNewData'>
                                                <strong>Mother Maiden Last Name:</strong>
                                            </Label>
                                            <Label htmlFor='motherMaidenLastNameNewData'>
                                                {data.motherMaidenLastName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='birthOrderNewData'>
                                                <strong>Birth Order:</strong>
                                            </Label>
                                            <Label htmlFor='birthOrderNewData'>
                                                {data.birthOrder}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='birthStateIdNewData'>
                                                <strong>Birth State ID:</strong>
                                            </Label>
                                            <Label htmlFor='birthStateIdNewData'>
                                                {data.birthStateId}
                                            </Label>
                                        </div>
                                    </div>
                                
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const ModalRightSide: React.FC<{ data: FormData }> = ({ data }) => {
        return (
            <div className='col-span-12 lg:col-span-9'>
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-12'>
                        <div className='col-span-12'>
                            <Card>
                                
                                    <div className="mb-4 pr-4 border-b"> {/* Add border-b class to draw a bottom border */}
                                        <h2 className="text-xl font-bold mb-2">Old Data</h2>
                                    </div>
                                    <div className='grid grid-cols-12 gap-4'>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='personTypeOldData'>
                                                <strong>Person Type:</strong>
                                            </Label>
                                            <Label htmlFor='personTypeOldData'>
                                                {data.personType}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='firstNameOldData'>
                                                <strong>First Name:</strong>
                                            </Label>
                                            <Label htmlFor='firstNameOldData'>
                                                {data.firstName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='lastNameOldData'>
                                                <strong>Last Name:</strong>
                                            </Label>
                                            <Label htmlFor='lastNameOldData'>
                                                {data.lastName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='genderOldData'>
                                                <strong>Gender:</strong>
                                            </Label>
                                            <Label htmlFor='genderOldData'>
                                                {data.gender}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='createdDateOldData'>
                                                <strong>Created Date:</strong>
                                            </Label>
                                            <Label htmlFor='createdDateOldData'>
                                                {data.createdDate}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='updatedDateOldData'>
                                                <strong>Updated Date:</strong>
                                            </Label>
                                            <Label htmlFor='updatedDateOldData'>
                                                {data.updatedDate}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='createdByOldData'>
                                                <strong>Created By:</strong>
                                            </Label>
                                            <Label htmlFor='createdByOldData'>
                                                {data.createdBy}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='updatedByOldData'>
                                                <strong>Updated By:</strong>
                                            </Label>
                                            <Label htmlFor='updatedByOldData'>
                                                {data.updatedBy}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='dateOfBirthOldData'>
                                                <strong>Date of Birth:</strong>
                                            </Label>
                                            <Label htmlFor='dateOfBirthOldData'>
                                                {data.dateOfBirth}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='middleNameOldData'>
                                                <strong>Middle Name:</strong>
                                            </Label>
                                            <Label htmlFor='middleNameOldData'>
                                                {data.middleName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='motherFirstNameOldData'>
                                                <strong>Mother First Name:</strong>
                                            </Label>
                                            <Label htmlFor='motherFirstNameOldData'>
                                                {data.motherFirstName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='motherLastNameOldData'>
                                                <strong>Mother Last Name:</strong>
                                            </Label>
                                            <Label htmlFor='motherLastNameOldData'>
                                                {data.motherLastName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='motherMaidenLastNameOldData'>
                                                <strong>Mother Maiden Last Name:</strong>
                                            </Label>
                                            <Label htmlFor='motherMaidenLastNameOldData'>
                                                {data.motherMaidenLastName}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='birthOrderOldData'>
                                                <strong>Birth Order:</strong>
                                            </Label>
                                            <Label htmlFor='birthOrderOldData'>
                                                {data.birthOrder}
                                            </Label>
                                        </div>
                                        <div className='col-span-12 lg:col-span-6'>
                                            <Label htmlFor='birthStateIdOldData'>
                                                <strong>Birth State ID:</strong>
                                            </Label>
                                            <Label htmlFor='birthStateIdOldData'>
                                                {data.birthStateId}
                                            </Label>
                                        </div>
                                    </div>
                                
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <PageWrapper name='List'>
            <Container>
                <Card className='h-full'>
                <Modal isOpen={compareModalVisible} setIsOpen={setCompareModalVisible}>
            <ModalBody>
            <div className="grid grid-cols-12 gap-4">
                 
                    <div className="col-span-6 pr-4 border-r">
                    <ModalLeftSide data={comparisonDataleft} />
                    </div>
                   
                    <div className="col-span-6">
                    <ModalRightSide data={comparisonDataRight} />
                    </div>
                </div>
            </ModalBody>
          
            <ModalFooter className="flex justify-between items-center">
            <div>
            <Button variant='solid' onClick={() => setCompareModalVisible(false)}>Close</Button>
        </div>
        <div className="button-container" style={{ display: 'flex', gap: '10px' }}>
            <Button variant='solid' icon='HeroClipboardDocumentCheck'>
                Keep Record
            </Button>
            <Button variant='solid' icon='HeroArchiveBoxXMark'>
                Not Required
            </Button>
        </div>
      
    </ModalFooter>
            </Modal>
                    <CardBody className='overflow-auto'>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={patientDuplicateData}
                                columns={contactNumbpatientDuplicateDataColumns}
                                checkboxSelection
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

export default DeDuplicationManagement;
