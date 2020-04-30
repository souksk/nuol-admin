import React, { useState } from 'react'
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
import { Formik } from 'formik'
import * as _ from 'lodash'
import * as Yup from 'yup';
import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CREATE_DEPARTMENT } from '../../apollo/deparment'
import { FACULTIES } from '../../apollo/faculty'

const DepartmentAdd = ({
  showAddView,
  _handleAddViewClose,
}) => {
  const [createDepartment] = useMutation(CREATE_DEPARTMENT);
  const { loading, error, data } = useQuery(FACULTIES);

  const facultyData = data && data.faculties ? data.faculties : {}

  const _onAdd = (values) => {
    let paramQL = {
      data: values
    };
    // console.log("paramQL: ", paramQL)
    createDepartment({ variables: paramQL }).then(async () => {
      _handleAddViewClose()
      window.location.reload(true)
    }).catch((err) => {
      _handleAddViewClose()
    });
  }

  const departmentAddValidation = Yup.object().shape({
    faculty: Yup.string()
      .required('Required'),
    name: Yup.string()
      .required('Required'),
  });

  if (loading) return <p>Loading...</p>

  return (
    <Modal show={showAddView} onHide={_handleAddViewClose} size='lg'>
      <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
        Add New Department
      </Modal.Title>

      <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
        <Formik
          initialValues={{
            faculty: '',
            name: '',
            description: '',
            note: ''
          }}
          validationSchema={departmentAddValidation}
          onSubmit={values => {
            // console.log("values: ", values)
            let data = {
              faculty: {
                connect: {
                  id: values.faculty
                }
              },
              name: values.name,
              description: values.description,
              note: values.note
            }

            _onAdd(data)
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
          }) =>
            <div>
              <div style={{ border: '#eee solid 1px', padding: 50 }}>
                <Form noValidate>
                  <Form.Group
                    as={Row}
                    controlId='formPlaintextEmail'
                    style={{ margin: 0, marginBottom: 10 }}
                  >
                    <Form.Label column sm='4' className='text-left'>
                      Faculty
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control as='select' name="faculty"
                        onChange={handleChange}
                        value={values.faculty}
                        isInvalid={!!errors.faculty}>
                        <option disabled={true} value="">---select faculty---</option>
                        {facultyData.map((x, index) => <option key={"faculty" + index} value={x.id}>{x.name}</option>)}
                      </Form.Control>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId='formPlaintextEmail'
                    style={{ margin: 0, marginBottom: 10 }}
                  >
                    <Form.Label column sm='4' className='text-left'>
                      Name
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        type="text"
                        name='name'
                        value={values.name}
                        onChange={handleChange}
                        placeholder="please input..."
                        isInvalid={!!errors.name}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId='formPlaintextEmail'
                    style={{ margin: 0, marginBottom: 10 }}
                  >
                    <Form.Label column sm='4' className='text-left'>
                      Description
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        as='textarea' rows='3'
                        name='description'
                        value={values.description}
                        onChange={handleChange}
                        placeholder="please input..."
                        isInvalid={!!errors.description}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId='formPlaintextEmail'
                    style={{ margin: 0, marginBottom: 10 }}
                  >
                    <Form.Label column sm='4' className='text-left'>
                      Note
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        as='textarea' rows='3'
                        name='note'
                        value={values.note}
                        onChange={handleChange}
                        placeholder="please input..."
                        isInvalid={!!errors.note}
                      />
                    </Col>
                  </Form.Group>
                </Form>
              </div>
              <div style={{ height: 20 }} />
              <div className='row'>
                <div style={{ padding: 15 }} className='col'>
                  <CustomButton
                    onClick={_handleAddViewClose}
                    width='100%'
                    title='Cancel'
                  />
                </div>
                <div style={{ padding: 15 }} className='col'>
                  <CustomButton
                    confirm
                    onClick={handleSubmit}
                    width='100%'
                    title='Add'
                  />
                </div>
              </div>
            </div>}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default DepartmentAdd
