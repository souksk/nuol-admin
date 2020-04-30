import React, { useState, useCallback, useEffect } from 'react'
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
import RegistrationDeleteConfirm from './RegistrationDeleteConfirm'
import RegistrationEdit from './RegistrationEdit'
import { CustomContainer, SearchBar, Title, CustomButton } from '../../common'

function RegistrationDetail() {
    const { history, location, match } = useReactRouter()

    // States
    const [data, setData] = useState({})
    const [showDeleteConfirmView, setShowDeleteConfirmView] = useState(false)
    const [showEditView, setShowEditView] = useState(false)

    // Set states
    const _handleDeleteConfirmViewClose = () => setShowDeleteConfirmView(false)
    const _handleDeleteConfirmViewShow = () => setShowDeleteConfirmView(true)

    const _handleEditViewClose = () => setShowEditView(false)
    const _handleEditViewShow = () => setShowEditView(true)

    useEffect(() => {
        setData(location.state)
    }, [])

    const _delete = () => {
        _handleDeleteConfirmViewShow()
    }

    const _edit = () => {
        _handleEditViewShow()
    }

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item onClick={() => {
                    history.push('/registration-list')
                    window.location.reload(true)
                }}>
                    Registration
                </Breadcrumb.Item>
                <Breadcrumb.Item onClick={() => {
                    history.push('/registration-list')
                    window.location.reload(true)
                }}>
                    All Registrations
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Registration Detail</Breadcrumb.Item>
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
                    <Title text='REGISTRATION DETAIL' />

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

                {data ? <div
                    style={{
                        width: 800,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 20,
                        paddingBottom: 80
                    }}
                >

                    {data.student ? <div style={{ padding: 20, paddingBottom: 0 }}>
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Student Detail</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            <Row>
                                <Col>Student ID</Col>
                                <Col>{data.student.userId ? data.student.userId : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>First name</Col>
                                <Col>{data.student.firstname ? data.student.firstname : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>Last name</Col>
                                <Col>{data.student.lastname ? data.student.lastname : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>Birthday</Col>
                                <Col>{data.student.birthday ? new Date(data.student.birthday).toLocaleDateString('la-LA') : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>Phone number</Col>
                                <Col>{data.student.phone ? data.student.phone : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>E-Mail</Col>
                                <Col>{data.student.email ? data.student.email : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>Year level</Col>
                                <Col>{data.student.yearLevel ? data.student.yearLevel : '-'}</Col>
                            </Row>
                        </div>
                    </div> : ''}

                    {data.course ? <div style={{ padding: 20, paddingBottom: 0 }}>
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Course Detail</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            <Row>
                                <Col>Course ID</Col>
                                <Col>{data.course.courseCode ? data.course.courseCode : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>Course name</Col>
                                <Col>{data.course.title ? data.course.title : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>Faculty</Col>
                                <Col>{data.course.department ? (data.course.department.faculty ? (data.course.department.faculty.name ? data.course.department.faculty.name : '-') : '-') : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>Department</Col>
                                <Col>{data.course.department ? (data.course.department.name ? data.course.department.name : '-') : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>Year level</Col>
                                <Col>{data.course.yearLevel ? data.course.yearLevel : '-'}</Col>
                            </Row>
                        </div>
                    </div> : ''}

                    <div style={{ padding: 20, paddingBottom: 0 }}>
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Registration Detfail</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            <Row>
                                <Col>Register date</Col>
                                <Col>{data.createdAt ? new Date(data.createdAt).toLocaleString('la-LA', { hour12: false }) : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>Update date</Col>
                                <Col>{data.updatedAt ? new Date(data.updatedAt).toLocaleString('la-LA', { hour12: false }) : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>Description</Col>
                                <Col>{data.note ? data.note : '-'}</Col>
                            </Row>
                        </div>
                    </div>

                </div> : ''}


                {/* ------- Edit Modal ------ */}
                <RegistrationEdit
                    showEditView={showEditView}
                    _handleEditViewClose={_handleEditViewClose}
                    registrationData={data}
                />

                {/* ------- Delete Modal ------ */}
                <RegistrationDeleteConfirm
                    showDeleteConfirmView={showDeleteConfirmView}
                    _handleDeleteConfirmViewClose={_handleDeleteConfirmViewClose}
                    data={data}
                />

            </CustomContainer>
        </div>
    )
}

export default RegistrationDetail
