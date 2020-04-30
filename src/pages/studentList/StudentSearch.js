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

const StudentSearch = ({
  facultyData,
  showSearchView,
  _handleSearchViewClose,
  onSearch
}) => {
  const [selectedFacultyIndex, setSelectedFacultyIndex] = useState(0)

  return (
    <Modal show={showSearchView} onHide={_handleSearchViewClose} size='lg'>
      <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
        <b>STUDENT SEARCH</b>
      </Modal.Title>

      <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
        <Formik
          initialValues={{
            faculty: '',
            department: '',
            yearLevel: '',
            userId: ''
          }}
          onSubmit={values => {
            onSearch(values)
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
                    as='select'
                    name='faculty'
                    value={values.faculty}
                    onChange={fValue => {
                      setSelectedFacultyIndex(fValue.target.value)
                      handleChange(fValue)
                    }}
                    isInvalid={!!errors.faculty}
                  >
                    <option value=''>-----All faculty-----</option>
                    {facultyData &&
                      facultyData.map((faculty, index) => {
                        return (
                          <option value={index + 1} key={index}>
                            {faculty.name}
                          </option>
                        )
                      })}
                  </Form.Control>
                </Col>
              </Form.Group>

              {(values.faculty != '') ? <Form.Group
                as={Row}
                controlId='formPlaintextEmail'
                style={{ margin: 0, marginBottom: 10 }}
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
                    isInvalid={!!errors.department}
                  >
                    <option value=''>-----All department-----</option>
                    {facultyData[selectedFacultyIndex - 1] &&
                      facultyData[
                        selectedFacultyIndex - 1
                      ].departments.map((department, index) => {
                        return (
                          <option key={index}>
                            {department.name}
                          </option>
                        )
                      })}
                  </Form.Control>
                </Col>
              </Form.Group> : ''}

              <Form.Group
                as={Row}
                controlId='formPlaintextEmail'
                style={{ margin: 0, marginBottom: 10 }}
              >
                <Form.Label column sm='4' className='text-left'>
                  Year level
                </Form.Label>
                <Col sm='8'>
                  <Form.Control
                    as='select'
                    name='yearLevel'
                    value={values.yearLevel}
                    onChange={handleChange}
                    isInvalid={!!errors.yearLevel}
                  >
                    <option value='0'>-----All year level-----</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <hr />

              <Form.Group
                as={Row}
                controlId='formPlaintextEmail'
                style={{ margin: 0, marginBottom: 10 }}
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

              <div style={{ height: 20 }} />
              <div className='row'>
                <div style={{ padding: 15 }} className='col'>
                  <CustomButton
                    confirm
                    onClick={handleSubmit}
                    width='100%'
                    title='Search'
                  />
                </div>
              </div>
            </div>}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default StudentSearch
