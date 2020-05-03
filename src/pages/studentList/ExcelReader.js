import React, { useState, useEffect } from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import XLSX from 'xlsx';
import './style.css';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
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
    Spinner
} from 'react-bootstrap'
import Consts from '../../consts'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CREATE_USER } from './../../apollo/user'
import { FACULTIES } from '../../apollo/faculty'
import { DEPARTMENTS } from '../../apollo/deparment'

function ExcelReader({
    showAddConfirmModal,
    _handleShowAddConfirmModalClose,
}) {
    const [file, setFile] = useState({})
    const [data, setData] = useState([])
    const [cols, setCols] = useState([])
    const [onLoading, setOnLoading] = useState(false);

    const [createUser] = useMutation(CREATE_USER)
    const { data: facultyData, loading: facultyLoading, error: facultyError } = useQuery(FACULTIES)
    const { data: departmentData, loading: departmentLoading, error: departmentError } = useQuery(DEPARTMENTS)

    useEffect(() => {
        // if (facultyData.faculties) {
        //     console.log(facultyData.faculties);
        // }
    }, [facultyData])

    const handleChange = async (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            setFile(files[0]);
        }
    };

    const handleFile = () => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const dataSheet = XLSX.utils.sheet_to_json(ws);
            /* Update state */
            // console.log("dataSheet: ", dataSheet)
            // console.log("Cols: ", make_cols(ws['!ref']))
            setData(dataSheet);
            setCols(make_cols(ws['!ref']));
        };

        if (rABS) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        };
    }

    const _confirmImport = async () => {
        try {
            setOnLoading(true)
            let arrDataSheet = []
            let arrDataSheet2 = []
            for (var i = 0; i < data.length; i++) {
                if (data[i].faculty) {
                    for (var j = 0; j < facultyData.faculties.length; j++) {
                        if (data[i].faculty == facultyData.faculties[j].name) {
                            arrDataSheet.push({
                                ...data[i],
                                faculty: {
                                    connect: {
                                        id: facultyData.faculties[j].id
                                    }
                                },
                                password: (data[i].password).toString()
                            })
                        }
                    }
                } else {
                    delete data[i].faculty
                    arrDataSheet.push({
                        ...data[i],
                        password: (data[i].password).toString()
                    })
                }
            }
            for (var i = 0; i < arrDataSheet.length; i++) {
                if (arrDataSheet[i].department) {
                    for (var j = 0; j < departmentData.departments.length; j++) {
                        if (arrDataSheet[i].department == departmentData.departments[j].name) {
                            arrDataSheet2.push({
                                ...arrDataSheet[i],
                                department: {
                                    connect: {
                                        id: departmentData.departments[j].id
                                    }
                                },
                                password: (arrDataSheet[i].password).toString(),
                                role: "STUDENT"
                            })
                        }
                    }
                } else {
                    delete arrDataSheet[i].department
                    arrDataSheet2.push({
                        ...arrDataSheet[i],
                        password: (arrDataSheet[i].password).toString(),
                        role: "STUDENT"
                    })
                }
            }
            for (var i = 0; i < arrDataSheet2.length; i++) {
                await createUser({ variables: { data: arrDataSheet2[i] } })
            }

            await setOnLoading(false)
            await _handleShowAddConfirmModalClose()
            window.location.reload(true)
        } catch (err) {
            // TODO: Show error
            console.log('err: ', err)
        }
    }

    return (
        <div>

            <Modal
                show={showAddConfirmModal}
                onHide={_handleShowAddConfirmModalClose}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Title style={{ textAlign: 'center', paddingTop: 20, fontWeight: 'bold' }}>
                    IMPORT STUDENTS FROM EXCEL FILE
                </Modal.Title>
                {
                    (onLoading == true) ?
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', height: 500, justifyContent: 'center', alignItems: 'center', textAlign: 'center', textJustify: 'center', marginTop: 100, marginBottom: 100 }}>
                            <Spinner animation="border" variant="info" />
                            <p>Please wait...</p>
                        </div> :
                        <Modal.Body
                            style={{
                                marginRight: 5, color: Consts.SECONDARY_COLOR0,
                                padding: 20,
                                paddingTop: 0
                            }}
                        >
                            <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={(e) => handleChange(e)} />
                            <br />
                            <input type='submit'
                                value="Generate and show datas"
                                onClick={() => handleFile()} />
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <table style={{ width: '100%', marginTop: 30 }}>
                                    <tr>
                                        <th style={{ width: 15 }}>#</th>
                                        <th>firstname</th>
                                        <th>lastname</th>
                                        <th>userId</th>
                                        <th>password</th>
                                        <th>phone</th>
                                        <th>email</th>
                                        <th>gender</th>
                                        <th>maritualStatus</th>
                                        <th>faculty</th>
                                        <th>department</th>
                                        <th>yearLevel</th>
                                        <th>birthday</th>
                                    </tr>
                                    {
                                        data &&
                                        data.length > 0 &&
                                        data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.firstname}</td>
                                                <td >{item.lastname}</td>
                                                <td>{item.userId}</td>
                                                <td>{item.password}</td>
                                                <td>{item.phone}</td>
                                                <td>{item.email}</td>
                                                <td>{item.gender}</td>
                                                <td>{item.maritualStatus}</td>
                                                <td>{item.faculty}</td>
                                                <td>{item.department}</td>
                                                <td>{item.yearLevel}</td>
                                                <td>{item.birthday}</td>
                                            </tr>
                                        ))
                                    }
                                </table>
                            </div>
                            <br />
                            <hr />
                            <br />
                            <div className='row'>
                                <div style={{ padding: 15 }} className='col'>
                                    <Button
                                        onClick={_handleShowAddConfirmModalClose}
                                        style={{
                                            width: '100%',
                                            backgroundColor: '#fff',
                                            color: '#6f6f6f',
                                            borderColor: Consts.SECONDARY_COLOR
                                        }}
                                    >
                                        Cancel
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
                                        onClick={() => _confirmImport()}
                                    >
                                        Import
                            </Button>
                                </div>
                            </div>
                        </Modal.Body>}
            </Modal>
        </div>

    )
}

export default ExcelReader;