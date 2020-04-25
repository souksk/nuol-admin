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

function StudentEditConfirm({
  showAddConfirmModal,
  _handleShowAddConfirmModalClose,
  param,
  faculty
}) {
  const { history, location, match } = useReactRouter()
  const [updateUser, { data }] = useMutation(UPDATE_USER);
  const [onLoading, setOnLoading] = useState(false);

  var _day = param.data && param.data.day ? param.data.day : ''
  var _month = param.data && param.data.month ? param.data.month : ''
  var _year = param.data && param.data.year ? param.data.year : ''
  
  //send to backend server
  const _confirmTeacherEdit = async () => {
    setOnLoading(true)
    delete param.data.day
    delete param.data.month
    delete param.data.year

    if (!param.data.email) {
      delete param.data.email
    }
    if (!param.data.phone) {
      delete param.data.phone
    }
    if (!param.data.lastname) {
      delete param.data.lastname
    }
    if (!param.data.birthday || param.data.birthday == 'undefined-undefined-undefined') {
      delete param.data.birthday
    }
    if (!param.data.gender) {
      delete param.data.gender
    }
    if (!param.data.maritualStatus) {
      delete param.data.maritualStatus
    }

    await updateUser({ variables: param });
    setOnLoading(false)
    history.push("/student-list")
    window.location.reload(true)
  }

  const _renderFaculty = (id) => {
    let facultyIndex = _.find(faculty, function (o) { return o.id == id });
    return facultyIndex.name
  }

  const _renderDepartment = (facultyId, departmentId) => {
    let facultyIndex = _.findIndex(faculty, function (o) { return o.id == facultyId });
    let departnemt = _.find(faculty[facultyIndex].departments, function (o) { return o.id == departmentId });
    return departnemt.name
  }

  const _onConvertGenter = (gender) => {
    let result
    switch (gender) {
      case 'MALE':
        result = 'ຊາຍ'
        break;
      case 'FEMALE':
        result = 'ຍິງ'
        break;
      case 'OTHER':
        result = 'ອື່ນໆ'
        break;
      default:
        result = 'ຊາຍ'
    }
    return result
  }

  const _onConvertMaritualStatus = (maritualStatus) => {
    let result
    switch (maritualStatus) {
      case 'SINGLE':
        result = 'ໂສດ'
        break;
      case 'MARRIAGE':
        result = 'ແຕ່ງງານແລ້ວ'
        break;
      default:
        result = 'ໂສດ'
    }
    return result
  }

  return (
    <Modal
      show={showAddConfirmModal}
      onHide={_handleShowAddConfirmModalClose}
      size='lg'
    >
      <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
        ຢືນຢັນການແກ້ໄຂຂໍ້ມູນນັກຮຽນ
      </Modal.Title>
      <Modal.Body
        style={{
          marginLeft: 50,
          marginRight: 5, color: Consts.SECONDARY_COLOR0,
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
            {/* ---------- ຄະນະແລະພາກວິຊາ --------- */}
            <div style={{ marginBottom: 10 }}>
              <div>
                <i
                  className='fa fa-caret-down'
                  aria-hidden='true'
                  style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
                />
                ຄະນະແລະພາກວິຊາ
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
                  ຄະນະ
                </Form.Label>
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.faculty ? _renderFaculty(param.data.faculty.connect.id) : '-')}</span>
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
                  ພາກວິຊາ
                </Form.Label>
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && ((param.data.faculty && param.data.department) ? _renderDepartment(param.data.faculty.connect.id, param.data.department.connect.id) : '-')}</span>
                </Col>
              </Form.Group>

              {/* ປີຮຽນ */}
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
                  ປີຮຽນ
                </Form.Label>
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.yearLevel ? param.data.yearLevel : '-')}</span>
                </Col>
              </Form.Group>
            </div>

            {/* ---------- ຂໍ້ມູນອາຈານ --------- */}
            <div style={{ marginBottom: 10 }}>
              <div>
                <i
                  className='fa fa-caret-down'
                  aria-hidden='true'
                  style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
                />
                ຂໍ້ມູນນັກຮຽນ
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
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.firstname? param.data.firstname:'-')} </span>
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
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.lastname? param.data.lastname:'-')}</span>
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
                  <Col sm='8' style={{marginTop:8}}>
                    <span>
                      {param.data && ((param.data.birthday && param.data.birthday != "undefined-undefined-undefined") ? (_day + '-' + _month + '-' + _year) : '-')}
                    </span>
                  </Col>
                </Form.Group>

                {/* ເພດ */}
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
                    ເພດ
                </Form.Label>
                  <Col sm='8' style={{marginTop:8}}>
                    <span>
                      {param.data && (param.data.gender ? _onConvertGenter(param.data.gender) : '')}
                    </span>
                  </Col>
                </Form.Group>

                {/* ສະຖານະ */}
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
                    ສະຖານະ
                </Form.Label>
                  <Col sm='8' style={{marginTop:8}}>
                    <span>
                      {param.data && (param.data.maritualStatus ? _onConvertMaritualStatus(param.data.maritualStatus) : '')}
                    </span>
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
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.userId? param.data.userId:'-')}</span>
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
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.phone? param.data.phone : '-')}</span>
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
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.email? param.data.email:'-')}</span>
                </Col>
              </Form.Group>
            </div>

            {/* ---------- ໄອດີ ແລະ ລະຫັດຜ່ານ --------- */}
            <div style={{ marginBottom: 10 }}>
              <div>
                <i
                  className='fa fa-caret-down'
                  aria-hidden='true'
                  style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
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
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.userId? param.data.userId:'-')}</span>
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
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.password? param.data.password:'-')}</span>
                </Col>
              </Form.Group>

            </div>

            {/* ---------- ອື່ນໆ --------- */}
            <div style={{ marginBottom: 10 }}>
              <div>
                <i
                  className='fa fa-caret-down'
                  aria-hidden='true'
                  style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
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
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.description? param.data.description:'-')}</span>
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
                <Col sm='8' style={{marginTop:8}}>
                  <span>{param.data && (param.data.note? param.data.note:'-')}</span>
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
                borderColor: Consts.SECONDARY_COLOR
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
              onClick={() => _confirmTeacherEdit()}
            >
              ຕົກລົງ
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default StudentEditConfirm
