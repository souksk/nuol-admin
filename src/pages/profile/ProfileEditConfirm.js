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
  FormControl
} from 'react-bootstrap'
import Consts from '../../consts';
import * as _ from 'lodash';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { UPDATE_USER } from '../../apollo/user'

function ProfileEditConfirm({
  showAddConfirmModal,
  _handleShowAddConfirmModalClose,
  param
}) {
  const { history, location, match } = useReactRouter()
  const [updateUser, { data }] = useMutation(UPDATE_USER);

  var _day = param.data && param.data.birthday ? new Date(param.data.birthday).getDate() : ''
  var _month = param.data && param.data.birthday ? new Date(param.data.birthday).getMonth() + 1 : ''
  var _year = param.data && param.data.birthday ? new Date(param.data.birthday).getFullYear() : ''

  //send to backend server
  const _confirmProfileEdit = async () => {

    if (param.data.userId) {
      delete param.data.userId
    }

    await updateUser({ variables: param });
    history.push("/profile-detail", param.where)
    window.location.reload(true)
  }

  return (
    <Modal
      show={showAddConfirmModal}
      onHide={_handleShowAddConfirmModalClose}
      size='lg'
    >
      <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
        CONFIRM EDIT PROFILE
      </Modal.Title>
      <Modal.Body
        style={{
          marginLeft: 50,
          marginRight: 50,
          padding: 50,
          paddingTop: 0
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            padding: 10,
            marginTop: 20
          }}
        >
          {/* Form container */}
          <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>

            {/* ---------- ຂໍ້ມູນ --------- */}
            <div style={{ marginBottom: 10 }}>
              <div>
                <i
                  className='fa fa-caret-down'
                  aria-hidden='true'
                  style={{ marginRight: 5 }}
                />
                General
              </div>
              {/* ຊື່ */}
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
                  First name
                </Form.Label>
                <Col sm='8'>
                  <span>{param.data && (param.data.firstname ? param.data.firstname : '-')} </span>
                </Col>
              </Form.Group>

              {/* ນາມສະກຸນ */}
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
                  Last name
                </Form.Label>
                <Col sm='8'>
                  <span>{param.data && (param.data.lastname ? param.data.lastname : '-')}</span>
                </Col>
              </Form.Group>

              {/* ວັນເດືອນປີເກີດ */}
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
                  Birthday
                </Form.Label>
                <Col sm='8'>
                  <span>
                    {param.data && ((param.data.birthday && param.data.birthday != "undefined-undefined-undefined") ? (_day + '-' + _month + '-' + _year) : '-')}
                  </span>
                </Col>
              </Form.Group>

              {/* ເບີໂທ */}
              {param.data && param.data.phone && <Form.Group
                as={Row}
                style={{
                  margin: 0,
                  marginBottom: 10,
                  paddingLeft: 20,
                  fontSize: 16
                }}
              >
                <Form.Label column sm='4' className='text-left'>
                  Phone number
                </Form.Label>
                <Col sm='8'>
                  <span>{param.data.phone}</span>
                </Col>
              </Form.Group>}


              {/* ອີເມວ */}
              {param.data && param.data.email && <Form.Group
                as={Row}
                style={{
                  margin: 0,
                  marginBottom: 10,
                  paddingLeft: 20,
                  fontSize: 16
                }}
              >
                <Form.Label column sm='4' className='text-left'>
                  E-Mail
                </Form.Label>
                <Col sm='8'>
                  <span>
                    {param.data.email}
                  </span>
                </Col>
              </Form.Group>}
            </div>

            {/* ---------- ໄອດີ ແລະ ລະຫັດຜ່ານ --------- */}
            <div style={{ marginBottom: 10 }}>
              <div>
                <i
                  className='fa fa-caret-down'
                  aria-hidden='true'
                  style={{ marginRight: 5 }}
                />
                User ID and Password
              </div>
              {/* ໄອດີ */}
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
                  User ID
                </Form.Label>
                <Col sm='8'>
                  <span>{param.data && (param.data.userId ? param.data.userId : '-')}</span>
                </Col>
              </Form.Group>

              {/* ລະຫັດຜ່ານ */}
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
                  Password
                </Form.Label>
                <Col sm='8'>
                  <span>{param.data && (param.data.password ? param.data.password : '-')}</span>
                </Col>
              </Form.Group>

            </div>

            {/* ---------- ອື່ນໆ --------- */}
            <div style={{ marginBottom: 10 }}>
              <div>
                <i
                  className='fa fa-caret-down'
                  aria-hidden='true'
                  style={{ marginRight: 5 }}
                />
                Other
              </div>
              {/* ລາຍລະອຽດ */}
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
                  <span>{param.data && (param.data.description ? param.data.description : '-')}</span>
                </Col>
              </Form.Group>

              {/* ໝາຍເຫດ */}
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
                  Note
                </Form.Label>
                <Col sm='8'>
                  <span>{param.data && (param.data.note ? param.data.note : '-')}</span>
                </Col>
              </Form.Group>
            </div>

          </div>
        </div>

        <div style={{ height: 20 }} />
        <div className='row'>
          <div style={{ padding: 15 }} className='col'>
            <Button
              onClick={_handleShowAddConfirmModalClose}
              style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#6f6f6f',
                borderColor: '#6f6f6f'
              }}
            >
              Cancel
            </Button>
          </div>
          <div style={{ padding: 15 }} className='col'>
            <Button
              style={{
                width: '100%',
                backgroundColor: Consts.SECONDARY_COLOR,
                color: '#fff',
                borderColor: Consts.SECONDARY_COLOR
              }}
              onClick={() => _confirmProfileEdit()}
            >
              Edit
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ProfileEditConfirm
