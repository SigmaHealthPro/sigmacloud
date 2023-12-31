import React, { SVGProps } from 'react';

const SvgSpatula = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M14.613 1.264l7.623 7.623a.5.5 0 01-.076.77l-6.68 4.452a4.391 4.391 0 01-6.09-6.09l4.454-6.679a.5.5 0 01.77-.076z'
					fill='currentColor'
					opacity={0.3}
				/>
				<path
					d='M8.213 13.248l2.039 2.04-1.778 3.78a3.039 3.039 0 11-4.043-4.042l3.782-1.778zm-3.628 5.666a1.435 1.435 0 002.03.01 1.435 1.435 0 00-.01-2.03 1.435 1.435 0 00-2.029-.01 1.435 1.435 0 00.01 2.03z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgSpatula;
