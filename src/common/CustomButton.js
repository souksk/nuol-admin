import React, { Component } from 'react'
import Consts from '../consts'

/**
 *
 * @param {confirm} : show confirm
 * @param {addIcon} : show addIcon
 * @param {downloadIcon} : show downloadIcon
 */
function CustomButton({
  title,
  onClick,
  confirm,
  addIcon,
  downloadIcon,
  width,
  style,
  deleteType
}) {
  return (
    <button
      style={{
        backgroundColor: confirm ? Consts.SECONDARY_COLOR : (deleteType ? Consts.BORDER_COLOR_DELETE : '#fff'),
        color: (confirm || deleteType) ? '#fff' : '#000',
        width: width || 140,
        height: 40,
        border: (deleteType) ? Consts.BORDER_COLOR_DELETE : '1px solid ' + Consts.SECONDARY_COLOR,
        outline: 'none',
        ...style
      }}
      onClick={() => onClick()}
    >
      {addIcon && <i className='fa fa-plus' />}{' '}
      {downloadIcon && <i className='fa fa-download' />} {title}
    </button>
  )
}

export default CustomButton
