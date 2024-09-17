import React, { lazy, useEffect, useState } from 'react';
// import { RouteProps } from 'react-router-dom';
// import { Routes, Route, Outlet, Link } from "react-router-dom";
import { appPages, authPages, componentsPages, examplePages } from '../config/pages.config';
import NotFoundPage from '../pages/NotFound.page';
import LoginPage from '../pages/Login.page';
import VaccineForecasting from '../pages/Vaccine \u2028Forecasting/VaccineForecasting';
import FacilitiesPage from '../pages/Facility Management/Facilities.page';
import Facilitypage from '../pages/Facility Management/Facilitypage.page';
import FacilityProfile from '../pages/FacilityProfile.page';
import FacilityPage from '../pages/Facility Management/Facilitypage.page';
import PatientManagement from '../pages/Patient Management/PatientManagement';
import OrderManagement from '../pages/Vaccine Management/Orders';
import AddPatient from '../pages/Patient Management/AddPatient';
import PatientProfile from '../pages/Patient Management/PatientProfile';
import EventCalendar from '../pages/Facility Management/Events/EventCalendar';
import InventoryManagement from '../pages/Inventory/InventoryManagement';
import InventoryProfile from '../pages/Inventory/InventoryProfile';
import AddOrder from '../pages/Vaccine Management/AddOrder';
import DeDuplicationManagement from '../pages/Admin/DeDuplicationManagement';
import DeDuplicationPatientNewData from '../pages/Admin/DeDuplicationPatientNewData';
import UserList from '../pages/Admin/User/UserList';
import OrdersList from '../pages/Admin/Orders/OrdersList';
/**
 * UI
 */
const AlertPage = lazy(() => import('../pages/componentsAndTemplates/ui/AlertPage/Alert.page'));
const BadgePage = lazy(() => import('../pages/componentsAndTemplates/ui/BadgePage/Badge.page'));
const ButtonPage = lazy(() => import('../pages/componentsAndTemplates/ui/ButtonPage/Button.page'));
const ButtonGroupPage = lazy(
	() => import('../pages/componentsAndTemplates/ui/ButtonGroup/ButtonGroup.page'),
);
const CardPage = lazy(() => import('../pages/componentsAndTemplates/ui/CardPage/Card.page'));
const CollapsePage = lazy(
	() => import('../pages/componentsAndTemplates/ui/CollapsePage/Collapse.page'),
);
const DropdownPage = lazy(
	() => import('../pages/componentsAndTemplates/ui/DropdownPage/Dropdown.page'),
);
const ModalPage = lazy(() => import('../pages/componentsAndTemplates/ui/ModalPage/Modal.page'));
const OffcanvasPage = lazy(
	() => import('../pages/componentsAndTemplates/ui/OffcanvasPage/Offcanvas.page'),
);
const ProgressPage = lazy(
	() => import('../pages/componentsAndTemplates/ui/ProgressPage/Progress.page'),
);
const TablePage = lazy(() => import('../pages/componentsAndTemplates/ui/TablePage/Table.page'));
const TooltipPage = lazy(
	() => import('../pages/componentsAndTemplates/ui/TooltipPage/Tooltip.page'),
);

/**
 * FORM
 */
const FieldWrapPage = lazy(
	() => import('../pages/componentsAndTemplates/form/FieldWrapPage/FieldWrap.page'),
);
const CheckboxPage = lazy(
	() => import('../pages/componentsAndTemplates/form/CheckboxPage/Checkbox.page'),
);
const CheckboxGroupPage = lazy(
	() => import('../pages/componentsAndTemplates/form/CheckboxGroupPage/CheckboxGroup.page'),
);
const InputPage = lazy(() => import('../pages/componentsAndTemplates/form/InputPage/Input.page'));
const LabelPage = lazy(() => import('../pages/componentsAndTemplates/form/LabelPage/Label.page'));
const RadioPage = lazy(() => import('../pages/componentsAndTemplates/form/RadioPage/Radio.page'));
const RichTextPage = lazy(
	() => import('../pages/componentsAndTemplates/form/RichTextPage/RichText.page'),
);
const SelectPage = lazy(
	() => import('../pages/componentsAndTemplates/form/SelectPage/Select.page'),
);
const SelectReactPage = lazy(
	() => import('../pages/componentsAndTemplates/form/SelectReactPage/SelectReact.page'),
);
const TextareaPage = lazy(
	() => import('../pages/componentsAndTemplates/form/TextareaPage/Textarea.page'),
);
const ValidationPage = lazy(
	() => import('../pages/componentsAndTemplates/form/ValidationPage/Validation.page'),
);

