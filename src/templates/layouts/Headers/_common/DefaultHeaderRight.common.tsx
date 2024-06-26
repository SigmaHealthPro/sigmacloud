import { useState } from 'react';
import NotificationPartial from '../_partial/Notification.partial';
import SettingsPartial from '../_partial/Settings.partial';
import LanguageSelectorPartial from '../_partial/LanguageSelector.partial';
import MessagesPartial from '../_partial/Messages.partial';
import CartPartial from '../_partial/Cart.partial';
import { DataContextProvider } from '../../../../context/dataContext';
import { Cart } from '../../../../interface/cart.interface';

const DefaultHeaderRightCommon: React.FC = () => {
	return (
		<>
			<CartPartial />
			<MessagesPartial />
			<NotificationPartial />
			<SettingsPartial />
			<LanguageSelectorPartial />
		</>
	);
};

export default DefaultHeaderRightCommon;
