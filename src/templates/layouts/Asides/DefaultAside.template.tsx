import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import apiconfig from '../../../config/apiconfig';

const DefaultAsideTemplate = () => {
	const [menuData, setMenuData] = useState([]);

	const loadMenu = async () => {
		try {
			const formData = new FormData();
            formData.append('lovMasterRoleId', '951693f1-21ce-40b9-aa92-42dabe652c7e');    
            const response = await axios.post('https://localhost:7155/api/User/get-users-role-access', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
			
			// console.log("response", response);
			if (response.data.status === 'Success') {
				setMenuData(response.data.dataList);
			} else {
			//   console.error('Failed to fetch user role access data:', response.data.message);
			  return [];
			}
		  } catch (error) {
			// console.error('Error fetching user role access data:', error);
			return [];
		  }
	}
	useEffect(() => {
       loadMenu();
	}, []);
	return (
		<Aside>
			<AsideHead>
				<LogoAndAsideTogglePart />
			</AsideHead>
			<AsideBody>
				<Nav className='font-[SecondFamily]'>
					{/* dashboard */}
					<NavItem {...appPages.DashboardAppPages.subPages.salesDashboardPage} />
					{
						menuData && 
						(menuData).map((list, index) => {
							// console.log("list", list)
							return (
								<NavCollapse
									text={list.profileName}
									to="#"
									icon={list.iconCode}
									key={list.profileId}
									>
										{
											list.features ?
											(list.features).map((features, index2) => {
												// console.log("features", features)												
												return (
													features.hasSubFeature === true ?
														<NavCollapse
															text={features.featureName}
															to={features.featureLink}
															icon={features.iconCode}
															key={features.featureId}>
																{
																	features.subFeatures ?
																	(features.subFeatures).map((subFeaturesData, index3) => {
																		return (
																			<NavItem
																				text={subFeaturesData.subFeatureName}
																				to={subFeaturesData.subFeatureLink}
																				// icon={subFeaturesData.iconCode}
																				key={subFeaturesData.subFeatureId}
																			/>
																		)})
																	: null
																}
														</NavCollapse>
														:
													<NavItem
														text={features.featureName}
														to={features.featureLink}
														// icon={features.iconCode}
														key={features.featureId}
													/>
												)
											})
											: null
										}
								</NavCollapse>
							)
						})
					}
					{/* enrollment */}
					{/* <NavCollapse
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
					</NavCollapse> */}
				
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
