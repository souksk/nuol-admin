import React, { useState, useCallback } from 'react'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import { useDropzone } from 'react-dropzone'
import {
  Breadcrumb,
  Modal,
  Button,
  Form,
  Row,
  Col,
  Table,
  InputGroup,
  FormControl,
  Toast
} from 'react-bootstrap'
import Consts from '../../consts'

import { useQuery, useMutation } from '@apollo/react-hooks';
import { CREATE_COURSE } from '../../apollo/course'
import * as _ from 'lodash';

function CourseAddConfirm({
  showAddConfirmModal,
  _handleShowAddConfirmModalClose,
  param,
  FACULTY
}) {
  const { history, location, match } = useReactRouter()
  const [createCourse, { data }] = useMutation(CREATE_COURSE);

  ////console.log(param)
  //Set State
  const [showToast, setShowToast] = useState(false);


  const _confirmCourseAdd = () => {
    if(param.data.unit == 0){
      delete param.data.unit
    }
    
    const aaa = createCourse({ variables: param }).then(async (x) => {
      await history.push("/course-list")
      window.location.reload(true)
    }).catch((err) => {
      //console.log(err)
      _handleShowAddConfirmModalClose()
      setShowToast(true)
    });
    // //console.log(aaa)
  }

  const _renderFaculty = (id) => {
    let faculty = _.find(FACULTY, function (o) { return o.id == id });
    return faculty.name
  }

  const _renderDepartment = (facultyId, departmentId) => {
    let facultyIndex = _.findIndex(FACULTY, function (o) { return o.id == facultyId });
    let departnemt = _.find(FACULTY[facultyIndex].departments, function (o) { return o.id == departmentId });
    return departnemt.name
  }

  return (
    <div>
      <Modal
        show={showAddConfirmModal}
        onHide={_handleShowAddConfirmModalClose}
        size='lg'
      >
        <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
          CONFIRM ADD NEW FILE
      </Modal.Title>
        <Modal.Body
          style={{
            marginLeft: 50,
            marginRight: 50,
            padding: 50,
            paddingTop: 0
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: 10,
              marginTop: 20
            }}
          >
            {/* Form container */}
            <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
              {/* ---------- ຄະນະແລະພາກວິຊາ --------- */}
              <div style={{ marginBottom: 10 }}>
                <div>
                  <i
                    className='fa fa-caret-down'
                    aria-hidden='true'
                    style={{ marginRight: 5 }}
                  />
                  Faculty and Department
              </div>
                {/* ຄະນະ */}
                <Form.Group
                  as={Row}
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    paddingLeft: 20,
                    fontSize: 16
                  }}
                >
                  <Form.Label column sm='4' className='text-left'>
                  Faculty
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && _renderFaculty(param.data.faculty.connect.id)}</span>
                  </Col>
                </Form.Group>

                {/* ພາກວິຊາ */}
                <Form.Group
                  as={Row}
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    paddingLeft: 20,
                    fontSize: 16
                  }}
                >
                  <Form.Label column sm='4' className='text-left'>
                  Department
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && _renderDepartment(param.data.faculty.connect.id, param.data.department.connect.id)}</span>
                  </Col>
                </Form.Group>
              </div>

              {/* ---------- ຂໍ້ມູນວິຊາ --------- */}
              <div style={{ marginBottom: 10 }}>
                <div>
                  <i
                    className='fa fa-caret-down'
                    aria-hidden='true'
                    style={{ marginRight: 5 }}
                  />
                  Course
              </div>
                {/* ຊື່ວິຊາ */}
                <Form.Group
                  as={Row}
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    paddingLeft: 20,
                    fontSize: 16
                  }}
                >
                  <Form.Label column sm='4' className='text-left'>
                    Course naem
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && (param.data.title ? param.data.title : '')}</span>
                  </Col>
                </Form.Group>

                {/* ລະຫັດວິຊາ */}
                <Form.Group
                  as={Row}
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    paddingLeft: 20,
                    fontSize: 16
                  }}
                >
                  <Form.Label column sm='4' className='text-left'>
                  Course ID
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && (param.data.courseCode ? param.data.courseCode : '')}</span>
                  </Col>
                </Form.Group>

                {/* ຈໍານວນຫນ່ວຍກິດ */}
                <Form.Group
                  as={Row}
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    paddingLeft: 20,
                    fontSize: 16
                  }}
                >
                  <Form.Label column sm='4' className='text-left'>
                    Unit
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && ((param.data.unit != 0) ? param.data.unit : '')}</span>
                  </Col>
                </Form.Group>
              </div>

              {/* ---------- ຄໍາອະທິບາຍ --------- */}
              <div style={{ marginBottom: 10 }}>
                <div>
                  <i
                    className='fa fa-caret-down'
                    aria-hidden='true'
                    style={{ marginRight: 5 }}
                  />
                  Description
              </div>
                {/* ເນື້ອໃນຂອງວິຊາ */}
                <Form.Group
                  as={Row}
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    paddingLeft: 20,
                    fontSize: 16
                  }}
                >
                  <Form.Label column sm='4' className='text-left'>
                  Description
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && param.data.description}</span>
                  </Col>
                </Form.Group>
              </div>

              {/* ---------- ອັບໂຫລດ --------- */}
              <div style={{ marginBottom: 10 }}>
                <div>
                  <i
                    className='fa fa-caret-down'
                    aria-hidden='true'
                    style={{ marginRight: 5 }}
                  />
                  File
              </div>
                {/* ອັບໂຫລດໄຟລ */}
                <Form.Group
                  as={Row}
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    paddingLeft: 20,
                    fontSize: 16
                  }}
                >
                  <Form.Label column sm='4' className='text-left'>
                    File upload
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && param.data.syllabusFile && param.data.syllabusFile.create.title}</span>
                  </Col>
                </Form.Group>
              </div>
            </div>
          </div>

          <div style={{ height: 20 }} />
          <div className='row'>
            <div style={{ padding: 15 }} className='col'>
              <Button
                onClick={_handleShowAddConfirmModalClose}
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  color: '#6f6f6f',
                  borderColor: '#6f6f6f'
                }}
              >
                Cancel
            </Button>
            </div>
            <div style={{ padding: 15 }} className='col'>
              <Button
                style={{
                  width: '100%',
                  backgroundColor: Consts.SECONDARY_COLOR,
                  color: '#fff',
                  borderColor: Consts.SECONDARY_COLOR
                }}
                onClick={() => _confirmCourseAdd()}
              >
                Add
            </Button>
            </div>
          </div>
        </Modal.Body>

      </Modal>

      <div
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 9999
        }}
      >
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide >
          <Toast.Header style={{ backgroundColor: "#c0392b" }}>
            <strong className="mr-auto" style={{ color: "#fff" }}>ມີຂໍ້ຜິດພາດ</strong>
          </Toast.Header>
          <Toast.Body>ທ່ານຕື່ມຂໍ້ມູນບໍ່ຖືກຕ້ອງຕາມທີ່ລະບົບກໍານົດ</Toast.Body>
        </Toast>
      </div>
    </div>

  )
}

export default CourseAddConfirm
