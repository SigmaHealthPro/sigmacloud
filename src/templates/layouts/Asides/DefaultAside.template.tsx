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

const DefaultAsideTemplate = () => {
	return (
		<Aside>
			<AsideHead>
				<LogoAndAsideTogglePart />
			</AsideHead>
			<AsideBody>
				<Nav className='font-[SecondFamily]'>
					{/* dashboard */}
					<NavItem {...appPages.salesAppPages.subPages.salesDashboardPage} />
					{/* enrollment */}
					<NavCollapse
						text={appPages.salesAppPages.text}
						to={appPages.salesAppPages.to}
						icon={appPages.salesAppPages.icon}>
						<NavCollapse
							text={appPages.salesAppPages.subPages.productPage.text}
							to={appPages.salesAppPages.subPages.productPage.to}
							icon={appPages.salesAppPages.subPages.productPage.icon}>
							<NavItem
								{...appPages.salesAppPages.subPages.productPage.subPages.listPage}
							/>
							<NavItem
								{...appPages.salesAppPages.subPages.productPage.subPages.editPage}
							/>
						</NavCollapse>
						<NavCollapse
							text={appPages.salesAppPages.subPages.categoryPage.text}
							to={appPages.salesAppPages.subPages.categoryPage.to}
							icon={appPages.salesAppPages.subPages.categoryPage.icon}>
							<NavItem
								{...appPages.salesAppPages.subPages.categoryPage.subPages.listPage}
							/>
							<NavItem
								{...appPages.salesAppPages.subPages.categoryPage.subPages.editPage}
							/>
						</NavCollapse>
					</NavCollapse>
					{/* Patient Management  */}
					<NavItem
						text={appPages.PatientManagement.text}
						to={appPages.PatientManagement.to}
						icon={appPages.PatientManagement.icon}
					/>
					{/* Vaccine Management */}
					<NavCollapse
						text={appPages.crmAppPages.text}
						to={appPages.crmAppPages.to}
						icon={appPages.crmAppPages.icon}>
						<NavItem {...appPages.crmAppPages.subPages.crmDashboardPage} />
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
