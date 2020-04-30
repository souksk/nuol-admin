import React, { useState, useCallback } from 'react'
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
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Consts from '../../consts'
import CourseDeleteConfirm from './CourseDeleteConfirm'
import { CustomContainer, SearchBar, Title, CustomButton } from '../../common'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { COURSE } from '../../apollo/course'
import * as moment from "moment"
import 'moment/locale/lo';
moment.locale("lo");

function CourseDetail() {
  const { history, location, match } = useReactRouter()

  // //console.log("location: ", location)
  //init apollo
  const { data: apolloData, loading: apolloLoading, error: apolloError } = useQuery(COURSE, { variables: { where: { id: location.state.id } } })
  const courseData =
    apolloData && apolloData.course ? apolloData.course : {}

  // States
  const [showDeleteConfirmView, setShowDeleteConfirmView] = useState(false)

  // Set states
  const _handleDeleteConfirmViewClose = () => setShowDeleteConfirmView(false)
  const _handleDeleteConfirmViewShow = () => setShowDeleteConfirmView(true)

  const _viewDoc = (data) => {
    history.push('/course-doc-list', data)
  }

  const _edit = (data) => {
    history.push('/course-edit', data)
  }

  const _delete = () => {
    _handleDeleteConfirmViewShow()
  }

  if (apolloLoading) return <p>Loading...</p>
  // //console.log("apolloData: ", apolloData)
  // //console.log("courseData: ", courseData)

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/course-list')}>
          Course Management
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => history.push('/course-list')}>
          All Courses
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Course Detail</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Title text='COURSE DETAIL' />

          {/* Button group */}
          <div>
            {/* ເອກະສານບົດສອນ */}
            <button
              style={{
                backgroundColor: '#fff',
                color: Consts.FONT_COLOR_SECONDARY,
                width: 180,
                height: 40,
                border: '1px solid #ddd',
                outline: 'none',
                marginRight: 5
              }}
              onClick={() => _viewDoc(courseData)}
            >
              Documents
            </button>

            {/* ແກ້ໃຂ */}
            <button
              style={{
                backgroundColor: '#fff',
                color: Consts.BORDER_COLOR,
                width: 100,
                height: 40,
                border: '1px solid ' + Consts.BORDER_COLOR,
                outline: 'none',
                marginRight: 5
              }}
              onClick={() => _edit(courseData)}
            >
              <FontAwesomeIcon icon='edit' style={{ fontSize: 16 }} /> Edit
            </button>

            {/* ລຶບ */}
            <button
              style={{
                backgroundColor: '#fff',
                color: Consts.BORDER_COLOR_DELETE,
                width: 100,
                height: 40,
                border: '1px solid ' + Consts.BORDER_COLOR_DELETE,
                outline: 'none'
              }}
              onClick={() => _delete()}
            >
              <i className='fa fa-trash' /> Delete
            </button>
          </div>
        </div>

        <div
          style={{
            width: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 20,
            paddingBottom: 80
          }}
        >
          {/* ------ detail box ------ */}
          <div
            style={{
              border: '1px solid #ddd',
              width: 500,
              padding: 20,
              fontSize: 14,
              paddingLeft: 80
            }}
          >
            <Row>
              <Col>Course name</Col>
              <Col
                style={{ color: Consts.FONT_COLOR_PRIMARY, fontWeight: 'bold' }}
              >
                {courseData && courseData.title}
              </Col>
            </Row>
            <div style={{ height: 10 }} />
            <Row>
              <Col>Course ID</Col>
              <Col
                style={{ color: Consts.FONT_COLOR_PRIMARY, fontWeight: 'bold' }}
              >
                {courseData && courseData.courseCode}
              </Col>
            </Row>
            <div style={{ height: 10 }} />
            <Row>
              <Col>Unit</Col>
              <Col
                style={{ color: Consts.FONT_COLOR_PRIMARY, fontWeight: 'bold' }}
              >
                {courseData && courseData.unit}
              </Col>
            </Row>
          </div>

          {/* -------- ຄະນະແລະພາກວິຊາ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }} style={{ fontWeight: "bold" }} ><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Faculty and Department</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>Faculty</Col>
                <Col>{courseData && courseData.faculty && courseData.faculty.name}</Col>
              </Row>
              <Row>
                <Col>Department</Col>
                <Col>{courseData && courseData.department && courseData.department.name}</Col>
              </Row>
            </div>
          </div>

          {/* -------- ອັບໂຫລດ Syllabus -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }} ><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />File Syllabus Uploaded</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>File upload (PDF)</Col>
                <Col><a href={courseData && courseData.syllabusFile && courseData.syllabusFile.file}>{courseData && courseData.syllabusFile && courseData.syllabusFile.title}</a></Col>
              </Row>
            </div>
          </div>
        </div>

        {/* ------- Delete Modal ------ */}
        <CourseDeleteConfirm
          showDeleteConfirmView={showDeleteConfirmView}
          _handleDeleteConfirmViewClose={_handleDeleteConfirmViewClose}
          data={courseData}
        />

      </CustomContainer>
    </div>
  )
}

export default CourseDetail
