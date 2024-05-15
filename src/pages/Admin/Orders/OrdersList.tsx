import React, { useState, useEffect, useMemo, ReactNode, useContext, FC } from 'react';
import axios from 'axios';
import { PublicBaseSelectProps } from 'react-select/base';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../components/ui/Card';
import Button, { IButtonProps } from '../../../components/ui/Button';
import Icon from '../../../components/icon/Icon';
// import Input from '../../../components/form/Input';
import { GridCellParams, GridRowParams } from '@mui/x-data-grid';
import { appPages } from '../../../config/pages.config';
// import Modal, {
// 	ModalBody,
// 	ModalHeader,
// 	ModalFooter,
// 	TModalSize,
// } from '../../../components/ui/Modal';
import { UUID } from 'crypto';
import Validation from '../../../components/form/Validation';
import { useFormik } from 'formik';
import Label from '../../../components/form/Label';
import { orderApi } from '../../../Apis/orderApi';
import { v4 as uuidv4 } from 'uuid';
import apiconfig from '../../../config/apiconfig';
import Checkbox, { CheckboxGroup } from '../../../components/form/Checkbox';
import tagsDb from '../../../mocks/db/tags.db';
import toast, { Toaster } from 'react-hot-toast';
import Select from '../../../components/form/Select';
import { number } from 'prop-types';
import { fontFamily, width } from '@mui/system';
import CustomDatecomp from '../../Vaccine Management/CustomDatecomp';
import ReactDOMServer from 'react-dom/server';
import {
	HeroCheck,
	HeroCursorArrowRays,
	HeroDocumentCheck,
	HeroDocumentMinus,
	HeroLockClosed,
	HeroMinus,
} from '../../../components/icon/heroicons';
import { TUser } from '../../../mocks/db/users.db';
import {
	MoreVert as MoreVertIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	ViewColumnOutlined,
	ViewCarousel,
	ViewComfyOutlined,
	ViewAgendaOutlined,
	ViewKanban,
	Close,
} from '@mui/icons-material';
import { Button as AntButton, Popconfirm, Space, Table, Modal, Input } from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	MoreOutlined,
	BoldOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import {
	DataContextProvider,
	useDataContext,
	DataContext,
	DataContextValue,
} from '../../../context/dataContext';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownNavLinkItem,
	DropdownToggle,
} from '../../../components/ui/Dropdown';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../templates/common/TableParts.template';
import { indexOf } from 'lodash';
import themeConfig from '../../../config/theme.config';
import SvgViewColumns from '../../../components/icon/heroicons/ViewColumns';
import { HeroEye } from '../../../components/icon/heroicons';
import { left, right } from '@popperjs/core';

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
	GridRowId,
} from '@mui/x-data-grid';

import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
	root: {
		// Increase specificity by repeating the class
		'& .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-menuIcon, .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-sortIcon':
			{
				visibility: 'visible !important', // ensure it overrides other styles
			},
		'& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader': {
			color: 'inherit', // Just an example to ensure color is consistent
		},
	},
});

type TModalStableSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
const OrdersList: React.FC = () => {
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [editData, setEditData] = useState<any>([]);
	const [globalFilterOrder, setGlobalFilterOrder] = useState<any>('');
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 5,
	});
	const [Orders, setOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false); // Track loading state
	const [rowCountState, setRowCountState] = useState<number>(0); // Total number of items
	const classes = useStyles();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [comment, setComment] = useState('');
	const [currentParams, setCurrentParams] = useState<GridCellParams | null>(null);
	const apiUrl = apiconfig.apiHostUrl;
	const [localData, setLocalData] = useState<TUser | null>(null);
	const navigate = useNavigate();
	function CustomPagination() {
		return (
			<GridToolbarContainer className='flex w-full items-center justify-between'>
				<CardHeader>
					<CardHeaderChild>
						<CardTitle>Review Orders</CardTitle>
					</CardHeaderChild>
				</CardHeader>
				<GridPagination />
			</GridToolbarContainer>
		);
	}

	const handleOk = async () => {
		if (currentParams) {
			//const orderid = currentParams.row.id;
			// Add your rejection logic here, including handling the comment
			setIsModalVisible(false);
			toast.success(`Order rejected with comment: ${comment}`);
		} else {
			toast.error('Error: Unable to reject order. Please try again.');
		}
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handlePaginationModelChange = (newModel: GridPaginationModel) => {
		setPaginationModel(newModel);
	};

	const Columns = [
		//{ field: 'id', headerName: 'Order ID', width: 250, hide: true }, // Hidden Order ID field
		{ field: 'product', headerName: 'Product', width: 140 },
		{ field: 'manufacturername', headerName: 'Manufacturer', width: 250, hide: true }, // Hidden Order ID field
		//{ field: 'createdBy', headerName: 'CreatedBy', width: 250, hide: true },
		{ field: 'orderItemDesc', headerName: 'OrderItemDesc', width: 140 },
		{ field: 'facility', headerName: 'Facility', width: 140 },
		{ field: 'orderDate', headerName: 'OrderDate', width: 140 },
		{ field: 'quantity', headerName: 'Quantity', width: 140 },
		{ field: 'unitPrice', headerName: 'UnitPrice', width: 140 },
		{ field: 'orderTotal', headerName: 'OrderTotal', width: 140 },
		// { field: 'orderStatus', headerName: 'OrderStatus', width: 140 },
		{
			field: 'actions',
			headerName: 'Actions',
			width: 100,
			renderCell: (params: GridCellParams) => {
				return (
					<div className='group relative'>
						{' '}
						{/* Ensure this div is relative for positioning context */}
						<MoreVertIcon className='cursor-pointer' />
						<div
							className='absolute left-10 top-full mt-1 hidden -translate-x-1/2 -translate-y-full 
                        transform flex-col items-center bg-white shadow-md group-hover:flex'>
							<Space size='small'>
								<AntButton
									icon={<HeroCheck onClick={(event) => Approve(params, event)} />}
								/>
								<AntButton
									icon={<Close onClick={(event) => showModal(params, event)} />}
								/>
							</Space>
						</div>
					</div>
				);
			},
		},
	];
	const Approve = async (params: any, event: any) => {
		const orderid = params.row.id;
		event.preventDefault();
		toast.success(`Order approved successfully!`);
	};
	const showModal = async (params: any, event: any) => {
		const orderid = params.row.id;
		event.stopPropagation();
		setCurrentParams(params);
		setIsModalVisible(true);
	};
	const Reject = async (params: any, event: any) => {
		const orderid = params.row.id;
		event.preventDefault();
		toast.success(`Order rejected!`);
	};
	const listOrders = () => {
		setLoading(true);
		const requestData = {
			pagenumber: paginationModel.page + 1,
			pagesize: paginationModel.pageSize,
		};

		axios
			.post(
				apiUrl +
					'api/Vaccination/getpendingorders?pagenumber=' +
					(paginationModel.page + 1) +
					'&pagesize=' +
					paginationModel.pageSize,
			)
			.then((response) => {
				setLoading(true);
				const { items, totalCount } = response.data;

				if (items.length > paginationModel.pageSize) {
					console.warn('API returned more items than the requested page size.');
				}

				setOrders(items);
				console.log('pending orders:', items);
				const totalRowCount = response.data.totalCount; // Assuming API returns totalCount
				setRowCountState((prevRowCountState) =>
					totalRowCount !== undefined ? totalRowCount : prevRowCountState,
				);
				setLoading(false); // End loading
			})
			.catch((error) => {
				console.error('Error fetching data: ', error);
				setLoading(false); // End loading
			});
	};
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGlobalFilterOrder(e.target.value);
		if (e.target.value !== '') {
			const searchDataFilter = Orders.filter(
				(item: any) =>
					item?.Product.startsWith(e.target.value) ||
					item?.Manufacturer.startsWith(e.target.value) ||
					item?.OrderItemDesc.startsWith(e.target.value) ||
					item?.Facility.startsWith(e.target.value) ||
					item?.OrderDate.startsWith(e.target.value) ||
					item?.Quantity.startsWith(e.target.value) ||
					item?.UnitPrice.startsWith(e.target.value) ||
					item?.OrderTotal.startsWith(e.target.value) ||
					item?.OrderStatus.startsWith(e.target.value),
			);
			setOrders(searchDataFilter);
		} else {
			listOrders();
		}
	};
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			listOrders();
		}
	};

	useEffect(() => {
		//console.log('selectedorgid', localStorage.getItem('organizationidlogged'));
		const storedData = localStorage.getItem('apiData');
		if (storedData) {
			setLocalData(JSON.parse(storedData));
		}
		listOrders();
	}, [globalFilterOrder, paginationModel]);

	return (
		<PageWrapper name='Order List'>
			<Subheader>
				<Toaster />
				<SubheaderLeft>
					<FieldWrap
						firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
						lastSuffix={
							globalFilterOrder && (
								<Icon
									icon='HeroXMark'
									color='red'
									className='mx-2 cursor-pointer'
									onClick={() => setGlobalFilterOrder('')}
								/>
							)
						}>
						<Input
							id='globalFilterOrder'
							name='globalFilterOrder'
							placeholder='Search...'
							value={globalFilterOrder}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
						/>
					</FieldWrap>
				</SubheaderLeft>
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardBody className='overflow-auto'>
						<DataGrid
							className={classes.root}
							rows={Orders}
							columns={Columns}
							rowCount={rowCountState}
							loading={loading}
							pageSizeOptions={[5, 10, 25]}
							paginationModel={paginationModel}
							paginationMode='server'
							onPaginationModelChange={handlePaginationModelChange}
							checkboxSelection
							// onRowClick={handleRowClick}
							//getRowId={(row) => `${row.}-${row.personId}`}
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
						<Modal
							title='Comments'
							visible={isModalVisible}
							onOk={handleOk}
							onCancel={handleCancel}
							okButtonProps={{
								style: {
									backgroundColor: 'green',
									color: 'white',
									borderColor: 'green',
								},
							}}
							cancelButtonProps={{
								style: {
									backgroundColor: 'green',
									color: 'white',
									borderColor: 'green',
								},
							}}>
							<Input.TextArea
								placeholder='Please provide a reason for rejection'
								value={comment}
								onChange={(e) => setComment(e.target.value)}
							/>
						</Modal>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};
export default OrdersList;
