import React from 'react'
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
import {Formik} from 'formik'
import {
  CustomContainer,
  SearchBar,
  Title,
  CustomButton,
  TableHeader,
  TableCell
} from '../../common'

const DocumentSearch = ({showSearchView, _handleSearchViewClose, onSearch}) => {
  return (
    <Formik
      initialValues={{
        keyword: ''
      }}
      onSubmit={values => {
        onSearch(values)
        _handleSearchViewClose()
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
        /* and other goodies */
      }) =>
        <Modal show={showSearchView} onHide={_handleSearchViewClose} size='lg'>
          <Modal.Title style={{textAlign: 'center', paddingTop: 20}}>
            SEARCH DOCUMENT
          </Modal.Title>

          <Modal.Body style={{marginLeft: 50, marginRight: 50, padding: 50}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div style={{marginRight: 20, fontWeight: 'bold'}}>Keyword</div>
              <div style={{width: '100%'}}>
                <Form.Control
                  type='text'
                  placeholder='database, javaScript, ...'
                  name='keyword'
                  value={values.keyword}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: 35,
                    borderRadius: 15,
                    outline: 'none',
                    borderColor: '1px solid #eee'
                  }}
                />
              </div>
            </div>
            <div style={{height: 20}} />
            <div className='row'>
              <div style={{padding: 15}} className='col'>
                <CustomButton
                  confirm
                  onClick={handleSubmit}
                  width='100%'
                  title='Search'
                />
              </div>
            </div>
          </Modal.Body>
        </Modal>}
    </Formik>
  )
}

export default DocumentSearch
