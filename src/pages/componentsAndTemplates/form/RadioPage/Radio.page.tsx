import React, { ReactNode, useRef } from 'react';
import useScrollSpy from 'react-use-scrollspy';
import { useFormik } from 'formik';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Doc, { DocContent, DocNav } from '../../../../templates/for-demo/Doc';
import Button from '../../../../components/ui/Button';
import ExampleView from '../../../../templates/for-demo/ExampleView';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Label from '../../../../components/form/Label';
import MdViewer from '../../../../components/MdViewer';
import Radio, { RadioGroup, TRadioDimension } from '../../../../components/form/Radio';
import Icon from '../../../../components/icon/Icon';
import Badge from '../../../../components/ui/Badge';
import priceFormat from '../../../../Services/utils/priceFormat.util';

import RadioInterfaceMD from './md/RadioInterface.md';
import RadioExample1MD from './md/RadioExample1.md';
import RadioExample2MD from './md/RadioExample2.md';
import { arrColors } from '../../../../types/colors.type';
import { arrColorIntensity } from '../../../../types/colorIntensities.type';
import Subheader, { SubheaderLeft } from '../../../../components/layouts/Subheader/Subheader';
import Breadcrumb from '../../../../components/layouts/Breadcrumb/Breadcrumb';

const RadioPage = () => {
	const sectionRefs = [
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
	];
	const activeSection = useScrollSpy({
		sectionElementRefs: sectionRefs,
		offsetPx: -90,
	});

	const options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
	const options2: { value: string; content: ReactNode }[] = [
		{ value: 'default', content: 'Default' },
		{
			value: 'speed',
			content: (
				<div className='flex items-center gap-2'>
					<Icon icon='HeroRocketLaunch' size='text-lg' />
					<span>Speed</span>
					<Badge variant='outline' className='border-transparent'>
						+{priceFormat(3.99)}
					</Badge>
				</div>
			),
		},
		{
			value: 'extraSpeed',
			content: (
				<div className='flex items-center gap-2'>
					<Icon icon='HeroBolt' color='emerald' size='text-lg' />
					<span className='font-bold'>Extra Speed</span>
					<Badge color='emerald' variant='outline' className='border-transparent'>
						+{priceFormat(4.99)}
					</Badge>
				</div>
			),
		},
	];

	const formik = useFormik({
		initialValues: {
			radioOption: options[1],
			radioOption2: options2[0].value,
			radioColor: arrColors[6],
			radioColorIntensity: arrColorIntensity[5],
			radioDimension: 'default',
		},
		onSubmit: () => {},
	});

	return (
		<PageWrapper name='Radio'>
			<Subheader>
				<SubheaderLeft>
					<Breadcrumb path='Components & Templates / Form' currentPage='Radio' />
				</SubheaderLeft>
			</Subheader>
			<Container>
				<Doc>
					<DocContent>
						<div
							id='Examples'
							ref={sectionRefs[0]}
							className='scroll-mt-offset col-span-12'>
							<span className='text-3xl font-semibold'>Examples</span>
						</div>
						<div className='col-span-12 md:col-span-6'>
							<ExampleView title='Example 1' mdFile={RadioExample1MD as RequestInfo}>
								<Card>
									<CardBody>
										<Label htmlFor='radioOption'>Example Radio</Label>
										<RadioGroup isInline>
											{options.map((i) => (
												<Radio
													key={i}
													label={i}
													name='radioOption'
													value={i}
													selectedValue={formik.values.radioOption}
													onChange={formik.handleChange}
												/>
											))}
										</RadioGroup>
									</CardBody>
								</Card>
							</ExampleView>
						</div>
						<div className='col-span-12 md:col-span-6'>
							<ExampleView title='Example 2' mdFile={RadioExample2MD as RequestInfo}>
								<Card>
									<CardBody>
										<Label
											htmlFor='radioOption2'
											description='Default shipments ship within 3 weeks.'>
											Choose shipping type
										</Label>
										<RadioGroup>
											{options2.map((i) => (
												<Radio
													key={i.value}
													label={i.content}
													name='radioOption2'
													value={i.value}
													selectedValue={formik.values.radioOption2}
													onChange={formik.handleChange}
													color={
														i.value === options2[2].value
															? 'emerald'
															: 'blue'
													}
												/>
											))}
										</RadioGroup>
									</CardBody>
								</Card>
							</ExampleView>
						</div>
						<div
							id='Interface'
							ref={sectionRefs[1]}
							className='scroll-mt-offset col-span-12'>
							<Card>
								<CardHeader>
									<CardHeaderChild>
										<CardTitle>Interface</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<MdViewer mdFile={RadioInterfaceMD as RequestInfo} />
								</CardBody>
							</Card>
						</div>
						<div
							id='color'
							ref={sectionRefs[2]}
							className='scroll-mt-offset col-span-12'>
							<Card>
								<CardHeader>
									<CardHeaderChild>
										<CardTitle>
											<code>color?: TColors;</code>
										</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='flex flex-wrap items-center gap-4'>
										{arrColors.map((item) => (
											<div key={item}>
												<Radio
													key={item}
													label={item}
													name='radioColor'
													value={item}
													selectedValue={formik.values.radioColor}
													onChange={formik.handleChange}
													color={item}
												/>
											</div>
										))}
									</div>
								</CardBody>
							</Card>
						</div>
						<div
							id='colorIntensity'
							ref={sectionRefs[3]}
							className='scroll-mt-offset col-span-12'>
							<Card>
								<CardHeader>
									<CardHeaderChild>
										<CardTitle>
											<code>colorIntensity?: TColorIntensity;</code>
										</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='flex flex-wrap items-center gap-4'>
										{arrColorIntensity.map((item) => (
											<div key={item}>
												<Radio
													key={item}
													label={item}
													name='radioColorIntensity'
													value={item}
													selectedValue={
														formik.values.radioColorIntensity
													}
													onChange={formik.handleChange}
													colorIntensity={item}
												/>
											</div>
										))}
									</div>
								</CardBody>
							</Card>
						</div>
						<div
							id='dimension'
							ref={sectionRefs[3]}
							className='scroll-mt-offset col-span-12'>
							<Card>
								<CardHeader>
									<CardHeaderChild>
										<CardTitle>
											<code>dimension?: TRadioDimension;</code>
										</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='flex flex-wrap items-center gap-4'>
										{['sm', 'default', 'lg', 'xl'].map((item) => (
											<div key={item}>
												<Radio
													key={item}
													label={item}
													name='radioDimension'
													value={item}
													selectedValue={formik.values.radioDimension}
													onChange={formik.handleChange}
													dimension={item as TRadioDimension}
												/>
											</div>
										))}
									</div>
								</CardBody>
							</Card>
						</div>
					</DocContent>
					<DocNav>
						<Button isActive={activeSection === 0} className='!px-0'>
							<a href='#Examples'>Examples</a>
						</Button>
						<Button isActive={activeSection === 1} className='!px-0'>
							<a href='#Interface'>Interface</a>
						</Button>
						<code className='text-xs'>{'<Radio />'}</code>
						<Button isActive={activeSection === 2}>
							<a href='#color'>color</a>
						</Button>
						<Button isActive={activeSection === 3}>
							<a href='#colorIntensity'>colorIntensity</a>
						</Button>
						<Button isActive={activeSection === 4}>
							<a href='#dimension'>dimension</a>
						</Button>
					</DocNav>
				</Doc>
			</Container>
		</PageWrapper>
	);
};

export default RadioPage;