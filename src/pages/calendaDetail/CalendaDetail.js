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
import CalendaTimeAdd from './CalendaTimeAdd'
import CalendaTimeDelete from './CalendaTimeDelete'
import CalendaDeleteConfirm from './CalendaDeleteConfirm'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { STUDYCALENDA, UPDATE_STUDYCALENDA } from '../../apollo/calenda'
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
  const [showTimeAddView, setShowTimeAddView] = useState(false)
  const [showTimeDeleteView, setShowTimeDeleteView] = useState(false)
  const [dataTime, setDataTime] = useState({})

  // Set states
  const _handleDeleteConfirmViewClose = () => setShowDeleteConfirmView(false)
  const _handleDeleteConfirmViewShow = () => setShowDeleteConfirmView(true)

  const _handleTimeAddViewClose = () => setShowTimeAddView(false)
  const _handleTimeAddViewShow = () => setShowTimeAddView(true)

  const _handleTimeDeleteViewClose = () => setShowTimeDeleteView(false)
  const _handleTimeDeleteViewShow = () => setShowTimeDeleteView(true)

  const _edit = (data) => {
    history.push('/calenda-edit', data)
  }

  const _delete = () => {
    _handleDeleteConfirmViewShow()
  }

  const _timeAdd = () => {
    _handleTimeAddViewShow()
  }

  const _timeDelete = (time) => {
    setDataTime(time)
    _handleTimeDeleteViewShow()
  }

  const _convertDay = (day) => {
    let result = ''
    switch (day) {
      case 'ຈັນ':
        result = 'Monday';
        break;
      case 'ອັງຄານ':
        result = 'Tuesday';
        break;
      case 'ພຸດ':
        result = 'Wednesday';
        break;
      case 'ພະຫັດ':
        result = 'Thursday';
        break;
      case 'ສຸກ':
        result = 'Friday';
        break;
      case 'ເສົາ':
        result = 'Saturday';
        break;
      case 'ອາທິດ':
        result = 'Sunday';
        break;
      default:
        result = 'Monday';
        break;
    }
    return result;
  }

  if (apolloLoading) return <p>Loading...</p>
  // //console.log("apolloData: ", apolloData)
  // console.log("studyCalendaData: ", studyCalendaData)

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/course-list')}>
          Schedule Management
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => history.push('/course-list')}>
          All Schedules
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Schedule Detail</Breadcrumb.Item>
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
          <Title text='SCHEDULE DETAIL' />

          {/* Button group */}
          <div>

            {/* ເພີ່ມເວລາສອນ */}
            <button
              style={{
                backgroundColor: '#fff',
                color: Consts.FONT_COLOR_SECONDARY,
                width: 150,
                height: 40,
                marginRight: 5,
                border: '1px solid ' + Consts.FONT_COLOR_SECONDARY,
                outline: 'none'
              }}
              onClick={() => _timeAdd()}
            >
              <i className='fa fa-clock' /> Add study time
            </button>

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
              <FontAwesomeIcon icon='edit' style={{ fontSize: 16 }} /> Edit
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
              <i className='fa fa-trash' /> Delete
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
              <Col>Course name</Col>
              <Col
                style={{ color: Consts.FONT_COLOR_PRIMARY, fontWeight: 'bold' }}
              >
                {studyCalendaData && studyCalendaData.course && studyCalendaData.course.title}
              </Col>
            </Row>
            <div style={{ height: 10 }} />
            <Row>
              <Col>Calenda ID</Col>
              <Col
                style={{ color: Consts.FONT_COLOR_PRIMARY, fontWeight: 'bold' }}
              >
                {studyCalendaData && studyCalendaData.calendaCoce}
              </Col>
            </Row>
            <div style={{ height: 10 }} />
            <Row>
              <Col>Unit</Col>
              <Col
                style={{ color: Consts.FONT_COLOR_PRIMARY, fontWeight: 'bold' }}
              >
                {studyCalendaData && studyCalendaData.course && studyCalendaData.course.unit}
              </Col>
            </Row>
          </div>

          {/* -------- ຄະນະແລະພາກວິຊາ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }} style={{ fontWeight: "bold" }} ><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Year level and Semester</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>Year Level</Col>
                <Col>{studyCalendaData && studyCalendaData.yearLevel}</Col>
              </Row>
              <Row>
                <Col>Semester</Col>
                <Col>{studyCalendaData && studyCalendaData.semester}</Col>
              </Row>
            </div>
          </div>

          {/* -------- ຕາຕະລາງມື້ສອນ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }} ><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Schedule</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
                  <thead>
                    <TableHeader>
                      <th style={{ width: 60 }}>#</th>
                      <th style={{ width: 120 }}>Day</th>
                      <th style={{ width: 120 }}>Time</th>
                      <th style={{ width: 60 }}>Action</th>
                    </TableHeader>
                  </thead>
                  <tbody>
                    {
                      studyCalendaData &&
                      studyCalendaData.dayTimeIndexes && 
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
                              {_convertDay(x.dayString)}
                            </TableCell>
                            <TableCell>
                              {x.timeIndexes + ''}
                            </TableCell>
                            <TableCell>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-around'
                                }}
                              >
                                <div
                                  onClick={() => _timeDelete(x)}
                                  style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}
                                >
                                  <FontAwesomeIcon
                                    icon={['fas', 'trash']}
                                    color={Consts.BORDER_COLOR_DELETE}
                                  />{' '}
                                </div>
                              </div>
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
            <div style={{ fontWeight: "bold" }} ><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Start date and End date</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>Start date</Col>
                <Col>{studyCalendaData && new Date(studyCalendaData.startDate).toLocaleDateString('la')}</Col>
              </Row>
              <Row>
                <Col>End date</Col>
                <Col>{studyCalendaData && new Date(studyCalendaData.endDate).toLocaleDateString('la')}</Col>
              </Row>
            </div>
          </div>

          {/* -------- ອາຈານສິດສອນ -------- */}
          <div style={{ padding: 20, paddingBottom: 0 }}>
            <div style={{ fontWeight: "bold" }} ><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Teacher</div>
            <div style={{ paddingLeft: 20, fontSize: 14 }}>
              <Row>
                <Col>Teacher name</Col>
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

        <CalendaTimeAdd
          showTimeAddView={showTimeAddView}
          _handleTimeAddViewClose={_handleTimeAddViewClose}
          data={studyCalendaData}
        />

        <CalendaTimeDelete
          showTimeDeleteView={showTimeDeleteView}
          _handleTimeDeleteViewClose={_handleTimeDeleteViewClose}
          data={studyCalendaData}
          dataTime={dataTime}
        />

      </CustomContainer>
    </div>
  )
}

export default CalendaDetail
