import React, { useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import Badge from '../../../components/ui/Badge';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import { appPages } from '../../../config/pages.config';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownNavLinkItem,
	DropdownToggle,
} from '../../../components/ui/Dropdown';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../templates/common/TableParts.template';
import TsiteManageDb, { SiteManageData } from '../../../mocks/db/Sitemanagement';
import { HeroAdjustmentsVertical, HeroEye, HeroPlusSmall } from '../../../components/icon/heroicons';
import { DuoEdit1, DuoTrash } from '../../../components/icon/duotone';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../../../components/ui/Modal';
import Label from '../../../components/form/Label';
import { useFormik } from 'formik';

const columnHelper = createColumnHelper<SiteManageData>();

const editLinkPath = `../${appPages.salesAppPages.subPages.productPage.subPages.editPageLink.to}/`;

const columns = [
	columnHelper.accessor('jurisdiction', {
		cell: (info) => (
			<div aria-hidden="false" className='font-bold'>{info.getValue()}</div>

		),
		header: 'Jurisdiction',
		footer: 'Jurisdiction',
	}),
	columnHelper.accessor('organization', {
		cell: (info) => (
			<div className='font-bold'>{info.getValue()}</div>
		),
		header: 'Organization',
		footer: 'Organization',
	}),
	columnHelper.accessor('facilityName', {
		cell: (info) => (
			<div className='font-bold'>{info.getValue()}</div>
		),
		header: 'Facility Name',
		footer: 'Facility Name',
	}),
	columnHelper.accessor('address', {
		cell: (info) => (
			<div className='font-bold'>{info.getValue()}</div>
		),
		header: 'Address',
		footer: 'Address',
	}),
	columnHelper.accessor('city', {
		cell: (info) => (
			<div className='font-bold'>{info.getValue()}</div>
		),
		header: 'City',
		footer: 'City',
	}),
	columnHelper.accessor('state', {
		cell: (info) => (
			<div className='font-bold'>{info.getValue()}</div>
		),
		header: 'State',
		footer: 'State',
	}),
	columnHelper.accessor('zipCode', {
		cell: (info) => (
			<div className='font-bold'>{info.getValue()}</div>
		),
		header: 'Zip Code',
		footer: 'Zip Code',
	}),
	columnHelper.accessor('icon', {
		cell: (_icon) => (
			<Dropdown>
				<DropdownToggle hasIcon={false}>
					<Button color='zinc' icon='HeroEllipsisVertical' />
				</DropdownToggle>
				<DropdownMenu placement='bottom-end'>
					<div className='flex flex-col gap-4'>
						<Button>
							<DuoEdit1 fontSize={"18px"} />
						</Button>
						<Button>
							<HeroEye fontSize={"18px"} />
						</Button>
						<Button>
							<DuoTrash fontSize={"18px"} />
						</Button>
					</div>
				</DropdownMenu>
			</Dropdown>
			// <div className='font-bold'>{info.getValue()}</div>
		),
		header: 'Action',
		footer: 'Action',
	}),
];

const SiteManagement = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');

	const [data] = useState<SiteManageData[]>(() => [...TsiteManageDb]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 10 },
		},
		// debugTable: true,
	});
	const [modalStatus, setModalStatus] = useState<boolean>(false);
	const formik = useFormik({
		initialValues: {
			textJurisdiction: '',
			textOrganization: '',
			textFacilityName: '',
			textAddress: '',
			textCity: '',
			textState: '',
			textZipCode: '',
		},
		onSubmit: () => { },
	});
	return (
		<PageWrapper name='Products List'>
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
									onClick={() => {
										setGlobalFilter('');
									}}
								/>
							)
						}>
						<Input
							id='example'
							name='example'
							placeholder='Search...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					<Link to={`#`}>
						<Button variant='outline' icon='HeroPlusSmall' onClick={() => setModalStatus(true)}>Add New</Button>
						<Modal isOpen={modalStatus} setIsOpen={setModalStatus}>
							<ModalHeader>Add New Site Management</ModalHeader>
							<ModalBody>
								<div>
									<Label
										htmlFor='urlAddress'
										description=' '>
										Jurisdiction
									</Label>
									<FieldWrap>
										<Input
											type='text'
											id='TextJurisdiction'
											name='TextJurisdiction'
											onChange={formik.handleChange}
											value={formik.values.textJurisdiction}
											placeholder='Michigan-JD1'
										/>
									</FieldWrap>
								</div>
								<div>
									<Label
										htmlFor='urlAddress'
										description=' '>
										Organization
									</Label>
									<FieldWrap>
										<Input
											type='text'
											id='TextOrganization'
											name='TextOrganization'
											onChange={formik.handleChange}
											value={formik.values.textOrganization}
											placeholder='CVS Pharmacy'
										/>
									</FieldWrap>
								</div>
								<div>
									<Label
										htmlFor='urlAddress'
										description=' '>
										Facility Name
									</Label>
									<FieldWrap>
										<Input
											type='text'
											id='TextJurisdiction'
											name='TextJurisdiction'
											onChange={formik.handleChange}
											value={formik.values.textFacilityName}
											placeholder='Michigan-JD1'
										/>
									</FieldWrap>
								</div>
								<div>
									<Label
										htmlFor='text'
										description=' '>
										Address
									</Label>
									<FieldWrap>
										<Input
											type='text'
											id='textAddress'
											name='textAddress'
											onChange={formik.handleChange}
											value={formik.values.textAddress}
											placeholder='Michigan-JD1'
										/>
									</FieldWrap>
								</div>
								<div>
									<Label
										htmlFor='city'
										description=' '>
										City
									</Label>
									<FieldWrap>
										<Input
											type='text'
											id='TextJurisdiction'
											name='TextJurisdiction'
											onChange={formik.handleChange}
											value={formik.values.textCity}
											placeholder='Michigan-JD1'
										/>
									</FieldWrap>
								</div>
								<div>
									<Label
										htmlFor='urlAddress'
										description=' '>
										State
									</Label>
									<FieldWrap>
										<Input
											type='text'
											id='state'
											name='textState'
											onChange={formik.handleChange}
											value={formik.values.textState}
											placeholder='Michigan-JD1'
										/>
									</FieldWrap>
								</div>
								<div>
									<Label
										htmlFor='urlAddress'
										description=' '>
										Zip Code
									</Label>
									<FieldWrap>
										<Input
											type='text'
											id='TextJurisdiction'
											name='TextJurisdiction'
											onChange={formik.handleChange}
											value={formik.values.textZipCode}
											placeholder='Michigan-JD1'
										/>
									</FieldWrap>
								</div>
									<Button className=' mt-3' variant='outline'>Submit</Button>
							</ModalBody>
						</Modal>
					</Link>
				</SubheaderRight>
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Site Management</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default SiteManagement;
