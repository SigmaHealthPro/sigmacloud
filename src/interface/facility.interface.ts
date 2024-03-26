export interface Facility {
    id: string; 
    jurisdiction: string;
    organization: string;
    facilityName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
};
export interface Provider {
    id: number;
    providerName: string;
  }
  
export interface Site {
    id: number;
    siteName: string;
  } 
  export interface LovMasterType {
	id: string;
	key: string;
	value: string;
	lovType: string;
	longDescription: string;
  }
  export interface Address {
	id: string;
	addressId: string;
	line1: string;
	line2: string;
	suite: string;
	countyName: string;
	countryName: string;
	stateName: string;
	cityName: string;
	zipCode: string;
	fullAddress: string;
  }
