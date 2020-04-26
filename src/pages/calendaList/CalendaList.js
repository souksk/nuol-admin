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
// import CalendaSearch from './CalendaSearch'
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
import { STUDYCALENDAS } from '../../apollo/calenda'
import { FACULTIES } from '../../apollo/faculty'

function CalendaList() {
  const { history, location, match } = useReactRouter()
  const [loadStudyCalendas, apolloData] = useLazyQuery(STUDYCALENDAS)
  // const {data: courseData, loading: loadCourses, error: errorCourses} = useQuery(COURSES)
  // const { loading, error } = apolloData
  const studyCalendaData =
    apolloData.data && apolloData.data.studyCalendas ? apolloData.data.studyCalendas : []
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
  const [title, setTitle] = useState('ຕາຕະລາງຮຽນທັງຫມົດ')

  // on first load
  useEffect(() => {
    loadStudyCalendas()
    loadFaculties()
  }, [])

  // Set states
  const _handleSearchViewClose = () => setShowSearchView(false)
  const _handleSearchViewShow = () => setShowSearchView(true)

  const _studyCalendaDetail = data => {
    history.push('/calenda-detail', data)
  }

  const _studyCalendaEdit = data => {
    history.push('/calenda-edit', data)
  }

  const _studyCalendaAdd = () => {
    history.push('/calenda-add')
  }

  // const _onSearch = value => {
  //   // //console.log('value: ', value)
  //   // update view
  //   const facultyName = facultyData.faculties[parseInt(value.faculty) - 1]
  //     ? facultyData.faculties[parseInt(value.faculty) - 1].name
  //     : ''

  //   setselectedFaculty(facultyName)
  //   setselectedDepartment(value.department)
  //   setselectedYearLevel(value.yearLevel)

  //   let where = {}
  //   if (!_.isEmpty(value.courseCode)) {
  //     where = {
  //       courseCode_contains: value.courseCode
  //     }
  //   } else {
  //     // faculty search
  //     if (!_.isEmpty(facultyName)) {
  //       where['faculty'] = {
  //         name: facultyName
  //       }
  //     }

  //     // department search
  //     if (!_.isEmpty(value.department)) {
  //       where['department'] = {
  //         name: value.department
  //       }
  //     }

  //     // yearLevel search
  //     if (!_.isEmpty(value.yearLevel)) {
  //       where['yearLevel'] = parseInt(value.yearLevel)
  //     }
  //   }

  //   // //console.log('where: ', where)

  //   // Close search view
  //   _handleSearchViewClose()

  //   loadStudyCalendas({
  //     variables: { where: ((Object.keys(where)).length > 0) ? where : {} }
  //   })

  //   // set title
  //   setTitle('ຜົນການຄົ້ນຫາ')
  // }

  // if(loadCourses) return <p>Loading...</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => {
          history.push('/calenda-list')
          window.location.reload(true)
        }
        }>
          ຈັດການຕາຕະລາງຮຽນ
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
            title='ເພີ່ມຕາຕະລາງ'
            onClick={() => _studyCalendaAdd()}
          />
        </div>

        {/* custom search button */}
        {/* <SearchBar
          title='ຄະນະວິທະຍາສາດທໍາມະຊາດ,ພາກວິຊາວິທະຍາສາດຄອມພິວເຕີ,ປີຮຽນທີ່1'
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
          ທັງຫມົດ {studyCalendaData.length} ຕາຕະລາງ
        </div>

        {/* Table list */}
        <div>
          <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
            <thead>
              <TableHeader>
                <th style={{ width: 60 }}>ລຳດັບ</th>
                <th style={{ width: 100 }}>ລະຫັດຕາຕະລາງ</th>
                <th style={{ width: 250 }}>ຊື່ວິຊາ</th>
                <th style={{ width: 250 }}>ອາຈານ</th>
                <th style={{ width: 100 }}>ປິຮຽນ</th>
                <th style={{ width: 100 }}>ພາກຮຽນ</th>
                <th style={{ width: 100 }}>ວັນ</th>
                <th style={{ width: 100 }}>ຊົ່ວໂມງ</th>
                <th style={{ width: 180 }}>ຈັດການ</th>
              </TableHeader>
            </thead>
            <tbody>
              {studyCalendaData.length > 0 &&
                studyCalendaData.map((x, index) => {
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
                        {x.calendaCoce}
                      </TableCell>
                      <TableCell>
                        {x.course && x.course.title}
                      </TableCell>
                      <TableCell>
                        {x.teacher && x.teacher.firstname}{' '}
                        {x.teacher && x.teacher.lastname}
                      </TableCell>
                      <TableCell>
                        {x.yearLevel}
                      </TableCell>
                      <TableCell>
                        {x.semester}
                      </TableCell>
                      <TableCell>
                        {
                          x.dayTimeIndexes.length != 0 ?
                            (x.dayTimeIndexes.map((d, index) => (
                              <p key={index}>{d.dayString}</p>
                            ))) : ''
                        }
                      </TableCell>
                      <TableCell>
                        {
                          x.dayTimeIndexes.length != 0 ?
                            (x.dayTimeIndexes.map((t, index) => (
                              <p key={index}>{t.timeIndexes + ' '}</p>
                            ))) : ''
                        }
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
                            onClick={() => _studyCalendaEdit(x)}
                            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'edit']}
                              color={Consts.BORDER_COLOR}
                            />{' '}
                          </div>
                          <div
                            onClick={() => _studyCalendaDetail(x)}
                            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}
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
      {/* <CalendaSearch
        facultyData={facultyData ? facultyData.faculties : []}
        showSearchView={showSearchView}
        _handleSearchViewClose={_handleSearchViewClose}
        onSearch={value => _onSearch(value)}
      /> */}
    </div>
  )
}

export default CalendaList
