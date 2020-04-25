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

import { REGISTRATIONS } from '../../apollo/registration'
import { FACULTIES } from '../../apollo/faculty'
import RegistrationAdd from './RegistrationAdd'
import RegistrationSearch from './RegistrationSearch'
import RegistrationEdit from './RegistrationEdit'

function RegistrationList() {
  const { history, location, match } = useReactRouter()
  const apolloData = useQuery(REGISTRATIONS)

  // Query faculties
  const [
    loadRegistrations,
    {
      called: registrationCalled,
      loading: registrationLoading,
      data: registrationData
    }
  ] = useLazyQuery(REGISTRATIONS)

  // Query faculties
  const [
    loadFaculties,
    { called: facultyCalled, loading: facultyLoading, data: facultyData }
  ] = useLazyQuery(FACULTIES)

  // States
  const [showSearchView, setShowSearchView] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedFaculty, setselectedFaculty] = useState('')
  const [selectedDepartment, setselectedDepartment] = useState('')
  const [selectedYearLevel, setselectedYearLevel] = useState(null)
  const [title, setTitle] = useState('ວິຊາທັງຫມົດ')
  const [showEditView, setShowEditView] = useState(false)
  const [dataEdit, setDataEdit] = useState({})

  // on first load
  useEffect(() => {
    loadRegistrations()
    loadFaculties()
  }, [])

  // Set states
  const _handleSearchViewClose = () => setShowSearchView(false)
  const _handleSearchViewShow = () => setShowSearchView(true)

  const _handleShowAddModalClose = () => setShowAddModal(false)
  const _handleShowAddModalShow = () => setShowAddModal(true)

  const _handleEditViewClose = () => setShowEditView(false)
  const _handleEditViewShow = () => setShowEditView(true)

  const _studentDetail = event => {
    history.push('/registration-detail', event)
  }

  // const _studentEdit = event => {
  //   // history.push('/registration-edit', event)
  //   //console.log("event: ", event)
  // }
  const _edit = async (data) => {
    await setDataEdit(data)
    _handleEditViewShow()
}

  // const _studentAdd = () => {
  //   history.push('/registration-add')
  // }

  const _onSearch = value => {
    // update view
    const facultyName = facultyData.faculties[parseInt(value.faculty) - 1]
      ? facultyData.faculties[parseInt(value.faculty) - 1].name
      : ''

    setselectedFaculty(facultyName)
    setselectedDepartment(value.department)
    setselectedYearLevel(value.yearLevel)

    let where = {}
    if (!_.isEmpty(value.studentId)) {
      where = {
        student: {
          userId_contains: value.studentId
        }
      }
    } else {
      where = {
        course: {}
      }
      // faculty search
      if (!_.isEmpty(facultyName)) {
        where['course']['faculty'] = {
          name_contains: facultyName
        }
      }

      // department search
      if (!_.isEmpty(value.department)) {
        where['course']['department'] = {
          name_contains: value.department
        }
      }

      // yearLevel search
      if (!_.isEmpty(value.yearLevel)) {
        where['course']['yearLevel'] = parseInt(value.yearLevel)
      }
    }

    // Close search view
    _handleSearchViewClose()

    loadRegistrations({
      variables: { where: where }
    })

    // set title
    setTitle('ຜົນການຄົ້ນຫາ')
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/registration-list')}>
          ລົງທະບຽນວິຊາ
        </Breadcrumb.Item>
        <Breadcrumb.Item active>ລາຍການລົງທະບຽນທັງຫມົດ</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text={'ລາຍການລົງທະບຽນທັງຫມົດ '} />
        <div style={{ textAlign: 'right' }}>
          <CustomButton
            confirm
            addIcon
            title='ລົງທະບຽນ'
            onClick={() => {
              _handleShowAddModalShow()
            }}
          />
        </div>

        {/* custom search button */}
        <SearchBar
          title='ຄະນະວິທະຍາສາດທໍາມະຊາດ,ພາກວິຊາວິທະຍາສາດຄອມພິວເຕີ,ປີຮຽນທີ່1'
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
          ທັງຫມົດ{' '}
          {registrationData &&
            registrationData.registrations &&
            registrationData.registrations.length}{' '}
          ລາຍການ
        </div>

        {/* Table list */}
        <div>
          <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
            <thead>
              <TableHeader>
                <th>ລຳດັບ</th>
                <th>ລະຫັດນັກຮຽນ</th>
                <th>ຊື່ນັກຮຽນ</th>
                <th>ລະຫັດວິຊາ</th>
                <th>ຊື່ວິຊາ</th>
                <th>ວັນທີລົງທະບຽນ</th>
                <th style={{width: 180}}>ຈັດການ</th>
              </TableHeader>
            </thead>
            <tbody>
              {registrationData &&
                registrationData.registrations &&
                registrationData.registrations.map((x, index) => {
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
                        {x.student && x.student.userId}
                      </TableCell>
                      <TableCell>
                        {x.student && x.student.firstname}  {x.student && x.student.lastname}
                      </TableCell>
                      <TableCell>
                        {x.student && x.course ? (x.course.courseCode ? x.course.courseCode : '') : ''}
                      </TableCell>
                      <TableCell>
                        {x.student && x.course ? (x.course.title ? x.course.title : '') : ''}
                      </TableCell>
                      <TableCell>
                        {x.student && new Date(x.createdAt).toLocaleString('la-LA', { hour12: false })}
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
                            onClick={() => _edit(x)}
                            style={{ cursor: 'pointer', backgroundColor:'#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'edit']}
                              color={Consts.BORDER_COLOR}
                            />{' '}
                          </div>
                          <div
                            onClick={() => _studentDetail(x)}
                            style={{ cursor: 'pointer', backgroundColor:'#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'external-link-alt']}
                              color={Consts.BORDER_COLOR}
                            />{' '}
                          </div>
                        </div>
                      </TableCell>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </CustomContainer>

      {/* ------- Add Modal ------ */}
      <RegistrationAdd
        showAddModal={showAddModal}
        _handleShowAddModalClose={_handleShowAddModalClose}
      />

      {/* ------- Edit Modal ------ */}
      <RegistrationEdit
        showEditView={showEditView}
        _handleEditViewClose={_handleEditViewClose}
        registrationData={dataEdit}
      />

      {/* Search Modal */}
      <RegistrationSearch
        facultyData={facultyData ? facultyData.faculties : []}
        showSearchView={showSearchView}
        _handleSearchViewClose={_handleSearchViewClose}
        onSearch={value => _onSearch(value)}
      />
    </div>
  )
}

export default RegistrationList
