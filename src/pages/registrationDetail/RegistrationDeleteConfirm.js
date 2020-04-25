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
import Consts from '../../consts'
import useReactRouter from 'use-react-router'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { DELETE_REGISTRATION } from '../../apollo/registration'


const RegistrationDeleteConfirm = ({
  showDeleteConfirmView,
  _handleDeleteConfirmViewClose,
  data
}) => {
  const { history, location, match } = useReactRouter()
  const [deleteRegistration] = useMutation(DELETE_REGISTRATION);

  const _deleteRegistration = () => {
    deleteRegistration({ variables: { where: { id: data.id } } }).then(async () => {
      await history.push('/registration-list')
      window.location.reload(true)
    }).catch((err) => {
      //console.log(err)
    })
  }

  return (
    <Modal
      show={showDeleteConfirmView}
      onHide={_handleDeleteConfirmViewClose}
      size='lg'
    >
      <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
        <Modal.Title
					style={{
						textAlign: 'center',
						paddingTop: 20,
						color: Consts.BORDER_COLOR_DELETE,
						fontWeight: 'bold'
					}}
				>
					ຕ້ອງການລຶບການລົງທະບຽນ?
				</Modal.Title>

        <p className='text-center'>{data && (data.student ? (data.student.firstname + ' ' + (data.student.lastname ? data.student.lastname : '')) : '')}</p>

        <div style={{ height: 20 }} />
        <div className='row'>
          <div style={{ padding: 15 }} className='col'>
            <Button
              onClick={_handleDeleteConfirmViewClose}
              style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#6f6f6f',
                borderColor: Consts.DELETE_COLOR_BUTTON
              }}
            >
              ຍົກເລີກ
            </Button>
          </div>
          <div style={{ padding: 15 }} className='col'>
            <Button
              style={{
                width: '100%',
                backgroundColor: Consts.DELETE_COLOR_BUTTON,
                color: '#fff',
                borderColor: Consts.DELETE_COLOR_BUTTON
              }}
              onClick={() => _deleteRegistration()}
            >
              ລຶບ
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default RegistrationDeleteConfirm
