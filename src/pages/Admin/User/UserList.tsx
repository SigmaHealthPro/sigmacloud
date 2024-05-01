import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import {
	DataGrid,
	GridPaginationModel,
	GridToolbarContainer,
	gridClasses,
	GridPagination,
} from '@mui/x-data-grid';
import {
	MoreVert as MoreVertIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { GridCellParams, GridRowParams } from '@mui/x-data-grid';
import Modal, { ModalBody, ModalHeader, ModalFooter } from '../../../components/ui/Modal';
import Validation from '../../../components/form/Validation';
import { useFormik } from 'formik';
import Label from '../../../components/form/Label';
import apiconfig from '../../../config/apiconfig'; 
import toast, { Toaster } from 'react-hot-toast';
import Select from '../../../components/form/Select';
import popUp from '../../../components/popup/popup';
import { LovMasterType } from "../../../interface/facility.interface";
const useStyles = makeStyles({
	root: {
		'& .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-menuIcon, .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-sortIcon':
			{
				visibility: 'visible !important', // ensure it overrides other styles
			},
		'& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader': {
			color: 'inherit', // Just an example to ensure color is consistent
		},
	},
});

const UserList = () => {

    const userDataColumns = [
        { field: 'userId', headerName: 'User Id', flex: 1 },
        { field: 'userType', headerName: 'User Type', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 1 },
        { field: 'designation', headerName: 'Designation', flex: 1 },
        { field: 'createdDate', headerName: 'Created Date', flex: 1 },
        { field: 'updatedDate', headerName: 'Updated Date', flex: 1 },
        { field: 'createdBy', headerName: 'Created By', flex: 1 },
        { field: 'updatedBy', headerName: 'Updated By', flex: 1 },
        { field: 'imageUrl', headerName: 'Image URL', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1, sortable: false, renderCell: (params:any) => {
            const handleStatusUpdate = async () => {
                try {
                   
                    const oppositeStatus = !params.row.status;

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
        {
			field: 'actions',
			headerName: 'Actions',
			width: 140,
			renderCell: (params: GridCellParams) => {
				return (
					<div className='group relative'>
						{' '}
						{/* Ensure this div is relative for positioning context */}
						<MoreVertIcon className='cursor-pointer' />
						<div
							className='absolute left-10 top-full mt-1 hidden -translate-x-1/2 -translate-y-full 
                        transform flex-col items-center bg-white shadow-md group-hover:flex'>
							<Space size={0}>
								<AntButton
									icon={
										<EditOutlined
											onClick={(event) => handleEditData(params, event)}
										/>
									}
								/>
                                 <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(params.row.id)}>
                          <AntButton icon={<DeleteOutlined />} />
                      </Popconfirm>
							</Space>
						</div>
					</div>
				);
			},
		},
    ];

    
    const [users, setUsers] = useState([]);
    const [usersModel, setUsersModel] =useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
	const [editTouched, setEditTouched] = useState(false);
    const classes = useStyles();
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [genderTypes, setGenderTypes] = useState<LovMasterType[]>([]);
    //const [genderTypes, setGenderTypes]  = useState([]);
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
    const fetchAllGender = async () => {
        try {
          const response = await axios.get(
            apiconfig.apiHostUrl + 'api/MasterData/getlovmasterbylovtype?lovtype=Gender'
          );
    
          console.log('LOV Master Type API Response:', response);
    
          if (response.data && Array.isArray(response.data)) {
            // Adding a default item at the beginning
            const defaultItem = {
              id: 'default',
              key: 'default',
              value: 'Select Gender',
              lovType: 'Gender',
              longDescription: 'Select Gender',
            };
            //setGenderTypes(response.data);
           setGenderTypes([defaultItem, ...response.data]);
          } else {
            console.error('Error LOV Master Type data');
          }
        } catch (error) {
          console.error('Error LOV Master Type data', error);
        }
      };
    useEffect(() => {
        fetchAllGender
        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.toLowerCase(); // Convert input value to lowercase for case-insensitive matching
        setGlobalFilter(inputValue);
    
        if (inputValue !== '') {
            // Filter the users data based on the input value
            const searchDataFilter = users.filter((item: any) =>
                Object.values(item).some((value: any) =>
                    typeof value === 'string' && value.toLowerCase().includes(inputValue)
                )
            );
            // Update the state with filtered data
            setUsers(searchDataFilter);
        } else {
            // If the input value is empty, reset to the original users data
            fetchUsers();
        }
    };
    
    
    const openModal = () => {
		setUsersModel(true);
	};

    const handleEditData = async (params: any, event: any) => {
		event.preventDefault();
		setUsersModel(true);
		setEditTouched(true);
		formik.setFieldValue('id', params.row.id);
		formik.setFieldValue('userId', params.row.userId);
		formik.setFieldValue('password', params.row.password);
		formik.setFieldValue('userType', params.row.userType);
		formik.setFieldValue('gender', params.row.gender);
		formik.setFieldValue('designation', params.row.designation);
		formik.setFieldValue('personId', params.row.personId);
		formik.setFieldValue('isEdit', true);
	};
    const handleDelete = async (Id: string) => {
        console.log('User ID: ' + Id);
    
        try {
            const formData = new FormData();
            formData.append('Id', Id);
    
            const response = await axios.post(
                apiconfig.apiHostUrl + 'api/User/delete-user',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
    
            console.log(response.data);
    
            if (response.data.status === 'Success') {
                fetchUsers();
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error deleting user');
        }
    };
    
    
    type User = {
        id: string;
        sequenceId: number;
        userId: string;
        password: string ;
        userType: string;
        gender: string;
        designation: string;
        createdDate: string;
        updatedDate: string;
        createdBy: string;
        updatedBy: string;
        isdelete: boolean;
        personId: string;
        imageUrl: string;
        status: boolean;
        isEdit:boolean;
    };
    const formik = useFormik<User>({
        initialValues: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            sequenceId: 2,
            userId: '',
            password: '',
            userType: '',
            gender: '',
            designation: '',
            createdDate: '2024-01-14T19:52:35.880454Z',
            updatedDate: '2024-01-14T19:52:35.880454Z',
            createdBy: 'system',
            updatedBy: 'system',
            isdelete: false,
            personId: '0a59c9d7-716b-45b6-b256-1dc8fd4c43bb',
            imageUrl: '',
            status: true,
            isEdit: false
        },
    
        validate: (values: User) => {
            const errors: Partial<User> = {};
          
            if (!values.userId) {
                errors.userId = 'Required';
            }
            if (!values.password) {
                errors.password = 'Required';
            }
            if (!values.userType) {
                errors.userType = 'Required';
            }
            if (!values.gender) {
                errors.gender = 'Required';
            }
            if (!values.designation) {
                errors.designation = 'Required';
            }
          
            if (!values.personId) {
                errors.personId = 'Required';
            }
           
        
            return errors;
        },
        
    
        onSubmit: async (values: User) => {
            console.log('Request Payload: ', values);
            try {
                if (values.isEdit==false) {

                    const requestBodyFoInsert = {
                        sequenceId: values.sequenceId,
                        userId: values.userId,
                        password: values.password,
                        userType: values.userType,
                        gender: values.gender,
                        designation: values.designation,
                        createdBy: values.createdBy,
                        updatedBy: values.updatedBy,
                        personId: values.personId,
                        imageUrl: values.imageUrl
                    };
                    const response = await axios.post(
                        apiconfig.apiHostUrl+'api/User/create-user',
                        requestBodyFoInsert,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'accept': '*/*' 
                            },
                        },
                    );
                    if (response.data.status === 'Success') {
                       
                        console.log(response.data.message);
                        popUp(response.data.message);
                        
                    } else {
                        console.error('Error: Unexpected response status');
                    popUp(response.data.message);
                    }
                   
                } 
                //Update
                else {
                 
                    const requestBodyForUpdate = {
                        id: values.id,
                        sequenceId: values.sequenceId,
                        userId: values.userId,
                        password: values.password,
                        userType: values.userType,
                        gender: values.gender,
                        designation: values.designation,
                        createdBy: values.createdBy,
                        updatedBy: values.updatedBy,
                        personId: values.personId,
                        imageUrl: values.imageUrl
                    };
                    const response = await axios.post(
                        apiconfig.apiHostUrl+'api/User/update-user',
                        requestBodyForUpdate,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'accept': '*/*' 
                            },
                        },
                    );
                    if (response.data.status === 'Success') {
                       
                        console.log(response.data.message);
                       
                        toast.success(response.data.message);
                        
                    } else {
                        console.error('Error: Unexpected response status');
                   
                    toast.error(response.data.message);
                    }
                }
                setUsersModel(false);
                fetchUsers();
                formik.resetForm();
            } catch (error) {
                console.error('Error: ', error);
            }
        },
        
    });
    return (
        <PageWrapper name='User List'>
            <Subheader>
			<Toaster />
			<SubheaderLeft>
				<FieldWrap
					firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
					lastSuffix={
						globalFilter && (
							<Icon
								icon='HeroXMark'
								color='red'
								className='mx-2 cursor-pointer'
								onClick={() => setGlobalFilter('')}
							/>
						)
					}>
					<Input
						id='globalFilter'
						name='globalFilter'
						placeholder='Search...'
						value={globalFilter}
						onChange={handleInputChange} // Modified to use the new handler
					/>
				</FieldWrap>
			</SubheaderLeft>
			<SubheaderRight>
				
				<Button
					variant='solid'
					icon='HeroPlus'
					onClick={() => {
						openModal();
						setEditTouched(false);
						formik.resetForm();
					}}
					>
					New User
				</Button>
				<Modal isOpen={usersModel} setIsOpen={setUsersModel}>
					<ModalHeader>
						{' '}
						{!editTouched ? 'Add New User' : 'Modification'}
					</ModalHeader>
                    <ModalBody>
    <div className='col-span-12 lg:col-span-9'>
        <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-12'>
                <Card>
                    <CardBody>
                    <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='userId'>User ID</Label>
                                <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.userId}
                                    invalidFeedback={formik.errors.userId}
                                    validFeedback='Good'>
                                    <Input
                                        type='text'
                                        id='userId'
                                        name='userId'
                                        onChange={formik.handleChange}
                                        value={formik.values.userId}
                                        onBlur={formik.handleBlur}
                                    />
                                </Validation>
                            </div>
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='password'>Password</Label>
                                <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.password}
                                    invalidFeedback={formik.errors.password}
                                    validFeedback='Good'>
                                    <Input
                                        type='password'
                                        id='password'
                                        name='password'
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                        onBlur={formik.handleBlur}
                                    />
                                </Validation>
                            </div>
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='userType'>User Type</Label>
                                <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.userType}
                                    invalidFeedback={formik.errors.userType}
                                    validFeedback='Good'>
                                    <Input
                                        type='text'
                                        id='userType'
                                        name='userType'
                                        onChange={formik.handleChange}
                                        value={formik.values.userType}
                                        onBlur={formik.handleBlur}
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
                                    <Input
                                        type='text'
                                        id='gender'
                                        name='gender'
                                        onChange={formik.handleChange}
                                        value={formik.values.gender}
                                        onBlur={formik.handleBlur}
                                    />
                                </Validation>
                            </div>
                      
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='designation'>Designation</Label>
                                <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.designation}
                                    invalidFeedback={formik.errors.designation}
                                    validFeedback='Good'>
                                    <Input
                                        type='text'
                                        id='designation'
                                        name='designation'
                                        onChange={formik.handleChange}
                                        value={formik.values.designation}
                                        onBlur={formik.handleBlur}
                                    />
                                </Validation>
                            </div>
                           
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='createdBy'>Person</Label>
                                <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.personId}
                                    invalidFeedback={formik.errors.personId}
                                    validFeedback='Good'>
                                    <Input
                                        type='text'
                                        id='personId'
                                        name='personId'
                                        onChange={formik.handleChange}
                                        value={formik.values.personId}
                                        onBlur={formik.handleBlur}
                                    />
                                </Validation>
                            </div>
                            {/* Continue adding fields for other User properties here */}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    </div>
</ModalBody>

					<ModalFooter>
						<Button
							variant='solid'
							onClick={() => {
								setUsersModel(false);
								setEditTouched(false);
							}}>
							Close
						</Button>
						<Button variant='solid' icon='HeroClipboardDocumentCheck' onClick={() => formik.handleSubmit()}>
							{!editTouched ? 'Save' : 'Update'}
						</Button>
					</ModalFooter>
				</Modal>
			</SubheaderRight>
		</Subheader>
            <Container>
                <Card className='h-full'>
                <CardBody className='overflow-auto'>
        
                      
                        <DataGrid
                                rows={users}
                                columns={userDataColumns}
                                sx={{
                                    '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                        
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper>
    );
};

export default UserList;
