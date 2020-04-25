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
import TeacherSearch from './TeacherSearch'
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
import { TEACHERS } from './../../apollo/user'
import { FACULTIES } from '../../apollo/faculty'

function TeacherList() {
  const [selectedFaculty, setselectedFaculty] = useState('')
  const [selectedDepartment, setselectedDepartment] = useState('')
  const [title, setTitle] = useState('ລາຍຊື່ອາຈານທັງຫມົດ')

  const { history, location, match } = useReactRouter()

  // Query teacher
  const [
    loadTeachers,
    { called: teacherCalled, loading: teacherLoading, data: teacherData }
  ] = useLazyQuery(TEACHERS, {
    variables: { where: { role: 'TEACHER' } }
  })

  // Query faculties
  const [
    loadFaculties,
    { called: facultyCalled, loading: facultyLoading, data: facultyData }
  ] = useLazyQuery(FACULTIES)

  // States
  const [showSearchView, setShowSearchView] = useState(false)

  // on first load
  useEffect(() => {
    loadTeachers()
    loadFaculties()
  }, [])

  // Set states
  const _handleSearchViewClose = () => setShowSearchView(false)
  const _handleSearchViewShow = () => setShowSearchView(true)

  const _teacherDetail = event => {
    history.push('/teacher-detail', event)
  }

  const _teacherEdit = event => {
    history.push('/teacher-edit', event)
  }

  const _teacherAdd = () => {
    history.push('/teacher-add')
  }

  const _onSearch = value => {
    //console.log('value: ', value)
    // update view
    const facultyName = facultyData.faculties[parseInt(value.faculty) - 1]
      ? facultyData.faculties[parseInt(value.faculty) - 1].name
      : ''

    setselectedFaculty(facultyName)
    setselectedDepartment(value.department)

    let where = {}
    if (!_.isEmpty(value.userId)) {
      where = {
        userId_contains: value.userId
      }
    } else {
      // faculty search
      if (!_.isEmpty(facultyName)) {
        where['faculty'] = {
          name_contains: facultyName
        }
      }

      // department search
      if (!_.isEmpty(value.department)) {
        where['department'] = {
          name_contains: value.department
        }
      }
    }

    //console.log('where: ', where)

    // Close search view
    _handleSearchViewClose()

    loadTeachers({
      variables: { where: ((Object.keys(where)).length > 0) ? ({ AND: { ...where, role: 'TEACHER' } }) : { role: 'TEACHER' } }
    })

    // set title
    setTitle('ຜົນການຄົ້ນຫາ')
  }

  if (teacherLoading) return <p>ກໍາລັງໂຫຼດຂໍ້ມູນ...</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/teacher-list')}>
          ຈັດການອາຈານ
        </Breadcrumb.Item>
        <Breadcrumb.Item active>ອາຈານທັງຫມົດ</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text={title} />
        <div style={{ textAlign: 'right' }}>
          <CustomButton
            confirm
            addIcon
            title='ເພີ່ມອາຈານ'
            onClick={() => _teacherAdd()}
          />
        </div>

        {/* custom search button */}
        <SearchBar
          title='ຄະນະວິທະຍາສາດທໍາມະຊາດ,ພາກວິຊາວິທະຍາສາດຄອມພິວເຕີ,ປີຮຽນທີ່1'
          onClick={() => _handleSearchViewShow()}
        />

        {/* ວິຊາທັງຫມົດ */}
        <div
          style={{
            marginTop: 24,
            marginBottom: 8,
            fontSize: 16,
            color: Consts.FONT_COLOR_SECONDARY
          }}
        >
          ທັງຫມົດ {teacherData && teacherData.users.length} ທ່ານ
        </div>

        {/* Table list */}
        <div>
          <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
            <thead>
              <TableHeader>
                <th>ລຳດັບ</th>
                <th>ລະຫັດອາຈານ</th>
                <th>ຊື່</th>
                <th>ຄະນະ</th>
                <th>ພາກວິຊາ</th>
                <th>ເບີໂທ</th>
                <th style={{width: 180}}>ຈັດການ</th>
              </TableHeader>
            </thead>
            <tbody>
              {teacherData &&
                teacherData.users &&
                teacherData.users.map((x, index) => {
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
                        {x.userId}
                      </TableCell>
                      <TableCell>
                        {x.firstname} {x.lastname}
                      </TableCell>
                      <TableCell>
                        {x.faculty && x.faculty.name}
                      </TableCell>
                      <TableCell>
                        {x.department && x.department.name}
                      </TableCell>
                      <TableCell>
                        {x.phone}
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
                            onClick={() => _teacherEdit(x)}
                            style={{ cursor: 'pointer', backgroundColor:'#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'edit']}
                              color={Consts.BORDER_COLOR}
                            />{' '}
                          </div>
                          <div
                            onClick={() => _teacherDetail(x)}
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
                })}
            </tbody>
          </table>
        </div>
      </CustomContainer>

      {/* Search Modal */}
      <TeacherSearch
        facultyData={facultyData ? facultyData.faculties : []}
        showSearchView={showSearchView}
        _handleSearchViewClose={_handleSearchViewClose}
        onSearch={value => _onSearch(value)}
      />
    </div>
  )
}

export default TeacherList
