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
import TeacherDeleteConfirm from './TeacherDeleteConfirm'
import { CustomContainer, SearchBar, Title, CustomButton } from '../../common'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { USER, DELETE_USER } from './../../apollo/user'

function TeacherDetail() {
  const { history, location, match } = useReactRouter()
  const { loading, error, data } = useQuery(USER, {
    variables: { where: { id: location.state.id } }
  })
  const [deleteUser, deleteUserData] = useMutation(DELETE_USER, {
    variables: { where: { id: location.state.id } }
  })

  // States
  const [showDeleteConfirmView, setShowDeleteConfirmView] = useState(false)
  const [userData, setUserData] = useState(null)
  if (userData == null && data && data.user) setUserData(data.user)

  // Set states
  const _handleDeleteConfirmViewClose = () => setShowDeleteConfirmView(false)
  const _handleDeleteConfirmViewShow = () => setShowDeleteConfirmView(true)

  const _edit = event => {
    history.push('/teacher-edit', userData)
  }

  const _delete = () => {
    _handleDeleteConfirmViewShow()
  }

  const _deleteConfirm = async () => {
    await deleteUser()
    history.push('/teacher-list')
    window.location.reload(true)
  }

  const _onConvertGenter = (gender) => {
    let result
    switch (gender) {
      case 'MALE':
        result = 'Male'
        break;
      case 'FEMALE':
        result = 'Famale'
        break;
      default:
        result = 'Male'
    }
    return result
  }

  const _onConvertMaritualStatus = (maritualStatus) => {
    let result
    switch (maritualStatus) {
      case 'SINGLE':
        result = 'Single'
        break;
      case 'MARRIAGE':
        result = 'Marriage'
        break;
      default:
        result = 'Single'
    }
    return result
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/teacher-list')}>
          Teacher Management
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => history.push('/teacher-list')}>
          All Teachers
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Teacher Detail</Breadcrumb.Item>
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
          <Title text='TEACHER DETAIL' />

          {/* Button group */}
          <div>
            {/* ແກ້ໃຂ */}
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
              <FontAwesomeIcon icon='edit' style={{ fontSize: 16 }} /> Edit
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
              <i className='fa fa-trash' /> Delete
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
            <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Faculty and Department</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>Faculty</Col>
                <Col>
                  {userData && userData.faculty && (userData.faculty.name ? userData.faculty.name : '-')}
                </Col>
              </Row>
              <Row>
                <Col>Department</Col>
                <Col>
                  {userData && userData.department && (userData.department.name ? userData.department.name : '-')}
                </Col>
              </Row>
            </div>
          </div>

          {/* -------- ຂໍ້ມູນອາຈານ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Teacher</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>First name</Col>
                <Col>
                  {userData && (userData.firstname ? userData.firstname : '-')}
                </Col>
              </Row>
              <Row>
                <Col>Last name</Col>
                <Col>
                  {userData && (userData.lastname ? userData.lastname : '-')}
                </Col>
              </Row>
              <Row>
                <Col>Birthday</Col>
                <Col>
                  {userData && (userData.birthday ? new Date(userData.birthday).toLocaleDateString() : '-')}
                </Col>
              </Row>
              <Row>
                <Col>Gender</Col>
                <Col>
                  {userData && (userData.gender ? _onConvertGenter(userData.gender) : '-')}
                </Col>
              </Row>
              <Row>
                <Col>Status</Col>
                <Col>
                  {userData && (userData.maritualStatus ? _onConvertMaritualStatus(userData.maritualStatus) : '-')}
                </Col>
              </Row>
              <Row>
                <Col>Phone number</Col>
                <Col>
                  {userData && (userData.phone ? userData.phone : '-')}
                </Col>
              </Row>
              <Row>
                <Col>E-Mail</Col>
                <Col>
                  {userData && (userData.email ? userData.email : '-')}
                </Col>
              </Row>
            </div>
          </div>

          {/* -------- ໄອດີ ແລະ ລະຫັດຜ່ານ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />User ID and Password</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>User ID</Col>
                <Col>
                  {userData && userData.userId}
                </Col>
              </Row>
              <Row>
                <Col>Password</Col>
                <Col>
                  ********
                </Col>
              </Row>
            </div>
          </div>
          {/* -------- ຄໍາອະທິບາຍ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Other</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>Description</Col>
                <Col>
                  {userData && (userData.description ? userData.description : '-')}
                </Col>
              </Row>
              <Row>
                <Col>Note</Col>
                <Col>
                  {userData && (userData.note ? userData.note : '-')}
                </Col>
              </Row>
            </div>
          </div>
        </div>

        {/* ------- Delete Modal ------ */}
        {/* DeleteConfirm Modal */}
        <TeacherDeleteConfirm
          showDeleteConfirmView={showDeleteConfirmView}
          _handleDeleteConfirmViewClose={_handleDeleteConfirmViewClose}
          _deleteConfirm={_deleteConfirm}
          teacherData={userData}
        />
      </CustomContainer>
    </div>
  )
}

export default TeacherDetail
