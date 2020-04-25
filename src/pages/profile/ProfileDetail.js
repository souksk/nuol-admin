import React, { useState, useCallback } from 'react'
import {
    Breadcrumb,
    Row,
    Col,
} from 'react-bootstrap'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Consts from '../../consts'
import { CustomContainer, SearchBar, Title, CustomButton } from '../../common'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { USER, DELETE_USER } from './../../apollo/user'

function ProfileDetail() {
    const { history, location, match } = useReactRouter()
    //console.log("location: ", location)
    const { loading, error, data } = useQuery(USER, {
        variables: { where: { id: location.state.id } }
    })

    // States
    const [userData, setUserData] = useState(null)
    if (userData == null && data && data.user) setUserData(data.user)

    const _edit = () => {
        history.push('/profile-edit', userData)
    }

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item active>ຂໍ້ມູນສ່ວນຕົວ</Breadcrumb.Item>
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
                    <Title text={'ລາຍລະອຽດສ່ວນຕົວ'} />

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

                    </div>
                </div>

                {userData ? <div
                    style={{
                        width: 500,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 20,
                        paddingBottom: 80
                    }}
                    >

                    {/* -------- ຂໍ້ມູນອາຈານ -------- */}
                    <div style={{ padding: 20, paddingBottom: 0 }}>
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ຂໍ້ມູນ {userData.role}</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            <Row>
                                <Col>ຊື່</Col>
                                <Col>
                                    {userData.firstname ? userData.firstname : '-'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>ນາມສະກຸນ</Col>
                                <Col>
                                    {userData.lastname ? userData.lastname : '-'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>ວັນເດືອນປີເກີດ</Col>
                                <Col>
                                    {userData.birthday ? new Date(userData.birthday).toLocaleDateString() : '-'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>ເບີໂທ</Col>
                                <Col>
                                    {userData.phone ? userData.phone : '-'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>ອີເມວ</Col>
                                <Col>
                                    {userData.email ? userData.email : '-'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>Role</Col>
                                <Col>
                                    {userData.role ? userData.role : '-'}
                                </Col>
                            </Row>
                        </div>
                    </div>

                    {/* -------- ໄອດີ ແລະ ລະຫັດຜ່ານ -------- */}
                    <div style={{ padding: 20, paddingBottom: 0 }}>
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ໄອດີ ແລະ ລະຫັດຜ່ານ</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            <Row>
                                <Col>ໄອດີ</Col>
                                <Col>
                                    {userData.userId ? userData.userId : '-'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>ລະຫັດຜ່ານ</Col>
                                <Col>
                                    ********
                                </Col>
                            </Row>
                        </div>
                    </div>
                    {/* -------- ຄໍາອະທິບາຍ -------- */}
                    <div style={{ padding: 20, paddingBottom: 0 }}>
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ອື່ນໆ</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            <Row>
                                <Col>ລາຍລະອຽດ</Col>
                                <Col>
                                    {userData.description ? userData.description : '-'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>ໝາຍເຫດ</Col>
                                <Col>
                                    {userData.note ? userData.note : '-'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>ວັນສ້າງ</Col>
                                <Col>
                                    {userData.createdAt ? new Date(userData.createdAt).toLocaleString('la-LA', { hour12: false }) : '-'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>ວັນແກ້ໄຂ</Col>
                                <Col>
                                    {userData.updatedAt ? new Date(userData.updatedAt).toLocaleString('la-LA', { hour12: false }) : '-'}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div> : ''}

            </CustomContainer>
        </div>
    )
}

export default ProfileDetail
