import React from 'react';
// import { useNavigate } from 'react-router-dom';
import Aside, { AsideBody, AsideFooter, AsideHead } from '../../../components/layouts/Aside/Aside';
import LogoAndAsideTogglePart from './_parts/LogoAndAsideToggle.part';
import DarkModeSwitcherPart from './_parts/DarkModeSwitcher.part';
import { appPages } from '../../../config/pages.config';
import Nav, {
	NavButton,
	NavCollapse,
	NavItem,
	// NavSeparator,
} from '../../../components/layouts/Navigation/Nav';
import Badge from '../../../components/ui/Badge';
import UserTemplate from '../User/User.template';
import Icon from '../../../components/icon/Icon';

const DefaultAsideTemplate = () => {
	return (
		<Aside>
			<AsideHead>
				<LogoAndAsideTogglePart />
			</AsideHead>
			<AsideBody>
				<Nav className='font-[SecondFamily]'>
					{/* dashboard */}
					<NavItem {...appPages.DashboardAppPages.subPages.salesDashboardPage} />
					{/* enrollment */}
					<NavCollapse
						text={appPages.adminAppPages.text}
						to={appPages.adminAppPages.to}
						icon={appPages.adminAppPages.icon}>
						<NavCollapse
							text={appPages.adminAppPages.subPages.adminPage.text}
							to={appPages.adminAppPages.subPages.adminPage.to}
							icon={appPages.adminAppPages.subPages.adminPage.icon}>
							<NavItem
								{...appPages.adminAppPages.subPages.adminPage.subPages
									.duplicatePatientData}
							/>
							<NavItem
								{...appPages.adminAppPages.subPages.adminPage.subPages
									.newPatientData}
							/>
						</NavCollapse>
						<NavCollapse
							text={appPages.adminAppPages.subPages.Revieworders.text}
							to={appPages.adminAppPages.subPages.Revieworders.to}
							icon={appPages.adminAppPages.subPages.Revieworders.icon}>
							<NavItem
								{...appPages.adminAppPages.subPages.Revieworders.subPages
									.reviewOrdersData}
							/>
						</NavCollapse>
						<NavCollapse
							text={appPages.adminAppPages.subPages.userManagementPage.text}
							to={appPages.adminAppPages.subPages.userManagementPage.to}
							icon={appPages.adminAppPages.subPages.userManagementPage.icon}>
							<NavItem
								{...appPages.adminAppPages.subPages.userManagementPage.subPages
									.userManagementListPage}
							/>
						</NavCollapse>
					</NavCollapse>
					{/* Patient Management  */}
					<NavItem
						text={appPages.PatientManagement.text}
						to={appPages.PatientManagement.to}
						icon={appPages.PatientManagement.icon}
					/>
					{/* Inventory Management  */}
					<NavItem
						text={appPages.InventoryManagement.text}
						to={appPages.InventoryManagement.to}
						icon={appPages.InventoryManagement.icon}
					/>
					{/* Vaccine Management */}
					<NavCollapse
						text={appPages.crmAppPages.text}
						to={appPages.crmAppPages.to}
						icon={appPages.crmAppPages.icon}>
						<NavItem {...appPages.crmAppPages.subPages.crmDashboardPage} />
						{/*Vaccine Orders*/}
						<NavItem
							text={appPages.crmAppPages.subPages.OrdersPage.text}
							to={appPages.crmAppPages.subPages.OrdersPage.to}
							icon={appPages.crmAppPages.subPages.OrdersPage.icon}
						/>
						<NavCollapse
							text={appPages.crmAppPages.subPages.customerPage.text}
							to={appPages.crmAppPages.subPages.customerPage.to}
							icon={appPages.crmAppPages.subPages.customerPage.icon}>
							<NavItem
								{...appPages.crmAppPages.subPages.customerPage.subPages.listPage}
							/>
							<NavItem
								{...appPages.crmAppPages.subPages.customerPage.subPages.editPage}
							/>
							<NavItem
								{...appPages.crmAppPages.subPages.customerPage.subPages.editPage}
							/>
						</NavCollapse>
						<NavCollapse
							text={appPages.crmAppPages.subPages.rolePage.text}
							to={appPages.crmAppPages.subPages.rolePage.to}
							icon={appPages.crmAppPages.subPages.rolePage.icon}>
							<NavItem
								{...appPages.crmAppPages.subPages.rolePage.subPages.listPage}
							/>
							<NavItem
								{...appPages.crmAppPages.subPages.rolePage.subPages.editPage}
							/>
						</NavCollapse>
					</NavCollapse>
					{/* Site Management */}
					<NavCollapse
						text={appPages.projectAppPages.text}
						to={appPages.projectAppPages.to}
						icon={appPages.projectAppPages.icon}>
						<NavItem {...appPages.projectAppPages.subPages.projectDashboardPage}>
							<NavButton title='Add New' icon='HeroPlusCircle' />
						</NavItem>
						<NavItem {...appPages.projectAppPages.subPages.projectBoardPage}>
							<Badge
								variant='outline'
								color='emerald'
								className='border-transparent leading-none'>
								6
							</Badge>
						</NavItem>
					</NavCollapse>
					{/* User Management */}
					<NavItem
						text={appPages.educationAppPages.text}
						to={appPages.educationAppPages.to}
						icon={appPages.educationAppPages.icon}
					/>
					<NavItem
						text={appPages.facilityAppPages.text}
						to={appPages.facilityAppPages.to}
						icon={appPages.facilityAppPages.icon}
					/>
					{/* Access Management  */}
					<NavItem
						text={appPages.reservationAppPages.text}
						to={appPages.reservationAppPages.to}
						icon={appPages.reservationAppPages.icon}
					/>
					{/* Reference Data */}
					<NavItem
						text={appPages.mailAppPages.text}
						to={appPages.mailAppPages.to}
						icon={appPages.mailAppPages.icon}
					/>
					{/* vaccine Forecasting */}
					<NavItem
						text={appPages.vaccineForecasting.text}
						to={appPages.vaccineForecasting.to}
						icon={appPages.vaccineForecasting.icon}
					/>
					{/* Reports */}
					<NavItem
						text={appPages.reports.text}
						to={appPages.reports.to}
						icon={appPages.reports.icon}
					/>
				</Nav>
			</AsideBody>
			<AsideFooter>
				<UserTemplate />
				<DarkModeSwitcherPart />
			</AsideFooter>
		</Aside>
	);
};

export default DefaultAsideTemplate;
