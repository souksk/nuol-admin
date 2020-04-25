import React, { useCallback, useState } from 'react'
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
  ProgressBar
} from 'react-bootstrap'
import useReactRouter from 'use-react-router'
import Consts from '../../consts'
import { useDropzone } from 'react-dropzone'
import { useQuery, useMutation } from '@apollo/react-hooks';
import axios from "axios"
import { PRE_SIGNED_URL } from '../../apollo/doc'
import { UPDATE_COURSE } from '../../apollo/course'

const CourseDocUpload = ({
  courseDocUploadModal,
  _handlCourseDocUploadModalClose,
  courseData
}) => {

  const { history, location, match } = useReactRouter()
  const { loading, error, data: fileData } = useQuery(PRE_SIGNED_URL, { variables: { mimeType: "application/pdf" } })
  const [updateCourse, { data }] = useMutation(UPDATE_COURSE);

  //init state
  const [fileUploadProgress, setFileUploadProgress] = useState(0)
  const [files, setFiles] = useState([])
  const [titleName, setTitleName] = useState('')
  const [errFile, setErrFile] = useState('')
  const [errTitle, setErrTitle] = useState('')

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
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

  const _handleChangeTitleName = (e) => {
    setTitleName(e.target.value)
    setErrTitle('')
  }

  /* ເວລາກົດປຸ່ມແກ້ໄຂ */
  const _uploadFile = async (param) => {
    const { preSignedUrl } = fileData
    if (!titleName) {
      setErrTitle('ກະລຸນາຕື່ມຫົວຂໍ້!')
    }
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

        // ປ່ຽນຮູບແບບຕົວປ່ຽນໃຫ້ສາມາດອັບເດດກັບ GraphQL ໄດ້
        let paramQL = {
          data: {
            files: {
              create: {
                title: titleName,
                file: filename[0],
                type: "COURSE_FILE"
              }
            }
          },
          where: {
            id: courseData.id
          }
        };

        updateCourse({ variables: paramQL }).then((x) => {
          history.push("/course-detail", courseData)
          window.location.reload(true)
        }).catch((err) => {
          _handlCourseDocUploadModalClose()
        });
      }
    } else {
      /* ກໍານົດ paramQL ເພື່ອສົ່ງໄປຫນ້າຄອນເຟີມ */
      setErrFile('ກະລຸນາຕື່ມໄຟລ!')
      if (!titleName) {
        setErrTitle('ກະລຸນາຕື່ມຫົວຂໍ້!')
      }
    }
  }

  return (
    <div>
      <Modal
        show={courseDocUploadModal}
        onHide={_handlCourseDocUploadModalClose}
        size='lg'
      >
        <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
          ອັບໂຫລດບົດສອນ
        </Modal.Title>
        <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
          <p className='text-center'>ວິຊາຖານຂໍ້ມູນ</p>

          {/* file updload box */}
          <div style={{ border: '1px solid #eee', padding: 20, width: '100%' }}>
            {/* ຫົວຂໍ້ */}
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
                ຫົວຂໍ້
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  type='text'
                  placeholder='ກະລຸນາປ້ອນ'
                  value={titleName}
                  onChange={(e) => _handleChangeTitleName(e)}
                  style={{ borderRadius: 0 }}
                />
                {(errTitle) ? <p style={{ color: 'red', fontSize: 14 }}>{errTitle}</p> : ''}
              </Col>
            </Form.Group>

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
                ອັບໂຫລດໄຟລ
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
                  <span>Drag and drop or Browse</span>
                  {(acceptedFiles.length == 0 && errFile) ? <p style={{ color: 'red', fontSize: 14, marginTop: 10 }}>{errFile}</p> : ''}
                </div>
              </Col>
            </Form.Group>
          </div>

          {acceptedFiles.length > 0 && <aside>
            <h4>ໄຟລທີ່ຈະອັບໂຫລດ</h4>
            <ul>{fileUploaded}</ul>
          </aside>}

          {fileUploadProgress > 0 && fileUploadProgress < 100 && <div>
            <h3>ກໍາລັງອັບໂຫລດໄຟລເອກະສານ....</h3>
            <ProgressBar animated now={fileUploadProgress} label={`${fileUploadProgress}%`} />
          </div>
          }

          <div style={{ height: 20 }} />
          <div className='row' style={{ textAlign: 'center' }}>
            <div style={{ padding: 15 }} className='col'>
              <Button
                onClick={_handlCourseDocUploadModalClose}
                style={{
                  width: '60%',
                  backgroundColor: '#fff',
                  color: '#6f6f6f',
                  borderColor: Consts.PRIMARY_COLOR,
                  borderRadius: 0
                }}
              >
                ຍົກເລີກ
              </Button>
            </div>
            <div style={{ padding: 15 }} className='col'>
              <Button
                style={{
                  width: '60%',
                  backgroundColor: Consts.SECONDARY_COLOR,
                  color: '#fff',
                  borderColor: Consts.SECONDARY_COLOR,
                  borderRadius: 0
                }}
                onClick={_uploadFile}
              >
                ອັບໂຫລດບົດສອນ
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CourseDocUpload
