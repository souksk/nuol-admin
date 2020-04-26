import React, { useCallback } from 'react';
import { Breadcrumb, Modal, Button, Form, Row, Col, Table, InputGroup, FormControl } from 'react-bootstrap';
import Consts from '../../consts';
import useReactRouter from 'use-react-router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { UPDATE_STUDYCALENDA } from '../../apollo/calenda';

const CalendaTimeDelete = ({ showTimeDeleteView, _handleTimeDeleteViewClose, data, dataTime }) => {
	const { history, location, match } = useReactRouter();
	const [updateStudyCalenda] = useMutation(UPDATE_STUDYCALENDA);

	const _deleteCourse = async () => {
		let dayTimeIndexes = {
			deleteMany: {
				dayInt: dataTime.dayInt,
			}
		}

		await updateStudyCalenda({ variables: { data: { dayTimeIndexes }, where: { id: data.id } } });
		_handleTimeDeleteViewClose()
		window.location.reload(true);
	};
	//console.log(data.title);

	return (
		<Modal show={showTimeDeleteView} onHide={_handleTimeDeleteViewClose} size="lg">
			<Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
				<Modal.Title
					style={{
						textAlign: 'center',
						paddingTop: 20,
						color: Consts.BORDER_COLOR_DELETE,
						fontWeight: 'bold'
					}}
				>
					ຕ້ອງການລຶບ?
				</Modal.Title>

				<p className="text-center">{dataTime ? 'ວັນ ' + dataTime.dayString : ''}</p>
				<p className="text-center">{dataTime ? 'ຊົ່ວໂມງ ' + dataTime.timeIndexes : ''}</p>

				<div style={{ height: 20 }} />
				<div className="row">
					<div style={{ padding: 15 }} className="col">
						<Button
							onClick={_handleTimeDeleteViewClose}
							style={{
								width: '100%',
								backgroundColor: '#fff',
								color: '#6f6f6f',
								borderColor: Consts.DELETE_COLOR_BUTTON
							}}
						>
							ຍົກເລີກ
						</Button>
					</div>
					<div style={{ padding: 15 }} className="col">
						<Button
							style={{
								width: '100%',
								backgroundColor: Consts.DELETE_COLOR_BUTTON,
								color: '#fff',
								borderColor: Consts.DELETE_COLOR_BUTTON
							}}
							onClick={() => _deleteCourse()}
						>
							ລຶບ
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default CalendaTimeDelete;
