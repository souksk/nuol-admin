import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb, Modal, Button, Form, Row, Col, Table, InputGroup, FormControl } from 'react-bootstrap';
import * as _ from 'lodash';
import StudentSearch from './StudentSearch';
import Consts from '../../consts';
import { CustomContainer, SearchBar, Title, CustomButton, TableHeader, TableCell } from '../../common';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { USERS } from './../../apollo/user';
import { FACULTIES } from '../../apollo/faculty';

function StudentList() {
	const { history, location, match } = useReactRouter();

	// Query faculties
	const [
		loadStudents,
		{ called: studentCalled, loading: studentLoading, data: studentData }
	] = useLazyQuery(USERS, {
		variables: { where: { role: 'STUDENT' } }
	});

	// Query faculties
	const [ loadFaculties, { called: facultyCalled, loading: facultyLoading, data: facultyData } ] = useLazyQuery(
		FACULTIES
	);

	// States
	const [ showSearchView, setShowSearchView ] = useState(false);
	const [ selectedFaculty, setselectedFaculty ] = useState('');
	const [ selectedDepartment, setselectedDepartment ] = useState('');
	const [ selectedYearLevel, setselectedYearLevel ] = useState(null);
	const [ title, setTitle ] = useState('ວິຊາທັງຫມົດ');

	// on first load
	useEffect(() => {
		loadStudents();
		loadFaculties();
	}, []);

	// Set states
	const _handleSearchViewClose = () => setShowSearchView(false);
	const _handleSearchViewShow = () => setShowSearchView(true);

	const _studentDetail = (event) => {
		history.push('/student-detail', event);
	};

	const _studentEdit = (event) => {
		history.push('/student-edit', event);
	};

	const _studentAdd = () => {
		history.push('/student-add');
	};

	const _onSearch = (value) => {
		// //console.log('value: ', value)
		// update view
		const facultyName = facultyData.faculties[parseInt(value.faculty) - 1]
			? facultyData.faculties[parseInt(value.faculty) - 1].name
			: '';

		setselectedFaculty(facultyName);
		setselectedDepartment(value.department);
		setselectedYearLevel(value.yearLevel);

		let where = {};
		if (!_.isEmpty(value.userId)) {
			where = {
				userId_contains: value.userId
			};
		} else {
			// faculty search
			if (!_.isEmpty(facultyName)) {
				where['faculty'] = {
					name_contains: facultyName
				};
			}

			// department search
			if (!_.isEmpty(value.department)) {
				where['department'] = {
					name_contains: value.department
				};
			}

			// yearLevel search
			if (!_.isEmpty(value.yearLevel)) {
				where['yearLevel'] = parseInt(value.yearLevel);
			}
		}

		// //console.log(where)

		// Close search view
		_handleSearchViewClose();

		loadStudents({
			variables: {
				where: Object.keys(where).length > 0 ? { AND: { ...where, role: 'STUDENT' } } : { role: 'STUDENT' }
			}
		});

		// set title
		setTitle('ຜົນການຄົ້ນຫາ');
	};

	// if (studentLoading || facultyLoading) return <p>loading...</p>

	return (
		<div>
			{/* Breadcrumb */}
			<Breadcrumb>
				<Breadcrumb.Item href="" onClick={() => history.push('/student-list')}>
					ຈັດການນັກຮຽນ
				</Breadcrumb.Item>
				<Breadcrumb.Item active>ລາຍຊື່ນັກຮຽນທັງໝົດ</Breadcrumb.Item>
			</Breadcrumb>

			<CustomContainer>
				<Title text={'ລາຍຊື່ນັກຮຽນ'} />
				<div style={{ textAlign: 'right' }}>
					<CustomButton confirm addIcon title="ເພີ່ມນັກຮຽນ" onClick={() => _studentAdd()} />
				</div>

				{/* custom search button */}
				<SearchBar
					title="ຄະນະວິທະຍາສາດທໍາມະຊາດ,ພາກວິຊາວິທະຍາສາດຄອມພິວເຕີ,ປີຮຽນທີ່1"
					onClick={() => _handleSearchViewShow()}
				/>

				{/* ລາຍຊື່ນັກຮຽນ */}
				<div
					style={{
						marginTop: 24,
						marginBottom: 8,
						fontSize: 16,
						color: Consts.FONT_COLOR_SECONDARY
					}}
				>
					ທັງຫມົດ {studentData && studentData.users.length} ຄົນ
				</div>

				{/* Table list */}
				<div>
					<table border="1" bordercolor="#fff" style={{ width: '100%' }}>
						<thead>
							<TableHeader>
								<th>ລຳດັບ</th>
								<th>ລະຫັດນັກຮຽນ</th>
								<th>ຊື່</th>
								<th>ຄະນະ</th>
								<th>ພາກວິຊາ</th>
								<th>ປີຮຽນ</th>
								<th style={{ width: 180 }}>ຈັດການ</th>
							</TableHeader>
						</thead>
						<tbody>
							{studentData &&
								studentData.users &&
								studentData.users.map((x, index) => {
									return (
										<tr
											style={{
												borderBottom: '2px solid #ffff',
												textAlign: 'center'
											}}
											key={index}
										>
											<TableCell>{index + 1}</TableCell>
											<TableCell>{x.userId}</TableCell>
											<TableCell>
												{x.firstname} {x.lastname}
											</TableCell>
											<TableCell>{x.faculty && x.faculty.name}</TableCell>
											<TableCell>{x.department && x.department.name}</TableCell>
											<TableCell>{x && x.yearLevel}</TableCell>
											<TableCell>
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														justifyContent: 'space-around'
													}}
												>
													<div
														onClick={() => _studentEdit(x)}
														style={{
															cursor: 'pointer',
															backgroundColor: '#FFFFFF',
															padding: 3,
															width: 64,
															borderRadius: 4
														}}
													>
														<FontAwesomeIcon
															icon={[ 'fas', 'edit' ]}
															color={Consts.BORDER_COLOR}
														/>{' '}
													</div>
													<div
														onClick={() => _studentDetail(x)}
														style={{
															cursor: 'pointer',
															backgroundColor: '#FFFFFF',
															padding: 3,
															width: 64,
															borderRadius: 4
														}}
													>
														<FontAwesomeIcon
															icon={[ 'fas', 'external-link-alt' ]}
															color={Consts.BORDER_COLOR}
														/>{' '}
													</div>
												</div>
											</TableCell>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			</CustomContainer>

			{/* Search Modal */}
			<StudentSearch
				facultyData={facultyData ? facultyData.faculties : []}
				showSearchView={showSearchView}
				_handleSearchViewClose={_handleSearchViewClose}
				onSearch={(value) => _onSearch(value)}
			/>
		</div>
	);
}

export default StudentList;
