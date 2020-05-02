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

  const [selectTimeIndexesAdd, setSelectTimeIndexesAdd] = useState([])
  const [selectTimeIndexes, setSelectTimeIndexes] = useState([])
  const [scheduleDayInt, setScheduleDayInt] = useState(null)
  const [scheduleDayString, setScheduleDayString] = useState("")

  const [dayErr, setDayErr] = useState('')
  const [alreadyErr, setAlreadyErr] = useState('')

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

  const _timeIndexClick = (i) => {
    setDayErr('')
    if (!_.includes(selectTimeIndexes, i)) {
      let data = [...selectTimeIndexes, i];
      setSelectTimeIndexes(data)
    } else {
      let data = [...selectTimeIndexes];
      _.remove(data, (n) => n == i)
      setSelectTimeIndexes(data)
    }
  }
  const _renderDayInt = (dayString) => {
    if (dayString == "ຈັນ") return 0;
    else if (dayString == "ອັງຄານ") return 1;
    else if (dayString == "ພຸດ") return 2;
    else if (dayString == "ພະຫັດ") return 3;
    else if (dayString == "ສຸກ") return 4;
    else if (dayString == "ເສົາ") return 5;
    else if (dayString == "ອາທິດ") return 6;
  }
  const handleChangeDay = (e) => {
    setDayErr('')
    setScheduleDayString(e.target.value)
    setScheduleDayInt(_renderDayInt(e.target.value))
  }

  const _onAddTime = () => {
    if (scheduleDayString == "" || selectTimeIndexes.length <= 0) {
      setDayErr('ກະລຸນາເລືອກວັນ ແລະ ຊົ່ວໂມງ')
    } else {

      if (selectTimeIndexesAdd.length <= 0) {

        let arr = []
        arr.push(
          ...selectTimeIndexesAdd,
          {
            dayInt: scheduleDayInt,
            dayString: scheduleDayString,
            timeIndexes: { set: selectTimeIndexes }
          }
        )
        setSelectTimeIndexesAdd(arr)
        setScheduleDayString("")
        setSelectTimeIndexes([])
        setScheduleDayInt(null)
        setDayErr('')
        setAlreadyErr('')

      } else {

        let count = 0
        for (var i = 0; i < selectTimeIndexesAdd.length; i++) {
          if (selectTimeIndexesAdd[i].dayString == scheduleDayString) {
            for (var j = 0; j < selectTimeIndexesAdd[i].timeIndexes.set.length; j++) {
              for (var k = 0; k < selectTimeIndexes.length; k++) {
                if (selectTimeIndexesAdd[i].timeIndexes.set[j] == selectTimeIndexes[k]) {
                  count++
                }
              }
            }
          }
        }
        if (count > 0) {
          setAlreadyErr('ຊົ່ວໂມງນີ້ມີຢູ່ແລ້ວ')
        } else {
          let arr = []
          arr.push(
            ...selectTimeIndexesAdd,
            {
              dayInt: scheduleDayInt,
              dayString: scheduleDayString,
              timeIndexes: { set: selectTimeIndexes }
            }
          )
          setSelectTimeIndexesAdd(arr)
          setScheduleDayString("")
          setSelectTimeIndexes([])
          setScheduleDayInt(null)
          setDayErr('')
          setAlreadyErr('')
        }

      }
    }
  }

  const _onRemoveTime = (index) => {
    const temp = [...selectTimeIndexesAdd];
    temp.splice(index, 1);
    setSelectTimeIndexesAdd(temp)
  };

  const _timeCheck = (time, index) => {
    let check = false
    let count = 0
    for (var i = 0; i < time.length; i++) {
      if (time[i] == index) {
        count++
      }
    }
    if (count > 0) {
      check = true
    }
    return check
  }

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
      <style type="text/css">
        {`
          .btn-outline-flat {
            background-color: #fff;
            color: ${Consts.PRIMARY_COLOR};
            border: 1px solid ${Consts.PRIMARY_COLOR};
          }
          .btn-flat, .btn-flat-disabled, .btn-flat-disabled:hover, .btn-outline-flat:hover, .btn-flat:hover {
            background-color: ${Consts.PRIMARY_COLOR};
            color: white;
          }
          .btn-outline-flat-disabled, .btn-outline-flat-disabled:hover{
            background-color: #fff;
            color: ${Consts.PRIMARY_COLOR};
            border: 1px solid ${Consts.PRIMARY_COLOR};
          }
        `}
      </style>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/calenda-list')}>
          Schedule Management
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add New Schedule</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text='ADD NEW SCHEDULE' />

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

            if (selectTimeIndexesAdd.length > 0) {
              paramQL = {
                data: {
                  ...paramQL.data,
                  dayTimeIndexes: {
                    create: selectTimeIndexesAdd
                  },
                }
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
                      <Form.Label column sm='3' className='text-left'>
                        Course
                      </Form.Label>
                      <Col sm='9'>
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
                      <Form.Label column sm='3' className='text-left'>
                        Teacher
                      </Form.Label>
                      <Col sm='9'>
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
                      Schedule
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
                      <Form.Label column sm='3' className='text-left'>
                        Schedule ID
                      </Form.Label>
                      <Col sm='9'>
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
                      <Form.Label column sm='3' className='text-left'>
                        Year level
                      </Form.Label>
                      <Col sm='9'>
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
                      <Form.Label column sm='3' className='text-left'>
                        Semester
                      </Form.Label>
                      <Col sm='9'>
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
                      Schedule Times
                    </div>
                    <div>
                      <Form.Group
                        as={Row}
                        style={{
                          margin: 0,
                          marginBottom: 10,
                          paddingLeft: 20,
                          fontSize: 16
                        }}
                      >
                        <Form.Label column sm='3' className='text-left'>
                          Day and Times
                        </Form.Label>
                        <Col sm='9'>

                          {selectTimeIndexesAdd.length > 0 && selectTimeIndexesAdd.map((time, index) => (
                            <Form.Group
                              as={Row}
                              key={index}
                            >
                              <Col sm='3'>
                                <Form.Control as='select'
                                  // name="dayAdd"
                                  disabled={true}
                                  value={time.dayString}
                                // isInvalid={!!errors.day}
                                >
                                  <option disabled={true} value="">Select day</option>
                                  <option value="ຈັນ">Monday</option>
                                  <option value="ອັງຄານ">Tuesday</option>
                                  <option value="ພຸດ">Wednesday</option>
                                  <option value="ພະຫັດ">Thursday</option>
                                  <option value="ສຸກ">Friday</option>
                                  <option value="ເສົາ">Saturday</option>
                                  <option value="ວັນທິດ">Sunday</option>
                                </Form.Control>
                              </Col>
                              <Col sm='7'>
                                <ButtonGroup disabled={true} className="" style={{ width: "100% !important" }}>
                                  <Button disabled={true} variant={(_timeCheck(time.timeIndexes.set, 1) == true) ? "flat-disabled" : "outline-flat-disabled"}>ຊມ1</Button >
                                  <Button disabled={true} variant={(_timeCheck(time.timeIndexes.set, 2) == true) ? "flat-disabled" : "outline-flat-disabled"}>ຊມ2</Button >
                                  <Button disabled={true} variant={(_timeCheck(time.timeIndexes.set, 3) == true) ? "flat-disabled" : "outline-flat-disabled"}>ຊມ3</Button >
                                  <Button disabled={true} variant={(_timeCheck(time.timeIndexes.set, 4) == true) ? "flat-disabled" : "outline-flat-disabled"}>ຊມ4</Button >
                                  <Button disabled={true} variant={(_timeCheck(time.timeIndexes.set, 5) == true) ? "flat-disabled" : "outline-flat-disabled"}>ຊມ5</Button >
                                  <Button disabled={true} variant={(_timeCheck(time.timeIndexes.set, 6) == true) ? "flat-disabled" : "outline-flat-disabled"}>ຊມ6</Button >
                                  <Button disabled={true} variant={(_timeCheck(time.timeIndexes.set, 7) == true) ? "flat-disabled" : "outline-flat-disabled"}>ຊມ7</Button >
                                </ButtonGroup>
                              </Col>
                              <Col sm='2'>
                                <Button onClick={() => _onRemoveTime(index)} variant="outline-danger" style={{ borderRadius: 40 }}>
                                  <FontAwesomeIcon
                                    icon={['fas', 'trash']}
                                  />
                                </Button>
                              </Col>
                            </Form.Group>
                          ))}

                          <Form.Group
                            as={Row}
                          >
                            <Col sm='3'>
                              <Form.Control as='select'
                                name="scheduleDayString"
                                value={scheduleDayString}
                                onChange={(e) => handleChangeDay(e)}
                              // isInvalid={!!errors.day}
                              >
                                <option disabled={true} value="">Select day</option>
                                <option value="ຈັນ">Monday</option>
                                <option value="ອັງຄານ">Tuesday</option>
                                <option value="ພຸດ">Wednesday</option>
                                <option value="ພະຫັດ">Thursday</option>
                                <option value="ສຸກ">Friday</option>
                                <option value="ເສົາ">Saturday</option>
                                <option value="ວັນທິດ">Sunday</option>
                              </Form.Control>
                            </Col>
                            <Col sm='7'>
                              <ButtonGroup className="" style={{ width: "100% !important" }}>
                                <Button onClick={() => _timeIndexClick(1)} variant={_.includes(selectTimeIndexes, 1) ? "flat" : "outline-flat"}>ຊມ1</Button >
                                <Button onClick={() => _timeIndexClick(2)} variant={_.includes(selectTimeIndexes, 2) ? "flat" : "outline-flat"}>ຊມ2</Button >
                                <Button onClick={() => _timeIndexClick(3)} variant={_.includes(selectTimeIndexes, 3) ? "flat" : "outline-flat"}>ຊມ3</Button >
                                <Button onClick={() => _timeIndexClick(4)} variant={_.includes(selectTimeIndexes, 4) ? "flat" : "outline-flat"}>ຊມ4</Button >
                                <Button onClick={() => _timeIndexClick(5)} variant={_.includes(selectTimeIndexes, 5) ? "flat" : "outline-flat"}>ຊມ5</Button >
                                <Button onClick={() => _timeIndexClick(6)} variant={_.includes(selectTimeIndexes, 6) ? "flat" : "outline-flat"}>ຊມ6</Button >
                                <Button onClick={() => _timeIndexClick(7)} variant={_.includes(selectTimeIndexes, 7) ? "flat" : "outline-flat"}>ຊມ7</Button >
                              </ButtonGroup>
                            </Col>
                            <Col sm='2'>
                              <Button onClick={() => _onAddTime()} variant="success" style={{ borderRadius: 40 }}>
                                <FontAwesomeIcon
                                  icon={['fas', 'plus']}
                                />
                              </Button>
                            </Col>
                            {(dayErr) ? <Form.Label column style={{ color: 'red', fontSize: 12 }} sm='9' className='text-left'>
                              {dayErr}
                            </Form.Label> : ''}
                            {(alreadyErr) ? <Form.Label column style={{ color: 'red', fontSize: 12 }} sm='9' className='text-left'>
                              {alreadyErr}
                            </Form.Label> : ''}
                          </Form.Group>
                        </Col>
                      </Form.Group>
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
                      <Form.Label column sm='3' className='text-left'>
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
                      <Form.Label column sm='3' className='text-left'>
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
