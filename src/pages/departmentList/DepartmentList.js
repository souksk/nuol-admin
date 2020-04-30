import React, { useState, useEffect } from 'react'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Breadcrumb,
  Modal,
  Button,
  Form,
  Row,
  Col,
  Table,
  InputGroup,
  FormControl
} from 'react-bootstrap'
import * as _ from 'lodash'
import DepartmentAdd from './DepartmentAdd'
import DepartmentEdit from './DepartmentEdit'
import DepartmentDelete from './DepartmentDelete'
import DepartmentSearch from './DepartmentSearch'
import Consts from '../../consts'
import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks'
import { DEPARTMENTS } from '../../apollo/deparment'

function DepartmentList() {
  const [selectedFaculty, setselectedFaculty] = useState('')
  const [selectedDepartment, setselectedDepartment] = useState('')
  const [title, setTitle] = useState('All Departments')

  const { history, location, match } = useReactRouter()

  // Query faculties
  const [
    loadDepartments,
    { called: departmentCalled, loading: departmentLoading, data: departmentData }
  ] = useLazyQuery(DEPARTMENTS, { variables: { orderBy: 'createdAt_DESC' } })

  // States
  const [showSearchView, setShowSearchView] = useState(false)
  const [showAddView, setShowAddView] = useState(false)
  const [showEditView, setShowEditView] = useState(false)
  const [dataForEdit, setDataForEdit] = useState(null)
  const [showDeleteView, setShowDeleteView] = useState(false)
  const [dataForDelete, setDataForDelete] = useState(null)

  // on first load
  useEffect(() => {
    loadDepartments()
  }, [])

  // Set states
  // const _handleSearchViewClose = () => setShowSearchView(false)
  // const _handleSearchViewShow = () => setShowSearchView(true)

  const _handleAddViewClose = () => setShowAddView(false)
  const _handleAddViewShow = () => setShowAddView(true)

  const _handleEditViewClose = () => setShowEditView(false)
  const _handleEditViewShow = () => setShowEditView(true)

  const _handleDeleteViewClose = () => setShowDeleteView(false)
  const _handleDeleteViewShow = () => setShowDeleteView(true)

  const _departmantDelete = (data) => {
    setDataForDelete(data)
    _handleDeleteViewShow()
  }

  const _departmentEdit = (data) => {
    setDataForEdit(data)
    _handleEditViewShow()
  }

  const _departmentAdd = () => {
    _handleAddViewShow()
  }

  // const _onSearch = value => {
  //console.log('value: ', value)
  // update view
  // const facultyName = facultyData.faculties[parseInt(value.faculty) - 1]
  //   ? facultyData.faculties[parseInt(value.faculty) - 1].name
  //   : ''

  // setselectedFaculty(facultyName)
  // setselectedDepartment(value.department)

  // let where = {}
  // if (!_.isEmpty(value.userId)) {
  //   where = {
  //     userId_contains: value.userId
  //   }
  // } else {
  //   // faculty search
  //   if (!_.isEmpty(facultyName)) {
  //     where['faculty'] = {
  //       name_contains: facultyName
  //     }
  //   }

  //   // department search
  //   if (!_.isEmpty(value.department)) {
  //     where['department'] = {
  //       name_contains: value.department
  //     }
  //   }
  // }

  //console.log('where: ', where)

  // Close search view
  // _handleSearchViewClose()

  // loadTeachers({
  //   variables: { where: ((Object.keys(where)).length > 0) ? ({ AND: { ...where, role: 'TEACHER' } }) : { role: 'TEACHER' } }
  // })

  // set title
  // setTitle('ຜົນການຄົ້ນຫາ')
  // }

  if (departmentLoading) return <p>Loading...</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/department-list')}>
          Department Management
        </Breadcrumb.Item>
        <Breadcrumb.Item active>All Departments</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text={title} />
        <div style={{ textAlign: 'right' }}>
          <CustomButton
            confirm
            addIcon
            title='Add New'
            onClick={() => _departmentAdd()}
          />
        </div>

        {/* custom search button */}
        {/* <SearchBar
          title='ພາກວິຊາວິທະຍາສາດຄອມພິວເຕີ,...'
          onClick={() => _handleSearchViewShow()}
        /> */}

        {/* ວິຊາທັງຫມົດ */}
        <div
          style={{
            marginTop: 24,
            marginBottom: 8,
            fontSize: 16,
            color: Consts.FONT_COLOR_SECONDARY
          }}
        >
          All {departmentData && departmentData.departments && departmentData.departments.length} departments
        </div>

        {/* Table list */}
        <div>
          <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
            <thead>
              <TableHeader>
                <th style={{ width: 60 }}>#</th>
                <th style={{ width: 300 }}>DEPARTMENT NAME</th>
                <th style={{ width: 300 }}>FACULTY NAME</th>
                <th style={{ width: 300 }}>DESCRIPTION</th>
                <th style={{ width: 200 }}>NOTE</th>
                <th style={{ width: 180 }}>ACTIONS</th>
              </TableHeader>
            </thead>
            <tbody>
              {departmentData &&
                departmentData.departments &&
                departmentData.departments.map((x, index) => {
                  return (
                    <tr
                      style={{
                        borderBottom: '2px solid #ffff',
                        textAlign: 'center'
                      }}
                      key={index}
                    >
                      <TableCell>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {x.name}
                      </TableCell>
                      <TableCell>
                        {x.faculty ? x.faculty.name : '-'}
                      </TableCell>
                      <TableCell>
                        {x.description ? x.description : '-'}
                      </TableCell>
                      <TableCell>
                        {x.note ? x.note : '-'}
                      </TableCell>
                      <TableCell>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                          }}
                        >
                          <div
                            onClick={() => _departmentEdit(x)}
                            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'edit']}
                              color={Consts.BORDER_COLOR}
                            />{' '}
                          </div>
                          <div
                            onClick={() => _departmantDelete(x)}
                            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'trash']}
                              color={Consts.BORDER_COLOR_DELETE}
                            />{' '}
                          </div>
                        </div>
                      </TableCell>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </CustomContainer>

      {/* Search Modal */}
      {/* <DepartmentSearch
        facultyData={
          // facultyData ? facultyData.faculties : []
          []
        }
        showSearchView={showSearchView}
        _handleSearchViewClose={_handleSearchViewClose}
        onSearch={value => _onSearch(value)}
      /> */}

      <DepartmentAdd
        showAddView={showAddView}
        _handleAddViewClose={_handleAddViewClose}
      />

      <DepartmentEdit
        showEditView={showEditView}
        _handleEditViewClose={_handleEditViewClose}
        dataForEdit={dataForEdit}
      />

      <DepartmentDelete
        showDeleteView={showDeleteView}
        _handleDeleteViewClose={_handleDeleteViewClose}
        dataForDelete={dataForDelete}
      />
    </div>
  )
}

export default DepartmentList
