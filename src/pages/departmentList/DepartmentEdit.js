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
import { UPDATE_DEPARTMENT } from '../../apollo/deparment'
import { FACULTIES } from '../../apollo/faculty'

const DepartmentEdit = ({
  showEditView,
  _handleEditViewClose,
  dataForEdit
}) => {
  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT);
  const { loading, error, data } = useQuery(FACULTIES);

  const facultyData = data && data.faculties ? data.faculties : {}

  // console.log("dataForEdit: ", dataForEdit)
  const _onEdit = (values) => {
    let paramQL = {
      data: values,
      where: { id: dataForEdit.id }
    };
    updateDepartment({ variables: paramQL }).then(async () => {
      _handleEditViewClose()
      window.location.reload(true)
    }).catch((err) => {
      _handleEditViewClose()
    });
  }

  const departmentEditValidation = Yup.object().shape({
    faculty: Yup.string()
      .required('Required'),
    name: Yup.string()
      .required('Required'),
  });

  const _onConvertFaculty = (faculty) => {
    let ID = ''
    for (var i = 0; i < facultyData.length; i++) {
      if (facultyData[i].name == faculty) {
        ID = facultyData[i].id
      }
    }
    return ID
  }

  if (loading) return <p>Loading...</p>

  return (
    <Modal show={showEditView} onHide={_handleEditViewClose} size='lg'>
      <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
        Edit Department
      </Modal.Title>

      <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
        {dataForEdit && <Formik
          initialValues={{
            faculty: dataForEdit.faculty ? (dataForEdit.faculty.name || '') : '',
            name: dataForEdit.name || '',
            description: dataForEdit.description || '',
            note: dataForEdit.note || ''
          }}
          validationSchema={departmentEditValidation}
          onSubmit={values => {
            let data = {
              faculty: {
                connect: {
                  id: _onConvertFaculty(values.faculty)
                }
              },
              name: values.name,
              description: values.description,
              note: values.note
            }

            _onEdit(data)
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
                        {facultyData.map((x, index) => <option key={"faculty" + index} value={x.name}>{x.name}</option>)}
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
                    onClick={_handleEditViewClose}
                    width='100%'
                    title='Cancel'
                  />
                </div>
                <div style={{ padding: 15 }} className='col'>
                  <CustomButton
                    confirm
                    onClick={handleSubmit}
                    width='100%'
                    title='Edit'
                  />
                </div>
              </div>
            </div>}
        </Formik>}
      </Modal.Body>
    </Modal>
  )
}

export default DepartmentEdit
