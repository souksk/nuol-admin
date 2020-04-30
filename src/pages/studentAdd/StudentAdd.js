import React, { useState, useCallback, useEffect } from 'react'
import './studentAdd.css'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import * as yup from 'yup'
import { Formik } from 'formik'
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
  FormControl
} from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as _ from 'lodash';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Consts from '../../consts'
import StudentAddConfirm from './StudentAddConfirm'
import { CustomContainer, Title, CustomButton } from '../../common'
import { FACULTIES } from '../../apollo/faculty'

function StudentAdd() {
  const { history, location, match } = useReactRouter()

  // States
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false)
  const [formParam, setFormParam] = useState({})
  const [selectFacaltyIndex, setSelectFacaltyIndex] = useState(-1)
  const [selectFacalty, setSelectFacalty] = useState('')
  const [selectDepartment, setSelectDepartment] = useState('')

  const [sDate, setSDate] = useState(null);

  const facultyApollo = useQuery(FACULTIES)
  const FACULTY = facultyApollo && facultyApollo.data && facultyApollo.data.faculties

  // Set states
  const _handleShowAddConfirmModalClose = () => setShowAddConfirmModal(false)
  const _handleShowAddConfirmModalShow = () => setShowAddConfirmModal(true)

  const handleStartDateChange = (date) => {
    setSDate(date);
  };

  const _cancel = () => {
    history.push("/student-list")
    window.location.reload(true)
  }

  const _add = () => {
    _handleShowAddConfirmModalShow()
  }

  const _selectFacalty = (e) => {
    setSelectDepartment('')
    const facaltyIndex = _.findIndex(FACULTY, { 'name': e.target.value });
    setSelectFacaltyIndex(facaltyIndex)
    setSelectFacalty(e.target.value)
  }

  const _selectDepartment = (e) => {
    if (e) {
      setSelectDepartment(e.target.value)
    } else {
      setSelectDepartment(FACULTY[selectFacaltyIndex].departments[0].name)
    }
  }

  const _renderDepartmentId = (name) => {
    let id = FACULTY[selectFacaltyIndex].departments[0].id
    for (var i = 0; i < FACULTY[selectFacaltyIndex].departments.length; i++) {
      if (name == FACULTY[selectFacaltyIndex].departments[i].name) {
        id = FACULTY[selectFacaltyIndex].departments[i].id
        i = FACULTY[selectFacaltyIndex].departments.length
      }
    }
    // let departnemt  = _.find(FACULTY[selectFacaltyIndex].departments, function(o) { return o.name == name });
    return id
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => {
          history.push('/student-list')
          window.location.reload(true)
        }}>
          Student Management
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add Student</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text='ADD STUDENT' />
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            department: (selectDepartment) ? selectDepartment : '',
            phone: '',
            email: '',
            description: '',
            role: 'STUDENT',
            userId: '',
            password: '',
            note: '',
            yearLevel: '',
            facalty: '',
            gender: 'MALE',
            maritualStatus: 'SINGLE'
          }}
          validate={values => {
            const errors = {};
            if (!values.firstname) {
              errors.firstname = 'ກະລຸນາຕື່ມຊື່';
            }
            if (!values.userId) {
              errors.userId = 'ກະລຸນາຕື່ມໄອດີ';
            }
            if (!values.password) {
              errors.password = 'ກະລຸນາຕື່ມລະຫັດຜ່ານ';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            let birthday
            if (sDate) {
              birthday = (new Date(sDate).getFullYear()) + '-' + (new Date(sDate).getMonth() + 1) + '-' + (new Date(sDate).getDate())
              values = {
                ...values, birthday
              }
            }
            if (values.yearLevel) {
              values.yearLevel = parseInt(values.yearLevel)
            } else {
              delete values.yearLevel
            }
            if (!values.email) {
              delete values.email
            }
            if (!values.phone) {
              delete values.phone
            }
            if (values.facalty) {
              let facultyData = {
                connect: {
                  id: FACULTY[selectFacaltyIndex].id,
                }
              }
              values = {
                ...values, faculty: facultyData
              }
              delete values.facalty
            } else {
              delete values.facalty
            }
            if (values.department && selectDepartment) {
              let departmentData = {
                connect: {
                  id: _renderDepartmentId(values.department),
                }
              }
              values = {
                ...values, department: departmentData
              }
            } else {
              delete values.department
            }
            let data = {
              ...values
            }
            let paramQL = {
              data
            }
            //console.log("paramQL: ", paramQL)
            setFormParam(paramQL)
            _add()
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
            /* and other goodies */
          }) =>
            <div>
              {/* Form container */}
              <div
                style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}
              >
                {/* ---------- ຄະນະແລະພາກວິຊາ --------- */}
                <div style={{ marginBottom: 10 }}>
                  <div>
                    <i
                      className='fa fa-caret-down'
                      aria-hidden='true'
                      style={{ marginRight: 5, color: Consts.SECONDARY_COLOR, color: Consts.SECONDARY_COLOR }}
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
                      {FACULTY && <Form.Control as='select'
                        onChange={(e) => {
                          _selectFacalty(e)
                          handleChange(e)
                        }}
                        name="facalty"
                        value={values.facalty}>
                        <option disabled={true} value="">---Select faculty---</option>
                        {FACULTY.map((x, index) => <option key={"faculty" + index} value={x.name}>{x.name}</option>)}
                      </Form.Control>}
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
                      <Form.Control as='select' name="department"
                        value={!selectDepartment ? selectDepartment : values.department}
                        onChange={(e) => {
                          handleChange(e)
                          _selectDepartment(e)
                        }}>
                        <option disabled={true} value="">---Select department---</option>
                        {selectFacaltyIndex > -1 && FACULTY[selectFacaltyIndex].departments.map((x, index) => <option key={"department" + index}>{x.name}</option>)}
                      </Form.Control>
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
                      <Form.Control as='select' name="yearLevel" value={values.yearLevel} onChange={handleChange} >
                        <option disabled={true} value="">---Select year level---</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </div>

                {/* ---------- ຂໍ້ມູນນັກຮຽນ --------- */}
                <div style={{ marginBottom: 10 }}>
                  <div>
                    <i
                      className='fa fa-caret-down'
                      aria-hidden='true'
                      style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
                    />
                    Student
                  </div>
                  {/* ຊື່ */}
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
                      First name
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        type='text'
                        placeholder='please input...'
                        name='firstname'
                        value={values.firstname}
                        onChange={handleChange}
                        isInvalid={!!errors.firstname}
                      />
                    </Col>
                  </Form.Group>

                  {/* ນາມສະກຸນ */}
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
                      Last name
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        type='text'
                        placeholder='please input...'
                        name='lastname'
                        value={values.lastname}
                        onChange={handleChange}
                      />
                    </Col>
                  </Form.Group>

                  {/* ວັນເດືອນປີເກີດ */}
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
                      Birthday</Form.Label>
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

                  {/* ເພດ */}
                  <Form.Group
                    as={Row}
                    style={{
                      margin: 0,
                      marginBottom: 10,
                      paddingLeft: 20,
                      fontSize: 16
                    }}
                    name="gender"
                    onChange={handleChange}
                  >
                    <Form.Label column sm='4' className='text-left'>
                      Gender
                      </Form.Label>
                    <Col sm='8'>
                      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        <Col sm={4}>
                          <input
                            id="male"
                            value="MALE"
                            name="gender"
                            checked={values.gender == 'MALE' ? true : false}
                            type="radio"
                          />{'\t'}
                          <label htmlFor="male">Male</label>
                        </Col>
                        <Col sm={4}>
                          <input
                            id="female"
                            value="FEMALE"
                            name="gender"
                            checked={values.gender == 'FEMALE' ? true : false}
                            type="radio"
                          />{'\t'}
                          <label htmlFor="female">Famale</label>
                        </Col>
                      </div>
                    </Col>
                  </Form.Group>

                  {/* ສະຖານະ */}
                  <Form.Group
                    as={Row}
                    style={{
                      margin: 0,
                      marginBottom: 10,
                      paddingLeft: 20,
                      fontSize: 16
                    }}
                    name="maritualStatus"
                    onChange={handleChange}
                  >
                    <Form.Label column sm='4' className='text-left'>
                      Status
                      </Form.Label>
                    <Col sm='8'>
                      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        <Col sm={4}>
                          <input
                            id="single"
                            value="SINGLE"
                            name="maritualStatus"
                            checked={values.maritualStatus == 'SINGLE' ? true : false}
                            type="radio"
                          />{'\t'}
                          <label htmlFor="single">Single</label>
                        </Col>
                        <Col sm={4}>
                          <input
                            id="marriage"
                            value="MARRIAGE"
                            name="maritualStatus"
                            checked={values.maritualStatus == 'MARRIAGE' ? true : false}
                            type="radio"
                          />{'\t'}
                          <label htmlFor="marriage">Marriage</label>
                        </Col>
                      </div>
                    </Col>
                  </Form.Group>

                  {/* ເບີໂທ */}
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
                      Phone number
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        type='text'
                        placeholder='please input...'
                        name='phone'
                        value={values.phone}
                        onChange={handleChange}
                      />
                    </Col>
                  </Form.Group>

                  {/* ອີເມວ */}
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
                      E-Mail
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        type='text'
                        placeholder='please input...'
                        name='email'
                        value={values.email}
                        onChange={handleChange}
                      />
                    </Col>
                  </Form.Group>
                </div>

                {/* ---------- ໄອດີແລະລະຫັດຜ່ານ --------- */}
                <div style={{ marginBottom: 10 }}>
                  <div>
                    <i
                      className='fa fa-caret-down'
                      aria-hidden='true'
                      style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
                    />
                    User ID and Password
                  </div>
                  {/* ໄອດີ */}
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
                      User ID
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        type='text'
                        placeholder='please input...'
                        name='userId'
                        value={values.userId}
                        onChange={handleChange}
                        isInvalid={!!errors.userId}
                      />
                    </Col>
                  </Form.Group>
                  {/* ລະຫັດຜ່ານ */}
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
                      Password
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        type='text'
                        placeholder='please input...'
                        name='password'
                        value={values.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                      />
                    </Col>
                  </Form.Group>
                </div>

                {/* ---------- ອື່ນໆ --------- */}
                <div style={{ marginBottom: 10 }}>
                  <div>
                    <i
                      className='fa fa-caret-down'
                      aria-hidden='true'
                      style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
                    />
                    Other
                  </div>
                  {/* ລາຍລະອຽດ */}
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
                      Decription
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        as='textarea'
                        rows='3'
                        name='description'
                        placeholder='please input...'
                        value={values.description}
                        onChange={handleChange}
                        isInvalid={!!errors.description}
                      />
                    </Col>
                  </Form.Group>

                  {/* ໝາຍເຫດ */}
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
                      Note
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        as='textarea'
                        rows='3'
                        name='note'
                        placeholder='please input...'
                        value={values.note}
                        onChange={handleChange}
                        isInvalid={!!errors.note}
                      />
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

                  <CustomButton
                    confirm
                    title='Add'
                    onClick={handleSubmit}
                  />
                </div>
              </div>

              {/* ------- AddConfirm Modal ------ */}
              <StudentAddConfirm
                showAddConfirmModal={showAddConfirmModal}
                _handleShowAddConfirmModalClose={
                  _handleShowAddConfirmModalClose
                }
                param={formParam}
                facalty={selectFacalty}
                department={selectDepartment}
              />
            </div>}
        </Formik>
      </CustomContainer>
    </div>
  )
}

export default StudentAdd
