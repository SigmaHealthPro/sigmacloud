import React, { useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import { appPages } from '../../../../config/pages.config';
import rolesDb, { TRole } from '../../../../mocks/db/roles.db';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { modulesDbList } from '../../../../mocks/db/modules.db';
import Badge from '../../../../components/ui/Badge';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';

const columnHelper = createColumnHelper<TRole>();

const editLinkPath = `#`;

const columns = [
	columnHelper.accessor('name', {
		cell: (info) => (
			<Link to={`${editLinkPath}${info.row.original.id}`}>
				<div className='font-bold'>{info.getValue()}</div>
			</Link>
		),
		header: 'Name',
		footer: 'Name',
	}),
	columnHelper.display({
		cell: (info) => (
			<div className='flex gap-2'>
				{Object.keys(info.row.original.modules).map((m, index) => (
					<Badge
						variant='outline'
						rounded='rounded-full'
						className='border-transparent'
						key={m}>
						<span className='me-2'>
							{
								// @ts-ignore
								// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
								modulesDbList[`${m}`].name
							}
						</span>
						<b>{Object.values(info.row.original.modules)[index]}</b>
					</Badge>
				))}
			</div>
		),
		header: 'Permissions',
		footer: 'Permissions',
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

const RoleListPage = () => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [data] = useState<TRole[]>(() => [...rolesDb]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 5 },
		},
		// debugTable: true,
	});

	return (
		<PageWrapper name='Roles List'>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Table</CardTitle>
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
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default RoleListPage;
