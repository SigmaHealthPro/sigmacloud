import React, { SVGProps } from 'react';

const SvgKnifeFork1 = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M6 3l.45 4.502a.552.552 0 001.1 0L8 3h1l.45 4.502a.552.552 0 001.1 0L11 3h1v4.5a3.5 3.5 0 01-7 0V3h1z'
					fill='currentColor'
				/>
				<path
					d='M8.5 13c.561 0 1.024.438 1.055.998l.362 6.504A1.419 1.419 0 018.5 22a1.419 1.419 0 01-1.417-1.498l.362-6.504c.03-.56.494-.998 1.055-.998zM17.5 15c.563 0 1.031.435 1.071.997l.322 4.507A1.397 1.397 0 0117.5 22a1.397 1.397 0 01-1.393-1.496l.322-4.507c.04-.562.508-.997 1.071-.997z'
					fill='currentColor'
					opacity={0.3}
				/>
				<path d='M19 3v10h-4V7a4 4 0 014-4z' fill='currentColor' />
			</g>
		</svg>
	);
};

export default SvgKnifeFork1;
