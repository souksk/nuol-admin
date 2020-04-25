import React, {useState} from 'react'
import Consts from '../consts'

function SearchBar ({title, onClick}) {
  return (
    <div className='row'>
      <div className='col-1'>
        <div style={{paddingTop: 20, paddingBottom: 20}}>
          <p
            className=' '
            style={{margin: 0, color: Consts.FONT_COLOR_SECONDARY}}
          >
            ຄົ້ນຫາ
          </p>
        </div>
      </div>

      <div className='col' style={{paddingTop: 15}}>
        <button
          style={{
            width: '100%',
            height: 35,
            borderRadius: 15,
            outline: 'none',
            backgroundColor: '#eee',
            borderWidth: 0,
            color: Consts.FONT_COLOR_SECONDARY
          }}
          onClick={() => onClick()}
        >
          {title}
        </button>
        <i
          className='fa fa-search'
          style={{marginLeft: -35, marginTop: 10, fontSize: 16}}
        />
      </div>
    </div>
  )
}

export default SearchBar
