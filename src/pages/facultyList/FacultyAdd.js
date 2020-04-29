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
import { CREATE_FACULTY } from '../../apollo/faculty'

const FacultyAdd = ({
  showAddView,
  _handleAddViewClose,
}) => {
  const [createFaculty] = useMutation(CREATE_FACULTY);

  const _onAdd = (values) => {
    let paramQL = {
      data: {
        ...values
      }
    };
    createFaculty({ variables: paramQL }).then(async () => {
      _handleAddViewClose()
      window.location.reload(true)
    }).catch((err) => {
      _handleAddViewClose()
    });
  }

  return (
    <Modal show={showAddView} onHide={_handleAddViewClose} size='lg'>
      <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
        ເພີ່ມຄະນະ
      </Modal.Title>

      <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
        <Formik
          initialValues={{
            name: '',
            description: '',
            note: ''
          }}
          onSubmit={values => {
            // console.log("values: ", values)
            _onAdd(values)
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
                    ຄະນະ
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      type="text"
                      name='name'
                      value={values.name}
                      onChange={handleChange}
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
                    ຄຳອະທິບາຍ
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      as='textarea' rows='3'
                      name='description'
                      value={values.description}
                      onChange={handleChange}
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
                    ໝາຍເຫດ
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      as='textarea' rows='3'
                      name='note'
                      value={values.note}
                      onChange={handleChange}
                      isInvalid={!!errors.note}
                    />
                  </Col>
                </Form.Group>
              </div>
              <div style={{ height: 20 }} />
              <div className='row'>
                <div style={{ padding: 15 }} className='col'>
                  <CustomButton
                    onClick={_handleAddViewClose}
                    width='100%'
                    title='ຍົກເລີກ'
                  />
                </div>
                <div style={{ padding: 15 }} className='col'>
                  <CustomButton
                    confirm
                    onClick={handleSubmit}
                    width='100%'
                    title='ເພີ່ມ'
                  />
                </div>
              </div>
            </div>}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default FacultyAdd
