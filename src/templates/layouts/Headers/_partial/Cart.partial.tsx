import React, { FC, ReactNode, useState } from 'react';
import classNames from 'classnames';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../../components/ui/Dropdown';
import Button from '../../../../components/ui/Button';
import Avatar from '../../../../components/Avatar';
import usersDb from '../../../../mocks/db/users.db';
import SvgBold from '../../../../components/icon/duotone/Bold';
import Label from '../../../../components/form/Label';
import Modal, {
	ModalBody,
	ModalHeader,
	ModalFooter,
	TModalSize,
} from '../../../../components/ui/Modal';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import { Cart } from '../../../../interface/cart.interface';
export interface ChildProps {
	cartItems: Cart[];
	addToCart: (item: Cart) => void;
}

export const CartPartial: React.FC<ChildProps> = ({ cartItems }) => {
	const [newCartItem, setNewCart] = useState(false);
	const productName = localStorage.getItem('productname');
	console.log('in cart page itemcount=', localStorage.getItem('itemcount'));

	return (
		<div className='relative'>
			<Dropdown>
				<DropdownToggle hasIcon={false}>
					<Button icon='HeroShoppingCart' aria-label='Messages' />
				</DropdownToggle>
				<DropdownMenu
					onClick={() => {
						setNewCart(true);
					}}
					placement='bottom-end'
					className='flex flex-col flex-wrap divide-y divide-dashed divide-zinc-500/50 p-4 [&>*]:py-4'>
					<div className='flex min-w-[24rem] gap-2'>
						{cartItems &&
							cartItems.map((item) => (
								<div className='grow-0'>
									<div className='flex gap-2 font-bold'>{item.product}</div>
									<div className='flex w-[18rem] gap-2 text-zinc-500'>
										<span className='truncate'>{item.vaccine}</span>
										<span className='truncate'>{item.manufacturer}</span>
									</div>
								</div>
							))}
					</div>
				</DropdownMenu>
			</Dropdown>

			<span className='absolute end-0 top-0 flex h-3 w-3'>
				<span className='relative inline-flex h-3 w-0 rounded-full'></span>
				<span className='absolute inline-flex h-full w-full' />
				{localStorage.getItem('itemcount')}
				<span className='relative inline-flex h-3 w-3'></span>
			</span>
			<Modal
				isOpen={newCartItem}
				setIsOpen={setNewCart}
				size={'2xl'}
				isCentered={true}
				isAnimation={true}>
				<ModalHeader>Add Item to Cart</ModalHeader>
				<ModalBody>
					<PageWrapper name='Vaccine List'>
						<Container>
							<Card className='h-full'>
								<CardHeader>
									<CardHeaderChild>
										<div></div>
									</CardHeaderChild>
									<CardBody className='overflow-auto'>
										<div className='grid grid-cols-12 gap-4'>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='ProductName'>
													Product Name
													{' :         ' +
														localStorage.getItem('productname')}
												</Label>
											</div>
											<div className='col-span-12 lg:col-span-6'></div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='VaccineName'>
													Vaccine Name
													{' :         ' +
														localStorage.getItem('vaccinename')}
												</Label>
											</div>
											<div className='col-span-12 lg:col-span-6'></div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='ManufacturerName'>
													Manufacturer
													{' :         ' +
														localStorage.getItem('manufacturername')}
												</Label>
											</div>
											<div className='col-span-12 lg:col-span-6'></div>
										</div>
									</CardBody>
								</CardHeader>
							</Card>
						</Container>
					</PageWrapper>
				</ModalBody>
				<ModalFooter>
					<Button
						variant='solid'
						onClick={() => {
							setNewCart(false);
						}}>
						Back to Orders
					</Button>
					<Button
						variant='solid'
						onClick={() => {
							setNewCart(false);
						}}>
						Shippment
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};
export default CartPartial;