import React, { SVGProps } from 'react';

const SvgUmbrella = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M11.5 3a8.5 8.5 0 018.5 8.5v.5H3v-.5A8.5 8.5 0 0111.5 3z'
					fill='currentColor'
				/>
				<path
					d='M11 12h2v6.75a3.25 3.25 0 01-6.5 0V18h2v.75a1.25 1.25 0 002.5 0V12z'
					fill='currentColor'
					opacity={0.3}
				/>
			</g>
		</svg>
	);
};

export default SvgUmbrella;
