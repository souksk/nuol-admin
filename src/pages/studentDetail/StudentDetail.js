import React, { useState, useCallback } from 'react'
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Consts from '../../consts'
import CourseDeleteConfirm from './StudentDeleteConfirm'
import { CustomContainer, SearchBar, Title, CustomButton } from '../../common'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { USER, DELETE_USER } from './../../apollo/user'

function StudentDetail() {
  const { history, location, match } = useReactRouter()

  const apolloData = useQuery(USER, { variables: { where: { id: location.state.id } } });
  const { loading, error } = apolloData
  const studentData = apolloData.data && apolloData.data.user ? apolloData.data.user : {}
  const [deleteUser, deleteUserData] = useMutation(DELETE_USER, { variables: { where: { id: location.state.id } } });

  // States
  const [showDeleteConfirmView, setShowDeleteConfirmView] = useState(false)

  // Set states
  const _handleDeleteConfirmViewClose = () => setShowDeleteConfirmView(false)
  const _handleDeleteConfirmViewShow = () => setShowDeleteConfirmView(true)


  const _edit = () => {
    history.push('/student-edit', studentData)
  }

  const _delete = () => {
    _handleDeleteConfirmViewShow()
  }

  const _deleteConfirm = async () => {
    await deleteUser();
    history.push('/student-list')
    window.location.reload(true)
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
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/student-list')}>
          ຈັດການນັກຮຽນ
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => history.push('/student-list')}>
          ລາຍຊື່ນັກຮຽນທັງໝົດ
        </Breadcrumb.Item>
        <Breadcrumb.Item active>ລາຍລະອຽດນັກຮຽນ</Breadcrumb.Item>
      </Breadcrumb>
      <CustomContainer>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Title text='ລາຍລະອຽດນັກຮຽນ' />

          {/* Button group */}
          <div>
            {/* ແກ້ໄຂ */}
            <button
              style={{
                backgroundColor: '#fff',
                color: Consts.BORDER_COLOR,
                width: 100,
                height: 40,
                border: '1px solid ' + Consts.BORDER_COLOR,
                outline: 'none',
                marginRight: 5
              }}
              onClick={() => _edit()}
            >
              <FontAwesomeIcon icon='edit' style={{ fontSize: 16 }} /> ແກ້ໄຂ
            </button>

            {/* ລຶບ */}
            <button
              style={{
                backgroundColor: '#fff',
                color: Consts.BORDER_COLOR_DELETE,
                width: 100,
                height: 40,
                border: '1px solid ' + Consts.BORDER_COLOR_DELETE,
                outline: 'none'
              }}
              onClick={() => _delete()}
            >
              <i className='fa fa-trash' /> ລຶບ
            </button>
          </div>
        </div>

        <div
          style={{
            width: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 20,
            paddingBottom: 80
          }}
        >

          {/* -------- ຄະນະແລະພາກວິຊາ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ຄະນະແລະພາກວິຊາ</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>ຄະນະ</Col>
                <Col>{(studentData && studentData.faculty && studentData.faculty.name) ? studentData && studentData.faculty && studentData.faculty.name : '-'}</Col>
              </Row>
              <Row>
                <Col>ພາກວິຊາ</Col>
                <Col>{(studentData && studentData.department && studentData.department.name) ? studentData && studentData.department && studentData.department.name : '-'}</Col>
              </Row>
              <Row>
                <Col>ປີຮຽນ</Col>
                <Col>{studentData && (studentData.yearLevel ? studentData.yearLevel : '-')}</Col>
              </Row>
            </div>
          </div>

          {/* -------- ຂໍ້ມູນນັກຮຽນ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ຂໍ້ມູນນັກຮຽນ</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>ຊື່</Col>
                <Col>{studentData && (studentData.firstname ? studentData.firstname : '-')}</Col>
              </Row>
              <Row>
                <Col>ນາມສະກຸນ</Col>
                <Col>{studentData && (studentData.lastname ? studentData.lastname : '-')}</Col>
              </Row>
              <Row>
                <Col>ວັນເດືອນປີເກີດ</Col>
                <Col>
                  {studentData && (studentData.birthday ? new Date(studentData.birthday).toLocaleDateString() : '-')}
                </Col>
              </Row>
              <Row>
                <Col>ເພດ</Col>
                <Col>
                  {studentData && (studentData.gender ? _onConvertGenter(studentData.gender) : '-')}
                </Col>
              </Row>
              <Row>
                <Col>ສະຖານະ</Col>
                <Col>
                  {studentData && (studentData.maritualStatus ? _onConvertMaritualStatus(studentData.maritualStatus) : '-')}
                </Col>
              </Row>
              <Row>
                <Col>ເບີໂທ</Col>
                <Col>{studentData && (studentData.phone ? studentData.phone : '-')}</Col>
              </Row>
              <Row>
                <Col>ອີເມວ</Col>
                <Col>{studentData && (studentData.email ? studentData.email : '-')}</Col>
              </Row>
            </div>
          </div>

          {/* -------- ໄອດີແລະລະຫັດຜ່ານ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ໄອດີ ແລະ ລະຫັດຜ່ານ</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>ໄອດີ</Col>
                <Col>{studentData && (studentData.userId ? studentData.userId : '-')}</Col>
              </Row>
              <Row>
                <Col>ລະຫັດຜ່ານ</Col>
                <Col>********</Col>
              </Row>
            </div>
          </div>

          {/* -------- ອື່ນໆ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ອື່ນໆ</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>ລາຍລະອຽດ</Col>
                <Col>{studentData && (studentData.description ? studentData.description : '-')}</Col>
              </Row>
              <Row>
                <Col>ໝາຍເຫດ</Col>
                <Col>{studentData && (studentData.note ? studentData.note : '-')}</Col>
              </Row>
            </div>
          </div>
        </div>

        {/* ------- Delete Modal ------ */}
        {/* DeleteConfirm Modal */}
        <CourseDeleteConfirm
          showDeleteConfirmView={showDeleteConfirmView}
          _handleDeleteConfirmViewClose={_handleDeleteConfirmViewClose}
          _deleteConfirm={_deleteConfirm}
          studentData={studentData}
        />
      </CustomContainer>
    </div>
  )
}

export default StudentDetail
