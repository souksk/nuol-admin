import React, { useState, useCallback, useEffect } from 'react'
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

import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { CREATE_STUDYCALENDA } from '../../apollo/calenda'
import { COURSES } from '../../apollo/course'
import { TEACHERS } from './../../apollo/user'
import * as _ from 'lodash';

function CalendaAddConfirm({
  showAddConfirmModal,
  _handleShowAddConfirmModalClose,
  param,
}) {
  const { history, location, match } = useReactRouter()
  const [createStudyCalenda] = useMutation(CREATE_STUDYCALENDA);

  const [
    loadCourse,
    { called: courseCalled, loading: courseLoading, data: courseData }
  ] = useLazyQuery(COURSES)

  const [
    loadTeachers,
    { called: teacherCalled, loading: teacherLoading, data: teacherData }
  ] = useLazyQuery(TEACHERS, {
    variables: { where: { role: 'TEACHER' } }
  })

  useEffect(() => {
    loadCourse()
    loadTeachers()
  }, [])

  //Set State
  const [showToast, setShowToast] = useState(false);

  const _confirmCalendaAdd = () => {

    // console.log(param)
    const aaa = createStudyCalenda({ variables: param }).then(async () => {
      await history.push("/calenda-list")
      window.location.reload(true)
    }).catch((err) => {
      //console.log(err)
      _handleShowAddConfirmModalClose()
      setShowToast(true)
    });
    // //console.log(aaa)
  }
  const _convertCourse = (course) => {
    
    let courseName = ''
    for (var i = 0; i <= courseData.courses.length - 1; i++) {
      if (courseData.courses[i].id == course) {
        courseName = courseData.courses[i].title
      }
    }
    return courseName
  }

  const _convertTeacher = (teacher) => {
    
    let teacherName = ''
    for (var i = 0; i <= teacherData.users.length - 1; i++) {
      if (teacherData.users[i].id == teacher) {
        teacherName = teacherData.users[i].firstname + ' ' + teacherData.users[i].lastname
      }
    }
    return teacherName
  }

  return (
    <div>
      <Modal
        show={showAddConfirmModal}
        onHide={_handleShowAddConfirmModalClose}
        size='lg'
      >
        <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
          CONFIRM ADD NEW CALENDA
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
                  Course and Teacher
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
                    Course
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && _convertCourse(param.data.course.connect.id)}</span>
                  </Col>
                </Form.Group>

                {/* ລະຫັດອາຈານ */}
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
                  Teacher
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && param.data.teacher && _convertTeacher(param.data.teacher.connect.id)}</span>
                  </Col>
                </Form.Group>
              </div>

              {/* ---------- ປີຮຽນແລະພາກຮຽນ --------- */}
              <div style={{ marginBottom: 10 }}>
                <div>
                  <i
                    className='fa fa-caret-down'
                    aria-hidden='true'
                    style={{ marginRight: 5 }}
                  />
                  Study calenda
              </div>
                {/* ປີຮຽນ */}
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
                  calenda ID
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && param.data.calendaCoce}</span>
                  </Col>
                </Form.Group>

                {/* ປີຮຽນ */}
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
                  Year level
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && param.data.yearLevel}</span>
                  </Col>
                </Form.Group>

                {/* ພາກຮຽນ */}
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
                    Semester
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && param.data.semester}</span>
                  </Col>
                </Form.Group>
              </div>

              {/* ---------- ວັນເລີ່ມ ແລະ ວັນສິ້ນສຸດການສອນ --------- */}
              <div style={{ marginBottom: 10 }}>
                <div>
                  <i
                    className='fa fa-caret-down'
                    aria-hidden='true'
                    style={{ marginRight: 5 }}
                  />
                  Start date and End date
              </div>

                {/* ວັນເລີ່ມສອນ */}
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
                  Start date
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && param.data.startDate}</span>
                  </Col>
                </Form.Group>

                {/* ວັນສິ້ນສຸດການສອນ */}
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
                  End date
                </Form.Label>
                  <Col sm='8'>
                    <span>{param.data && param.data.endDate}</span>
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
                onClick={() => _confirmCalendaAdd()}
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

export default CalendaAddConfirm
