import React, { useState, useCallback, useEffect } from 'react'
import './teacherEdit.css'
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
import * as yup from 'yup';
import { Formik } from 'formik';
import Consts from '../../consts'
import TeacherEditConfirm from './TeacherEditConfirm'
import { CustomContainer, Title, CustomButton } from '../../common'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { USER_EDIT } from './../../apollo/user'
import * as _ from 'lodash';
import { FACULTIES } from '../../apollo/faculty'

function TeacherEdit() {
  const { history, location, match } = useReactRouter()
  const { loading, error, data } = useQuery(USER_EDIT, { variables: { where: { id: location.state.id } } });

  // States
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false)
  const [formParam, setFormParam] = useState({})
  const [userData, setUserData] = useState(null)
  const [faculty, setFaculty] = useState(null)
  const [selectFacultyIndex, setSelectFacultyIndex] = useState(-1)

  const [sDate, setSDate] = useState(null);

  // Set states
  const _handleShowAddConfirmModalClose = () => setShowAddConfirmModal(false)
  const _handleShowAddConfirmModalShow = () => setShowAddConfirmModal(true)

  //Get Data from Server
  if (userData == null && data && data.user) setUserData(data.user)
  if (faculty == null && data && data.faculties) setFaculty(data.faculties)

  useEffect(() => {
    if(data.user && data.user.birthday){
      handleStartDateChange(new Date(data.user.birthday))
    }
  }, [data])

  const handleStartDateChange = (date) => {
    setSDate(date);
  };

  const _cancel = () => {
    history.push('/teacher-list')
    window.location.reload(true)
  }

  const _edit = () => {
    _handleShowAddConfirmModalShow()
  }

  //init faculty index
  if (selectFacultyIndex == -1 && userData && userData.faculty && userData.faculty.name) setSelectFacultyIndex(_.findIndex(faculty, { 'name': userData.faculty.name }))

  const _selectFaculty = (e) => {
    const facaltyIndex = _.findIndex(faculty, { 'name': e.target.value });
    setSelectFacultyIndex(facaltyIndex)
  }

  /**
 * ແປງຂໍ້ມູນຊື່ department ເປັນ id 
 *   */
  const _renderDepartmentId = (name) => {
    let id = faculty[selectFacultyIndex].departments[0].id
    for (var i = 0; i < faculty[selectFacultyIndex].departments.length; i++) {
      if (name == faculty[selectFacultyIndex].departments[i].name) {
        id = faculty[selectFacultyIndex].departments[i].id
        i = faculty[selectFacultyIndex].departments.length
      }
    }
    // let departnemt = _.find(faculty[selectFacultyIndex].departments, function (o) { return o.name == name });

    return id
  }
  if (loading) return <p>Loading...</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => {
          history.push('/teacher-list')
          window.location.reload(true)
        }
        }>
          Teacher Management
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Edit Teacher</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text='EDIT TEACHER' />
        {userData && <Formik
          initialValues={{
            department: userData.department ? userData.department.name : "",
            faculty: userData.faculty ? userData.faculty.name : "",
            firstname: userData.firstname || "",
            lastname: userData.lastname || "",
            phone: userData.phone || "",
            email: userData.email || "",
            description: userData.description || "",
            role: 'TEACHER',
            userId: userData.userId || "",
            password: userData.password || "",
            note: userData.note || "",
            gender: userData.gender || 'MALE',
            maritualStatus: userData.maritualStatus || 'SINGLE'
          }}
          validate={values => {
            const errors = {};
            if (!values.firstname) {
              errors.firstname = 'ກະລຸນາຕື່ມຊື່';
            }
            if (!values.userId) {
              errors.userId = 'ໄອດີ';
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
            if (values.faculty) {
              const facultyData = {
                connect: {
                  id: faculty[selectFacultyIndex].id,
                }
              }
              values = {
                ...values, faculty: facultyData
              }
            } else {
              delete values.faculty
            }
            if(userData.phone == values.phone){
              delete values.phone
            }
            if(userData.email == values.email){
              delete values.email
            }
            if (!values.password) {
              delete values.password
            }
            if (values.department) {
              const departmentData = {
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
              where: {
                id: userData.id
              },
              data
            }

            // //console.log("paramQL: ", paramQL)
            setFormParam(paramQL)
            _edit()
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
            /* and other goodies */
          }) => (
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
                      {faculty && <Form.Group
                        as={Row}
                        style={{
                          margin: 0,
                          marginBottom: 10,
                          paddingLeft: 20,
                          fontSize: 16
                        }}
                      >
                        <Form.Label column sm='4' className='text-left'>
                        Faculty</Form.Label>
                        <Col sm='8'>
                          <Form.Control as='select' name="faculty"
                            onChange={(e) => {
                              handleChange(e)
                              _selectFaculty(e)
                            }}
                            value={values.faculty}>
                            <option disabled={true} value="">---Select faculty---</option>
                            {faculty.map((x, index) => <option key={"faculty" + index} value={x.name}>{x.name}</option>)}
                          </Form.Control>
                        </Col>
                      </Form.Group>}

                      {/* ພາກວິຊາ */}
                      {faculty && selectFacultyIndex > -1 && faculty[selectFacultyIndex].departments && <Form.Group
                        as={Row}
                        style={{
                          margin: 0,
                          marginBottom: 10,
                          paddingLeft: 20,
                          fontSize: 16
                        }}
                      >
                        <Form.Label column sm='4' className='text-left'>
                        Department</Form.Label>
                        <Col sm='8'>
                          <Form.Control as='select' name="department"
                            value={values.department}
                            onChange={handleChange}>
                            <option disabled={true} value="">---Select department---</option>
                            {selectFacultyIndex > -1 && faculty[selectFacultyIndex].departments.map((x, index) => <option key={"faculty" + index}>{x.name}</option>)}
                          </Form.Control>
                        </Col>
                      </Form.Group>}
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
                          First name</Form.Label>
                        <Col sm='8'>
                          <Form.Control type='text' placeholder='please input...'
                            name="firstname"
                            value={values.firstname}
                            onChange={handleChange}
                            isInvalid={!!errors.firstname} />
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
                          Last name</Form.Label>
                        <Col sm='8'>
                          <Form.Control type='text' placeholder='please input...' name="lastname"
                            value={values.lastname}
                            onChange={handleChange} />
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
                              <label htmlFor="male">Mail</label>
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
                          Staus
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
                          Phone number</Form.Label>
                        <Col sm='8'>
                          <Form.Control type='text' placeholder='please input...' name="phone"
                            value={values.phone}
                            onChange={handleChange} />
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
                          E-Mail</Form.Label>
                        <Col sm='8'>
                          <Form.Control type='text' placeholder='please input...' name="email"
                            value={values.email}
                            onChange={handleChange} />
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
                      User ID and Password</div>
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
                          User ID</Form.Label>
                        <Col sm='8'>
                          <Form.Control type='text' disabled={true} placeholder='please input...' name="userId"
                            value={values.userId}
                            onChange={handleChange}
                            isInvalid={!!errors.userId} />
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
                          Password</Form.Label>
                        <Col sm='8'>
                          <Form.Control type='text' placeholder='input to change' name="password"
                            value={values.password}
                            onChange={handleChange} />
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
                          <Form.Control type='text' placeholder='please input...' name="description"
                            value={values.description}
                            onChange={handleChange} />
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
                          <Form.Control type='text' placeholder='please input...' name="note"
                            value={values.note}
                            onChange={handleChange} />
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

                    <CustomButton confirm title='Edit' onClick={handleSubmit} type="submit" />
                  </div>
                </div>

                {/* ------- AddConfirm Modal ------ */}
                <TeacherEditConfirm
                  showAddConfirmModal={showAddConfirmModal}
                  _handleShowAddConfirmModalClose={_handleShowAddConfirmModalClose}
                  param={formParam}
                  faculty={faculty}
                />
              </div>
            )}
        </Formik>}

      </CustomContainer>
    </div>
  )
}

export default TeacherEdit
