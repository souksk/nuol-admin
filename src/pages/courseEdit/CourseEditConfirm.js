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
import * as _ from 'lodash';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { UPDATE_COURSE } from '../../apollo/course'

function CourseEditConfirm({
  showEditConfirmModal,
  _handleShowEditConfirmModalClose,
  param,
  FACULTY
}) {
  const { history, location, match } = useReactRouter()
  const [updateCourse, { data }] = useMutation(UPDATE_COURSE);

  ////console.log(param)
  //Set State
  const [showToast, setShowToast] = useState(false);


  const _confirmCourseEdit = () => {
    if(param.data.unit == 0){
      delete param.data.unit
    }
    
    const aaa = updateCourse({ variables: param }).then((x) => {
      ////console.log("res: ", x)
      history.push("/course-list")
      window.location.reload(true)
    }).catch((err) => {
      ////console.log(err)
      _handleShowEditConfirmModalClose()
      setShowToast(true)
    });
    ////console.log(aaa)
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
        show={showEditConfirmModal}
        onHide={_handleShowEditConfirmModalClose}
        size='lg'
      >
        <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
          CONFIRM TO EDIT COURSE
      </Modal.Title>
        <Modal.Body
          style={{
            marginLeft: 50,
            marginRight: 5, color: Consts.SECONDARY_COLOR0,
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
                    style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
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
                  <Col sm='8' style={{marginTop:8}}>
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
                  <Col sm='8' style={{marginTop:8}}>
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
                    style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
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
                    Course name
                </Form.Label>
                  <Col sm='8' style={{marginTop:8}}>
                    <span>{param.data && param.data.title}</span>
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
                  <Col sm='8' style={{marginTop:8}}>
                    <span>{param.data && param.data.courseCode}</span>
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
                  <Col sm='8' style={{marginTop:8}}>
                    <span>{param.data && (param.data.unit != 0 ? param.data.unit : '')}</span>
                  </Col>
                </Form.Group>
              </div>

              {/* ---------- ຄໍາອະທິບາຍ --------- */}
              <div style={{ marginBottom: 10 }}>
                <div>
                  <i
                    className='fa fa-caret-down'
                    aria-hidden='true'
                    style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
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
                  <Col sm='8' style={{marginTop:8}}>
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
                    style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
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
                  <Col sm='8' style={{marginTop:8}}>
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
                onClick={_handleShowEditConfirmModalClose}
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  color: '#6f6f6f',
                  borderColor: Consts.SECONDARY_COLOR
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
                onClick={() => _confirmCourseEdit()}
              >
                Edit
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

export default CourseEditConfirm
