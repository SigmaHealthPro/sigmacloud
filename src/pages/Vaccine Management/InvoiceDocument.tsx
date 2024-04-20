// InvoiceDocument.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
	page: {
		flexDirection: 'column',
		padding: 30,
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1,
	},
	title: {
		fontSize: 24,
		marginBottom: 10,
	},
});

interface InvoiceDocumentProps {
	formikValues: {
		OrderPlaced: string;
		manufacturername: string;
		orderTotal: string;
		ShipmentDate: string;
	};
}

export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ formikValues }) => (
	<Document>
		<Page style={styles.page}>
			<View style={styles.section}>
				{/* Other content */}
				{/* Render your other details here */}
				<Text>Order Placed: {formikValues.OrderPlaced}</Text>
				<Text>Manufacturer: {formikValues.manufacturername}</Text>
				<Text>Order Total: {formikValues.orderTotal}</Text>
				<Text>Shipment Date: {formikValues.ShipmentDate}</Text>
			</View>
		</Page>
	</Document>
);

export default InvoiceDocument;
