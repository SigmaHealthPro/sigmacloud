import { TIcons } from "../types/icons.type";

export enum TColors {
	Red = 'red',
	Lime = 'lime',
	Blue = 'blue',
	Amber='amber'
	// Add other colors as needed
  }


export type TTab = {
	text:
		| 'Edit Profile'
		| 'Addresses'
		| 'Contacts'
		| 'Sites'
		| 'Providers'
		| 'Events'
		| 'EventCalendar';
	icon: TIcons;
};
export type TTabs = {
	[key in
		| 'EDIT'
		| 'Addresses'
		| 'Contacts'
		| 'Sites'
		| 'Providers'
		| 'Events'
		| 'EventCalendar']: TTab;
	};
		
export const TAB: TTabs = {
	EDIT: {
		text: 'Edit Profile',
		icon: 'HeroPencil',
	},
	Addresses: {
		text: 'Addresses',
		icon: 'HeroBuildingOffice2',
	},
	Contacts: {
		text: 'Contacts',
		icon: 'HeroPhoneArrowDownLeft',
	},
	
	Sites: {
		text: 'Sites',
		icon: 'HeroBuildingOffice',
	},
	Providers: {
		text: 'Providers',
		icon: 'HeroUsers',
	},
	Events: {
		text: 'Events',
		icon: 'HeroCalendarDays',
	},
	EventCalendar: {
		text: 'EventCalendar',
		icon: 'HeroCalendarDays',
	},
};