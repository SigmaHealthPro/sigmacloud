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
import classNames from 'classnames';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import categoriesDb, { TCategory } from '../../../../mocks/db/categories.db';
import { appPages } from '../../../../config/pages.config';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import getFirstLetter from '../../../../Services/utils/getFirstLetter';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';

const columnHelper = createColumnHelper<TCategory>();

const editLinkPath = ``;

const columns = [
	columnHelper.accessor('name', {
		cell: (info) => (
			<Link to={`${editLinkPath}${info.row.original.id}`} className='flex items-center gap-4'>
				<div
					className={classNames(
						'flex aspect-square h-12 w-12 items-center justify-center bg-blue-500/20 text-blue-500',
						'rounded-xl',
					)}>
					{getFirstLetter(info.getValue())}
				</div>
				<div>{info.getValue()}</div>
			</Link>
		),
		header: 'Name',
		footer: 'Name',
	}),
	columnHelper.accessor('id', {
		cell: (info) => info.getValue(),
		header: 'ID',
		footer: 'ID',
	}),
	columnHelper.accessor('status', {
		cell: (info) =>
			info.getValue() ? (
				<Badge variant='outline' color='emerald' className='border-transparent'>
					Active
				</Badge>
			) : (
				<Badge variant='outline' color='red' className='border-transparent'>
					Passive
				</Badge>
			),
		header: 'Status',
		footer: 'Status',
	}),
	columnHelper.display({
		cell: (info) => (
			<Link to={`${editLinkPath}${info.row.original.id}`}>
				<Button>Edit</Button>
			</Link>
		),
		header: 'Actions',
		footer: 'Actions',
	}),
];

const CategoryListPage = () => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');

	const [data] = useState<TCategory[]>(() => [...categoriesDb]);

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
		<PageWrapper name='Categories List'>
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
					<Link to={`${editLinkPath}new`}>
						<Button variant='solid' icon='HeroPlus'>
							New Category
						</Button>
					</Link>
				</SubheaderRight>
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>All Category</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</CardHeaderChild>
						<CardHeaderChild>
							<Button icon='HeroLink' color='zinc' variant='outline'>
								Click
							</Button>
							<Button icon='HeroCloudArrowDown' variant='solid'>
								Click
							</Button>
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[50rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default CategoryListPage;
