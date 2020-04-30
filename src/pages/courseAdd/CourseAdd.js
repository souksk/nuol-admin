import React, { useState, useCallback, useEffect } from 'react'
import './courseAdd.css'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import * as Yup from 'yup';
import { Formik } from 'formik';
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
  FormControl,
  ButtonToolbar,
  ButtonGroup,
  ProgressBar
} from 'react-bootstrap'
import * as _ from 'lodash';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import axios from "axios"

// Custom
import Consts from '../../consts'
// import FACULTY from '../../consts/faculty'
import CourseAddConfirm from './CourseAddConfirm'
import { CustomContainer, Title, CustomButton, ImageUpload } from '../../common'
import { PRE_SIGNED_URL } from '../../apollo/doc'
import { FACULTIES } from '../../apollo/faculty'

function CourseAdd() {
  const { history, location, match } = useReactRouter()

  // States
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false)
  const [formParam, setFormParam] = useState({})
  const [selectFacaltyIndex, setSelectFacaltyIndex] = useState(-1)
  const [files, setFiles] = useState([])
  const [fileUploadProgress, setFileUploadProgress] = useState(0)

  // Set states
  const _handleShowAddConfirmModalClose = () => setShowAddConfirmModal(false)
  const _handleShowAddConfirmModalShow = () => setShowAddConfirmModal(true)


  // file query
  const { loading, error, data } = useQuery(PRE_SIGNED_URL, { variables: { mimeType: "application/pdf" } })

  const facultyApollo = useQuery(FACULTIES)
  const FACULTY = facultyApollo && facultyApollo.data && facultyApollo.data.faculties

  useEffect(() => {
    // //console.log("update:", formParam)
  }, [formParam])

  const _cancel = () => {
    history.push("/course-list")
    window.location.reload(true)
  }

  const _add = async (param) => {
    const { preSignedUrl } = data
    ////console.log(formParam)

    // Upload the image to our pre-signed URL.
    ////console.log("preSignedUrl: ", preSignedUrl)
    ////console.log("files: ", files)

    // Save file to s3
    if (acceptedFiles.length > 0) {
      if (preSignedUrl) {
        const response = await axios({
          method: 'put',
          url: preSignedUrl.url,
          data: files[0],
          headers: {
            'Content-Type': ' file/*; image/*',
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
          },
          onUploadProgress: function (progressEvent) {
            setFileUploadProgress(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
          }
        });
        //console.log("response: ", response)
        let filename = response.config.url.split("?")

        let data = {
          syllabusFile: {
            create: {
              title: files[0].name,
              file: filename[0],
              type: "SYLLABUS_FILE"
            }
          }
        }

        // set data form when file is uploaded
        let paramQL = {
          data: {
            ...param.data, ...data
          }
        };

        setFormParam(paramQL)
      }
    } else {
      setFormParam(param)
    }

    _handleShowAddConfirmModalShow()
  }

  const onDrop = useCallback(async acceptedFiles => {
    // TODO: store files in state
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop })

  const _fileUploaded = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} size: {file.size} bytes
    </li>
  ));

  const _renderDepartmentId = (name) => {
    let departnemt = _.find(FACULTY[selectFacaltyIndex].departments, function (o) { return o.name == name });
    return departnemt.id
  }

  const courseAddValidation = Yup.object().shape({
    facalty: Yup.string()
      .required('Required'),
    department: Yup.string()
      .required('Required'),
    title: Yup.string()
      .required('Required'),
    courseCode: Yup.string()
      .required('Required'),
  });

  const _selectFacalty = (e) => {
    const facaltyIndex = _.findIndex(FACULTY, { 'name': e.target.value });
    setSelectFacaltyIndex(facaltyIndex)
  }

  if (loading) return <p>loading...</p>
  if (error) return <p>Oop!</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/course-list')}>
          Course Management
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add New Course</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text='ADD NEW COURSE' />

        <Formik
          initialValues={{
            title: '',
            department: '',
            facalty: '',
            courseCode: '',
            description: '',
            note: '',
            unit: '0'
          }}
          validationSchema={courseAddValidation}
          onSubmit={(values, { setSubmitting }) => {

            //Set parameters for inserting to graphql
            let paramQL = {
              data: {
                faculty: {
                  connect: {
                    id: FACULTY[selectFacaltyIndex].id,
                  }
                },
                department: {
                  connect: {
                    id: _renderDepartmentId(values.department),
                  }
                },
                title: values.title,
                courseCode: values.courseCode,
                description: values.description,
                note: values.note,
                unit: parseInt(values.unit),
              }
            }

            // //console.log("paramQL: ", paramQL)
            _add(paramQL)
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

                  {/* ---------- ຄະນະແລະພາກວິຊາ --------- */}
                  <div style={{ marginBottom: 10 }}>
                    <div>
                      <i
                        className='fa fa-caret-down'
                        aria-hidden='true'
                        style={{ marginRight: 5 }}
                      />
                      Faculty and Department
                  </div>
                    {/* ຄະນະ */}
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
                      Faculty
                      </Form.Label>
                      <Col sm='8'>
                        {FACULTY && <Form.Control as='select' name="facalty"
                          onChange={(e) => {
                            handleChange(e)
                            _selectFacalty(e)
                          }}
                          value={values.facalty}
                          isInvalid={!!errors.facalty}
                          required={true}
                        >
                          <option disabled={true} value="">---Select faculty---</option>
                          {FACULTY.map((x, index) => <option key={"faculty" + index}>{x.name}</option>)}
                        </Form.Control>}
                      </Col>
                    </Form.Group>

                    {/* ພາກວິຊາ */}
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
                      Department</Form.Label>
                      <Col sm='8'>
                        <Form.Control as='select' name="department"
                          value={values.department}
                          onChange={handleChange}
                          isInvalid={!!errors.department}>
                          <option disabled={true} value="">---select department---</option>
                          {selectFacaltyIndex > -1 && FACULTY[selectFacaltyIndex].departments.map((x, index) => <option key={"department" + index}>{x.name}</option>)}
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </div>

                  {/* ---------- ຂໍ້ມູນວິຊາ --------- */}
                  <div style={{ marginBottom: 10 }}>
                    <div>
                      <i
                        className='fa fa-caret-down'
                        aria-hidden='true'
                        style={{ marginRight: 5 }}
                      />
                      Course
                    </div>
                    {/* ຊື່ວິຊາ */}
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
                        Course name</Form.Label>
                      <Col sm='8'>
                        <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ' name="title"
                          value={values.title}
                          onChange={handleChange}
                          isInvalid={!!errors.title} />
                      </Col>
                    </Form.Group>

                    {/* ລະຫັດວິຊາ */}
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
                        Course ID</Form.Label>
                      <Col sm='8'>
                        <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ' name="courseCode"
                          value={values.courseCode}
                          onChange={handleChange}
                          isInvalid={!!errors.courseCode} />
                      </Col>
                    </Form.Group>

                    {/* ຈໍານວນຫນ່ວຍກິດ */}
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
                        Unit</Form.Label>
                      <Col sm='8'>
                        <Form.Control as='select' name="unit"
                          value={values.unit}
                          onChange={handleChange}
                          isInvalid={!!errors.unit}>
                          <option disabled={true} value="0">---Select unit---</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </div>

                  {/* ---------- ຄໍາອະທິບາຍ --------- */}
                  <div style={{ marginBottom: 10 }}>
                    <div>
                      <i
                        className='fa fa-caret-down'
                        aria-hidden='true'
                        style={{ marginRight: 5 }}
                      />
                      Description
                    </div>
                    {/* ເນື້ອໃນຂອງວິຊາ */}
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
                        <Form.Control as='textarea' rows='3' name="description"
                          value={values.description}
                          onChange={handleChange}
                          isInvalid={!!errors.description} />
                      </Col>
                    </Form.Group>
                  </div>

                  {/* ---------- ອັບໂຫລດ --------- */}
                  <div style={{ marginBottom: 10 }}>
                    <div>
                      <i
                        className='fa fa-caret-down'
                        aria-hidden='true'
                        style={{ marginRight: 5 }}
                      />
                      File
                    </div>
                    {/* ອັບໂຫລດໄຟລ */}
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
                        File upload
                      </Form.Label>
                      <Col sm='8'>
                        <div
                          {...getRootProps()}
                          style={{
                            height: 100,
                            border: '1px solid #ddd',
                            outline: 'none',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          <input {...getInputProps()} />

                          <div
                            style={{
                              backgroundColor: '#f3f3f3',
                              marginLeft: 20,
                              marginTop: 20,
                              marginRight: 20,
                              textAlign: 'center'
                            }}
                          >
                            <img
                              style={{ width: 50, height: 50 }}
                              src='/assets/download.png'
                            />
                          </div>
                          <span>Drag or select file</span>
                        </div>
                        {acceptedFiles.length > 0 && <aside>
                          <h4>File to upload</h4>
                          <ul>{_fileUploaded}</ul>
                        </aside>}
                      </Col>
                    </Form.Group>
                  </div>

                  {/* new Upload file */}
                  {/* <ImageUpload presignedUploadUrl={preSignedUrl} >
                    <div>Image Upload na ja</div>
                  </ImageUpload> */}


                  {fileUploadProgress > 0 && fileUploadProgress < 100 && <div>
                    <h3>File uploading....</h3>
                    <ProgressBar animated now={fileUploadProgress} label={`${fileUploadProgress}%`} />
                  </div>
                  }


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

                    <CustomButton confirm title='Add' onClick={handleSubmit} />
                  </div>
                </div>

                {/* ------- AddConfirm Modal ------ */}
                <CourseAddConfirm
                  showAddConfirmModal={showAddConfirmModal}
                  _handleShowAddConfirmModalClose={_handleShowAddConfirmModalClose}
                  param={formParam}
                  FACULTY={FACULTY}
                />

              </div>

            )}
        </Formik>
      </CustomContainer>
    </div>
  )
}

export default CourseAdd
