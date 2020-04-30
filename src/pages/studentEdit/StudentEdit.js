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
import { CustomContainer, SearchBar, Title, CustomButton } from '../../common'
import StudentEditConfirm from './StudentEditConfirm'
import * as yup from 'yup';
import { Formik } from 'formik';
import Consts from '../../consts'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { USER_EDIT } from './../../apollo/user'
import * as _ from 'lodash';

function StudentEdit() {

  const { history, location, match } = useReactRouter()
  const { loading, error, data } = useQuery(USER_EDIT, { variables: { where: { id: location.state.id } } });

  // States
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
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
    if (data.user && data.user.birthday) {
      handleStartDateChange(new Date(data.user.birthday))
    }
  }, [data])

  const handleStartDateChange = (date) => {
    setSDate(date);
  };

  useEffect(() => {
    if (userData) {
      // //console.log("userData: ", userData)
      if (userData.faculty) {
        const facaltyIndex = _.findIndex(faculty, { 'name': userData.faculty.name });
        setSelectFacultyIndex(facaltyIndex)
      }
    }
  }, [userData])

  const _cancel = () => {
    history.push('/student-list')
    window.location.reload(true)
  }

  const _edit = () => {
    _handleShowAddConfirmModalShow()
  }

  /**
 * ແປງຂໍ້ມູນຊື່ department ເປັນ id 
 *   */
  const _renderDepartmentId = (name) => {
    if (selectFacultyIndex != -1) {
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

  }

  const _selectFaculty = (e) => {
    const facaltyIndex = _.findIndex(faculty, { 'name': e.target.value });
    setSelectFacultyIndex(facaltyIndex)
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/student-list')}>
          Student Management
        </Breadcrumb.Item>
        <Breadcrumb.Item href='' onClick={() => history.push('/student-list')}>
          All Students
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Edit Student</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text='EDIT STUDENT' />
        {userData && <Formik
          initialValues={{
            department: userData.department ? userData.department.name : "",
            faculty: userData.faculty ? userData.faculty.name : "",
            firstname: userData.firstname || "",
            lastname: userData.lastname || "",
            phone: userData.phone || "",
            email: userData.email || "",
            description: userData.description || "",
            role: 'STUDENT',
            userId: userData.userId || "",
            password: userData.password || "",
            note: userData.note || "",
            yearLevel: userData.yearLevel || "",
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
            if (values.yearLevel) {
              values.yearLevel = parseInt(values.yearLevel)
            } else {
              delete values.yearLevel
            }
            if (!values.password) {
              delete values.password
            }
            if (!values.email) {
              delete values.email
            }
            if (!values.phone) {
              delete values.phone
            }
            if (values.faculty) {
              let facultyData = {
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
            if (values.department) {
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
            if(userData.phone == values.phone){
              delete values.phone
            }
            if(userData.email == values.email){
              delete values.email
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
            //console.log("paramQL: ",paramQL)
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
                          value={values.faculty}
                          isInvalid={!!errors.faculty}>
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
                          onChange={handleChange}
                          isInvalid={!!errors.department}>
                          <option disabled={true} value="">---Select department---</option>
                          {selectFacultyIndex > -1 && faculty[selectFacultyIndex].departments.map((x, index) => <option key={"faculty" + index}>{x.name}</option>)}
                        </Form.Control>
                      </Col>
                    </Form.Group>}

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
                        <Form.Control type='text' placeholder='please input...' name="firstname"
                          value={values.firstname}
                          onChange={handleChange}
                          isInvalid={!!errors.firstname} />
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
                        <Form.Control type='text' placeholder='please input...' name="lastname"
                          value={values.lastname}
                          onChange={handleChange}
                          isInvalid={!!errors.lastname} />
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
                        <Form.Control type='text' placeholder='please input...' value={values.phone} name="phone" onChange={handleChange} />
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
                        <Form.Control type='text' placeholder='please input...' name="email"
                          value={values.email}
                          onChange={handleChange} />
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
                        <Form.Control type='text' disabled={true} placeholder='please input...' name="userId"
                          value={values.userId}
                          onChange={handleChange}
                          isInvalid={!!errors.userId} />
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
                        <Form.Control type='text' placeholder='input to change...' name="password"
                          value={values.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password} />
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
                        <Form.Control as='textarea' rows='3' name="description" placeholder="please input..."
                          value={values.description}
                          onChange={handleChange}
                          isInvalid={!!errors.description} />
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
                        <Form.Control as='textarea' rows='3' name="note" placeholder="please input..."
                          value={values.note}
                          onChange={handleChange}
                          isInvalid={!!errors.note} />
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
                      title='Edit'
                      onClick={handleSubmit}
                    />
                  </div>
                </div>
                {/* ------- EditConfirm Modal ------ */}
                <StudentEditConfirm
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

export default StudentEdit
