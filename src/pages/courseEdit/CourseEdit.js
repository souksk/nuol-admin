import React, { useState, useCallback } from 'react'
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
  FormControl,
  ButtonToolbar,
  ButtonGroup,
  ProgressBar
} from 'react-bootstrap'
import { CustomContainer, SearchBar, Title, CustomButton } from '../../common'
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks'
import { COURSE_EDIT } from '../../apollo/course'
import * as Yup from 'yup';
import { Formik } from 'formik';
//import FACULTY from '../../consts/faculty'
import * as _ from 'lodash';
import { PRE_SIGNED_URL } from '../../apollo/doc'
import { TEACHERS } from './../../apollo/user'
import Consts from '../../consts'
import axios from "axios"
import CourseEditConfirm from './CourseEditConfirm'

function CourseEdit() {

  const { history, location, match } = useReactRouter()

  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false)
  const [formParam, setFormParam] = useState({})
  const [selectTimeIndexes, setSelectTimeIndexes] = useState([])
  const [selectFacultyIndex, setSelectFacultyIndex] = useState(-1)
  const [files, setFiles] = useState([])
  const [fileUploadProgress, setFileUploadProgress] = useState(0)
  const [courseData, setCourseData] = useState(null)

  // Set states
  const _handleShowEditConfirmModalClose = () => setShowEditConfirmModal(false)
  const _handleShowEditConfirmModalShow = () => setShowEditConfirmModal(true)

  //init apollo
  const { loading: teacherLoading, data: teacherData } = useQuery(TEACHERS, { variables: { where: { role: 'TEACHER' } } })
  const { data } = useQuery(PRE_SIGNED_URL, { variables: { mimeType: "application/pdf" } })
  const apolloData = useQuery(COURSE_EDIT, { variables: { where: { id: location.state.id } } })
  const { loading, error } = apolloData
  if (apolloData.data && apolloData.data.course && !courseData) setCourseData(apolloData.data.course)
  const FACULTY = apolloData.data && apolloData.data.faculties ? apolloData.data.faculties : []
  ////console.log(courseData)
  ////console.log(apolloData)

  const _selectFaculty = (e) => {
    const facaltyIndex = _.findIndex(FACULTY, { 'name': e.target.value });
    setSelectFacultyIndex(facaltyIndex)
  }

  //init faculty index
  if (selectFacultyIndex == -1 && courseData && courseData.faculty && courseData.faculty.name)
    setSelectFacultyIndex(_.findIndex(FACULTY, { 'name': courseData.faculty.name }))

  /* ເວລາກົດປຸ່ມຍົກເລີກ */
  const _cancel = () => {
    history.push("/course-list")
    window.location.reload(true)
  }

  /* ເວລາກົດປຸ່ມແກ້ໄຂ */
  const _save = async (param) => {
    const { preSignedUrl } = data
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
          /* ສະແດງເປີເຊັນຂໍ້ມູນທີ່ອັບໂຫລດແລ້ວ  */
          onUploadProgress: function (progressEvent) {
            setFileUploadProgress(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
          }
        });
        // //console.log("response: ", response)
        let filename = response.config.url.split("?")

        /* ຕັ້ງຄ່າຕົວປ່ຽນ graphQL ເວລາມີໄຟລອັບໂຫລດ */
        let data = {
          syllabusFile: {
            create: {
              title: files[0].name,
              file: filename[0],
              type: "SYLLABUS_FILE"
            }
          }
        }

        // ປ່ຽນຮູບແບບຕົວປ່ຽນໃຫ້ສາມາດອັບເດດກັບ GraphQL ໄດ້
        let paramQL = {
          data: {
            ...param.data, ...data
          },
          where: {
            ...param.where
          }
        };
        // //console.log("paramQL 2: ", paramQL)
        /* ກໍານົດ paramQL ເພື່ອສົ່ງໄປຫນ້າຄອນເຟີມ */
        setFormParam(paramQL)
      }
    } else {
      /* ກໍານົດ paramQL ເພື່ອສົ່ງໄປຫນ້າຄອນເຟີມ */
      setFormParam(param)
    }

    _handleShowEditConfirmModalShow()
  }

  /**
   * ກຳນົດຄ່າໄຟລທີ່ຖືກອັບໂຫລດ
   *   */
  const onDrop = useCallback(async acceptedFiles => {
    setFiles(acceptedFiles)
  }, [])

  /**
     * ກຳນົດຄ່າເລີ່ມຕົ້ນຂອງອັບໂຫລດໄຟລ
     *   */
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop })


  /**
   * ກໍານົດຄ່າໄຟລເວລາໂຍນໄຟລ ຫຼື ອັບໂຫລດໄຟລໃສ່
   *   */
  const fileUploaded = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} ຂະຫນາດ: {file.size} bytes
    </li>
  ));

  /**
   * ແປງຂໍ້ມູນຊື່ department ເປັນ id 
   *   */
  const _renderDepartmentId = (name) => {
    let id = FACULTY[selectFacultyIndex].departments[0].id;
    for (var i = 0; i < FACULTY[selectFacultyIndex].departments.length; i++) {
      if (FACULTY[selectFacultyIndex].departments[i].name == name) {
        id = FACULTY[selectFacultyIndex].departments[i].id
      }
    }
    return id
  }

  if (loading || teacherLoading) return <p>loading...</p>

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href='' onClick={() => history.push('/course-list')}>
          Course Management
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Edit Course</Breadcrumb.Item>
      </Breadcrumb>

      <CustomContainer>
        <Title text='EDIT COURSE' />

        {courseData && <Formik
          initialValues={{
            title: courseData.title || '',
            department: courseData.department ? courseData.department.name : "",
            faculty: courseData.faculty ? courseData.faculty.name : "",
            courseCode: courseData.courseCode || '',
            description: courseData.description || '',
            unit: courseData.unit || '0',
            note: courseData.note || '',
          }}
          validate={values => {
            const errors = {};
            if (!values.title) {
              errors.title = 'ກະລຸນາຕື່ມຊື່ວິຊາ';
            }
            if (!values.courseCode) {
              errors.courseCode = 'ກະລຸນາຕື່ມລະຫັດວິຊາ';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            //Set parameters for inserting to graphql
            let paramQL = {
              where: {
                id: courseData.id
              },
              data: {
                faculty: {
                  connect: {
                    id: FACULTY[selectFacultyIndex].id,
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
            _save(paramQL)
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
                  <Form noValidate>
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
                      {/* ຄະນະ */}
                      {FACULTY && <Form.Group
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
                            {FACULTY.map((x, index) => <option key={"faculty" + index} value={x.name}>{x.name}</option>)}
                          </Form.Control>
                        </Col>
                      </Form.Group>}

                      {/* ພາກວິຊາ */}
                      {FACULTY && selectFacultyIndex > -1 && FACULTY[selectFacultyIndex].departments && <Form.Group
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
                            <option disabled={true} value="">---Select Department---</option>
                            {selectFacultyIndex > -1 && FACULTY[selectFacultyIndex].departments.map((x, index) => <option key={"faculty" + index}>{x.name}</option>)}
                          </Form.Control>
                        </Col>
                      </Form.Group>}
                    </div>

                    {/* ---------- ຂໍ້ມູນວິຊາ --------- */}
                    <div style={{ marginBottom: 10 }}>
                      <div>
                        <i
                          className='fa fa-caret-down'
                          aria-hidden='true'
                          style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
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
                          <Form.Control.Feedback type="invalid">
                            {errors.title}
                          </Form.Control.Feedback>
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
                          <Form.Control disabled={true} type='text' placeholder='ກະລຸນາປ້ອນ' name="courseCode"
                            value={values.courseCode}
                            onChange={handleChange}
                            isInvalid={!!errors.courseCode} />
                          <Form.Control.Feedback type="invalid">
                            {errors.courseCode}
                          </Form.Control.Feedback>
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
                            onChange={handleChange}>
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
                          style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
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
                            onChange={handleChange} />
                        </Col>
                      </Form.Group>
                    </div>

                    {/* ---------- ອັບໂຫລດ --------- */}
                    <div style={{ marginBottom: 10 }}>
                      <div>
                        <i
                          className='fa fa-caret-down'
                          aria-hidden='true'
                          style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
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
                                marginTop: 10,
                                marginRight: 20,
                                textAlign: 'center'
                              }}
                            >
                              {!courseData.syllabusFile ? <img
                                style={{ width: 50, height: 50 }}
                                src='/assets/download.png'
                              />
                                :
                                <p style={{ height: 40, paddingTop: 10 }}>{courseData.syllabusFile.title}</p>}
                            </div>
                            <span>Drag or select file to here</span>
                          </div>
                          {acceptedFiles.length > 0 && <aside>
                            <h4>File to upload</h4>
                            <ul>{fileUploaded}</ul>
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
                  </Form>

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

                    <CustomButton confirm title='Edit' onClick={handleSubmit} />
                  </div>

                </div>

                {/* ------- AddConfirm Modal ------ */}
                <CourseEditConfirm
                  showEditConfirmModal={showEditConfirmModal}
                  _handleShowEditConfirmModalClose={_handleShowEditConfirmModalClose}
                  param={formParam}
                  FACULTY={FACULTY}
                />

              </div>

            )}
        </Formik>
        }

      </CustomContainer>
    </div>
  )
}

export default CourseEdit
