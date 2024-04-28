import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarContainer,GridCellParams,GridRowParams } from '@mui/x-data-grid';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody } from '../../components/ui/Card';
import apiconfig from '../../config/apiconfig'; // Make sure this import is correct
import { EditOutlined, DeleteOutlined, SwapOutlined  } from '@ant-design/icons';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import Button from '../../components/ui/Button';
import Modal, { ModalBody, ModalHeader, ModalFooter } from '../../components/ui/Modal';
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
    const [compareData, setCompareData] = useState([]);

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
    
    const handleCompare = (id: string, duplicatePersonId: string) => {
        // Implement comparison logic using the id and duplicatePersonId
        console.log(`Comparing records with id: ${id} and duplicate person id: ${duplicatePersonId}`);
        
        // Open the compare modal popup
        setCompareModalVisible(true);
    };
    type ComparisonData = {
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
        [key: string]: string; // Index signature to allow accessing properties by string keys
    };
    
    // Data for comparison
    const comparisonData: ComparisonData = {
        id: '123',
        duplicatePersonId: '456',
        personType: 'Patient',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        createdDate: '2022-04-01',
        updatedDate: '2022-04-05',
        createdBy: 'Admin',
        updatedBy: 'User',
        dateOfBirth: '1990-01-01',
        middleName: 'Allen',
        motherFirstName: 'Alice',
        motherLastName: 'Doe',
        motherMaidenLastName: 'Smith',
        birthOrder: '1',
        birthStateId: 'NY',
    };
    

    // Fields to display as label-field pairs
    const fieldsToDisplay = [
        'id',
        'duplicatePersonId',
        'personType',
        'firstName',
        'lastName',
        'gender',
        'createdDate',
        'updatedDate',
        'createdBy',
        'updatedBy',
        'dateOfBirth',
        'middleName',
        'motherFirstName',
        'motherLastName',
        'motherMaidenLastName',
        'birthOrder',
        'birthStateId',
    ];

    // Function to render label-field pairs
    const renderLabelFieldPairs = () => {
        return fieldsToDisplay.map(field => (
            <div className="mb-4" key={field}>
                <label className="block text-sm font-medium text-gray-700">{field}</label>
                <div className="mt-1">{comparisonData[field]}</div>
            </div>
        ));
    };

    return (
        <PageWrapper name='List'>
            <Container>
                <Card className='h-full'>
                <Modal isOpen={compareModalVisible} setIsOpen={setCompareModalVisible}>
            <ModalBody>
            <div className="grid grid-cols-12 gap-4">
                    {/* Left side with label-field pairs */}
                    <div className="col-span-6">
                        {renderLabelFieldPairs()}
                    </div>
                    {/* Right side for additional content */}
                    <div className="col-span-6">
                        {/* Additional content on the right side */}
                    </div>
                </div>
            </ModalBody>
          
            <ModalFooter>
                <Button variant='solid' onClick={() => setCompareModalVisible(false)}>Close</Button>
            </ModalFooter>
            </Modal>
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
