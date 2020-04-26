import React, {useState} from 'react'
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
import {Formik} from 'formik'
import * as _ from 'lodash'

import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import FACULTY from '../../consts/faculty'

const FacultySearch = ({
  facultyData,
  showSearchView,
  _handleSearchViewClose,
  onSearch
}) => {
  const [selectFacaltyIndex, setSelectFacaltyIndex] = useState(-1)
  const [selectedFacultyIndex, setSelectedFacultyIndex] = useState(0)

  const _selectFacalty = e => {
    const facaltyIndex = _.findIndex(FACULTY, {name: e.target.value})
    setSelectFacaltyIndex(facaltyIndex)
  }

  return (
    <Modal show={showSearchView} onHide={_handleSearchViewClose} size='lg'>
      <Modal.Title style={{textAlign: 'center', paddingTop: 20}}>
        ຄົ້ນຫາຄະນະ
      </Modal.Title>

      <Modal.Body style={{marginLeft: 50, marginRight: 50, padding: 50}}>
        <Formik
          initialValues={{
            faculty: '',
            department: '',
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
              <div style={{border: '#eee solid 1px', padding: 50}}>
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
                      <option value='0'>-----ທຸກຄະນະ-----</option>
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
              </div>
              <div style={{height: 20}} />
              <div className='row'>
                <div style={{padding: 15}} className='col'>
                  <CustomButton
                    confirm
                    onClick={handleSubmit}
                    width='100%'
                    title='ຄົ້ນຫາ'
                  />
                </div>
              </div>
            </div>}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default FacultySearch
