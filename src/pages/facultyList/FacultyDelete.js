import React, { useState } from 'react'
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
import { Formik } from 'formik'
import * as _ from 'lodash'

import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { DELETE_FACULTY } from '../../apollo/faculty'

const FacultyDelete = ({
  showDeleteView,
  _handleDeleteViewClose,
  dataForDelete
}) => {
  const [deleteFaculty] = useMutation(DELETE_FACULTY);
  // console.log("dataForDelete: ", dataForDelete)
  const _onDelete = () => {
    let paramQL = {
      where: { id: dataForDelete.id }
    };
    deleteFaculty({ variables: paramQL }).then(async () => {
      _handleDeleteViewClose()
      window.location.reload(true)
    }).catch((err) => {
      _handleDeleteViewClose()
    });
  }

  return (
    <Modal show={showDeleteView} onHide={_handleDeleteViewClose} size='lg'>
      <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
        Delete This Faculty ?
      </Modal.Title>

      <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
          <h4 style={{ fontWeight: 'bold' }}>{dataForDelete && dataForDelete.name}</h4>
        </div>

        <div className='row'>
          <div style={{ padding: 15 }} className='col'>
            <CustomButton
              onClick={_handleDeleteViewClose}
              width='100%'
              title='Cancel'
            />
          </div>
          <div style={{ padding: 15 }} className='col'>
            <CustomButton
              deleteType
              onClick={() => _onDelete()}
              width='100%'
              title='Delete'
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default FacultyDelete
