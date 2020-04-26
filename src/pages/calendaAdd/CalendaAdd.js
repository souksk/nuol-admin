import React, { useState, useCallback, useEffect } from 'react'
import './courseAdd.css'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import * as Yup from 'yup';
import { Formik } from 'formik';
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
  ButtonToolbar,
  ButtonGroup,
  ProgressBar
} from 'react-bootstrap'
import * as _ from 'lodash';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import axios from "axios"

// Custom
import Consts from '../../consts'
// import FACULTY from '../../consts/faculty'
import CalendaAddConfirm from './CalendaAddConfirm'
import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import { COURSES } from '../../apollo/course'
import { TEACHERS } from './../../apollo/user'

function CalendaAdd() {
  const { history, location, match } = useReactRouter()

  // States
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false)
  const [formParam, setFormParam] = useState({})

  // Set states
  const _handleShowAddConfirmModalClose = () => setShowAddConfirmModal(false)
  const _handleShowAddConfirmModalShow = () => setShowAddConfirmModal(true)

  const [
    loadTeachers,
    { called: teacherCalled, loading: teacherLoading, data: teacherData }
  ] = useLazyQuery(TEACHERS, {
    variables: { where: { role: 'TEACHER' } }
  })

  const courseApollo = useQuery(COURSES)
  const COURSE = courseApollo && courseApollo.data && courseApollo.data.courses

  var [days, setDays] = useState([])
  var [months, setMonths] = useState([])
  var [years, setYears] = useState([])

  useEffect(() => {
    // //console.log("update:", formParam)
  }, [formParam])

  useEffect(() => {
    loadTeachers()
    dataBirthday()
  }, [])

  const _cancel = () => {
    history.push("/calenda-list")
    window.location.reload(true)
  }

  const _add = async (param) => {
    setFormParam(param)
    _handleShowAddConfirmModalShow()
  }

  const calendaAddValidation = Yup.object().shape({
    course: Yup.string()
      .required('Required'),
    teacher: Yup.string()
      .required('Required'),
    calendaCode: Yup.string()
      .required('Required'),
  });

  const dataBirthday = () => {
    var day = []
    var month = []
    var year = []
    for (var i = 1; i <= 31; i++) {
      day.push(i)
    }
    for (var i = 1; i <= 12; i++) {
      month.push(i)
    }
    for (var i = parseInt(new Date().getFullYear()); i >= parseInt(new Date().getFullYear()) - 99; i--) {
      year.push(i)
    }
    setDays(day)
    setMonths(month)
    setYears(year)
  }

  if (teacherLoading) return <p>loading...</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/calenda-list')}>
          ຈັດການຕາຕະລາງຮຽນ
        </Breadcrumb.Item>
        <Breadcrumb.Item active>ເພີ່ມວິຊາ</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text='ເພີ່ມຕາຕະລາງຮຽນ' />

        <Formik
          initialValues={{
            course: '',
            calendaCode: '',
            yearLevel: '0',
            semester: '0',
            timeIndexX: 0,
            timeIndexY: 0,
            teacher: '',
            dayStart: 0,
            monthStart: 0,
            yearStart: 0,
            dayEnd: 0,
            monthEnd: 0,
            yearEnd: 0
          }}
          validationSchema={calendaAddValidation}
          onSubmit={(values, { setSubmitting }) => {

            //Set parameters for inserting to graphql
            let paramQL = {
              data: {
                course: {
                  connect: {
                    id: values.course,
                  }
                },
                calendaCoce: values.calendaCode,
                yearLevel: parseInt(values.yearLevel),
                semester: parseInt(values.semester),
              }
            }

            let startDate = ''
            if (values.dayStart && values.monthStart && values.yearStart) {
              startDate = values.yearStart + '-' + values.monthStart + '-' + values.dayStart
              paramQL = {
                data: {
                  ...paramQL.data, startDate
                }
              }
              delete values.dayStart
              delete values.monthStart
              delete values.yearStart
            } else {
              delete values.dayStart
              delete values.monthStart
              delete values.yearStart
            }

            let endDate = ''
            if (values.dayEnd && values.monthEnd && values.yearEnd) {
              endDate = values.yearEnd + '-' + values.monthEnd + '-' + values.dayEnd
              paramQL = {
                data: {
                  ...paramQL.data, endDate
                }
              }
              delete values.dayStart
              delete values.monthStart
              delete values.yearStart
            } else {
              delete values.dayEnd
              delete values.monthEnd
              delete values.yearEnd
            }

            // //Check if there is teacher 
            if (values.teacher) {
              paramQL = {
                data: {
                  ...paramQL.data,
                  teacher: {
                    connect: {
                      id: values.teacher,
                    }
                  },
                }
              }
            }
            if (values.yearLevel == 0) {
              delete paramQL.data.yearLevel
            }
            if (values.semester == 0) {
              delete paramQL.data.semester
            }

            // console.log("paramQL: ", paramQL)
            _add(paramQL)
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
              <div>
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
                      ວິຊາ ແລະ ອາຈານສອນ
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
                        ວິຊາ
                      </Form.Label>
                      <Col sm='8'>
                        {COURSE && <Form.Control as='select' name="course"
                          onChange={handleChange}
                          value={values.course}
                          isInvalid={!!errors.course}
                          required={true}
                        >
                          <option disabled={true} value="">---ກະລຸນາເລືອກວິຊາ---</option>
                          {COURSE.map((x, index) => <option key={index} value={x.id}>{x.title}</option>)}
                        </Form.Control>}
                      </Col>
                    </Form.Group>

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
                        ອາຈານ
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control as="select" name="teacher"
                          value={values.teacher}
                          onChange={handleChange}
                          isInvalid={!!errors.teacher}
                          required={true}>
                          <option value="">---ກະລຸນາເລືອກອາຈານ---</option>
                          {teacherData &&
                            teacherData.users.map((teacher, index) => (
                              <option key={index} value={teacher.id}>{(teacher.firstname) + ' ' + (teacher.lastname ? teacher.lastname : '')}</option>
                            ))}
                        </Form.Control>
                      </Col>
                    </Form.Group>

                  </div>

                  {/* ---------- ຂໍ້ມູນຕາຕະລາງ --------- */}
                  <div style={{ marginBottom: 10 }}>
                    <div>
                      <i
                        className='fa fa-caret-down'
                        aria-hidden='true'
                        style={{ marginRight: 5 }}
                      />
                      ຂໍ້ມູນຕາຕະລາງການສອນ
                    </div>

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
                        ລະຫັດຕາຕະລາງ
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ' name="calendaCode"
                          value={values.calendaCode}
                          onChange={handleChange}
                          isInvalid={!!errors.calendaCode} />
                      </Col>
                    </Form.Group>

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
                        ປີຮຽນ
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control as='select' name="yearLevel"
                          value={values.yearLevel}
                          onChange={handleChange}
                          isInvalid={!!errors.yearLevel}>
                          <option disabled={true} value="0">---ກະລຸນາເລືອກປີຮຽນ---</option>
                          <option value={'1'}>1</option>
                          <option value={'2'}>2</option>
                          <option value={'2'}>3</option>
                          <option value={'2'}>4</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>

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
                        ພາກຮຽນ
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control as='select' name="semester"
                          value={values.semester}
                          onChange={handleChange}
                          isInvalid={!!errors.semester}>
                          <option disabled={true} value="0">---ກະລຸນາເລືອກພາກຮຽນ---</option>
                          <option value={'1'}>1</option>
                          <option value={'2'}>2</option>
                        </Form.Control>
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
                      ວັນເລີ່ມ ແລະ ວັນສິ້ນສຸດການສອນ
                    </div>

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
                        ວັນເລີ່ມສອນ
                      </Form.Label>
                      <Col sm='8'>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                          <Form.Control as='select' name="dayStart"
                            value={values.dayStart}
                            onChange={handleChange}>
                            <option disabled={true} value={0}>ເລືອກວັນທີ</option>
                            {days.map((d, index) => (
                              <option value={parseInt(d)} key={index}>{d}</option>
                            ))
                            }
                          </Form.Control>
                          <Form.Control as='select' name="monthStart"
                            value={values.monthStart}
                            onChange={handleChange}>
                            <option disabled={true} value={0}>ເລືອກເດືອນ</option>
                            {months.map((m, index) => (
                              <option value={parseInt(m)} key={index}>{m}</option>
                            ))
                            }
                          </Form.Control>
                          <Form.Control as='select' name="yearStart"
                            value={values.yearStart}
                            onChange={handleChange}>
                            <option disabled={true} value={0}>ເລືອກປີ</option>
                            {years.map((y, index) => (
                              <option value={parseInt(y)} key={index}>{y}</option>
                            ))
                            }
                          </Form.Control>
                        </div>
                      </Col>
                    </Form.Group>

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
                        ວັນສິ້ນສຸດການສອນ
                      </Form.Label>
                      <Col sm='8'>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                          <Form.Control as='select' name="dayEnd"
                            value={values.dayEnd}
                            onChange={handleChange}>
                            <option disabled={true} value={0}>ເລືອກວັນທີ</option>
                            {days.map((d, index) => (
                              <option value={parseInt(d)} key={index}>{d}</option>
                            ))
                            }
                          </Form.Control>
                          <Form.Control as='select' name="monthEnd"
                            value={values.monthEnd}
                            onChange={handleChange}>
                            <option disabled={true} value={0}>ເລືອກເດືອນ</option>
                            {months.map((m, index) => (
                              <option value={parseInt(m)} key={index}>{m}</option>
                            ))
                            }
                          </Form.Control>
                          <Form.Control as='select' name="yearEnd"
                            value={values.yearEnd}
                            onChange={handleChange}>
                            <option disabled={true} value={0}>ເລືອກປີ</option>
                            {years.map((y, index) => (
                              <option value={parseInt(y)} key={index}>{y}</option>
                            ))
                            }
                          </Form.Control>
                        </div>
                      </Col>
                    </Form.Group>
                  </div>

                  {/* Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      textAlign: 'center',
                      justifyContent: 'center',
                      marginTop: 40,
                      marginBottom: 40
                    }}
                  >
                    <div style={{ marginRight: 80 }}>
                      <CustomButton title='ຍົກເລີກ' onClick={() => _cancel()} />
                    </div>

                    <CustomButton confirm title='ເພີ່ມວິຊາ' onClick={handleSubmit} />
                  </div>
                </div>

                {/* ------- AddConfirm Modal ------ */}
                <CalendaAddConfirm
                  showAddConfirmModal={showAddConfirmModal}
                  _handleShowAddConfirmModalClose={_handleShowAddConfirmModalClose}
                  param={formParam}
                />

              </div>

            )}
        </Formik>
      </CustomContainer>

    </div>
  )
}

export default CalendaAdd
