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
import axios from "axios"
import { useQuery, useMutation } from '@apollo/react-hooks';
import { PRE_SIGNED_URL, UPDATE_FILE } from '../../apollo/doc'
import { UPDATE_COURSE } from '../../apollo/course'

const CourseDocEdit = ({ courseDocEditModal, _handlCourseDocEditModalClose, dataEdit }) => {
  const { history, location, match } = useReactRouter()

  const { loading, error, data: fileData } = useQuery(PRE_SIGNED_URL, { variables: { mimeType: "application/pdf" } })
  const [updateCourse, { data }] = useMutation(UPDATE_COURSE);
  const [updateFile, { data: dataUpdateFile }] = useMutation(UPDATE_FILE);

  const [fileTitle, setFileTitle] = useState('')
  const [fileName, setFileName] = useState('')
  const [files, setFiles] = useState([])
  const [fileUploadProgress, setFileUploadProgress] = useState(0)

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setFiles(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop })

  const _onChangeFileTitle = (e) => {
    setFileTitle(e.target.value)
  }
  const _onChangeFileName = (e) => {
    setFileName(e.target.value)
  }

  const fileUploaded = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} ຂະຫນາດ: {file.size} bytes
    </li>
  ));

  const _uploadFile = async (param) => {
    const { preSignedUrl } = fileData

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

        let paramQLDisconnect = {
          data: {
            files: {
              disconnect: {
                id: dataEdit.dataEdit.id
              }
            }
          },
          where: {
            id: dataEdit.courseData.id
          }
        };
        let paramQLConnect = {
          data: {
            files: {
              create: {
                title: fileTitle ? fileTitle : dataEdit.dataEdit.title,
                file: filename[0],
                type: "COURSE_FILE"
              }
            }
          },
          where: {
            id: dataEdit.courseData.id
          }
        };

        updateCourse({ variables: paramQLDisconnect }).then(() => {
          updateCourse({ variables: paramQLConnect }).then(() => {
            history.push("/course-detail", dataEdit.courseData)
            window.location.reload(true)
          }).catch((err) => {
            _handlCourseDocEditModalClose()
          });
        }).catch((err) => {
          _handlCourseDocEditModalClose()
        });
      }
    } else {
      let paramQL = {
        data: {
          title: fileTitle ? fileTitle : dataEdit.dataEdit.title
        },
        where: {
          id: dataEdit.dataEdit.id
        }
      };

      updateFile({ variables: paramQL }).then(() => {
        history.push("/course-detail", dataEdit.courseData)
        window.location.reload(true)
      }).catch((err) => {
        _handlCourseDocEditModalClose()
      });
    }
  }

  return (
    <div>
      <Modal
        show={courseDocEditModal}
        onHide={_handlCourseDocEditModalClose}
        size='lg'
      >
        <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
          ແກ້ໃຂເອກະສານບົດສອນ
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
                  placeholder='ປ້ອນເພື່ອປ່ຽນຫົວຂໍ້'
                  value={fileTitle}
                  onChange={(e) => _onChangeFileTitle(e)}
                  style={{ borderRadius: 0 }}
                />
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
                      display: 'flex',
                      backgroundColor: '#f3f3f3',
                      marginLeft: 20,
                      marginTop: 20,
                      marginRight: 20,
                      textAlign: 'center',
                      height: 50,
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {dataEdit && dataEdit.dataEdit && <span style={{ textDecoration: 'underline', color: Consts.PRIMARY_COLOR }}>{dataEdit.dataEdit.file.split('/')[4]}</span>}
                  </div>
                  <span>Drag and drop or <span style={{color: Consts.PRIMARY_COLOR}}>Browse</span></span>
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
                onClick={_handlCourseDocEditModalClose}
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
                ບັນທຶກການແກ້ໃຂ
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CourseDocEdit
