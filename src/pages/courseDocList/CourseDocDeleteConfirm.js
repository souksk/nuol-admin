import React, { useCallback } from 'react'
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
import useReactRouter from 'use-react-router'
import { useQuery, useMutation } from '@apollo/react-hooks';
import Consts from '../../consts'
import { UPDATE_COURSE } from '../../apollo/course'

const CourseDocDeleteConfirm = ({
  courseDocDeleteConfirmModal,
  _handlCourseDocDeleteConfirmModalClose,
  dataDelete
}) => {
  const { history, location, match } = useReactRouter()
  // //console.log("dataDelete: ", dataDelete)
  const [updateCourse, { data }] = useMutation(UPDATE_COURSE);

  const _confirmDelete = () => {
    let paramQL = {
      data: {
        files: {
          disconnect: {
            id: dataDelete.dataDelete.id
          }
        }
      },
      where: {
        id: dataDelete.courseData.id
      }
    };
    updateCourse({ variables: paramQL }).then((x) => {
      history.push("/course-detail", dataDelete.courseData)
      window.location.reload(true)
    }).catch((err) => {
      _handlCourseDocDeleteConfirmModalClose()
    });
  }

  return (
    <div>
      <Modal
        show={courseDocDeleteConfirmModal}
        onHide={_handlCourseDocDeleteConfirmModalClose}
        size='lg'
      >
        <Modal.Title style={{ textAlign: 'center', paddingTop: 20, color: Consts.BORDER_COLOR_DELETE, fontWeight: 'bold' }}>
          ຕ້ອງການລຶບເອກະສານ?
        </Modal.Title>
        <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
          <p className='text-center'>{dataDelete && dataDelete.dataDelete && dataDelete.dataDelete.title}</p>

          <div style={{ height: 20 }} />
          <div className='row' style={{ textAlign: 'center' }}>
            <div style={{ padding: 15 }} className='col'>
              <Button
                onClick={_handlCourseDocDeleteConfirmModalClose}
                style={{
                  width: '60%',
                  backgroundColor: '#fff',
                  color: '#6f6f6f',
                  borderColor: Consts.DELETE_COLOR_BUTTON,
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
                  backgroundColor: Consts.DELETE_COLOR_BUTTON,
                  color: '#fff',
                  borderColor: Consts.DELETE_COLOR_BUTTON,
                  borderRadius: 0
                }}
                onClick={() => _confirmDelete()}
              >
                ລົບ
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CourseDocDeleteConfirm
