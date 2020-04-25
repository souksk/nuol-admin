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
  style
}) {
  return (
    <button
      style={{
        backgroundColor: confirm ? Consts.SECONDARY_COLOR : '#fff',
        color: confirm ? '#fff' : '#000',
        width: width || 140,
        height: 40,
        border: '1px solid ' + Consts.SECONDARY_COLOR,
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