/**
 * Integrated
 */
const ReactDateRangePage = lazy(
	() =>
		import('../pages/componentsAndTemplates/integrated/ReactDateRangePage/ReactDateRange.page'),
);
const FullCalendarPage = lazy(
	() => import('../pages/componentsAndTemplates/integrated/FullCalendarPage/FullCalendarPage'),
);
const ApexChartsPage = lazy(
	() => import('../pages/componentsAndTemplates/integrated/ApexChartsPage/ApexCharts.page'),
);
const ReactSimpleMapsPage = lazy(
	() =>
		import(
			'../pages/componentsAndTemplates/integrated/ReactSimpleMapsPage/ReactSimpleMaps.page'
		),
);
const WaveSurferPage = lazy(
	() => import('../pages/componentsAndTemplates/integrated/WaveSurferPage/WaveSurfer.page'),
);

/**
 * Icons
 */
const IconPage = lazy(() => import('../pages/componentsAndTemplates/icons/IconPage/Icon.page'));
const HeroiconsPage = lazy(
	() => import('../pages/componentsAndTemplates/icons/HeroiconsPage/Heroicons.page'),
);
const DuotoneIconsPage = lazy(
	() => import('../pages/componentsAndTemplates/icons/DuotoneIconsPage/DuotoneIcons.page'),
);

/**
 * SALES
 */
const SalesDashboardPage = lazy(
	() => import('../pages/sales/SalesDashboardPage/SalesDashboard.page'),
);
const ProductListPage = lazy(
	() => import('../pages/sales/products/ProductListPage/ProductList.page'),
);

const CategoryListPage = lazy(
	() => import('../pages/sales/categories/CategoryListPage/CategoryList.page'),
);
const CategoryPage = lazy(() => import('../pages/sales/categories/CategoryPage/Category.page'));
const Facilities = lazy(() => import('../pages/Facility Management/Facilities.page'));
/**
 * CRM
 */
const Orders = lazy(() => import('../pages/Vaccine Management/Orders'));
const CustomerListPage = lazy(
	() => import('../pages/crm/customer/CustomerListPage/CustomerList.page'),
);
const CustomerPage = lazy(() => import('../pages/crm/customer/CustomerPage/Customer.page'));
const RoleListPage = lazy(() => import('../pages/crm/role/RoleListPage/RoleList.page'));
const RolePage = lazy(() => import('../pages/crm/role/RolePage/Role.page'));

/**
 * Project
 */
const ProjectBoardPage = lazy(() => import('../pages/project/ProjectBoardPage/ProjectBoard.page'));

const ExamplesPage = lazy(() => import('../pages/ExamplePage/Examples.page'));
const ProfilePage = lazy(() => import('../pages/Profile.page'));

/**
 * AI
 */
const AiDashboardPage = lazy(() => import('../pages/ai/AiDashboardPage/AiDashboard.page'));
const ChatPhotoPage = lazy(() => import('../pages/ai/chat/ChatPhotoPage/ChatPhoto.page'));
const ChatVideoPage = lazy(() => import('../pages/ai/chat/ChatVideoPage/ChatVideo.page'));
const ChatAudioPage = lazy(() => import('../pages/ai/chat/ChatAudioPage/ChatAudio.page'));
const ChatCodePage = lazy(() => import('../pages/ai/chat/ChatCodePage/ChatCode.page'));

/**
 * CHAT
 */
const ChatPage = lazy(() => import('../pages/ChatPage/Chat.page'));

/**
 * Other
 */
const UnderConstructionPage = lazy(() => import('../pages/UnderConstruction.page'));


