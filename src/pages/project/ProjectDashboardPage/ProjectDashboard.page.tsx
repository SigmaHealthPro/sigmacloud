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
import { HeroAdjustmentsVertical } from '../../../components/icon/heroicons';

const columnHelper = createColumnHelper<SiteManageData>();

const editLinkPath = `../${appPages.salesAppPages.subPages.productPage.subPages.editPageLink.to}/`;

const columns = [
	columnHelper.accessor('jurisdiction', {
		cell: (info) => (
			<div className='font-bold'>{info.getValue()}</div>
			
		),
		header: 'Jurisdiction >',
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
		cell: (_info) => (
			<Dropdown>
				<DropdownToggle>
					<Button icon='HeroEllipsisVertical'></Button>
				</DropdownToggle>
				<DropdownMenu placement='bottom-end'>
					<div className='flex flex-col p-3 gap-4 divide-zinc-200 dark:divide-zinc-800 md:divide-x'>
						<div>
							Edit
						</div>
						<div>
							Edit
						</div>
						<div>
							Edit
						</div>
					</div>
				</DropdownMenu>
			</Dropdown>
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
						<Button variant='outline' icon='HeroPlus'>
							Add New
						</Button>
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
						<CardHeaderChild>
							<Dropdown>
								<DropdownToggle>
									<Button icon='HeroEllipsisVertical'></Button>
								</DropdownToggle>
								<DropdownMenu placement='bottom-end'>
									<div className='grid grid-cols-12 gap-4 divide-zinc-200 dark:divide-zinc-800 md:divide-x'>
										<div className='col-span-12 gap-4 md:col-span-3'>
											<DropdownNavLinkItem to='/' icon='HeroLink'>
												Home Page
											</DropdownNavLinkItem>
											<DropdownNavLinkItem to='/ui/dropdown' icon='HeroLink'>
												Dropdown
											</DropdownNavLinkItem>
											<DropdownItem icon='HeroSquare2Stack'>
												Item 3
											</DropdownItem>
										</div>
										<div className='col-span-12 gap-4 md:col-span-3'>
											<DropdownItem icon='HeroSquare2Stack'>
												Item 4
											</DropdownItem>
											<DropdownItem icon='HeroSquare2Stack'>
												Item 5
											</DropdownItem>
											<DropdownItem icon='HeroSquare2Stack'>
												Item 6
											</DropdownItem>
										</div>
										<div className='col-span-12 gap-4 px-4 md:col-span-6'>
											Lorem ipsum dolor sit amet.
										</div>
									</div>
								</DropdownMenu>
							</Dropdown>
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
