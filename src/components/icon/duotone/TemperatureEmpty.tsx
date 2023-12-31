import React, { SVGProps } from 'react';

const SvgTemperatureEmpty = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M13.999 12.534L13 11.956V5c0-.267-.517-.991-1-1-.516-.01-1 .715-1 1v6.956l-.999.578a4 4 0 103.997 0zM18 16a6 6 0 11-9-5.197V5a3 3 0 016 0v5.803A5.998 5.998 0 0118 16z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgTemperatureEmpty;
