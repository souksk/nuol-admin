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
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Consts from '../../consts'
import DocumentDeleteConfirm from './DocumentDeleteConfirm'
import DocumentEdit from './DocumentEdit'
import { CustomContainer, SearchBar, Title, CustomButton } from '../../common'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { FILE } from '../../apollo/doc'

function DocumentDetail() {
    const { history, location, match } = useReactRouter()

    //init apollo
    const apolloData = useQuery(FILE, { variables: { where: { id: location.state.id } } })
    const { loading, error } = apolloData
    const fileData =
        apolloData.data && apolloData.data.file ? apolloData.data.file : {}
    // //console.log(apolloData)

    // States
    const [showDeleteConfirmView, setShowDeleteConfirmView] = useState(false)
    const [showEditView, setShowEditView] = useState(false)

    // Set states
    const _handleDeleteConfirmViewClose = () => setShowDeleteConfirmView(false)
    const _handleDeleteConfirmViewShow = () => setShowDeleteConfirmView(true)

    const _handleEditViewClose = () => setShowEditView(false)
    const _handleEditViewShow = () => setShowEditView(true)

    // const _edit = (data) => {
    //     history.push('/file-edit', data)
    // }

    const _delete = () => {
        _handleDeleteConfirmViewShow()
    }

    const _edit = () => {
        _handleEditViewShow()
    }

    const _onConvertCate = (cate) => {
        let result;
        switch (cate) {
            case 'RESEARCH':
                result = 'Research'
                break;
            case 'SPECIFIC':
                result = 'Specific'
                break;
            default:
                result = 'General'
        }
        return result;
    }

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item onClick={() => history.push('/document-list')}>
                    Document Management
                </Breadcrumb.Item>
                <Breadcrumb.Item onClick={() => history.push('/document-list')}>
                    All Documents
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Document Detail</Breadcrumb.Item>
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
                    <Title text='DOCUMENT DETAIL' />

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
                            onClick={() => _edit()}
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
                        width: 800,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 20,
                        paddingBottom: 80
                    }}
                >

                    {/* File Information */}
                    <div style={{ padding: 20, paddingBottom: 0 }}>
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Document Detail</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            {/* <Row>
                                <Col>ໝວດ</Col>
                                <Col>{fileData && fileData.type}</Col>
                            </Row> */}
                            <Row>
                                <Col>File type</Col>
                                <Col>{fileData && _onConvertCate(fileData.cate)}</Col>
                            </Row>
                            <Row>
                                <Col>File name</Col>
                                <Col>{fileData && fileData.title}</Col>
                            </Row>
                            <Row>
                                <Col>keyword</Col>
                                <Col>[ {fileData &&
                                    fileData.keyword &&
                                    fileData.keyword.length > 0 &&
                                    fileData.keyword.map((x, index) => (
                                        <span key={index}>{x + (((index + 1) >= fileData.keyword.length) ? '' : ', ')}</span>
                                    ))
                                } ]
                                </Col>
                            </Row>
                            <Row>
                                <Col>Description</Col>
                                <Col>{fileData && fileData.description}</Col>
                            </Row>
                        </div>
                    </div>

                    {/* File Upload Information */}
                    <div style={{ padding: 20, paddingBottom: 0 }}>
                        <div style={{ fontWeight: "bold" }}><FontAwesomeIcon icon='caret-down' style={{ marginRight: 16, marginLeft: -24, fontSize: 24, color: Consts.PRIMARY_COLOR }} />Upload Document</div>
                        <div style={{ paddingLeft: 20, fontSize: 14 }}>
                            <Row>
                                <Col>Upload date</Col>
                                <Col>{fileData && fileData.createdAt && new Date(fileData.createdAt).toLocaleString('la-LA', { hour12: false })}</Col>
                            </Row>
                            <Row>
                                <Col>Edit date</Col>
                                <Col>{fileData && fileData.updatedAt && new Date(fileData.updatedAt).toLocaleString('la-LA', { hour12: false })}</Col>
                            </Row>
                            <Row>
                                <Col>File</Col>
                                <Col><a href={fileData && fileData.file} download>{fileData && fileData.title}</a></Col>
                            </Row>
                        </div>
                    </div>

                </div>


                {/* ------- Edit Modal ------ */}
                <DocumentEdit
                    showEditView={showEditView}
                    _handleEditViewClose={_handleEditViewClose}
                    fileData={fileData}
                />

                {/* ------- Delete Modal ------ */}
                <DocumentDeleteConfirm
                    showDeleteConfirmView={showDeleteConfirmView}
                    _handleDeleteConfirmViewClose={_handleDeleteConfirmViewClose}
                    data={fileData}
                />

            </CustomContainer>
        </div>
    )
}

export default DocumentDetail
