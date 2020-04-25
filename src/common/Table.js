import styled from 'styled-components'
import Consts from '../consts'

export const TableHeader = styled.tr`
  background-color: ${Consts.PRIMARY_COLOR};
  color: #fff;
  text-align: center;
  height: 40px;
`

export const TableCell = styled.td`
  background-color: #efefef;
  height: 40px;
  padding: 0;
  color: ${Consts.FONT_COLOR_SECONDARY};
`
