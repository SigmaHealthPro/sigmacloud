import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody } from '../../../components/ui/Card';
import apiconfig from '../../../config/apiconfig'; 
import Button from '../../../components/ui/Button';

const UserList = () => {

    const userDataColumns = [
        { field: 'userType', headerName: 'User Type', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 1 },
        { field: 'designation', headerName: 'Designation', flex: 1 },
        { field: 'createdDate', headerName: 'Created Date', flex: 1 },
        { field: 'updatedDate', headerName: 'Updated Date', flex: 1 },
        { field: 'createdBy', headerName: 'Created By', flex: 1 },
        { field: 'updatedBy', headerName: 'Updated By', flex: 1 },
        { field: 'personId', headerName: 'Person ID', flex: 1 },
        { field: 'imageUrl', headerName: 'Image URL', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1, sortable: false, renderCell: (params:any) => {
            const handleStatusUpdate = async () => {
                try {
                    // Determine the opposite status based on the current status
                    const oppositeStatus = !params.row.status;

                    // Make API call to update status
                    const response = await axios.post(apiconfig.apiHostUrl + 'api/User/update-user-status', {
                        id: params.row.id,
                        status: oppositeStatus
                    });

                    if (response.data && response.data.status === 'Success') {
                        fetchUsers();
                        console.log('Status updated successfully');
                    } else {
                        fetchUsers();
                        console.error('Failed to update status');
                    }
                } catch (error) {
                    fetchUsers();
                    console.error('Error while updating status', error);
                }
            };

            return <button onClick={handleStatusUpdate}>{params.row.status ? 'Enable' : 'Disable'}</button>;
        }},
    ];

    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState<boolean>(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.post(apiconfig.apiHostUrl + 'api/User/get-users', {
                identifier: null,
                recordCount: null
            });
            if (response.data && response.data.status === 'Success') {
                setUsers(response.data.dataList);
            } else {
                setError('Failed to fetch users');
            }
        } catch (error) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        

        fetchUsers();
    }, []);

 
  
    return (
        <PageWrapper name='User List'>
            <Container>
                <Card className='h-full'>
                <CardBody className='overflow-auto'>
    
        <div className="button-container" style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant='solid' icon='HeroPlus'>
                    New
                </Button>
                
            </div>
        </div>

                        <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                                rows={users}
                                columns={userDataColumns}
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

export default UserList;
