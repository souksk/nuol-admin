import React, { useState, useEffect } from 'react';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Consts from '../consts';
import './sidenav.css';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

function CustomSideNav({ location, history }) {
	const [selectStatus, setSelectStatus] = useState(location.pathname.split('/')[1].split('-')[0]);
	const [expandedStatus, setExpandedStatus] = useState(false);

	return (
		<SideNav
			onSelect={async (selected) => {
				setSelectStatus(selected.split('-')[0]);
				const to = '/' + selected;
				if (location.pathname !== to) {
					await history.push(to);
					if(to == '/calenda-list'){
						window.location.reload(true)
					}
				}
			}}
			style={{
				position: 'fixed',
				backgroundColor: '#F5F5F5',
				zIndex: 10001
			}}
			onToggle={(expanded) => {
				setExpandedStatus(expanded);
			}}
		>
			<Toggle style={{ marginLeft: 6 }} />

			<SideNav.Nav defaultSelected={location.pathname.split('/')[1]}>
				{/* {(expandedStatus) ? <div style={{display:'flex', flexDirection:'column', width:'100%', alignItems:'center'}}>
					<img style={{ width: 150, marginTop: -26 }} src='/assets/logo-SLMS.png' />
				</div>:''} */}
				<NavItem
					eventKey="calenda-list"
					style={
						selectStatus == 'calenda' ? (
							{ backgroundColor: Consts.PRIMARY_COLOR, borderLeft: '6px solid #7BB500', marginTop: 5 }
						) : (
								{ backgroundColor: '#fff', borderLeft: '6px solid #fff', marginTop: 5 }
							)
					}
				>
					<NavIcon>
						<i className="fa fa-calendar-alt" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						ຈັດການຕາຕະລາງການຮຽນ
					</NavText>
				</NavItem>
				<NavItem
					eventKey="registration-list"
					style={
						selectStatus == 'registration' ? (
							{ backgroundColor: Consts.PRIMARY_COLOR, borderLeft: '6px solid #7BB500', marginTop: 5 }
						) : (
								{ backgroundColor: '#fff', borderLeft: '6px solid #fff', marginTop: 5 }
							)
					}
				>
					<NavIcon>
						<i className="fa fa-plus-square" aria-hidden="true" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						ລົງທະບຽນວິຊາຮຽນ
					</NavText>
				</NavItem>
				<NavItem
					eventKey="teacher-list"
					style={
						selectStatus == 'teacher' ? (
							{ backgroundColor: Consts.PRIMARY_COLOR, borderLeft: '6px solid #7BB500', marginTop: 5 }
						) : (
								{ backgroundColor: '#fff', borderLeft: '6px solid #fff', marginTop: 5 }
							)
					}
				>
					<NavIcon>
						<i className="fa fa-fw fa-user-friends" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						ຈັດການອາຈານ
					</NavText>
				</NavItem>
				<NavItem
					eventKey="student-list"
					style={
						selectStatus == 'student' ? (
							{ backgroundColor: Consts.PRIMARY_COLOR, borderLeft: '6px solid #7BB500', marginTop: 5 }
						) : (
								{ backgroundColor: '#fff', borderLeft: '6px solid #fff', marginTop: 5 }
							)
					}
				>
					<NavIcon>
						<i className="fa fa-male" style={{ fontSize: '1.75em' }} />
						<i className="fa fa-female" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						ຈັດການນັກຮຽນ
					</NavText>
				</NavItem>
				<NavItem
					eventKey="faculty-list"
					style={
						selectStatus == 'faculty' ? (
							{ backgroundColor: Consts.PRIMARY_COLOR, borderLeft: '6px solid #7BB500', marginTop: 5 }
						) : (
								{ backgroundColor: '#fff', borderLeft: '6px solid #fff', marginTop: 5 }
							)
					}
				>
					<NavIcon>
						<i className="fa fa-archive" aria-hidden="true" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						ຄະນະ
					</NavText>
				</NavItem>
				<NavItem
					eventKey="department-list"
					style={
						selectStatus == 'department' ? (
							{ backgroundColor: Consts.PRIMARY_COLOR, borderLeft: '6px solid #7BB500', marginTop: 5 }
						) : (
								{ backgroundColor: '#fff', borderLeft: '6px solid #fff', marginTop: 5 }
							)
					}
				>
					<NavIcon>
						<i className="fa fa-book" aria-hidden="true" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						ພາກວິຊາ
					</NavText>
				</NavItem>
				<NavItem
					eventKey="course-list"
					style={
						selectStatus == 'course' ? (
							{ backgroundColor: Consts.PRIMARY_COLOR, borderLeft: '6px solid #7BB500', marginTop: 5 }
						) : (
								{ backgroundColor: '#fff', borderLeft: '6px solid #fff', marginTop: 5 }
							)
					}
				>
					<NavIcon>
						<i className="fa fa-bookmark" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						ຈັດການວິຊາຮຽນ
					</NavText>
				</NavItem>
				<NavItem
					eventKey="document-list"
					style={
						selectStatus == 'document' ? (
							{ backgroundColor: Consts.PRIMARY_COLOR, borderLeft: '6px solid #7BB500', marginTop: 5 }
						) : (
								{ backgroundColor: '#fff', borderLeft: '6px solid #fff', marginTop: 5 }
							)
					}
				>
					<NavIcon>
						<i className="fa fa-fw fa-folder" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						ຈັດການໄຟລ
					</NavText>
				</NavItem>
			</SideNav.Nav>
		</SideNav>
	);
}

export default CustomSideNav;
