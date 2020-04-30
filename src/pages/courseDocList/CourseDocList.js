import React, { useState, useEffect } from 'react'
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
import CourseDocUpload from './CourseDocUpload'
import CourseDocEdit from './CourseDocEdit'
import CourseDocDeleteConfirm from './CourseDocDeleteConfirm'
import * as moment from "moment"
import 'moment/locale/lo';

import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common';

moment.locale("lo");


const CourseDocList = () => {
  const { history, location, match } = useReactRouter()

  // State
  const [courseDocUploadModal, setCourseDocUploadModal] = useState(false)
  const [courseDocEditModal, setCourseDocEditModal] = useState(false)
  const [courseDocDeleteConfirmModal, setCourseDocDeleteConfirmModal] = useState(false)
  const [courseData, setCourseData] = useState(null)
  const [dataDelete, setDataDelete] = useState({})
  const [dataEdit, setDataEdit] = useState({})

  // Set states
  const _handlCourseDocUploadModalClose = () => setCourseDocUploadModal(false)
  const _handlCourseDocUploadModalShow = () => setCourseDocUploadModal(true)
  const _handlCourseDocEditModalClose = () => setCourseDocEditModal(false)
  const _handlCourseDocEditModalShow = () => setCourseDocEditModal(true)
  const _handlCourseDocDeleteConfirmModalClose = () => setCourseDocDeleteConfirmModal(false)
  const _handlCourseDocDeleteConfirmModalShow = () => setCourseDocDeleteConfirmModal(true)

  

  if (!courseData) setCourseData(location.state)

  useEffect(() => {
    setCourseData(location.state)
    
  }, [])

  const _courseDetail = () => {
    history.push('/course-detail', location.state)
    // window.location.reload(true)
  }
  const _uploadFile = () => {
    _handlCourseDocUploadModalShow()
  }
  const _editFile = async (e, courseData, dataEdit) => {
    e.stopPropagation()
    await setDataEdit({
      courseData,
      dataEdit
    })
    _handlCourseDocEditModalShow()
  }
  const _removeFile = async (e, courseData, dataDelete) => {
    e.stopPropagation()
    await setDataDelete({
      courseData,
      dataDelete
    })
    _handlCourseDocDeleteConfirmModalShow()
  }
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='/course-list'>Course Management</Breadcrumb.Item>
        <Breadcrumb.Item href='/course-list'>All Course</Breadcrumb.Item>
        <Breadcrumb.Item active>Course's Documents</Breadcrumb.Item>
      </Breadcrumb>

      {/* Container */}
      <CustomContainer>
        {/* --------- Title and Button groups ----------- */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Title text="COURSE'S DOCUMENTS" />

          {/* Button group */}
          <div>
            {/* ລາຍລະອຽດວິຊາ */}
            <button
              style={{
                backgroundColor: '#fff',
                color: Consts.FONT_COLOR_SECONDARY,
                width: 160,
                height: 35,
                border: `1px solid ${Consts.PRIMARY_COLOR}`,
                outline: 'none',
                borderRadius: 0,
                marginRight: 20
              }}
              onClick={() => _courseDetail()}
            >
              Course Detail
            </button>

            {/* ອັບໂຫລດບົດສອນ */}
            <button
              style={{
                backgroundColor: Consts.SECONDARY_COLOR,
                color: '#fff',
                width: 160,
                height: 35,
                border: '1px solid #ddd',
                outline: 'none',
                borderRadius: 0
              }}
              onClick={() => _uploadFile()}
            >
              <FontAwesomeIcon icon='download' style={{ fontSize: 16 }} />{' '}
              Upload Document
            </button>
          </div>
        </div>

        {/* -------- ຂໍ້ມູນວິຊາ ----------- */}
        <div style={{ marginTop: 10 }}>
          <div>About Course</div>
          {/* ------ detail box ------ */}
          <div
            style={{
              border: '1px solid #ddd',
              width: '60%',
              padding: 20,
              fontSize: 14,
              marginRight: 'auto',
              marginLeft: 'auto',
              marginTop: -10,
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
        </div>

        {/* ------ ເອກະສານທີ່ຖືກອັບໂຫລດ -------- */}
        <div style={{ marginTop: 20, marginBottom: 10 }}>
          Course's documents
        </div>

        {/* ---------- table --------- */}
        <div>
          <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
            <thead>
              <TableHeader>
                <th style={{width:60}}>#</th>
                <th style={{width: 220}}>FILE TITLE</th>
                <th>FILE NAME</th>
                <th>UPDATED AT</th>
                <th style={{width: 180}}>ACTIONS</th>
              </TableHeader>
            </thead>
            <tbody>
              {courseData && courseData.files.map((x, index) => {
                return (
                  <tr
                    style={{
                      borderBottom: '2px solid #ffff',
                      textAlign: 'center'
                    }}
                    key={index}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{x.title}</TableCell>
                    <TableCell><a href={x.file}>{x.file}</a></TableCell>
                    <TableCell>{new Date(x.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-around'
                        }}
                      >
                        <div
                          onClick={(e) => _editFile(e, courseData, x)}
                          style={{ cursor: 'pointer', backgroundColor:'#FFFFFF', padding: 3, width: 64, borderRadius: 4}}
                        >
                          <FontAwesomeIcon
                            icon={['fas', 'edit']}
                            color={Consts.BORDER_COLOR}
                          />{' '}
                        </div>
                        <div
                          onClick={(e) => _removeFile(e, courseData, x)}
                          style={{ cursor: 'pointer', backgroundColor:'#FFFFFF', padding: 3, width: 64, borderRadius: 4}}
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

        {/* -------- Course doc upload modal ---------- */}
        {courseData && <CourseDocUpload
          courseDocUploadModal={courseDocUploadModal}
          _handlCourseDocUploadModalClose={_handlCourseDocUploadModalClose}
          courseData={courseData}
        />}

        {/* -------- Course doc edit modal ---------- */}
        <CourseDocEdit
          courseDocEditModal={courseDocEditModal}
          _handlCourseDocEditModalClose={_handlCourseDocEditModalClose}
          dataEdit = {dataEdit}
        />

        {/* -------- Course delete confirm modal ---------- */}
        <CourseDocDeleteConfirm
          courseDocDeleteConfirmModal={courseDocDeleteConfirmModal}
          _handlCourseDocDeleteConfirmModalClose={
            _handlCourseDocDeleteConfirmModalClose
          }
          dataDelete = {dataDelete}
        />
      </CustomContainer>
    </div>
  )
}

export default CourseDocList
