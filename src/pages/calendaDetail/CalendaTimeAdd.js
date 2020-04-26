import React, { useState, useCallback } from 'react';
import { Breadcrumb, Modal, Button, Form, Row, Col, Table, InputGroup, FormControl, ButtonToolbar, ButtonGroup, ProgressBar } from 'react-bootstrap';
import Consts from '../../consts';
import useReactRouter from 'use-react-router';
import * as _ from 'lodash';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { UPDATE_STUDYCALENDA } from '../../apollo/calenda';

const CalendaTimeAdd = ({ showTimeAddView, _handleTimeAddViewClose, data }) => {
	const { history, location, match } = useReactRouter();
	const [updateStudyCalenda] = useMutation(UPDATE_STUDYCALENDA);
	const [selectTimeIndexes, setSelectTimeIndexes] = useState([])
	const [selectDay, setSelectDay] = useState('')
	const [selectDayInt, setSelectDayInt] = useState('')

	const _addCalendaTime = async () => {
		let dayTimeIndexes = {
			create: [{
				dayInt: selectDayInt,
				dayString: selectDay,
				timeIndexes: {
					set: selectTimeIndexes
				}
			}]
		}

		// console.log("dayTimeIndexes: ", dayTimeIndexes)

		await updateStudyCalenda({ variables: { data: { dayTimeIndexes }, where: { id: data.id } } });
		_handleTimeAddViewClose()
		window.location.reload(true);
	};

	const _timeIndexClick = (i) => {
		if (!_.includes(selectTimeIndexes, i)) {
			let data = [...selectTimeIndexes, i];
			setSelectTimeIndexes(data)
		} else {
			let data = [...selectTimeIndexes];
			_.remove(data, (n) => n == i)
			setSelectTimeIndexes(data)
		}
	}

	/**
	 * ສະແດງປຸ່ມກໍານົດຊົວໂມງຮຽນ
	 *   */
	const RenderButton = () => {
		return (
			<ButtonToolbar>
				<ButtonGroup className="" style={{ width: "100% !important" }}>
					<Button onClick={() => _timeIndexClick(1)} variant={_.includes(selectTimeIndexes, 1) ? "primary" : "outline-primary"}>ຊມ1</Button >
					<Button onClick={() => _timeIndexClick(2)} variant={_.includes(selectTimeIndexes, 2) ? "primary" : "outline-primary"}>ຊມ2</Button >
					<Button onClick={() => _timeIndexClick(3)} variant={_.includes(selectTimeIndexes, 3) ? "primary" : "outline-primary"}>ຊມ3</Button >
					<Button onClick={() => _timeIndexClick(4)} variant={_.includes(selectTimeIndexes, 4) ? "primary" : "outline-primary"}>ຊມ4</Button >
					<Button onClick={() => _timeIndexClick(5)} variant={_.includes(selectTimeIndexes, 5) ? "primary" : "outline-primary"}>ຊມ5</Button >
					<Button onClick={() => _timeIndexClick(6)} variant={_.includes(selectTimeIndexes, 6) ? "primary" : "outline-primary"}>ຊມ6</Button >
					<Button onClick={() => _timeIndexClick(7)} variant={_.includes(selectTimeIndexes, 7) ? "primary" : "outline-primary"}>ຊມ7</Button >
					<Button onClick={() => _timeIndexClick(8)} variant={_.includes(selectTimeIndexes, 8) ? "primary" : "outline-primary"}>ຊມ8</Button >
				</ButtonGroup>
			</ButtonToolbar>
		)
	}

	const _convertDayInt = (day) => {
		let result;
		switch (day) {
			case 'ຈັນ':
				result = 0;
				break;
			case 'ອັງຄານ':
				result = 1;
				break;
			case 'ພຸດ':
				result = 2;
				break;
			case 'ພະຫັດ':
				result = 3;
				break;
			case 'ສຸກ':
				result = 4;
				break;
			case 'ເສົາ':
				result = 5;
				break;
			case 'ວັນທິດ':
				result = 6;
				break;
		}
		return result;
	}

	const onChangeDay = (e) => {
		setSelectDay(e.target.value)
		setSelectDayInt(_convertDayInt(e.target.value))
	}

	//console.log(data.title);

	return (
		<Modal show={showTimeAddView} onHide={_handleTimeAddViewClose} size="lg">
			<Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
				<Modal.Title
					style={{
						textAlign: 'center',
						paddingTop: 20,
						fontWeight: 'bold'
					}}
				>
					ເພີ່ມເວລາສອນ
				</Modal.Title>

				<div>
					{/* ---------- ຕາຕະລາງມື້ສອນ --------- */}
					<div style={{ marginBottom: 10 }}>
						<div>
							<i
								className='fa fa-caret-down'
								aria-hidden='true'
								style={{ marginRight: 5, color: Consts.SECONDARY_COLOR }}
							/>
                      ຕາຕະລາງມື້ສອນ
                    </div>
						{/* ວັນ */}
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
								ວັນ</Form.Label>
							<Col sm='8'>
								<Form.Control as='select' name="selectDay"
									value={selectDay}
									onChange={(e) => onChangeDay(e)}
								>
									<option id="" disabled={true} value="">---ກະລຸນາເລືອກວັນ---</option>
									<option id={0} value="ຈັນ">ຈັນ</option>
									<option id={1} value="ອັງຄານ">ອັງຄານ</option>
									<option id={2} value="ພຸດ">ພຸດ</option>
									<option id={3} value="ພະຫັດ">ພະຫັດ</option>
									<option id={4} value="ສຸກ">ສຸກ</option>
									<option id={5} value="ເສົາ">ເສົາ</option>
									<option id={6} value="ວັນທິດ">ວັນທິດ</option>
								</Form.Control>
							</Col>
						</Form.Group>

						{/* ຊົ່ວໂມງ */}
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
								ຊົ່ວໂມງ</Form.Label>
							<Col sm='8'>

								<RenderButton />

							</Col>
						</Form.Group>
					</div>
				</div>

				<div style={{ height: 20 }} />
				<div className="row">
					<div style={{ padding: 15 }} className="col">
						<Button
							onClick={_handleTimeAddViewClose}
							style={{
								width: '100%',
								backgroundColor: '#fff',
								color: Consts.PRIMARY_COLOR,
								borderColor: Consts.PRIMARY_COLOR
							}}
						>
							ຍົກເລີກ
						</Button>
					</div>
					<div style={{ padding: 15 }} className="col">
						<Button
							style={{
								width: '100%',
								backgroundColor: Consts.PRIMARY_COLOR,
								color: '#fff',
								borderColor: Consts.PRIMARY_COLOR
							}}
							onClick={() => _addCalendaTime()}
						>
							ລຶບ
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default CalendaTimeAdd;
