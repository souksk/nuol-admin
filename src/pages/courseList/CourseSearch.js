import React, {useState} from 'react'
import {
  Breadcrumb,
  Modal,
  Button,
  Table,
  Col,
  Row,
  InputGroup,
  FormControl,
  Form
} from 'react-bootstrap'
import {Formik} from 'formik'
import * as _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../consts'

const CourseSearch = ({
  facultyData,
  showSearchView,
  _handleSearchViewClose,
  onSearch
}) => {
  const [selectedFacultyIndex, setSelectedFacultyIndex] = useState(0)

  //console.log('facultyData: ', facultyData)
  return (
    <Modal
      show={showSearchView}
      onHide={_handleSearchViewClose}
      size='lg'
      style={{zIndex: 10000}}
    >
      <Modal.Title style={{textAlign: 'center', paddingTop: 20}}>
        ຄົ້ນຫາວິຊາ
      </Modal.Title>

      {/* Body */}
      <div style={{flex: 1, position: 'relative', backgroundColor: '#f0f0f1'}}>
        <Modal.Body
          style={{
            marginLeft: 50,
            marginRight: 50,
            padding: 10,
            marginTop: 70,
            marginBottom: 40
          }}
        >
          <Formik
            initialValues={{
              faculty: '',
              department: '',
              yearLevel: '',
              courseCode: ''
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
                  style={{margin: 0, marginBottom: 10}}
                >
                  <Form.Label column sm='4' className='text-left'>
                    ຄະນະ
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
                      <option value=''>-----ທຸກຄະນະ-----</option>
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

                <Form.Group
                  as={Row}
                  controlId='formPlaintextEmail'
                  style={{margin: 0, marginBottom: 10}}
                >
                  <Form.Label column sm='4' className='text-left'>
                    ພາກວິຊາ
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      as='select'
                      name='department'
                      value={values.department}
                      onChange={handleChange}
                      isInvalid={!!errors.department}
                    >
                      <option value=''>-----ທຸກພາກວິຊາ-----</option>
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
                </Form.Group>

                <Form.Group
                  as={Row}
                  controlId='formPlaintextEmail'
                  style={{margin: 0, marginBottom: 10}}
                >
                  <Form.Label column sm='4' className='text-left'>
                    ປີຮຽນ
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      as='select'
                      name='yearLevel'
                      value={values.yearLevel}
                      onChange={handleChange}
                      isInvalid={!!errors.yearLevel}
                    >
                      <option value=''>-----ທຸກປີຮຽນ-----</option>
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
                  style={{margin: 0, marginBottom: 10}}
                >
                  <Form.Label column sm='4' className='text-left'>
                    ລະຫັດວິຊາ
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      type='text'
                      placeholder='ກະລຸນາປ້ອນ'
                      name='courseCode'
                      value={values.courseCode}
                      onChange={handleChange}
                      isInvalid={!!errors.courseCode}
                    />
                  </Col>
                </Form.Group>

                <div style={{height: 20}} />
                <div className='col'>
                  <CustomButton
                    confirm
                    onClick={handleSubmit}
                    width='100%'
                    title='ຄົ້ນຫາ'
                  />
                </div>
              </div>}
          </Formik>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default CourseSearch
