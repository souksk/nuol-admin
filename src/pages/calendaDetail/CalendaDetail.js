import React, { useState, useCallback } from 'react'
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
import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Consts from '../../consts'
import CalendaDeleteConfirm from './CalendaDeleteConfirm'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { STUDYCALENDA } from '../../apollo/calenda'
import * as moment from "moment"
import 'moment/locale/lo';
moment.locale("lo");

function CalendaDetail() {
  const { history, location, match } = useReactRouter()

  // //console.log("location: ", location)
  //init apollo
  const { data: apolloData, loading: apolloLoading, error: apolloError } = useQuery(STUDYCALENDA, { variables: { where: { id: location.state.id } } })
  const studyCalendaData =
    apolloData && apolloData.studyCalenda ? apolloData.studyCalenda : {}

  // States
  const [showDeleteConfirmView, setShowDeleteConfirmView] = useState(false)

  // Set states
  const _handleDeleteConfirmViewClose = () => setShowDeleteConfirmView(false)
  const _handleDeleteConfirmViewShow = () => setShowDeleteConfirmView(true)

  const _edit = (data) => {
    history.push('/calenda-edit', data)
  }

  const _delete = () => {
    _handleDeleteConfirmViewShow()
  }

  if (apolloLoading) return <p>Loading...</p>
  // //console.log("apolloData: ", apolloData)
  // console.log("studyCalendaData: ", studyCalendaData)

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/course-list')}>
          ຈັດການຕາຕະລາງຮຽນ
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => history.push('/course-list')}>
          ຕາຕະລາງຮຽນທັງຫມົດ
        </Breadcrumb.Item>
        <Breadcrumb.Item active>ລາຍລະອຽດຕາຕະລາງຮຽນ</Breadcrumb.Item>
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
          <Title text='ລາຍລະອຽດຕາຕະລາງຮຽນ' />

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
              onClick={() => _edit(studyCalendaData)}
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

        <div
          style={{
            width: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 20,
            paddingBottom: 80
          }}
        >
          {/* ------ detail box ------ */}
          <div
            style={{
              border: '1px solid #ddd',
              width: 500,
              padding: 20,
              fontSize: 14,
              paddingLeft: 80
            }}
          >
            <Row>
              <Col>ຊື່ວິຊາ</Col>
              <Col
                style={{ color: Consts.FONT_COLOR_PRIMARY, fontWeight: 'bold' }}
              >
                {studyCalendaData && studyCalendaData.course && studyCalendaData.course.title}
              </Col>
            </Row>
            <div style={{ height: 10 }} />
            <Row>
              <Col>ລະຫັດຕາຕະລາງ</Col>
              <Col
                style={{ color: Consts.FONT_COLOR_PRIMARY, fontWeight: 'bold' }}
              >
                {studyCalendaData && studyCalendaData.calendaCoce}
              </Col>
            </Row>
            <div style={{ height: 10 }} />
            <Row>
              <Col>ຈໍານວນຫນ່ວຍກິດ</Col>
              <Col
                style={{ color: Consts.FONT_COLOR_PRIMARY, fontWeight: 'bold' }}
              >
                {studyCalendaData && studyCalendaData.course && studyCalendaData.course.unit}
              </Col>
            </Row>
          </div>

          {/* -------- ຄະນະແລະພາກວິຊາ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }} style={{ fontWeight: "bold" }} ><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ປິຮຽນ ແລະ ພາກຮຽນ</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>ປິຮຽນ</Col>
                <Col>{studyCalendaData && studyCalendaData.yearLevel}</Col>
              </Row>
              <Row>
                <Col>ພາກຮຽນ</Col>
                <Col>{studyCalendaData && studyCalendaData.semester}</Col>
              </Row>
            </div>
          </div>

          {/* -------- ຕາຕະລາງມື້ສອນ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }} ><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ຕາຕະລາງມື້ສອນ</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
                  <thead>
                    <TableHeader>
                      <th style={{ width: 60 }}>ລຳດັບ</th>
                      <th style={{ width: 120 }}>ວັນ</th>
                      <th style={{ width: 120 }}>ຊົ່ວໂມງ</th>
                    </TableHeader>
                  </thead>
                  <tbody>
                    {
                      studyCalendaData &&
                      studyCalendaData.dayTimeIndexes.length > 0 &&
                      studyCalendaData.dayTimeIndexes.map((x, index) => {
                        return (
                          <tr
                            style={{
                              borderBottom: '2px solid #ffff',
                              textAlign: 'center'
                            }}
                            key={index}
                          >
                            <TableCell>
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              {x.dayString}
                            </TableCell>
                            <TableCell>
                              {x.timeIndexes + ''}
                            </TableCell>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </Row>
            </div>
          </div>

          {/* -------- ວັນເລີ່ມສອນ ແລະ ວັນສິ້ນສຸດການສອນ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }} ><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ວັນເລີ່ມສອນ ແລະ ວັນສິ້ນສຸດການສອນ</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>ວັນເລີ່ມສອນ</Col>
                <Col>{studyCalendaData && new Date(studyCalendaData.startDate).toLocaleDateString('la')}</Col>
              </Row>
              <Row>
                <Col>ວັນສິ້ນສຸດການສອນ</Col>
                <Col>{studyCalendaData && new Date(studyCalendaData.endDate).toLocaleDateString('la')}</Col>
              </Row>
            </div>
          </div>

          {/* -------- ອາຈານສິດສອນ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }} ><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />ອາຈານສິດສອນ</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>ຊື່ອາຈານສອນ</Col>
                <Col>{studyCalendaData && (studyCalendaData.teacher ? (studyCalendaData.teacher.firstname) + ' ' + (studyCalendaData.teacher.lastname ? studyCalendaData.teacher.lastname : '') : '')}</Col>
              </Row>
            </div>
          </div>

        </div>

        {/* ------- Delete Modal ------ */}
        <CalendaDeleteConfirm
          showDeleteConfirmView={showDeleteConfirmView}
          _handleDeleteConfirmViewClose={_handleDeleteConfirmViewClose}
          data={studyCalendaData}
        />
      </CustomContainer>
    </div>
  )
}

export default CalendaDetail
