import React, { useState, useCallback, useEffect } from 'react'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import { useDropzone } from 'react-dropzone'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CREATE_USER } from '../../apollo/user'
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
import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import Consts from '../../consts'
import * as yup from 'yup';
import { Formik } from 'formik';


import { UPDATE_REGISTRATION } from '../../apollo/registration'
import { USERS } from '../../apollo/user'
import { REGISTER_COURSES } from '../../apollo/course'

function RegistrationEdit({
  showEditView,
  _handleEditViewClose,
  registrationData
}) {

  const { history, location, match } = useReactRouter();
  const [updateRegistration, { data: updateData }] = useMutation(UPDATE_REGISTRATION);
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(USERS, { variables: { where: { role: "STUDENT" } } });
  const { loading: coursesLoading, error: coursesError, data: coursesData } = useQuery(REGISTER_COURSES);

  //States
  const [data, setData] = useState({})
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (registrationData) {
      setData(registrationData)
    }
  }, [registrationData])

  //functions
  const _registration = (values) => {
    let paramQL = {
      data: {
        note: values.note,
        student: {
          connect: {
            userId: values.userId
          }
        },
        course: {
          connect: {
            courseCode: values.courseCode
          }
        }
      },
      where: { id: data.id }
    }

    // //console.log("paramQL: ", paramQL)

    updateRegistration({ variables: paramQL }).then(async () => {
      await _handleEditViewClose();
      // history.push("/registration-list")
      window.location.reload(true)
    }).catch((err) => {
      //console.log(err)
      _handleEditViewClose();
      setShowToast(true)
    })

  }
  if (usersLoading || coursesLoading) return <p>Loading...</p>

  return (
    <div>
      <Modal
        show={showEditView}
        onHide={_handleEditViewClose}
        size='lg'
      >
        <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
          <b>REGISTRATION EDIT</b>
        </Modal.Title>
        <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>

          {data ? <Formik
            initialValues={{
              userId: data.student ? (data.student.userId ? data.student.userId : '') : '',
              courseCode: data.course ? (data.course.courseCode ? data.course.courseCode : '') : '',
              note: data.note ? data.note : '',
            }}
            validate={values => {
            }}
            onSubmit={(values, { setSubmitting }) => {
              // //console.log("values: ", values)
              _registration(values)
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
                  <div style={{ border: "#eee solid 1px", padding: 50 }}>

                    {usersData ? <Form.Group
                      as={Row}
                      controlId='formPlaintextEmail'
                      style={{ margin: 0, marginBottom: 10 }}
                    >
                      <Form.Label column sm='4' className='text-left'>
                        Student
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control as='select' name="userId"
                          onChange={handleChange}
                          value={values.userId}
                          isInvalid={!!errors.userId}>
                          <option disabled={true} value="">---Select Student---</option>
                          {usersData.users && usersData.users.map((x, index) => <option key={"userId" + index} value={x.userId}>{x.firstname + ' ' + (x.lastname ? x.lastname : '')}</option>)}
                        </Form.Control>
                      </Col>
                    </Form.Group> : ''}


                    {coursesData ? <Form.Group
                      as={Row}
                      controlId='formPlaintextEmail'
                      style={{ margin: 0, marginBottom: 10 }}
                    >
                      <Form.Label column sm='4' className='text-left'>
                        Course
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control as='select' name="courseCode"
                          onChange={handleChange}
                          value={values.courseCode}
                          isInvalid={!!errors.courseCode}>
                          <option disabled={true} value="">---Select course---</option>
                          {coursesData.courses && coursesData.courses.map((x, index) => <option key={"courseCode" + index} value={x.courseCode}>{x.title}</option>)}
                        </Form.Control>
                      </Col>
                    </Form.Group> : ''}


                    <Form.Group
                      as={Row}
                      controlId='formPlaintextEmail'
                      style={{ margin: 0, marginBottom: 10 }}
                    >
                      <Form.Label column sm='4' className='text-left'>
                        Description</Form.Label>
                      <Col sm='8'>
                        <Form.Control type='text' placeholder='please input...' name="note"
                          value={values.note}
                          onChange={handleChange}
                          isInvalid={!!errors.note} />
                      </Col>
                    </Form.Group>
                  </div>
                  <div style={{ height: 20 }} />
                  <div className='row'>
                    <div style={{ padding: 15 }} className='col'>
                      <Button
                        onClick={_handleEditViewClose}
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
                        onClick={handleSubmit}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                </div>
              )}
          </Formik> : ''}

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

export default RegistrationEdit
