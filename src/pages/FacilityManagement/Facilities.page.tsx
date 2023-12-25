import React, { useState, useEffect , useMemo} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
    renderCell: () => {
      return (
        <div className="group relative"> {/* Ensure this div is relative for positioning context */}
  <MoreVertIcon className="cursor-pointer" />
  <div className="absolute hidden group-hover:flex flex-col items-center bg-white shadow-md 
                  -translate-y-full -translate-x-1/2 transform top-full right-0 mt-1">
    {/* The action-icons div now shows on hover */}
    <EditIcon className="cursor-pointer text-gray-600 hover:text-green-600" />
    <DeleteIcon className="cursor-pointer text-gray-600 hover:text-red-600" />
  </div>
</div>
      );
    },
  },
  
  
];
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

const FacilitiesPage = () => {
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
          <Link to='/new-customer'>
            <Button variant='solid' icon='HeroPlus'>
              New Customer
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
        getRowId={(row) => `${row.facilityName}-${row.organization}`}
        sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold', // Bolding the column headers
        },}}
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