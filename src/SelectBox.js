import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'

function makeScaleable(el, options) {
  if (options === true) options = { right: true }

  const configedCursor = el.style.cursor
  const configedTransition = el.style.transition

  function appendTriggerDivTo(target, style, triggerLoaction = 'right') {
    triggerLoaction = [triggerLoaction].flat()
    let scaleDirection = {}
    if (triggerLoaction.includes('right') || triggerLoaction.includes('left'))
      scaleDirection.x = true
    if (triggerLoaction.includes('bottom') || triggerLoaction.includes('top'))
      scaleDirection.y = true
    function mouseDown(e) {
      e.stopPropagation()
      el.style.transition = undefined
      const mousedownX = e.x
      const mousedownY = e.y
      const boxW = el.clientWidth
      const boxH = el.clientHeight
      function mouseMove(e) {
        const deltaX = e.x - mousedownX
        const deltaY = e.y - mousedownY
        const width = Math.max(10, deltaX + boxW)
        const height = Math.max(10, deltaY + boxH)
        if (scaleDirection.x) el.style.width = width + 'px'
        if (scaleDirection.y) el.style.height = height + 'px'
      }
      function mouseUp(e) {
        el.style.cursor = configedCursor
        el.style.transition = configedTransition
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
      }
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
    }
    el.style.cursor = configedCursor || 'se-resize'
    const triggerDiv = document.createElement('div')
    Object.assign(triggerDiv.style, style)
    triggerDiv.addEventListener('mousedown', mouseDown)
    target.append(triggerDiv)
  }

  if (options.right)
    appendTriggerDivTo(
      el,
      {
        width: '5px',
        height: '100%',
        position: 'absolute',
        background: '#00000024',
        cursor: 'col-resize',
        right: 0
      },
      'right'
    )
  if (options.bottom)
    appendTriggerDivTo(
      el,
      {
        width: '100%',
        height: '5px',
        position: 'absolute',
        background: '#00000024',
        cursor: 'row-resize',
        bottom: 0
      },
      'bottom'
    )
}

export function SelectBox({ text = 'hello', className, co = [0, 0] }) {
  const [isSelected, selectedState] = useState(false)
  const ref = useRef()
  useEffect(() => {
    if (ref) {
      const el = ref.current || new HTMLElement()
      el.addEventListener('mousedraw', () => selectedState(true))
    }
  }, [])
  return (
    <div
      className={classNames('selectBox', { selected: isSelected }, className)}
      ref={ref}
      onClick={() => selectedState(!isSelected)}
    >
      {co.join(' ')}
    </div>
  )
}
