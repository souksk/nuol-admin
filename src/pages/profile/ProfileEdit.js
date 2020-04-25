import React, { useState, useCallback, useEffect } from 'react'
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
import * as yup from 'yup';
import { Formik } from 'formik';
import Consts from '../../consts'
import ProfileEditConfirm from './ProfileEditConfirm'
import { CustomContainer, Title, CustomButton } from '../../common'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { USER_EDIT } from './../../apollo/user'
import * as _ from 'lodash';

function ProfileEdit() {
    const { history, location, match } = useReactRouter()
    const { loading, error, data } = useQuery(USER_EDIT, { variables: { where: { id: location.state.id } } });

    // States
    const [showAddConfirmModal, setShowAddConfirmModal] = useState(false)
    const [formParam, setFormParam] = useState({})
    const [userData, setUserData] = useState(null)
    var [days, setDays] = useState([])
    var [months, setMonths] = useState([])
    var [years, setYears] = useState([])

    useEffect(() => {
        dataBirthday()
    }, [])

    // Set states
    const _handleShowAddConfirmModalClose = () => setShowAddConfirmModal(false)
    const _handleShowAddConfirmModalShow = () => setShowAddConfirmModal(true)

    //Get Data from Server
    if (userData == null && data && data.user) setUserData(data.user)

    const _cancel = () => {
        history.push('/profile-detail', userData)
        window.location.reload(true)
    }

    const _edit = () => {
        _handleShowAddConfirmModalShow()
    }

    const dataBirthday = () => {
        var day = []
        var month = []
        var year = []
        for (var i = 1; i <= 31; i++) {
            day.push(i)
        }
        for (var i = 1; i <= 12; i++) {
            month.push(i)
        }
        for (var i = parseInt(new Date().getFullYear()); i >= parseInt(new Date().getFullYear()) - 99; i--) {
            year.push(i)
        }
        setDays(day)
        setMonths(month)
        setYears(year)
    }
    if (loading) return <p>Loading...</p>
    var _day = data.user.birthday ? new Date(data.user.birthday).getDate() : ''
    var _month = data.user.birthday ? (new Date(data.user.birthday).getMonth() + 1) : ''
    var _year = data.user.birthday ? new Date(data.user.birthday).getFullYear() : ''

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item href='' onClick={() => {
                    history.push('/profile-detail', userData)
                    window.location.reload(true)
                }
                }>
                    ລາຍລະອຽດສ່ວນຕົວ
                </Breadcrumb.Item>
                <Breadcrumb.Item active>ແກ້ໄຂຂໍ້ມູນ</Breadcrumb.Item>
            </Breadcrumb>

            <CustomContainer>
                <Title text='ແກ້ໄຂຂໍ້ມູນ' />
                {userData && <Formik
                    initialValues={{
                        firstname: userData.firstname || "",
                        lastname: userData.lastname || "",
                        phone: userData.phone || "",
                        email: userData.email || "",
                        description: userData.description || "",
                        role: 'ADMIN',
                        userId: userData.userId || "",
                        password: userData.password || "",
                        note: userData.note || "",
                        day: _day ? _day : 0,
                        month: _month ? _month : 0,
                        year: _year ? _year : 0,
                    }}
                    validate={values => {
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        let birthday = ''
                        if (values.day != 0 && values.month != 0 && values.year != 0) {
                            birthday = values.year + '-' + values.month + '-' + values.day
                        } else {
                            delete values.day
                            delete values.month
                            delete values.year
                        }
                        if (!values.password) {
                            delete values.password
                        }

                        let data = {
                            ...values, birthday
                        }
                        let paramQL = {
                            where: {
                                id: userData.id
                            },
                            data
                        }

                        //console.log("paramQL: ", paramQL)
                        setFormParam(paramQL)
                        _edit()
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                    }) => (
                            <div>
                                {/* Form container */}
                                <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>

                                    {/* ---------- ຂໍ້ມູນອາຈານ --------- */}
                                    <div style={{ marginBottom: 10 }}>
                                        <div>
                                            <i
                                                className='fa fa-caret-down'
                                                aria-hidden='true'
                                                style={{ marginRight: 5 }}
                                            />
                                                ຂໍ້ມູນທົ່ວໄປ
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
                                                <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ'
                                                    name="firstname"
                                                    value={values.firstname}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.firstname} />
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
                                                ນາມສະກຸນ</Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ' name="lastname"
                                                    value={values.lastname}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.lastname} />
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
                                                ວັນເດືອນປີເກີດ</Form.Label>
                                            <Col sm='8'>
                                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                                    <Form.Control as='select' name="day"
                                                        value={values.day}
                                                        onChange={handleChange}>
                                                        <option disabled={true} value={0}>ເລືອກວັນທີ</option>
                                                        {days.map((d, index) => (
                                                            <option value={parseInt(d)} key={index}>{d}</option>
                                                        ))
                                                        }
                                                    </Form.Control>
                                                    <Form.Control as='select' name="month"
                                                        value={values.month}
                                                        onChange={handleChange}>
                                                        <option disabled={true} value={0}>ເລືອກເດືອນ</option>
                                                        {months.map((m, index) => (
                                                            <option value={parseInt(m)} key={index}>{m}</option>
                                                        ))
                                                        }
                                                    </Form.Control>
                                                    <Form.Control as='select' name="year"
                                                        value={values.year}
                                                        onChange={handleChange}>
                                                        <option disabled={true} value={0}>ເລືອກປີ</option>
                                                        {years.map((y, index) => (
                                                            <option value={parseInt(y)} key={index}>{y}</option>
                                                        ))
                                                        }
                                                    </Form.Control>
                                                </div>
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
                                                ເບີໂທ</Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ' name="phone"
                                                    value={values.phone}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.phone} />
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
                                                ອີເມວ</Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ' name="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.email} />
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
                                        ໄອດີ ແລະ ລະຫັດຜ່ານ</div>
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
                                                ໄອດີ</Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' disabled={true} placeholder='ກະລຸນາປ້ອນ' name="userId"
                                                    value={values.userId}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.userId} />
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
                                                ລະຫັດຜ່ານ</Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' placeholder='ປ້ອນເພື່ອປ່ຽນລະຫັດຜ່ານ' name="password"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.password} />
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
                                                <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ' name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.description} />
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
                                                <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ' name="note"
                                                    value={values.note}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.note} />
                                            </Col>
                                        </Form.Group>

                                    </div>

                                    {/* Buttons */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            textAlign: 'center',
                                            justifyContent: 'center',
                                            marginTop: 40,
                                            marginBottom: 40
                                        }}
                                    >
                                        <div style={{ marginRight: 80 }}>
                                            <CustomButton title='ຍົກເລີກ' onClick={() => _cancel()} />
                                        </div>

                                        <CustomButton confirm title='ບັນທຶກການແກ້ໄຂ' onClick={handleSubmit} type="submit" />
                                    </div>
                                </div>

                                {/* ------- EditConfirm Modal ------ */}
                                <ProfileEditConfirm
                                    showAddConfirmModal={showAddConfirmModal}
                                    _handleShowAddConfirmModalClose={_handleShowAddConfirmModalClose}
                                    param={formParam}
                                />
                            </div>
                        )}
                </Formik>}

            </CustomContainer>
        </div>
    )
}

export default ProfileEdit
