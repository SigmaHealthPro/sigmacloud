import React, { SVGProps } from 'react';

const SvgSize = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M18 6h-7c-.667-.114-1-.448-1-1s.333-.886 1-1h9v9c0 .667-.333 1-1 1s-1-.333-1-1V6zM6 18h7c.667.114 1 .448 1 1s-.333.886-1 1H4v-9c0-.667.333-1 1-1s1 .333 1 1v7z'
					fill='currentColor'
				/>
				<rect
					fill='currentColor'
					opacity={0.3}
					transform='rotate(-45 12 12)'
					x={7}
					y={11}
					width={10}
					height={2}
					rx={1}
				/>
			</g>
		</svg>
	);
};

export default SvgSize;
