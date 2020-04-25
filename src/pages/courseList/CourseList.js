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
import CourseSearch from './CourseSearch'
import Consts from '../../consts'
import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import * as _ from 'lodash'
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks'
import { COURSES } from '../../apollo/course'
import { FACULTIES } from '../../apollo/faculty'

function CourseList() {
  const { history, location, match } = useReactRouter()
  const [loadCourses, apolloData] = useLazyQuery(COURSES)
  // const {data: courseData, loading: loadCourses, error: errorCourses} = useQuery(COURSES)
  // const { loading, error } = apolloData
  const courseData =
    apolloData.data && apolloData.data.courses ? apolloData.data.courses : []
  // const [courseData, setCourseData] = useState({})

  // Query faculties
  const [
    loadFaculties,
    { called: facultyCalled, loading: facultyLoading, data: facultyData }
  ] = useLazyQuery(FACULTIES)

  // States
  const [showSearchView, setShowSearchView] = useState(false)
  const [selectedFaculty, setselectedFaculty] = useState('')
  const [selectedDepartment, setselectedDepartment] = useState('')
  const [selectedYearLevel, setselectedYearLevel] = useState(null)
  const [title, setTitle] = useState('ວິຊາທັງຫມົດ')

  // on first load
  useEffect(() => {
    loadCourses()
    loadFaculties()
  }, [])

  // Set states
  const _handleSearchViewClose = () => setShowSearchView(false)
  const _handleSearchViewShow = () => setShowSearchView(true)

  const _courseDetail = data => {
    history.push('/course-detail', data)
  }

  const _courseEdit = data => {
    history.push('/course-edit', data)
  }

  const _courseAdd = () => {
    history.push('/course-add')
  }

  const _onSearch = value => {
    // //console.log('value: ', value)
    // update view
    const facultyName = facultyData.faculties[parseInt(value.faculty) - 1]
      ? facultyData.faculties[parseInt(value.faculty) - 1].name
      : ''

    setselectedFaculty(facultyName)
    setselectedDepartment(value.department)
    setselectedYearLevel(value.yearLevel)

    let where = {}
    if (!_.isEmpty(value.courseCode)) {
      where = {
        courseCode_contains: value.courseCode
      }
    } else {
      // faculty search
      if (!_.isEmpty(facultyName)) {
        where['faculty'] = {
          name: facultyName
        }
      }

      // department search
      if (!_.isEmpty(value.department)) {
        where['department'] = {
          name: value.department
        }
      }

      // yearLevel search
      if (!_.isEmpty(value.yearLevel)) {
        where['yearLevel'] = parseInt(value.yearLevel)
      }
    }

    // //console.log('where: ', where)

    // Close search view
    _handleSearchViewClose()

    loadCourses({
      variables: { where: ((Object.keys(where)).length > 0) ? where : {} }
    })

    // set title
    setTitle('ຜົນການຄົ້ນຫາ')
  }

  // if(loadCourses) return <p>Loading...</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => {
            history.push('/course-list')
            window.location.reload(true)
          }
        }>
          ຈັດການວິຊາ
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {title}
        </Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text={title} />
        <div style={{ textAlign: 'right' }}>
          <CustomButton
            confirm
            addIcon
            title='ເພີ່ມວິຊາ'
            onClick={() => _courseAdd()}
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
          ທັງຫມົດ {courseData.length} ວິຊາ
        </div>

        {/* Table list */}
        <div>
          <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
            <thead>
              <TableHeader>
                <th>ລຳດັບ</th>
                <th>ລະຫັດວິຊາ</th>
                <th>ຊື່ວິຊາ</th>
                <th>ພາກຮຽນ</th>
                <th>ວັນ</th>
                <th>ຊົ່ວໂມງ</th>
                <th>ອາຈານ</th>
                <th style={{width: 180}}>ຈັດການ</th>
              </TableHeader>
            </thead>
            <tbody>
              {courseData.length > 0 &&
                courseData.map((x, index) => {
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
                        {x.courseCode}
                      </TableCell>
                      <TableCell>
                        {x.title}
                      </TableCell>
                      <TableCell>
                        {x.semester}
                      </TableCell>
                      <TableCell>
                        {
                          x.dayTimeIndexes.length != 0 ? x.dayTimeIndexes[x.dayTimeIndexes.length - 1].dayString : ''
                        }
                      </TableCell>
                      <TableCell>
                        {x.dayTimeIndexes.length != 0 ? <div
                          className='row'
                          style={{
                            padding: 15,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center'
                          }}
                        >
                          {x.dayTimeIndexes[
                            x.dayTimeIndexes.length - 1
                          ].timeIndexes.map((y, index) =>
                            <p key={'timeIndex' + index} style={{ margin: 0 }}>
                              {y + 1}
                              {x.dayTimeIndexes[x.dayTimeIndexes.length - 1]
                                .timeIndexes.length !=
                                index + 1
                                ? '-'
                                : ''}
                            </p>
                          )}
                        </div> : ''}
                      </TableCell>
                      <TableCell>
                        {x.teacher && x.teacher.firstname}{' '}
                        {x.teacher && x.teacher.lastname}
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
                            onClick={() => _courseEdit(x)}
                            style={{ cursor: 'pointer', backgroundColor:'#FFFFFF', padding: 3, width: 64, borderRadius: 4}}
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'edit']}
                              color={Consts.BORDER_COLOR}
                            />{' '}
                          </div>
                          <div
                            onClick={() => _courseDetail(x)}
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
      <CourseSearch
        facultyData={facultyData ? facultyData.faculties : []}
        showSearchView={showSearchView}
        _handleSearchViewClose={_handleSearchViewClose}
        onSearch={value => _onSearch(value)}
      />
    </div>
  )
}

export default CourseList
