import React, { FC, HTMLAttributes } from 'react';
// import colors from 'tailwindcss/colors';
// import themeConfig from '../../../config/theme.config';
import useDarkMode from '../../../hooks/useDarkMode';
import logoForWhite from '../../../../public/logo192.png';
import logoForDark from '../../../../public/SigmaHealthProWhite.png';

type ILogoTemplateProps = HTMLAttributes<HTMLOrSVGElement>;
const LogoTemplate: FC<ILogoTemplateProps> = () => {
	const { isDarkTheme } = useDarkMode();
	if (isDarkTheme) {
		return <img className=' w-56' src={logoForDark} alt='' />;
	}
	return <img className=' w-56' src={logoForWhite} alt='' />;
};

export default LogoTemplate;
