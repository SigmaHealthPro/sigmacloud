import React, { useState } from 'react';
import { Input, Modal, Form, Popconfirm } from 'antd';
import { BiEditAlt } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import Button from '../../../components/ui/Button';

const initialData = [
	{
		id: '1',
		order_date: 'Michigan-JD1',
		date_amount: 'CVS Pharmacy',
		quantity: 'Troy',
	},
	{
		id: '2',
		order_date: 'Michigan-JD2',
		date_amount: 'CVS Pharmacy',
		quantity: 'Rochester Hills',
	},
];

const CustomerDashboardPage: React.FC = () => {
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
		<div className='modify_vaccine p-5'>
			<div className='details_area rounded-lg bg-white dark:bg-zinc-900'>
				<div className='details_title py-5'>
					<h4 className='text-center font-normal dark:text-white'>Details</h4>
				</div>
				<div className='bg-base-100 mt-6 rounded-lg p-6 shadow-md dark:bg-zinc-900 lg:px-60'>
					<div className='grid grid-cols-2 gap-8 sm:gap-24'>
						<div className='flex flex-col gap-3'>
							<input type='text' placeholder='Vaccine Code' />
							<input type='text' placeholder='Vaccine Code' />
							<input type='text' placeholder='Vaccine Code' />
						</div>
						<div className='flex flex-col gap-3'>
							<input type='text' placeholder='Vaccine Code' />
							<input type='text' placeholder='Vaccine Code' />
						</div>
					</div>

					<div className='mt-6 flex justify-end gap-6'>
						<button className='flex items-center gap-4 rounded-2xl bg-blue-600 px-4 py-1.5 text-white'>
							Save
						</button>
						<button className='flex items-center gap-4 rounded-2xl bg-red-600 px-4 py-1.5 text-white'>
							Cancel
						</button>
					</div>
				</div>
			</div>

			<div className='mt-6 gap-4 md:flex'>
				<div className='p-5 text-[15px] dark:text-white md:w-72'>
					<p className='rounded-md bg-[#ddd] p-[12px] font-medium dark:bg-zinc-900'>
						Order
					</p>
					<div>
						<p className='rounded-md p-[12px]'>Shipments</p>
						<p className='rounded-md bg-[#dddddd45] p-[12px] dark:bg-[#dddddd0f]'>
							Events
						</p>
						<p className='rounded-md p-[12px]'>Inventorys</p>
					</div>
				</div>

				<div className='w-full'>
					<div className='relative overflow-x-auto rounded-lg p-5 dark:bg-zinc-900'>
						<table className='managment_table'>
							<thead>
								<tr>
									<th>
										<input type='checkbox' name='' id='' />
									</th>
									<th>Order Date</th>
									<th>Date Amount</th>
									<th>Quantity</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{datas?.map((data) => (
									<tr key={data?.id}>
										<td>
											<input type='checkbox' name='' id='' />
										</td>
										<td>{data?.order_date}</td>
										<td>{data?.date_amount}</td>
										<td>{data?.quantity}</td>
										<td>
											<div className='flex gap-2'>
												<button>
													<FaEye />
												</button>
												<button
													type='button'
													onClick={() => handleEdit(data)}>
													<BiEditAlt className='text-green-600' />
												</button>
												<Popconfirm
													title='Sure to delete?'
													onConfirm={() => handleDelete(data?.id)}
													style={{ backgroundColor: '#ffa5' }}>
													<button type='button'>
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

					<div className='mt-8 flex items-center justify-between'>
						<Button
							variant='outline'
							type='button'
							onClick={() => {
								setOpenModal(true);
								setEditingKey('');
							}}>
							Add New +
						</Button>

						<p className='text-sm text-gray-500'>All Pages (1 - 20)</p>
					</div>
				</div>

				{/* Modal */}
				<Modal
					title='Basic Modal'
					open={openModal}
					onOk={() => handleAddOrEdit(editingKey)}
					onCancel={handleCancel}>
					<Form form={form} layout='vertical'>
						<Form.Item
							name='order_date'
							label='Order Date'
							rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						<Form.Item
							name='date_amount'
							label='Date Amount'
							rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						<Form.Item name='quantity' label='Quantity' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</div>
	);
};

export default CustomerDashboardPage;