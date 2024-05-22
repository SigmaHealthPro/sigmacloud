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
