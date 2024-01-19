import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../components/form/FieldWrap';
import { DataGrid, GridPaginationModel, GridToolbarContainer, gridClasses, GridPagination } from '@mui/x-data-grid';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { GridCellParams, GridRowParams } from '@mui/x-data-grid';
import { appPages } from '../../config/pages.config';
import { Patients } from '../../interface/Patients.interface';


const useStyles = makeStyles({
	root: {
		// Increase specificity by repeating the class
		'& .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-menuIcon, .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-sortIcon': {
			visibility: 'visible !important', // ensure it overrides other styles
		},
		'& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader': {
			color: 'inherit', // Just an example to ensure color is consistent
		},
	},
});



const PatientManagement = () => {


	const navigate = useNavigate();
	const columns = [
		{ field: 'firstName', headerName: 'Patient Name', width: 140 },
		{ field: 'dateOfHistoryVaccine', headerName: 'Date Of History Vaccine', width: 140 },
		{ field: 'patientStatus', headerName: 'Patient Status', width: 140 },
		{ field: 'personId', headerName: 'Person', width: 140 },
		{ field: 'address', headerName: 'Address', width: 140 },
		{ field: 'country', headerName: 'Country', width: 140 },
		{ field: 'city', headerName: 'City', width: 140 },
		{ field: 'state', headerName: 'State', width: 140 },
		{ field: 'zipCode', headerName: 'Zip Code', width: 140 },
		{
			field: 'actions',
			headerName: 'Actions',
			width: 100,
			renderCell: (params: GridCellParams) => {
				return (
					<div className="group relative"> {/* Ensure this div is relative for positioning context */}
						<MoreVertIcon className="cursor-pointer" />
						<div className="absolute hidden group-hover:flex flex-col items-center bg-white shadow-md 
                        -translate-y-full -translate-x-1/2 transform top-full left-10 mt-1">
							<Space size="middle">
								<AntButton icon={<EditOutlined />} />
								<Popconfirm title="Sure to delete?" onConfirm={() => ""}>
									<AntButton icon={<DeleteOutlined />} />
								</Popconfirm>
							</Space>
						</div>
					</div>
				);
			},
		},


	];
	const classes = useStyles();
	const [patients, setPatients] = useState<any[]>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false); // Track loading state
	const [rowCountState, setRowCountState] = useState<number>(0); // Total number of items
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 15,
	});
	const[searchTouched , setSearchTouched] = useState(false)
	const [sortModel, setSortModel] = useState([]);
	const [searchData, setSearchData] = useState<Patients[]>([])
	const handleRowClick = (params: GridRowParams) => {
		// Ensure to use backticks for template literals
		navigate(`${appPages.PatientManagement.to}/${params.id}`);
	};

	function removeDublicates(array: any[], key: any) {
		const seen = new Set();
		return array.filter(item => {
			const itemKey = key ? item[key] : item;
			const stringifiedItem = JSON.stringify(itemKey);
			if (!seen.has(stringifiedItem)) {
				seen.add(stringifiedItem);
				return true;
			}
			return false;
		});
	}
	


	function CustomPagination() {
		return (
			<GridToolbarContainer className="flex justify-between items-center w-full">
				<CardHeader>
					<CardHeaderChild>
						<CardTitle>All Patients {JSON.stringify(searchTouched)}</CardTitle>
					</CardHeaderChild>
				</CardHeader>
				<GridPagination />
			</GridToolbarContainer>
		);
	}
	const getRowId = (row: Patients) => {
		return `${row.patientName}-${row.dateOfHistoryVaccine}`;
	};

	const handlePaginationModelChange = (newModel: GridPaginationModel) => {
		setPaginationModel(newModel);
	};


	const listPatients = () => {

		setLoading(true);
		const requestData = {
			keyword: "",
			pagenumber: paginationModel.page + 1,
			pagesize: paginationModel.pageSize,
			patient_name: "",
			date_of_history_vaccine: "",
			patient_status: "",
			address: "",
			person: "",
			city: "",
			state: "",
			country: "",
			zip_code: "",
			orderby: "patient_name",
		};



		axios.post('https://localhost:7155/api/Patients/searchpatient', requestData)
			.then(response => {
				setLoading(true);
				// const { items, totalCount } = response.data;
				// if (items.length > paginationModel.pageSize) {
				//     console.warn('API returned more items than the requested page size.');
				//   }
				debugger;
				const data = removeDublicates(response.data , 'personId')
				setPatients(data);
				// const totalRowCount = response.data.totalCount; // Assuming API returns totalCount
				// setRowCountState((prevRowCountState) => 
				//   totalRowCount !== undefined ? totalRowCount : prevRowCountState
				// );
				// Assuming the API returns total count
				setLoading(false); // End loading
			})
			.catch(error => {
				console.error('Error fetching data: ', error);
				setLoading(false); // End loading
			});
	};
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		debugger;
		setGlobalFilter(e.target.value);
		if (e.target.value !== '') {
			const searchDataFilter = patients.filter((item:any) => item?.firstName.startsWith(e.target.value));
			debugger;
			setPatients(searchDataFilter);
		}
		else {
			debugger;
			listPatients();
		}
	};
	

	useEffect(() => {
		listPatients();
		// const timer = setTimeout(() => {
		//     listPatients();
		// }, 600); // 300 ms delay
		// return () => clearTimeout(timer);
	}, []);

	
	console.log('Patients Data:', patients); // Debugging: Log current state of patients data


	return (
		<PageWrapper name='Customer List'>
			<Subheader>
				<SubheaderLeft>
					<FieldWrap
						firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
						lastSuffix={
							globalFilter && (
								<Icon
									icon='HeroXMark'
									color='red'
									className='mx-2 cursor-pointer'
									onClick={() =>setGlobalFilter('')}
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
					<Link to={`${appPages.PatientManagement.subPages.AddPatient.to}`}>
						<Button variant='solid' icon='HeroPlus'>
							New Patients
						</Button>
					</Link>
				</SubheaderRight>
			</Subheader>
			<Container>
				<Card className='h-full'>
					{/* <CardHeader>
            <CardHeaderChild>
              <CardTitle>All Customers</CardTitle>
            </CardHeaderChild>
          </CardHeader> */}
					<CardBody className='overflow-auto'>
						<DataGrid
							className={classes.root}
							rows={patients}
							columns={columns}
							rowCount={rowCountState}
							loading={loading}
							pageSizeOptions={[5, 10, 25]}
							paginationModel={paginationModel}
							paginationMode="server"
							onPaginationModelChange={handlePaginationModelChange}
							checkboxSelection
							onRowClick={handleRowClick}
							getRowId={(row) => `${row.patientStatus}`}
							sx={{
								'& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
								'& .MuiDataGrid-columnHeaderTitle': {
									fontWeight: 'bold', // Bolding the column headers
								},
							}}
							slots={{
								toolbar: CustomPagination, // 'toolbar' should be all lowercase
							}}
						/>

					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default PatientManagement;
