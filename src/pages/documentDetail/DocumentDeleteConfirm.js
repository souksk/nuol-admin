import React, { useCallback } from 'react';
import { Breadcrumb, Modal, Button, Form, Row, Col, Table, InputGroup, FormControl } from 'react-bootstrap';
import Consts from '../../consts';
import useReactRouter from 'use-react-router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { DELETE_FILE } from '../../apollo/doc';

const DocumentDeleteConfirm = ({ showDeleteConfirmView, _handleDeleteConfirmViewClose, data }) => {
	const { history, location, match } = useReactRouter();
	const [ deleteFile ] = useMutation(DELETE_FILE);

	const _deleteFile = () => {
		deleteFile({ variables: { where: { id: data.id } } })
			.then(async () => {
				await history.push('/document-list');
				window.location.reload(true);
			})
			.catch((err) => {
				//console.log(err);
			});
	};

	return (
		<Modal show={showDeleteConfirmView} onHide={_handleDeleteConfirmViewClose} size="lg">
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

				<p className="text-center">{data && data.title}</p>

				<div style={{ height: 20 }} />
				<div className="row">
					<div style={{ padding: 15 }} className="col">
						<Button
							onClick={_handleDeleteConfirmViewClose}
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
							onClick={() => _deleteFile()}
						>
							ລຶບ
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default DocumentDeleteConfirm;
