import React from 'react'
import Consts from '../consts'

const Title = ({text}) => {
  return (
    <div style={{fontSize: 32, color: Consts.FONT_COLOR_PRIMARY}}>
      {text}
    </div>
  )
}

export default Title
