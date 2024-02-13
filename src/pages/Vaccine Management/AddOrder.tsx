import { Link, useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
	SubheaderSeparator,
} from '../../components/layouts/Subheader/Subheader';
import {
	DataGrid,
	GridPaginationModel,
	GridToolbarContainer,
	gridClasses,
	GridPagination,
	GridRowId,
} from '@mui/x-data-grid';
import Button from '../../components/ui/Button';
import Container from '../../components/layouts/Container/Container';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../components/ui/Card';
import Label from '../../components/form/Label';
import Input from '../../components/form/Input';
import { appPages } from '../../config/pages.config';
import { useFormik } from 'formik';
import { values } from 'lodash';
import { error } from 'console';
import { Orders } from '../../interface/order.interface';
import { orderApi } from '../../Apis/orderApi';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'crypto';
import Validation from '../../components/form/Validation';
import apiconfig from '../../config/apiconfig';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';

const navigate = useNavigate();
const [filteredFacility, setFilteredFacility] = useState([]);
const [filteredProduct, setFilteredProduct] = useState([]);
const [value, setValue] = useState(localStorage.getItem('token'));
const [filteredVaccine, setFilteredVaccine] = useState<any[]>([]);
const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
	page: 0,
	pageSize: 5,
});
const [vaccineloading, setVaccineLoading] = useState<boolean>(false);
const [rowCountState, setRowCountState] = useState<number>(0); // Total number of items
const [rowcountstates, setRowCountstates] = useState<number>(0);
const [sorting, setSorting] = useState<SortingState>([]);
const [globalFilter, setGlobalFilter] = useState<string>(''); // Total number of items
let generatedGUID: string;
generatedGUID = uuidv4();
const apiUrl = apiconfig.apiHostUrl;
const AddOrder = () => {};

export default AddOrder;
