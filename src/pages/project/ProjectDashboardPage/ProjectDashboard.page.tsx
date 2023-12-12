import React, { useState } from 'react';
import { BiEditAlt } from 'react-icons/bi';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEye } from "react-icons/fa6";
import { Input, Modal, Form, Popconfirm } from 'antd';
import Button from '../../../components/ui/Button';

const initialData = [
	{
		id: '1',
		jurisdiction: 'Michigan-JD1',
		organization: 'CVS Pharmacy',
		facilityName: 'Troy',
		address: '123 Main',
		city: 'Troy',
		state: 'MI',
		zipCode: '48098',
		status: 'Danger',
	},
	{
		id: '2',
		jurisdiction: 'Michigan-JD2',
		organization: 'CVS Pharmacy',
		facilityName: 'Rochester Hills',
		address: '124 Main',
		city: 'Rochester Hills',
		state: 'MI',
		zipCode: '48099',
		status: 'Danger',
	},
	{
		id: '3',
		jurisdiction: 'Michigan-JD1',
		organization: 'CVS Pharmacy',
		facilityName: 'Troy',
		address: '123 Main',
		city: 'Troy',
		state: 'MI',
		zipCode: '48098',
		status: 'Danger',
	},
	{
		id: '4',
		jurisdiction: 'Michigan-JD2',
		organization: 'CVS Pharmacy',
		facilityName: 'Rochester Hills',
		address: '124 Main',
		city: 'Rochester Hills',
		state: 'MI',
		zipCode: '48099',
		status: 'Danger',
	},
	{
		id: '5',
		jurisdiction: 'Michigan-JD1',
		organization: 'CVS Pharmacy',
		facilityName: 'Troy',
		address: '123 Main',
		city: 'Troy',
		state: 'MI',
		zipCode: '48098',
		status: 'Danger',
	},
	{
		id: '6',
		jurisdiction: 'Michigan-JD2',
		organization: 'CVS Pharmacy',
		facilityName: 'Rochester Hills',
		address: '124 Main',
		city: 'Rochester Hills',
		state: 'MI',
		zipCode: '48099',
		status: 'Danger',
	},
];

const ProjectTable: React.FC = () => {
	const [openModal, setOpenModal] = useState(false);
	const [datas, setDatas] = useState(initialData || []);
	const [form] = Form.useForm();
	const [editingKey, setEditingKey] = useState('');

	const handleAddOrEdit = (id) => {
		form.validateFields()
			.then((data) => {
				const newData = [...datas];
				const index = newData?.findIndex((item) => id === item?.id);

				if (index > -1) {
					const item = newData[index];
					newData.splice(index, 1, { ...item, ...data });
					setDatas(newData);
					setEditingKey('');
				} else {
					newData.push({ id: Date.now(), ...data });
					setDatas(newData);
				}
				setOpenModal(false);
			})
			.catch((info) => {
				console.log('Validate Failed:', info);
			});
	};

	const handleDelete = (id) => {
		const newData = datas.filter((data) => data?.id !== id);
		setDatas(newData);
	};

	const handleEdit = (data) => {
		form.setFieldsValue({ ...data });
		setEditingKey(data?.id);
		setOpenModal(true);
	};

	const handleCancel = () => {
		setEditingKey('');
		setOpenModal(false);
	};

	return (
		<div className='m-10'>
			<div className='flex items-center justify-between'>
				<div>
					<Button
						variant='outline'
						type='button'
						onClick={() => {
							setOpenModal(true);
							setEditingKey('');
						}}
						>
						Add New +
					</Button>

					{/* modal */}
					<Modal
						title='Basic Modal'
						open={openModal}
						onOk={() => handleAddOrEdit(editingKey)}
						onCancel={handleCancel}>
						<Form form={form} layout='vertical'>
							<Form.Item
								name='jurisdiction'
								label='Jurisdiction'
								rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item
								name='organization'
								label='Organization'
								rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item
								name='facilityName'
								label='Facility Name'
								rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item name='address' label='Address' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item name='city' label='City' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item name='state' label='State' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item name='zipCode' label='Zip Code' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</Form>
					</Modal>
				</div>

				<p className='text-sm text-gray-500'>All Pages (1 - 20)</p>
			</div>

			<div className='relative mt-4 overflow-x-auto rounded-lg bg-white p-5 dark:bg-zinc-900'>
				<table className='managment_table'>
					<thead>
						<tr>
							<th>
								<input type='checkbox' name='' id='' />
							</th>
							<th>Jurisdiction</th>
							<th>Organization</th>
							<th>Facility Name</th>
							<th>Address</th>
							<th>City</th>
							<th>State</th>
							<th>Zip</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{datas?.map((data) => (
							<tr key={data?.id}>
								<td>
									<input type='checkbox' name='' id='' />
								</td>
								<td>{data?.jurisdiction}</td>
								<td>{data?.organization}</td>
								<td>{data?.facilityName}</td>
								<td>{data?.address}</td>
								<td>{data?.city}</td>
								<td>{data?.state}</td>
								<td>{data?.zipCode}</td>
								<td>
									<div className='flex gap-2'>
									<button onClick={() => handleEdit(data)}>
										<FaEye />
										</button>
										<button onClick={() => handleEdit(data)}>
											<BiEditAlt className='text-green-600' />
										</button>
										<Popconfirm
											title='Sure to delete?'
											onConfirm={() => handleDelete(data?.id)}
											style={{ backgroundColor: '#ffa5' }}>
											<button>
												<MdDeleteOutline className='text-red-600' />
											</button>
										</Popconfirm>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ProjectTable;