let contentRoutes = [


	  {
		path: "/facility-management/facility-profile/:id", 
		element: <FacilityProfile />,
	  },

	  {
		path:"/facility-management/new-facilityAdd",
		element: <FacilityPage/>
	  },
	
	/**
	 * Admin::BEGIN
	 */
	// {
	// 	path: appPages.DashboardAppPages.subPages.salesDashboardPage.to,
	// 	element: <SalesDashboardPage />,
	// },

	// {
	// 	path: appPages.adminAppPages.subPages.adminPage.subPages.duplicatePatientData.to,
	// 	element: <DeDuplicationManagement />,
	// },
	// {
	// 	path: appPages.adminAppPages.subPages.adminPage.subPages.newPatientData.to,
	// 	element: <DeDuplicationPatientNewData />,
	// },

	// {
	// 	path: appPages.adminAppPages.subPages.userManagementPage.subPages.userManagementListPage.to,
	// 	element: <UserList />,
	// },
	// {
	// 	path: appPages.adminAppPages.subPages.Revieworders.subPages.reviewOrdersData.to,
	// 	element: <OrdersList />,
	// },
	
	/**
	 * CHAT::END
	 */

	{ path: examplePages.examplesPage.to, element: <ExamplesPage /> },

	/**
	 * UI::BEGIN
	 */
	{ path: componentsPages.uiPages.subPages.alertPage.to, element: <AlertPage /> },
	{ path: componentsPages.uiPages.subPages.badgePage.to, element: <BadgePage /> },
	{ path: componentsPages.uiPages.subPages.buttonPage.to, element: <ButtonPage /> },
	{ path: componentsPages.uiPages.subPages.buttonGroupPage.to, element: <ButtonGroupPage /> },
	{ path: componentsPages.uiPages.subPages.cardPage.to, element: <CardPage /> },
	{ path: componentsPages.uiPages.subPages.collapsePage.to, element: <CollapsePage /> },
	{ path: componentsPages.uiPages.subPages.dropdownPage.to, element: <DropdownPage /> },
	{ path: componentsPages.uiPages.subPages.modalPage.to, element: <ModalPage /> },
	{ path: componentsPages.uiPages.subPages.offcanvasPage.to, element: <OffcanvasPage /> },
	{ path: componentsPages.uiPages.subPages.progressPage.to, element: <ProgressPage /> },
	{ path: componentsPages.uiPages.subPages.tablePage.to, element: <TablePage /> },
	{ path: componentsPages.uiPages.subPages.tooltipPage.to, element: <TooltipPage /> },
	/**
	 * UI::END
	 */

	/**
	 * FORM::BEGIN
	 */
	{ path: componentsPages.formPages.subPages.fieldWrapPage.to, element: <FieldWrapPage /> },
	{ path: componentsPages.formPages.subPages.checkboxPage.to, element: <CheckboxPage /> },
	{
		path: componentsPages.formPages.subPages.checkboxGroupPage.to,
		element: <CheckboxGroupPage />,
	},
	{ path: componentsPages.formPages.subPages.inputPage.to, element: <InputPage /> },
	{ path: componentsPages.formPages.subPages.labelPage.to, element: <LabelPage /> },
	{ path: componentsPages.formPages.subPages.radioPage.to, element: <RadioPage /> },
	{ path: componentsPages.formPages.subPages.richTextPage.to, element: <RichTextPage /> },
	{ path: componentsPages.formPages.subPages.selectPage.to, element: <SelectPage /> },
	{
		path: componentsPages.formPages.subPages.selectReactPage.to,
		element: <SelectReactPage />,
	},
	{ path: componentsPages.formPages.subPages.textareaPage.to, element: <TextareaPage /> },
	{ path: componentsPages.formPages.subPages.validationPage.to, element: <ValidationPage /> },
	/**
	 * FORM::END
	 */

	/**
	 * INTEGRATED::BEGIN
	 */
	{
		path: componentsPages.integratedPages.subPages.reactDateRangePage.to,
		element: <ReactDateRangePage />,
	},
	{
		path: componentsPages.integratedPages.subPages.fullCalendarPage.to,
		element: <FullCalendarPage />,
	},
	{
		path: componentsPages.integratedPages.subPages.apexChartsPage.to,
		element: <ApexChartsPage />,
	},
	{
		path: componentsPages.integratedPages.subPages.reactSimpleMapsPage.to,
		element: <ReactSimpleMapsPage />,
	},
	{
		path: componentsPages.integratedPages.subPages.waveSurferPage.to,
		element: <WaveSurferPage />,
	},
	/**
	 * INTEGRATED::BEGIN
	 */

	/**
	 * ICONS::BEGIN
	 */
	{ path: componentsPages.iconsPage.to, element: <IconPage /> },
	{ path: componentsPages.iconsPage.subPages.heroiconsPage.to, element: <HeroiconsPage /> },
	{
		path: componentsPages.iconsPage.subPages.duotoneIconsPage.to,
		element: <DuotoneIconsPage />,
	},
	/**
	 * ICONS::BEGIN
	 */

	{ path: `facilityProfile.to/:id`, element: <FacilityProfile /> },
	

	{ path: authPages.loginPage.to, element: <LoginPage /> },
	{ path: authPages.profilePage.to, element: <ProfilePage /> },

	{ path: '*', element: <NotFoundPage /> },
];

// useEffect(() => {
// 	contentRoutes = [...contentRoutes, 
// 		{
// 			path: "/admin/deduplication/dummyurl2",
// 			element: <DeDuplicationManagement />,
// 		},
// 	]
//  }, []);


export default contentRoutes;
