import React, { SVGProps } from 'react';

const SvgPolygon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M8.081 20h7.838a1.5 1.5 0 001.423-1.026l2.33-6.99a1.5 1.5 0 00-.476-1.638l-6.24-5.077a1.5 1.5 0 00-1.892-.001l-6.258 5.078a1.5 1.5 0 00-.478 1.639l2.33 6.99A1.5 1.5 0 008.081 20z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgPolygon;
