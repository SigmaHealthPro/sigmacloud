import React from 'react';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../components/layouts/Subheader/Subheader';
import Container from '../../components/layouts/Container/Container';

const VaccineForecasting = () => {
	return (
		<PageWrapper>
			<Subheader>
				<SubheaderLeft>SubheaderLeft</SubheaderLeft>
				<SubheaderRight>SubheaderRight</SubheaderRight>
			</Subheader>
			<Container>Container</Container>
		</PageWrapper>
	);
};

export default VaccineForecasting;
