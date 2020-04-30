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
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
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

    const [sDate, setSDate] = useState(null);

    useEffect(() => {
        if (data.user && data.user.birthday) {
            handleStartDateChange(new Date(data.user.birthday))
        }
    }, [data])

    const handleStartDateChange = (date) => {
        setSDate(date);
    };

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

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item href='' onClick={() => {
                    history.push('/profile-detail', userData)
                    window.location.reload(true)
                }
                }>
                    My Profile
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Edit profile</Breadcrumb.Item>
            </Breadcrumb>

            <CustomContainer>
                <Title text='EDIT MY PROFILE' />
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
                    }}
                    validate={values => {
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        let birthday
                        if (sDate) {
                            birthday = (new Date(sDate).getFullYear()) + '-' + (new Date(sDate).getMonth() + 1) + '-' + (new Date(sDate).getDate())
                            values = {
                                ...values, birthday
                            }
                        }
                        if (!values.password) {
                            delete values.password
                        }
                        if (userData.phone == values.phone) {
                            delete values.phone
                        }
                        if (userData.email == values.email) {
                            delete values.email
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
                                                <Form.Control type='text' placeholder='please input...'
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
                                                Last name</Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' placeholder='please input...' name="lastname"
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
                                                Birthday</Form.Label>
                                            <Col sm='3'>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <Grid style={{ marginTop: -15 }} container justify="space-around">
                                                        <KeyboardDatePicker
                                                            disableToolbar
                                                            variant="inline"
                                                            format="dd/MM/yyyy"
                                                            margin="normal"
                                                            id="sDate"
                                                            value={sDate}
                                                            onChange={handleStartDateChange}
                                                        />
                                                    </Grid>
                                                </MuiPickersUtilsProvider>
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
                                                Phone number</Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' placeholder='please input...' name="phone"
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
                                                E-Mail</Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' placeholder='please input...' name="email"
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
                                        User Id and Password</div>
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
                                                User ID</Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' disabled={true} placeholder='please input...' name="userId"
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
                                                Password</Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' placeholder='input to change...' name="password"
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
                                                <Form.Control type='text' placeholder='please input...' name="description"
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
                                                Note
                                            </Form.Label>
                                            <Col sm='8'>
                                                <Form.Control type='text' placeholder='please input...' name="note"
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
                                            <CustomButton title='Cancel' onClick={() => _cancel()} />
                                        </div>

                                        <CustomButton confirm title='Edit' onClick={handleSubmit} type="submit" />
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
