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
                    ລົງທະບຽນວິຊາ
                </Breadcrumb.Item>
                <Breadcrumb.Item onClick={() => {
                    history.push('/registration-list')
                    window.location.reload(true)
                }}>
                    ລາຍການລົງທະບຽນທັງຫມົດ
                </Breadcrumb.Item>
                <Breadcrumb.Item active>ລາຍລະອຽດ</Breadcrumb.Item>
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
                    <Title text='ລາຍລະອຽດ' />

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
                            <FontAwesomeIcon icon='edit' style={{ fontSize: 16 }} /> ແກ້ໃຂ
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
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ຂໍ້ມູນນັກຮຽນທີ່ລົງທະບຽນ</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            <Row>
                                <Col>ລະຫັດນັກຮຽນ</Col>
                                <Col>{data.student.userId ? data.student.userId : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ຊື່</Col>
                                <Col>{data.student.firstname ? data.student.firstname : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ນາມສະກຸນ</Col>
                                <Col>{data.student.lastname ? data.student.lastname : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ວັນເດືອນປີເກີດ</Col>
                                <Col>{data.student.birthday ? new Date(data.student.birthday).toLocaleDateString('la-LA') : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ເບິໂທ</Col>
                                <Col>{data.student.phone ? data.student.phone : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ອີເມວ</Col>
                                <Col>{data.student.email ? data.student.email : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ປີຮຽນ</Col>
                                <Col>{data.student.yearLevel ? data.student.yearLevel : '-'}</Col>
                            </Row>
                        </div>
                    </div> : ''}

                    {data.course ? <div style={{ padding: 20, paddingBottom: 0 }}>
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ຂໍ້ມູນວິຊາທີ່ລົງທະບຽນ</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            <Row>
                                <Col>ລະຫັດວິຊາ</Col>
                                <Col>{data.course.courseCode ? data.course.courseCode : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ຊື່ວິຊາ</Col>
                                <Col>{data.course.title ? data.course.title : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ຄະນະ</Col>
                                <Col>{data.course.department ? (data.course.department.faculty ? (data.course.department.faculty.name ? data.course.department.faculty.name : '-') : '-') : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ພາກວິຊາ</Col>
                                <Col>{data.course.department ? (data.course.department.name ? data.course.department.name : '-') : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ປີຮຽນ</Col>
                                <Col>{data.course.yearLevel ? data.course.yearLevel : '-'}</Col>
                            </Row>
                        </div>
                    </div> : ''}

                    <div style={{ padding: 20, paddingBottom: 0 }}>
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ຂໍ້ມູນການລົງທະບຽນ</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            <Row>
                                <Col>ລົງທະບຽນວັນທີ</Col>
                                <Col>{data.createdAt ? new Date(data.createdAt).toLocaleString('la-LA', { hour12: false }) : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ອັບເດດວັນທີ</Col>
                                <Col>{data.createdAt ? new Date(data.updatedAt).toLocaleString('la-LA', { hour12: false }) : '-'}</Col>
                            </Row>
                            <Row>
                                <Col>ໝາຍເຫດ</Col>
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
