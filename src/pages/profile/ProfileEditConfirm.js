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
  var _day = param.data && param.data.day ? param.data.day : ''
  var _month = param.data && param.data.month ? param.data.month : ''
  var _year = param.data && param.data.year ? param.data.year : ''

  //send to backend server
  const _confirmProfileEdit = async () => {
    delete param.data.day
    delete param.data.month
    delete param.data.year
    
    if(!param.data.birthday){
      delete param.data.birthday
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
        ຢືນຢັນການແກ້ໄຂຂໍ້ມູນສ່ວນຕົວ
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
                ຂໍ້ມູນສ່ວນຕົວ
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
                  ຊື່
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
                  ນາມສະກຸນ
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
                  ວັນເດືອນປີເກີດ
                </Form.Label>
                <Col sm='8'>
                  <span>{param.data && (param.data.birthday ? (_day + '-' + _month + '-' + _year) : '-')}</span>
                </Col>
              </Form.Group>

              {/* ລະຫັດອາຈານ */}
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
                  ລະຫັດນັກຮຽນ
                </Form.Label>
                <Col sm='8'>
                  <span>{param.data && (param.data.userId ? param.data.userId : '-')}</span>
                </Col>
              </Form.Group>

              {/* ເບີໂທ */}
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
                  ເບີໂທ
                </Form.Label>
                <Col sm='8'>
                  <span>{param.data && (param.data.phone ? param.data.phone : '-')}</span>
                </Col>
              </Form.Group>


              {/* ອີເມວ */}
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
                  ອີເມວ
                </Form.Label>
                <Col sm='8'>
                  <span>{param.data && (param.data.email ? param.data.email : '-')}</span>
                </Col>
              </Form.Group>
            </div>

            {/* ---------- ໄອດີ ແລະ ລະຫັດຜ່ານ --------- */}
            <div style={{ marginBottom: 10 }}>
              <div>
                <i
                  className='fa fa-caret-down'
                  aria-hidden='true'
                  style={{ marginRight: 5 }}
                />
                ໄອດີ ແລະ ລະຫັດຜ່ານ
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
                  ໄອດີ
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
                  ລະຫັດຜ່ານ
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
                ອື່ນໆ
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
                  ລາຍລະອຽດ
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
                  ໝາຍເຫດ
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
              ຍົກເລີກ
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
              ຕົກລົງ
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ProfileEditConfirm
