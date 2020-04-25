import React, { Component, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import useReactRouter from 'use-react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery, useMutation } from '@apollo/react-hooks';

import CustomButton from '../../common/CustomButton';
import { LOGIN_USER } from '../../apollo/user';
import { USER_KEY } from '../../consts';

function Login() {
	const { history, location, match } = useReactRouter();
	const [ userId, setUserId ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ userIdStatus, setUserIdStatus ] = useState(true);
	const [ passwordStatus, setPasswordStatus ] = useState(true);
	const [ loginStatus, setLoginStatus ] = useState(true);

	const [ loginUser, loginUserData ] = useMutation(LOGIN_USER, {
		variables: { data: { userId, password } }
	});

	const _handleSubmit = async () => {
		if (
			(userId == '' || userId == ' ' || userId == null) &&
			(password == '' || password == ' ' || password == null)
		) {
			setPasswordStatus(false);
			setUserIdStatus(false);
		} else {
			if (userId == '' || userId == ' ' || userId == null) {
				setUserIdStatus(false);
			} else {
				if (password == '' || password == ' ' || password == null) {
					setPasswordStatus(false);
				} else {
					setPasswordStatus(true);
					setUserIdStatus(true);
					try {
						const response = await loginUser();
						if (response.data) {
							const user = response.data.loginUser;
							localStorage.setItem(USER_KEY, JSON.stringify(user));

							history.push('/course-list');
						}
					} catch (err) {
						setLoginStatus(false);
						//console.log(err)
					}
				}
			}
		}
	};

	const _handleChangeUserId = (e) => {
		setUserId(e.target.value);
		setUserIdStatus(true);
		setLoginStatus(true);
	};

	const _handleChangePassword = (e) => {
		setPassword(e.target.value);
		setPasswordStatus(true);
		setLoginStatus(true);
	};

	return (
		<div>
			<div className="">
				<div style={{ height: 30 }} />
				<div className="text-center">
					<img style={{ width: 250 }} src="/assets/logo-SLMS.png" />
				</div>
				<div className="d-flex justify-content-center">
					<div
						style={{
							backgroundColor: '#fff',
							width: '50vw',
							padding: 30,
							paddingLeft: 80,
							paddingRight: 80,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<h2>
							<b>ກະລຸນາລ໋ອກອິນເພື່ອເຂົ້າໃຊ້ລະບົບ</b>
						</h2>
						<Form noValidate style={{ width: '100%', paddingTop: 32 }}>
							<Form.Group as={Row} controlId="formPlaintextEmail">
								<Form.Label column sm="2">
									<FontAwesomeIcon icon={[ 'fas', 'user' ]} size="2x" color="#057CAE" />
								</Form.Label>
								<Col sm="10">
									<Form.Control
										type="text"
										value={userId}
										onChange={(e) => _handleChangeUserId(e)}
										placeholder="ໄອດີ"
									/>
									{!userIdStatus ? <p style={{ color: 'red', fontSize: 14 }}>ກະລຸນາປ້ອນໄອດີ</p> : ''}
								</Col>
							</Form.Group>

							<Form.Group as={Row} controlId="formPlaintextPassword">
								<Form.Label column sm="2">
									<FontAwesomeIcon icon={[ 'fas', 'lock' ]} size="2x" color="#057CAE" />
								</Form.Label>
								<Col sm="10">
									<Form.Control
										type="password"
										onChange={(e) => _handleChangePassword(e)}
										value={password}
										placeholder="ລະຫັດຜ່ານ"
									/>
									{!passwordStatus ? (
										<p style={{ color: 'red', fontSize: 14 }}>ກະລຸນາປ້ອນລະຫັດຜ່ານ</p>
									) : (
										''
									)}
								</Col>
							</Form.Group>

							<Form.Group as={Row}>
								<Form.Label column sm="2" />
								<Form.Label column sm="10">
									{!loginStatus ? (
										<p style={{ color: 'red', fontSize: 14, marginLeft: 24 }}>
											* ໄອດີ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ
										</p>
									) : (
										''
									)}
								</Form.Label>
							</Form.Group>
						</Form>

						<Button style={{ width: '100%', backgroundColor: '#057CAE' }} onClick={() => _handleSubmit()}>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									width: '100%'
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										width: '100%',
										fontSize: 20
									}}
								>
									ລ໊ອກອິນ
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										width: 30,
										alignItems: 'flex-end'
									}}
								>
									<FontAwesomeIcon
										icon={[ 'fas', 'sign-in-alt' ]}
										style={{ fontSize: 24, fontWeight: 'normal' }}
										color="#fff"
									/>
								</div>
							</div>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
