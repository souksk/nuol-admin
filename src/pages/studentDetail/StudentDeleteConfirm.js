import React, {useCallback} from 'react'
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
import Consts from '../../consts'

const CourseDeleteConfirm = ({
  showDeleteConfirmView,
  _handleDeleteConfirmViewClose,
  _deleteConfirm,
  studentData
}) => {
  return (
    <Modal
      show={showDeleteConfirmView}
      onHide={_handleDeleteConfirmViewClose}
      size='lg'
    >
      <Modal.Body style={{marginLeft: 50, marginRight: 50, padding: 50}}>
      <Modal.Title
					style={{
						textAlign: 'center',
						paddingTop: 20,
						color: Consts.BORDER_COLOR_DELETE,
						fontWeight: 'bold'
					}}
				>
					Do you want to delete?
				</Modal.Title>

        <p className='text-center'>{studentData && studentData.firstname} {studentData && studentData.lastname}</p>

        <div style={{height: 20}} />
        <div className='row'>
          <div style={{padding: 15}} className='col'>
            <Button
              onClick={_handleDeleteConfirmViewClose}
              style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#6f6f6f',
                borderColor: Consts.DELETE_COLOR_BUTTON
              }}
            >
              Cancel
            </Button>
          </div>
          <div style={{padding: 15}} className='col'>
            <Button
              style={{
                width: '100%',
                backgroundColor: Consts.DELETE_COLOR_BUTTON,
                color: '#fff',
                borderColor: Consts.DELETE_COLOR_BUTTON
              }}
              onClick={_deleteConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CourseDeleteConfirm
