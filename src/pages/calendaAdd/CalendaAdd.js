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
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
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

  // const [startDate, setStartDate] = useState(new Date().toISOString());
  // const [endDate, setEndDate] = useState(new Date().toISOString());

  // States
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false)
  const [formParam, setFormParam] = useState({})

  const [sDate, setSDate] = useState(null);
  const [eDate, setEDate] = useState(null);

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

  // var [days, setDays] = useState([])
  // var [months, setMonths] = useState([])
  // var [years, setYears] = useState([])

  useEffect(() => {
    // //console.log("update:", formParam)
  }, [formParam])

  useEffect(() => {
    loadTeachers()
  }, [])

  const handleStartDateChange = (date) => {
    setSDate(date);
  };
  const handleEndDateChange = (date) => {
    setEDate(date);
  };

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

  if (teacherLoading) return <p>loading...</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/calenda-list')}>
          Study Calenda Management
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add New Study Calenda</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text='ADD NEW STUDY CALENDA' />

        <Formik
          initialValues={{
            course: '',
            calendaCode: '',
            yearLevel: '0',
            semester: '0',
            timeIndexX: 0,
            timeIndexY: 0,
            teacher: '',
          }}
          validationSchema={calendaAddValidation}
          onSubmit={(values, { setSubmitting }) => {

            //Set parameters for inserting to graphql
            let startDate
            let endDate
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
            if (sDate) {
              startDate = (new Date(sDate).getFullYear()) + '-' + (new Date(sDate).getMonth() + 1) + '-' + (new Date(sDate).getDate())
              paramQL = {
                data: {
                  ...paramQL.data, startDate
                }
              }
            }
            if (eDate) {
              endDate = (new Date(eDate).getFullYear()) + '-' + (new Date(eDate).getMonth() + 1) + '-' + (new Date(eDate).getDate())
              paramQL = {
                data: {
                  ...paramQL.data, endDate
                }
              }
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
                  <div style={{ marginBottom: 10, marginTop: 30 }}>
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
                        {COURSE && <Form.Control as='select' name="course"
                          onChange={handleChange}
                          value={values.course}
                          isInvalid={!!errors.course}
                          required={true}
                        >
                          <option disabled={true} value="">---Select course---</option>
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
                        Teacher
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control as="select" name="teacher"
                          value={values.teacher}
                          onChange={handleChange}
                          isInvalid={!!errors.teacher}
                          required={true}>
                          <option value="">---Select teacher---</option>
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
                      Study calenda
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
                        Calenda ID
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control type='text' placeholder='please input...' name="calendaCode"
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
                        Year level
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control as='select' name="yearLevel"
                          value={values.yearLevel}
                          onChange={handleChange}
                          isInvalid={!!errors.yearLevel}>
                          <option disabled={true} value="0">---Select year level---</option>
                          <option value={'1'}>1</option>
                          <option value={'2'}>2</option>
                          <option value={'3'}>3</option>
                          <option value={'4'}>4</option>
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
                        Semester
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control as='select' name="semester"
                          value={values.semester}
                          onChange={handleChange}
                          isInvalid={!!errors.semester}>
                          <option disabled={true} value="0">---Select semester---</option>
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
                      Start date and End date
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
                        Start date
                      </Form.Label>
                      <Col sm='3'>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <Grid style={{ marginTop: -15 }} container justify="space-around">
                            <KeyboardDatePicker
                              disableToolbar
                              variant="inline"
                              format="dd/MM/yyyy"
                              margin="normal"
                              id="sDate"
                              value={sDate}
                              onChange={handleStartDateChange}
                            />
                          </Grid>
                        </MuiPickersUtilsProvider>
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
                        End date
                      </Form.Label>
                      <Col sm='3'>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <Grid style={{ marginTop: -15 }} container justify="space-around">
                            <KeyboardDatePicker
                              disableToolbar
                              variant="inline"
                              format="dd/MM/yyyy"
                              margin="normal"
                              id="eDate"
                              value={eDate}
                              onChange={handleEndDateChange}
                            />
                          </Grid>
                        </MuiPickersUtilsProvider>
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
                      <CustomButton title='Cancel' onClick={() => _cancel()} />
                    </div>

                    <CustomButton confirm title='Add' onClick={handleSubmit} />
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
