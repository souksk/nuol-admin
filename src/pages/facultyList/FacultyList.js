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
import FacultySearch from './FacultySearch'
import FacultyAdd from './FacultyAdd'
import FacultyEdit from './FacultyEdit'
import FacultyDelete from './FacultyDelete'
import FacultyDetail from './FacultyDetail'
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
import { FACULTIES } from '../../apollo/faculty'

function FacultyList() {
  // const [selectedFaculty, setselectedFaculty] = useState('')
  // const [selectedDepartment, setselectedDepartment] = useState('')
  const [title, setTitle] = useState('All Faculties')

  const { history, location, match } = useReactRouter()

  // Query faculties
  const [
    loadFaculties,
    { called: facultyCalled, loading: facultyLoading, data: facultyData }
  ] = useLazyQuery(FACULTIES, { variables: { orderBy: 'createdAt_DESC' } })

  // States
  const [showSearchView, setShowSearchView] = useState(false)
  const [showAddView, setShowAddView] = useState(false)
  const [showEditView, setShowEditView] = useState(false)
  const [dataForEdit, setDataForEdit] = useState(null)
  const [showDeleteView, setShowDeleteView] = useState(false)
  const [dataForDelete, setDataForDelete] = useState(null)
  const [showDetailView, setShowDetailView] = useState(false)
  const [dataForDetail, setDataForDetail] = useState(null)

  // on first load
  useEffect(() => {
    loadFaculties()
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

  const _handleDetailViewClose = () => setShowDetailView(false)
  const _handleDetailViewShow = () => setShowDetailView(true)

  const _facultyAdd = () => {
    _handleAddViewShow()
  }

  const _facultyEdit = (data) => {
    setDataForEdit(data)
    _handleEditViewShow()
  }

  const _facultyDelete = (data) => {
    setDataForDelete(data)
    _handleDeleteViewShow()
  }

  const _facultyDetail = (data) => {
    setDataForDetail(data)
    _handleDetailViewShow()
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

  // // set title
  // setTitle('ຜົນການຄົ້ນຫາ')
  // }

  if(facultyLoading) return <p>Loading...</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/faculty-list')}>
        Faculty Management
        </Breadcrumb.Item>
        <Breadcrumb.Item active>All faculties</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text={title} />
        <div style={{ textAlign: 'right' }}>
          <CustomButton
            confirm
            addIcon
            title='Add New'
            onClick={() => _facultyAdd()}
          />
        </div>

        {/* custom search button */}
        {/* <SearchBar
          title='ຄະນະວິທະຍາສາດທໍາມະຊາດ,...'
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
          All {facultyData && facultyData.faculties && facultyData.faculties.length} faculties
        </div>

        {/* Table list */}
        <div>
          <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
            <thead>
              <TableHeader>
                <th style={{ width: 60 }}>#</th>
                <th style={{ width: 300 }}>FACULTY NAME</th>
                <th style={{ width: 300 }}>DESCRIPTION</th>
                <th style={{ width: 300 }}>NOTE</th>
                <th style={{ width: 150 }}>ACTIONS</th>
              </TableHeader>
            </thead>
            <tbody>
              {facultyData &&
                facultyData.faculties &&
                facultyData.faculties.map((x, index) => {
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
                            onClick={() => _facultyEdit(x)}
                            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'edit']}
                              color={Consts.BORDER_COLOR}
                            />{' '}
                          </div>
                          {/* <div
                            onClick={() => _facultyDetail(x)}
                            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'eye']}
                              color={Consts.BORDER_COLOR}
                            />{' '}
                          </div> */}
                          <div
                            onClick={() => _facultyDelete(x)}
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
      {/* <FacultySearch
        facultyData={facultyData ? facultyData.faculties : []}
        showSearchView={showSearchView}
        _handleSearchViewClose={_handleSearchViewClose}
        onSearch={value => _onSearch(value)}
      /> */}

      <FacultyAdd
        showAddView={showAddView}
        _handleAddViewClose={_handleAddViewClose}
      />

      <FacultyEdit
        showEditView={showEditView}
        _handleEditViewClose={_handleEditViewClose}
        dataForEdit={dataForEdit}
      />

      <FacultyDelete
        showDeleteView={showDeleteView}
        _handleDeleteViewClose={_handleDeleteViewClose}
        dataForDelete={dataForDelete}
      />

      <FacultyDetail
        showDetailView={showDetailView}
        _handleDetailViewClose={_handleDetailViewClose}
        dataForDetail={dataForDetail}
      />

    </div>
  )
}

export default FacultyList
