import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { MultiSelectBoxes } from './MultiSelectBoxes'
import { Loading } from './Loading'

ReactDOM.render(
  <>
    <MultiSelectBoxes />
    <Loading />
  </>,
  document.getElementById('root')
)
