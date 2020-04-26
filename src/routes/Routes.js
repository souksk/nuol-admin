
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import styled from 'styled-components'

import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

import Login from '../pages/login/Login'
// CustomSideNav
import { CustomSideNav, CustomNavbar } from '../common'

// Course
import CourseList from '../pages/courseList/CourseList'
import CourseAdd from '../pages/courseAdd/CourseAdd'
import CourseDetail from '../pages/courseDetail/CourseDetail'
import CourseEdit from '../pages/courseEdit/CourseEdit'
import CourseDocList from '../pages/courseDocList/CourseDocList'

// Teacher
import TeacherList from '../pages/teacherList/TeacherList'
import TeacherDetail from '../pages/teacherDetail/TeacherDetail'
import TeacherAdd from '../pages/teacherAdd/TeacherAdd'
import TeacherEdit from '../pages/teacherEdit/TeacherEdit'

// Student
import StudentList from '../pages/studentList/StudentList'
import StudentDetail from '../pages/studentDetail/StudentDetail'
import StudentAdd from '../pages/studentAdd/StudentAdd'
import StudentEdit from '../pages/studentEdit/StudentEdit'

// Register
import RegistrationList from '../pages/registrationList/RegistrationList'
import RegistrationDetail from '../pages/registrationDetail/RegistrationDetail'

// Profile
import ProfileDetail from '../pages/profile/ProfileDetail'
import ProfileEdit from '../pages/profile/ProfileEdit'

// Document
import DocumentList from '../pages/documentList/DocumentList'
import DocumentDetail from '../pages/documentDetail/DocumentDetail'

// Faculty
import FacultyList from '../pages/facultyList/FacultyList'

// Department
import DepartmentList from '../pages/departmentList/DepartmentList'

// Calenda
import CalendaList from '../pages/calendaList/CalendaList'
import CalendaDetail from '../pages/calendaDetail/CalendaDetail'
import CalendaAdd from '../pages/calendaAdd/CalendaAdd'
import CalendaEdit from '../pages/calendaEdit/CalendaEdit'


const Main = styled.main`
  /* position: relative; */
  overflow: hidden;
  transition: all .15s;
  padding: 0 20px;
  margin-left: ${props => (props.expanded ? 240 : 64)}px;
`
function Routes() {

  return (
    <Router>
      <Switch>
        {/* Before login routes */}
        <PublicRoute exact path='/' component={Login} />

        {/* After login routes (has SideNav and NavBar) */}
        <Route
          render={({ location, history }) =>
            <React.Fragment>
              {/* sidenav */}
              <CustomSideNav location={location} history={history} />

              <Main>
                {/* navbar */}
                <CustomNavbar />

                {/* Contents */}
                <div
                  style={{
                    marginTop: 60,
                    backgroundColor: '#eee',
                    minHeight: '100vh'
                  }}
                >
                  {/* private routes */}
                  <PrivateRoute
                    path='/course-list'
                    exact
                    component={props => <CourseList />}
                  />
                  <PrivateRoute
                    path='/course-add'
                    component={props => <CourseAdd />}
                  />
                  <PrivateRoute
                    path='/course-detail'
                    component={props => <CourseDetail />}
                  />
                  <PrivateRoute
                    path='/course-edit'
                    component={props => <CourseEdit />}
                  />
                  <PrivateRoute
                    path='/course-doc-list'
                    component={props => <CourseDocList />}
                  />

                  {/* Teacher PrivateRoutes */}
                  <PrivateRoute
                    path='/teacher-list'
                    component={props => <TeacherList />}
                  />
                  <PrivateRoute
                    path='/teacher-add'
                    component={props => <TeacherAdd />}
                  />
                  <PrivateRoute
                    path='/teacher-edit'
                    component={props => <TeacherEdit />}
                  />
                  <PrivateRoute
                    path='/teacher-detail'
                    component={props => <TeacherDetail />}
                  />
                  <PrivateRoute
                    path='/student-list'
                    component={props => <StudentList />}
                  />
                  <PrivateRoute
                    path='/student-detail'
                    component={props => <StudentDetail />}
                  />
                  <PrivateRoute
                    path='/student-add'
                    component={props => <StudentAdd />}
                  />
                  <PrivateRoute
                    path='/student-edit'
                    component={props => <StudentEdit />}
                  />

                  <PrivateRoute
                    path='/registration-list'
                    component={props => <RegistrationList />}
                  />
                  <PrivateRoute
                    path='/registration-detail'
                    component={props => <RegistrationDetail />}
                  />

                  {/* Document PrivateRoutes */}
                  <PrivateRoute
                    path='/document-list'
                    component={props => <DocumentList />}
                  />

                  <PrivateRoute
                    path='/document-detail'
                    component={props => <DocumentDetail />}
                  />

                  <PrivateRoute
                    path='/profile-detail'
                    component={props => <ProfileDetail />}
                  />
                  <PrivateRoute
                    path='/profile-edit'
                    component={props => <ProfileEdit />}
                  />

                  <PrivateRoute
                    path='/faculty-list'
                    component={props => <FacultyList />}
                  />

                  <PrivateRoute
                    path='/department-list'
                    component={props => <DepartmentList />}
                  />

                  <PrivateRoute
                    path='/calenda-list'
                    component={props => <CalendaList />}
                  />

                  <PrivateRoute
                    path='/calenda-detail'
                    component={props => <CalendaDetail />}
                  />

                  <PrivateRoute
                    path='/calenda-add'
                    component={props => <CalendaAdd />}
                  />

                  <PrivateRoute
                    path='/calenda-edit'
                    component={props => <CalendaEdit />}
                  />

                </div>
              </Main>
            </React.Fragment>}
        />
      </Switch>
    </Router>
  )
}

export default Routes
