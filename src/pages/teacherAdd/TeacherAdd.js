import React, { useState, useCallback, useEffect } from 'react'
import './teacherAdd.css'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import * as Yup from 'yup';
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
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Consts from '../../consts'
import TeacherAddConfirm from './TeacherAddConfirm'
import { CustomContainer, Title, CustomButton } from '../../common'

import { useQuery, useMutation } from '@apollo/react-hooks'
import * as _ from 'lodash'
import { FACULTIES } from '../../apollo/faculty'
import { Slot } from '@wry/context'

function TeacherAdd() {
  const { history, location, match } = useReactRouter()

  // States
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false)
  const [formParam, setFormParam] = useState({})
  const [selectFacaltyIndex, setSelectFacaltyIndex] = useState(-1)
  const [selectFacaltyName, setSelectFacaltyName] = useState('')
  const [selectDepartmentName, setSelectDepartmentName] = useState('')

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
    history.push('/teacher-list')
  }

  const _add = () => {
    _handleShowAddConfirmModalShow()
  }

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const _selectFacalty = e => {
    const facaltyIndex = _.findIndex(FACULTY, { name: e.target.value })
    setSelectFacaltyIndex(facaltyIndex)
    setSelectFacaltyName(FACULTY[facaltyIndex].name)
  }

  const _renderDepartmentId = name => {
    let departnemt = _.find(FACULTY[selectFacaltyIndex].departments, function (
      o
    ) {
      return o.name == name
    })
    return departnemt.id
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/teacher-list')}>
          Teacher Management
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add Teacher</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text='ADD TEACHER' />
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            department: '',
            phone: '',
            email: '',
            description: '',
            role: 'TEACHER',
            userId: '',
            password: '',
            note: '',
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
            // set department name
            setSelectDepartmentName(values.department)
            let birthday
            if (sDate) {
              birthday = (new Date(sDate).getFullYear()) + '-' + (new Date(sDate).getMonth() + 1) + '-' + (new Date(sDate).getDate())
              values = {
                ...values, birthday
              }
            }
            if (values.facalty) {
              let facultyData = {
                connect: {
                  id: FACULTY[selectFacaltyIndex].id
                }
              }
              values = {
                ...values, faculty: facultyData
              }
              delete values.facalty
            } else {
              delete values.facalty
            }
            if (values.department) {
              let departmentData = {
                connect: {
                  id: _renderDepartmentId(values.department)
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
            // console.log("paramQL: ", paramQL)
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
              <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
                <Form noValidate>
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
                      <Col sm='8'>
                        {FACULTY &&
                          <Form.Control
                            as='select'
                            onChange={(e) => {
                              handleChange(e)
                              _selectFacalty(e)
                            }}
                            name='facalty'
                            value={values.facalty}
                          >
                            <option disabled={true} value="">---Select faculty---</option>
                            {FACULTY.map((x, index) =>
                              <option key={'faculty' + index} value={x.name}>
                                {x.name}
                              </option>
                            )}
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
                        <Form.Control
                          as='select'
                          name='department'
                          value={values.department}
                          onChange={handleChange}
                        >
                          <option disabled={true} value="">---Select department---</option>
                          {selectFacaltyIndex > -1 &&
                            FACULTY[
                              selectFacaltyIndex
                            ].departments.map((x, index) =>
                              <option key={'department' + index}>
                                {x.name}
                              </option>
                            )}
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </div>

                  {/* ---------- ຂໍ້ມູນອາຈານ --------- */}
                  <div style={{ marginBottom: 10 }}>
                    <div>
                      <i
                        className='fa fa-caret-down'
                        aria-hidden='true'
                        style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
                      />
                    Teacher
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
                        <Form.Control.Feedback type="invalid">
                          {errors.firstname}
                        </Form.Control.Feedback>
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

                  {/* ---------- ໄອດີ ແລະ ລະຫັດຜ່ານ --------- */}
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
                        <Form.Control.Feedback type="invalid">
                          {errors.userId}
                        </Form.Control.Feedback>
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
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
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
                        Description
                    </Form.Label>
                      <Col sm='8'>
                        <Form.Control
                          type='text'
                          placeholder='please input...'
                          name='description'
                          value={values.description}
                          onChange={handleChange}
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
                          type='text'
                          placeholder='please input...'
                          name='note'
                          value={values.note}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>
                  </div>
                </Form>
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
                    type='submit'
                  />
                </div>

              </div>

              {/* ------- AddConfirm Modal ------ */}
              <TeacherAddConfirm
                showAddConfirmModal={showAddConfirmModal}
                _handleShowAddConfirmModalClose={
                  _handleShowAddConfirmModalClose
                }
                param={formParam}
                facultyName={selectFacaltyName}
                departmentName={selectDepartmentName}
              />
            </div>}
        </Formik>
      </CustomContainer>
    </div>
  )
}

export default TeacherAdd
