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

const FacultyDetail = ({
  showDetailView,
  _handleDetailViewClose,
  dataForDetail
}) => {
  return (
    <Modal show={showDetailView} onHide={_handleDetailViewClose} size='lg'>
      <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
        Faculty Detail
      </Modal.Title>

      <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
        {dataForDetail &&
          <div>
            <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
              <thead>
                {/* <TableHeader>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Note</th>
                </TableHeader> */}
              </thead>
              <tbody>
                <tr
                  style={{
                    borderBottom: '2px solid #ffff',
                    textAlign: 'center'
                  }}
                >
                  <TableCell>
                    {dataForDetail.name}
                  </TableCell>
                  <TableCell>
                    {dataForDetail.description}
                  </TableCell>
                  <TableCell>
                    {dataForDetail.note}
                  </TableCell>
                </tr>
              </tbody>
            </table>
          </div>}

        <div className='row'>
          <div style={{ padding: 15 }} className='col'>
            <CustomButton
              confirm
              onClick={_handleDetailViewClose}
              width='100%'
              title='OK'
            />
          </div>
        </div>
      </Modal.Body>
    </Modal >
  )
}

export default FacultyDetail
