import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { drawCheckbox,abc } from './drawCheckbox'

const [any, drawUI] = drawCheckbox()

const App = () => drawUI(<div className="hello">hello</div>)

ReactDOM.render(<App />, document.getElementById('root'))
