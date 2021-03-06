import React, { useState, useCallback, useEffect } from 'react'
import {
    Breadcrumb,
    Modal,
    Button,
    Form,
    Row,
    Col,
    Table,
    InputGroup,
    FormControl,
    ProgressBar
} from 'react-bootstrap'
import {
    CustomContainer,
    SearchBar,
    Title,
    CustomButton,
    TableHeader,
    TableCell
} from '../../common'
import Consts from '../../consts'
import * as yup from 'yup';
import { Formik } from 'formik';
import { useDropzone } from 'react-dropzone'
import { CREATE_FILE, PRE_SIGNED_URL } from '../../apollo/doc'
import { useQuery, useMutation } from '@apollo/react-hooks';
import axios from "axios"


const DocumentUpload = ({ showUploadView, _handleUploadViewClose }) => {
    const { loading, error, data } = useQuery(PRE_SIGNED_URL, { variables: { mimeType: "application/pdf" } })
    const [createFile] = useMutation(CREATE_FILE);
    const [errFile, setErrFile] = useState('')

    const [files, setFiles] = useState([])
    const [fileUploadProgress, setFileUploadProgress] = useState(0)

    const onDrop = useCallback(async acceptedFiles => {
        // TODO: store files in state
        setFiles(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop })

    const _fileUploaded = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} ຂະຫນາດ: {file.size} bytes
        </li>
    ));


    const _uploadFile = async (param) => {
        const { preSignedUrl } = data
        // Save file to s3
        if (acceptedFiles.length > 0) {
            if (preSignedUrl) {
                const response = await axios({
                    method: 'put',
                    url: preSignedUrl.url,
                    data: files[0],
                    headers: {
                        'Content-Type': ' file/*; image/*',
                        'Access-Control-Allow-Origin': '*',
                        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                    },
                    onUploadProgress: function (progressEvent) {
                        setFileUploadProgress(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
                    }
                });
                //console.log("response: ", response)
                let filename = response.config.url.split("?")

                let data = {
                    file: filename[0]
                }

                // set data form when file is uploaded
                let paramQL = {
                    data: {
                        ...param.data, ...data
                    }
                };
                // //console.log("paramQL: ", paramQL)
                createFile({ variables: paramQL }).then((x) => {
                    _handleUploadViewClose();
                    window.location.reload(true)
                }).catch((err) => {
                    //console.log(err)
                    _handleUploadViewClose();
                })

            }
        }else{
            setErrFile('ກະລຸນາຕື່ມໄຟລ!')
        }

    }

    if (loading) return <div>loading...</div>
    if (error) return <div>Ooop! somthing wrong</div>

    return (
        <Modal show={showUploadView} onHide={_handleUploadViewClose} size='lg'>
            <Modal.Title style={{ textAlign: 'center', paddingTop: 20 }}>
                ອັບໂຫລດເອກະສານ
            </Modal.Title>

            <Modal.Body style={{ marginLeft: 50, marginRight: 50, padding: 50 }}>
                <Formik
                    initialValues={{
                        keyword: '',
                        title: '',
                        cate: 'RESEARCH',
                        type: "PUBLIC_FILE"
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.title) {
                            errors.title = 'ກະລຸນາຕື່ມຊື່ເອກະສານ';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        //Set parameters for inserting to graphql
                        let paramQL = {
                            data: {
                                title: values.title,
                                keyword: {
                                    set: values.keyword.split(",")
                                },
                                cate: values.cate,
                                type: values.type,
                            }
                        }
                        // //console.log("paramQL: ", paramQL)
                        _uploadFile(paramQL)

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
                                <div style={{ border: "#eee solid 1px", padding: 50 }}>

                                    <Form.Group
                                        as={Row}
                                        controlId='formPlaintextEmail'
                                        style={{ margin: 0, marginBottom: 10 }}
                                    >
                                        <Form.Label column sm='4' className='text-left'>
                                            ປະເພດເອກະສານ</Form.Label>
                                        <Col sm='8'>
                                            <Form.Control as='select' name="cate"
                                                value={values.cate}
                                                onChange={handleChange}
                                                isInvalid={!!errors.cate}>
                                                <option value="RESEARCH">ບົດຄົ້ນຄ້ວາ</option>
                                                <option value="SPECIFIC">ວິຊາສະເພາະ</option>
                                                <option value="GENERAL">ຄວາມຮູ້ທົ່ວໄປ</option>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>


                                    <Form.Group
                                        as={Row}
                                        controlId='formPlaintextEmail'
                                        style={{ margin: 0, marginBottom: 10 }}
                                    >
                                        <Form.Label column sm='4' className='text-left'>
                                            ຊື່ເອກະສານ</Form.Label>
                                        <Col sm='8'>
                                            <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ' name="title"
                                                value={values.title}
                                                onChange={handleChange}
                                                isInvalid={!!errors.title} />
                                        </Col>
                                    </Form.Group>


                                    <Form.Group
                                        as={Row}
                                        controlId='formPlaintextEmail'
                                        style={{ margin: 0, marginBottom: 10 }}
                                    >
                                        <Form.Label column sm='4' className='text-left'>
                                            keyword</Form.Label>
                                        <Col sm='8'>
                                            <Form.Control type='text' placeholder='ກະລຸນາປ້ອນ (ຂັ້ນດ້ວຍ",")' name="keyword"
                                                value={values.keyword}
                                                onChange={handleChange}
                                                isInvalid={!!errors.keyword} />
                                        </Col>
                                    </Form.Group>

                                    {/* ອັບໂຫລດໄຟລ */}
                                    <Form.Group
                                        as={Row}
                                        style={{
                                            margin: 0, marginBottom: 10
                                        }}
                                    >
                                        <Form.Label column sm='4' className='text-left'>
                                            ອັບໂຫລດໄຟລ</Form.Label>
                                        <Col sm='8'>
                                            <div
                                                {...getRootProps()}
                                                style={{
                                                    height: 100,
                                                    border: '1px solid #ddd',
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <input {...getInputProps()} />

                                                <div
                                                    style={{
                                                        backgroundColor: '#f3f3f3',
                                                        marginLeft: 20,
                                                        marginTop: 20,
                                                        marginRight: 20,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <img
                                                        style={{ width: 50, height: 50 }}
                                                        src='/assets/download.png'
                                                    />
                                                </div>
                                                <span>ໂຍນໄຟລທີ່ຕ້ອງການອັບໂຫລດໃສ່ນີ້</span>
                                                {(acceptedFiles.length == 0 && errFile) ? <p style={{ color: 'red', fontSize: 14, marginTop: 10 }}>{errFile}</p> : ''}
                                            </div>
                                            {acceptedFiles.length > 0 && <aside>
                                                <h4>ໄຟລທີ່ຈະອັບໂຫລດ</h4>
                                                <ul>{_fileUploaded}</ul>
                                            </aside>}
                                        </Col>
                                    </Form.Group>

                                    {fileUploadProgress > 0 && fileUploadProgress < 100 && <div>
                                        <h3>ກໍາລັງອັບໂຫລດໄຟລເອກະສານ....</h3>
                                        <ProgressBar animated now={fileUploadProgress} label={`${fileUploadProgress}%`} />
                                    </div>
                                    }

                                </div>
                                <div style={{ height: 20 }} />
                                <div className='row'>
                                    <div style={{ padding: 15 }} className='col'>
                                        <Button
                                            onClick={_handleUploadViewClose}
                                            style={{
                                                width: '100%',
                                                backgroundColor: '#fff',
                                                color: '#6f6f6f',
                                                borderColor: Consts.SECONDARY_COLOR
                                            }}
                                        >
                                            ຍົກເລີກ
                                        </Button>
                                    </div>
                                    <div style={{ padding: 15 }} className='col'>
                                        <Button
                                            style={{
                                                width: '100%',
                                                backgroundColor: Consts.SECONDARY_COLOR,
                                                color: '#fff',
                                                borderColor: Consts.SECONDARY_COLOR
                                            }}
                                            onClick={handleSubmit}
                                        >
                                            ອັບໂຫລດ
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        )}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default DocumentUpload
