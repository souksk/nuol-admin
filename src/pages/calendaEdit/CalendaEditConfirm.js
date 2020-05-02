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
import { UPDATE_STUDYCALENDA, STUDYCALENDA } from '../../apollo/calenda'
import { COURSES } from '../../apollo/course'
import { TEACHERS } from './../../apollo/user'
import * as _ from 'lodash';

function CalendaEditConfirm({
  showEditConfirmModal,
  _handleShowEditConfirmModalClose,
  param,
  oldData
}) {
  const { history, location, match } = useReactRouter()

  const [updateStudyCalenda] = useMutation(UPDATE_STUDYCALENDA);

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

  const _confirmCalendaEdit = async () => {

    if (oldData && oldData.dayTimeIndexes && oldData.dayTimeIndexes.length > 0) {
      let arrDayString = []
      for (var i = 0; i < oldData.dayTimeIndexes.length; i++) {
        arrDayString.push(oldData.dayTimeIndexes[i].dayString)
      }
      await updateStudyCalenda(
        {
          variables: {
            data: {
              dayTimeIndexes: {
                deleteMany: {
                  dayString_in: arrDayString
                }
              }
            },
            where: param.where
          }
        }
      )
    }

    const aaa = updateStudyCalenda({ variables: param }).then(async () => {
      await history.push("/calenda-list")
      window.location.reload(true)
    }).catch((err) => {
      //console.log(err)
      _handleShowEditConfirmModalClose()
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

  const _convertDay = (day) => {
    let result = ''
    switch (day) {
      case 'ຈັນ':
        result = 'Monday';
        break;
      case 'ອັງຄານ':
        result = 'Tuesday';
        break;
      case 'ພຸດ':
        result = 'Wednesday';
        break;
      case 'ພະຫັດ':
        result = 'Thursday';
        break;
      case 'ສຸກ':
        result = 'Friday';
        break;
      case 'ເສົາ':
        result = 'Saturday';
        break;
      case 'ອາທິດ':
        result = 'Sunday';
        break;
      default:
        result = 'Monday';
        break;
    }
    return result;
  }

  return (
    <div>
      <Modal
        show={showEditConfirmModal}
        onHide={_handleShowEditConfirmModalClose}
        size='lg'
      >
        <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
          CONFIRM EDIT SCHEDULE
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
                  Schedule
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
                    Calenda ID
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
                  Schedule Times
              </div>

                {/* ວັນ */}
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
                    Day and Times
                </Form.Label>
                  <Col sm='8' style={{ marginTop: 8 }}>
                    {
                      param.data &&
                      param.data.dayTimeIndexes &&
                      param.data.dayTimeIndexes.create.map((t, index) => (
                        <p key={index}><span>{_convertDay(t.dayString)}</span> : <span>{t.timeIndexes.set.map((x, i) => ((x) + (t.timeIndexes.set.length == (i + 1) ? '' : ' - ')))}</span></p>
                      ))
                    }
                  </Col>
                </Form.Group>

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
                onClick={_handleShowEditConfirmModalClose}
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
                onClick={() => _confirmCalendaEdit()}
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

export default CalendaEditConfirm
