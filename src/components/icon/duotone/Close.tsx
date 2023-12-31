import React, { SVGProps } from 'react';

const SvgClose = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g transform='rotate(-45 14.828 5.172)' fill='currentColor' fillRule='evenodd'>
				<rect y={7} width={16} height={2} rx={1} />
				<rect opacity={0.3} transform='rotate(90 8 8)' y={7} width={16} height={2} rx={1} />
			</g>
		</svg>
	);
};

export default SvgClose;
