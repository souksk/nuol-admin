import React, { useState, useEffect } from 'react'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import * as _ from 'lodash'
import DocumentSearch from './DocumentSearch'
import DocumentUpload from './DocumentUpload'
import Consts from '../../consts'
import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks'
import { FILES, FILE_BY_KEYWORD } from '../../apollo/doc'

function DocumentList() {
  const { history, location, match } = useReactRouter()

  const [filesData, setFilesData] = useState([])
  const [fileCat, setFileCat] = useState({ where: { type: 'PUBLIC_FILE' } })
  const { error, loading, data: normalFilesData } = useQuery(FILES, { variables: fileCat })

  // Query courses
  const [
    loadFilesByKeyword,
    { called, loading: filesByKeywordLoading, data: keywordFilesData }
  ] = useLazyQuery(FILE_BY_KEYWORD)

  // Watch effect from normalFilesData
  useEffect(
    () => {
      if (!_.isEmpty(normalFilesData)) {
        setFilesData(normalFilesData.files)
      }
    },
    [normalFilesData]
  )

  // Watch effect from keywordFilesData
  useEffect(
    () => {
      // //console.log("keywordFilesData: ", keywordFilesData)
      if (!_.isEmpty(keywordFilesData)) {
        // //console.log("finish to search", keywordFilesData.fileByKeyword)
        setFilesData(keywordFilesData.fileByKeyword)
      }
    },
    [keywordFilesData]
  )

  // States
  const [showSearchView, setShowSearchView] = useState(false)
  const [showUploadView, setShowUploadView] = useState(false)
  const [title, setTitle] = useState("ALL DOCUMENTS")
  const [keywordInput, setKeywordInput] = useState(null)

  // Set states
  const _handleSearchViewClose = () => setShowSearchView(false)
  const _handleSearchViewShow = () => setShowSearchView(true)

  const _handleUploadViewClose = () => setShowUploadView(false)
  const _handleUploadViewShow = () => setShowUploadView(true)

  const _documentDetail = data => {
    history.push('/document-detail', data)
  }

  const _onSearch = value => {
    //console.log('value: ', value)
    if (!_.isEmpty(value.keyword)) {
      // Perform search by keyword
      // //console.log("Searching")
      loadFilesByKeyword({
        variables: { keyword: value.keyword }
      })
      setKeywordInput(value.keyword)
      setTitle("SEARCH RESULT")
    } else {
      setFilesData(normalFilesData.files)
      setTitle("ALL DOCUMENTS")
      setKeywordInput('')
    }
  }

  const [isClicked, setIsClicked] = useState(0)
  function showBorder(status) {
    // Status : 0 = ທັງໝົດ 1 = ບົດຄົ້ນຄວ້າ 2 = ຄວາມຮູ້ທົ່ວໄປ 3 = ເອກະສານວິຊາສະເພາະ
    setIsClicked(status)
    if (status == 0) {
      setFileCat({ where: { type: 'PUBLIC_FILE' } })
    } else if (status == 1) {
      setFileCat({ where: { type: 'PUBLIC_FILE', cate: 'RESEARCH' } })
    } else if (status == 2) {
      setFileCat({ where: { type: 'PUBLIC_FILE', cate: 'GENERAL' } })
    } else if (status == 3) {
      setFileCat({ where: { type: 'PUBLIC_FILE', cate: 'SPECIFIC' } })
    }
  }
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item active>{title}</Breadcrumb.Item>
      </Breadcrumb>
      <CustomContainer>
        <Title text={title + (keywordInput ? ': ' + keywordInput : "")} />
        <div style={{ textAlign: 'right' }}>
          <CustomButton
            confirm
            downloadIcon
            width={200}
            title='Upload Document'
            onClick={() => _handleUploadViewShow()}
          />
        </div>

        {/* custom search button */}
        <SearchBar
          title='Keyword . . .'
          onClick={() => _handleSearchViewShow()}
        />

        {/* muad */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginTop: 30
          }}
        >
          <div style={{ width: 100 }}>Category</div>
          <div
            onClick={() => showBorder(0)}
            style={{
              width: 100,
              marginRight: 30,
              textAlign: 'center',
              cursor: 'pointer',
              borderBottom: isClicked == 0 ? '5px solid #7BB500' : 'none'
            }}
          >
            All Files
          </div>
          <div
            onClick={() => showBorder(1)}
            style={{
              width: 100,
              marginRight: 40,
              textAlign: 'center',
              cursor: 'pointer',
              borderBottom: isClicked == 1 ? '5px solid #7BB500' : 'none'
            }}
          >
            Research
          </div>
          <div
            onClick={() => showBorder(2)}
            style={{
              width: 100,
              marginRight: 40,
              textAlign: 'center',
              cursor: 'pointer',
              borderBottom: isClicked == 2 ? '5px solid #7BB500' : 'none'
            }}
          >
            Specific
          </div>
          <div
            onClick={() => showBorder(3)}
            style={{
              width: 100,
              cursor: 'pointer',
              borderBottom: isClicked == 3 ? '5px solid #7BB500' : 'none'
            }}
          >
            General
          </div>
        </div>

        {/* ເອກະສານທັງຫມົດ */}
        <div
          style={{
            marginTop: 24,
            marginBottom: 8,
            fontSize: 16,
            color: Consts.FONT_COLOR_SECONDARY
          }}
        >
          All {filesData.length} documents
        </div>

        {/* Table list */}
        <div>
          <table border='1' bordercolor='#fff' style={{ width: '100%' }}>
            <thead>
              <TableHeader>
                <th>#</th>
                <th>FILE NAME</th>
                <th>DESCRIPTION</th>
                <th>UPLOAD DATE</th>
                <th style={{ width: 200 }}>ACTIONS</th>
              </TableHeader>
            </thead>
            <tbody>
              {filesData.length > 0 &&
                filesData.map((x, index) => {
                  return (
                    <tr
                      style={{
                        borderBottom: '2px solid #ffff',
                        textAlign: 'center'
                      }}
                      key={index}
                    >
                      <TableCell style={{ width: 60 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {x.title}
                      </TableCell>
                      <TableCell>
                        {(x.description ? x.description : '-')}
                      </TableCell>
                      <TableCell style={{ width: 200 }}>
                        {new Date(x.updatedAt).toLocaleString('la-LA', { hour12: false })}
                      </TableCell>
                      <TableCell style={{ width: 200 }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            width: 200
                          }}
                        >
                          <a href={x.file} download>
                            <div style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}>
                              <i className='fa fa-download' style={{ color: Consts.BORDER_COLOR }} />
                            </div>
                          </a>

                          <div
                            onClick={() => _documentDetail(x)}
                            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', padding: 3, width: 64, borderRadius: 4 }}>
                            <FontAwesomeIcon
                              icon={['fas', 'eye']}
                              color={Consts.BORDER_COLOR}
                            />
                          </div>

                        </div>
                      </TableCell>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </CustomContainer>
      {/* Search Modal */}
      <DocumentSearch
        showSearchView={showSearchView}
        _handleSearchViewClose={_handleSearchViewClose}
        onSearch={value => _onSearch(value)}
      />

      {/* Upload Modal */}
      <DocumentUpload
        showUploadView={showUploadView}
        _handleUploadViewClose={_handleUploadViewClose}
      />
    </div>
  )
}

export default DocumentList
