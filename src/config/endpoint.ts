const endpoint = {
	//api endPoint of Inventory
	searchInventory: 'api/Inventory/searchInventory',
	deleteinventory: 'api/Inventory/deleteinventory',
	createInventory: 'api/Inventory/createInventory',
	getallproducts: 'api/Vaccination/getallproducts',
	AllSites: 'api/Site/AllSites',
	getallfacilities: 'api/Vaccination/getallfacilities',
	getvaccineinfobyproduct: 'api/Vaccination/getvaccineinfobyproductid?productid=',

	//api endPoint of Patient

	searchpatient: 'api/Patients/searchpatient',
	deletepatient: 'api/Patients/deletepatient',
	Countries: 'api/MasterData/Countries',
	States: 'api/MasterData/States',
	getcitiesbystateid: 'api/MasterData/getcitiesbystateid',
	Gender: 'api/MasterData/getlovmasterbylovtype?lovtype=Gender',
	AddressType: 'api/MasterData/getlovmasterbylovtype?lovtype=AddressType',
	addresses: 'api/Addresses/get-addresses',
	createpatient: 'api/Patients/createpatient',

	//api endPoint Event Calendar
	searchevent: 'api/Event/searchevent',
	AllProviders: 'api/Provider/AllProviders',
	createEvent: 'api/Event/createEvent',
};

export default endpoint;
