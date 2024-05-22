import React, { useState, useEffect , useMemo} from 'react';
import axios from 'axios';
import { Link, useNavigate  } from 'react-router-dom';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../components/form/FieldWrap';
import { DataGrid, GridPaginationModel,GridToolbarContainer,  gridClasses, GridPagination } from '@mui/x-data-grid';
import { Facility } from '../../interface/facility.interface';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { debounce } from 'lodash';
import { makeStyles } from '@mui/styles';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { GridCellParams,GridRowParams } from '@mui/x-data-grid';
import { appPages } from '../../config/pages.config';



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

const editLinkPath = `#`;
//${appPages.facilityAppPages.subPages.newfacilityPage.to}`
const FacilitiesPage = () => {
    
    const navigate = useNavigate();
    const columns = [
        { field: 'jurisdiction', headerName: 'Jurisdiction', width: 140 },
        { field: 'organization', headerName: 'Organization', width: 140 },
        { field: 'facilityName', headerName: 'Facility Name', width: 140 },
        { field: 'address', headerName: 'Address', width: 140 },
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
      
    const classes = useStyles();
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // Track loading state
    const [rowCountState, setRowCountState] = useState<number>(0); // Total number of items
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
      });
      const [sortModel, setSortModel] = useState([]);
      const handleDelete = async (facilityId: string) => {
        console.log("this is facility id "+ facilityId)
        const formData = new FormData();
        formData.append('facilityId', facilityId); // Add the facility ID to the form data
    
        try {
            const response = await axios.put(
                'https://dev-api-iis-sigmacloud.azurewebsites.net/api/Facility/delete', 
                formData, // Send the form data
                {
                    headers: { 'Content-Type': 'multipart/form-data' }, // This matches the expected content type
                }
            );
            console.log(response.data); // Handle the response as needed
            
            // Refresh the data grid or update state here...
            if (response.data.status === 'Success') {
                // Option 1: Re-fetch facilities from the API
                fetchFacilities();
    
                // Option 2: Update state locally (if not re-fetching from the API)
                // setFacilities(prevFacilities => prevFacilities.filter(facility => facility.id !== facilityId));
            }
        } catch (error) {
            console.error('Error deleting facility:', error);
            // Handle error as needed...
        }
    };
 

 
    const handleRowClick = () => {
      // Ensure to use backticks for template literals
      navigate(`#`);
  };
  
    

      function CustomPagination() {
        return (
            <GridToolbarContainer className="flex justify-between items-center w-full">
                <CardHeader>
                    <CardHeaderChild>
                        <CardTitle>All Facilities</CardTitle>
                    </CardHeaderChild>
                </CardHeader>
                <GridPagination />
            </GridToolbarContainer>
        );
    }
  const getRowId = (row: Facility) => {
	return `${row.facilityName}-${row.organization}`;
  };

const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

//   const filteredFacilities = useMemo(() => {
//     return facilities.filter(facility =>
//       facility.facilityName.toLowerCase().includes(globalFilter.toLowerCase())
//     );
//   }, [facilities, globalFilter]);

  const fetchFacilities = () => {
    
    setLoading(true);
    const requestData = {
      identifier: globalFilter || "", // Include global filter
      pageNumber: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      sortBy: "facilityname",
      sortDirection: "desc"
    };

    axios.post('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Facility/search', requestData)
      .then(response => {
        const { items, totalCount } = response.data;
        if (items.length > paginationModel.pageSize) {
            console.warn('API returned more items than the requested page size.');
          }
        setFacilities(items);
        const totalRowCount = response.data.totalCount; // Assuming API returns totalCount
        setRowCountState((prevRowCountState) => 
          totalRowCount !== undefined ? totalRowCount : prevRowCountState
        );// Assuming the API returns total count
        setLoading(false); // End loading
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setLoading(false); // End loading
      });
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(e.target.value);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        
        if (e.key === 'Enter') {
            fetchFacilities();
        }
    };
    
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchFacilities();
        }, 600); // 300 ms delay
        return () => clearTimeout(timer);
    }, [globalFilter, paginationModel ]);
  
	console.log('Facilities Data:', facilities); // Debugging: Log current state of facilities data
  

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
              onKeyDown={handleKeyDown}  // Listen for key down events
            />
          </FieldWrap>
        </SubheaderLeft>
        <SubheaderRight>
          <Link to={`${editLinkPath}`}>
            <Button variant='solid' icon='HeroPlus'>
              New Facility
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
        rows={facilities}
        columns={columns}
        rowCount={rowCountState}
        loading={loading}
        pageSizeOptions={[5, 10, 25]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        checkboxSelection
        onRowClick={handleRowClick}
        getRowId={(row) => `${row.id}`}
        sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold', // Bolding the column headers
        },
        '& .MuiDataGrid-row:hover': {
          cursor: 'pointer',
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

export default FacilitiesPage;