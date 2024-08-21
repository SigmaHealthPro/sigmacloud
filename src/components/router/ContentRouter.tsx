import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import contentRoutes from '../../routes/contentRoutes';
import PageWrapper from '../layouts/PageWrapper/PageWrapper';
import Container from '../layouts/Container/Container';
import Subheader, { SubheaderLeft, SubheaderRight } from '../layouts/Subheader/Subheader';
import Header, { HeaderLeft, HeaderRight } from '../layouts/Header/Header';
import Card from '../ui/Card';
import axios from 'axios';
// import PrivateRoute from './PrivateRoute';
interface RouteProps {
    path: any;
    // Add other properties as needed
}

const ContentRouter = () => {
	const [menuData, setMenuData] = useState([]);

	const loadMenu = async () => {
		var finalUrl:any = [];
		try {
			const formData = new FormData();
            formData.append('lovMasterRoleId', '951693f1-21ce-40b9-aa92-42dabe652c7e');    
            const response = await axios.post('api/User/get-users-role-access', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });			
			if (response.data.status === 'Success') {
				// console.log("-----------", response.data.dataList);
				(response.data.dataList).map((list: any) => {
					list.features && (list.features).map((list2: any) => {
						if(list2.hasSubFeature === true){
							(list2.subFeatures).map((list3: any) => {
								finalUrl = [...finalUrl, {
									path: list3.subFeatureLink,
									component: list3.element
								}]
							})
						}else{
							finalUrl = [...finalUrl, {
								path: list2.featureLink,
								component: list2.element
							}]
						}
					})
				})
				setMenuData(finalUrl);
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
		<Suspense
			fallback={
				<>
					<Header>
						<HeaderLeft>
							<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
						</HeaderLeft>
						<HeaderRight>
							<div className='flex gap-4'>
								<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
								<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
								<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
							</div>
						</HeaderRight>
					</Header>
					<PageWrapper>
						<Subheader>
							<SubheaderLeft>
								<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
							</SubheaderLeft>
							<SubheaderRight>
								<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
							</SubheaderRight>
						</Subheader>
						<Container>
							<div className='grid grid-cols-12 gap-4'>
								<div className='col-span-3'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-3 '>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-3'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-3'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>

								<div className='col-span-6'>
									<Card className='h-[50vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-6'>
									<Card className='h-[50vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>

								<div className='col-span-12'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
							</div>
						</Container>
					</PageWrapper>
				</>
			}>
			{/* <contentRoutes /> */}
			<Routes>
			    
				{menuData.map((RouteProps:any) => {
					const Component = React.lazy(() => import(`../${RouteProps.component}`));
					return (
						<Route key={RouteProps.path} path={RouteProps.path} element={<Component />} />
					)
				})}
				{contentRoutes.map((routeProps) => (
					<Route key={routeProps.path} {...routeProps} />
				))}
			</Routes>
		</Suspense>
	);
};

export default ContentRouter;
