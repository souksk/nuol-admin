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

import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { UPDATE_FACULTY } from '../../apollo/faculty'

const FacultyEdit = ({
  showEditView,
  _handleEditViewClose,
  dataForEdit
}) => {
  const [updateFaculty] = useMutation(UPDATE_FACULTY);
  // console.log("dataForEdit: ", dataForEdit)
  const _onEdit = (values) => {
    let paramQL = {
      data: {
        ...values
      },
      where: { id: dataForEdit.id }
    };
    updateFaculty({ variables: paramQL }).then(async () => {
      _handleEditViewClose()
      window.location.reload(true)
    }).catch((err) => {
      _handleEditViewClose()
    });
  }

  return (
    <Modal show={showEditView} onHide={_handleEditViewClose} size='lg'>
      <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
        Edit Faculty
      </Modal.Title>

      <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
        {dataForEdit && <Formik
          initialValues={{
            name: dataForEdit.name || '',
            description: dataForEdit.description || '',
            note: dataForEdit.note || ''
          }}
          onSubmit={values => {
            // console.log("values: ", values)
            _onEdit(values)
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
                <Form.Group
                  as={Row}
                  controlId='formPlaintextEmail'
                  style={{ margin: 0, marginBottom: 10 }}
                >
                  <Form.Label column sm='4' className='text-left'>
                  Faculty
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

export default FacultyEdit
