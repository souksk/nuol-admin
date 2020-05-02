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
					if(to == '/calenda-list' || to == '/course-list'){
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
					active={selectStatus === "calenda" ? true : false}
					style={{ borderLeft: (selectStatus === "calenda") ? '6px solid #7BB500' : '6px solid #fff' }}
				>
					<NavIcon>
						<i className="fa fa-calendar-alt" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
					Schedule Management
					</NavText>
				</NavItem>
				<NavItem
					eventKey="registration-list"
					active={selectStatus === "registration" ? true : false}
					style={{ borderLeft: (selectStatus === "registration") ? '6px solid #7BB500' : '6px solid #fff' }}
				>
					<NavIcon>
						<i className="fa fa-plus-square" aria-hidden="true" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						Registration Management
					</NavText>
				</NavItem>
				<NavItem
					eventKey="teacher-list"
					active={selectStatus === "teacher" ? true : false}
					style={{ borderLeft: (selectStatus === "teacher") ? '6px solid #7BB500' : '6px solid #fff' }}
				>
					<NavIcon>
						<i className="fa fa-fw fa-user-friends" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						Teacher Management
					</NavText>
				</NavItem>
				<NavItem
					eventKey="student-list"
					active={selectStatus === "student" ? true : false}
					style={{ borderLeft: (selectStatus === "student") ? '6px solid #7BB500' : '6px solid #fff' }}
				>
					<NavIcon>
						<i className="fa fa-male" style={{ fontSize: '1.75em' }} />
						<i className="fa fa-female" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						Student Management
					</NavText>
				</NavItem>
				<NavItem
					eventKey="faculty-list"
					active={selectStatus === "faculty" ? true : false}
					style={{ borderLeft: (selectStatus === "faculty") ? '6px solid #7BB500' : '6px solid #fff' }}
				>
					<NavIcon>
						<i className="fa fa-archive" aria-hidden="true" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						Faculty Management
					</NavText>
				</NavItem>
				<NavItem
					eventKey="department-list"
					active={selectStatus === "department" ? true : false}
					style={{ borderLeft: (selectStatus === "department") ? '6px solid #7BB500' : '6px solid #fff' }}
				>
					<NavIcon>
						<i className="fa fa-book" aria-hidden="true" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						Department Management
					</NavText>
				</NavItem>
				<NavItem
					eventKey="course-list"
					active={selectStatus === "course" ? true : false}
					style={{ borderLeft: (selectStatus === "course") ? '6px solid #7BB500' : '6px solid #fff' }}
				>
					<NavIcon>
						<i className="fa fa-bookmark" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						Course Management
					</NavText>
				</NavItem>
				<NavItem
					eventKey="document-list"
					active={selectStatus === "document" ? true : false}
					style={{ borderLeft: (selectStatus === "document") ? '6px solid #7BB500' : '6px solid #fff' }}
				>
					<NavIcon>
						<i className="fa fa-fw fa-folder" style={{ fontSize: '1.75em' }} />
					</NavIcon>
					<NavText style={{ color: Consts.PRIMARY_COLOR }}>
						Document Management
					</NavText>
				</NavItem>
			</SideNav.Nav>
		</SideNav>
	);
}

export default CustomSideNav;
