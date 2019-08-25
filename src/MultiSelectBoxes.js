import React, { useRef, useEffect } from 'react'
import { SelectBox } from './SelectBox'

function makeDraggable(el) {
  const configedCursor = el.style.cursor || 'grab'
  const configedTransition = el.style.transition

  el.style.cursor = configedCursor

  function mouseDown(e) {
    e.preventDefault()
    el.style.transition = undefined // 禁用 Transition 设置（不然会拖拽不能）
    const matched =
      (el.style.transform || '').match(
        /(.*)translate\((\d+)px(?:, (\d+)px)?\)(.*)/
      ) || []
    const otherTransformLeft = String(matched[1] || '')
    const preTransX = Number(matched[2] || 0)
    const preTransY = Number(matched[3] || 0)
    const otherTransformRight = String(matched[4] || '')
    const mousedownX = e.x
    const mousedownY = e.y

    el.style.cursor = 'grabbing'

    function mouseMove(e) {
      const newTransX = e.x - mousedownX + preTransX
      const newTransY = e.y - mousedownY + preTransY
      el.style.transform = `${otherTransformLeft}translate(${newTransX}px, ${newTransY}px)${otherTransformRight}`
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
  el.addEventListener('mousedown', mouseDown)
}

function createMatrix(matrixSize = [0, 0]) {
  const [x, y] = matrixSize
  const matrix = []
  for (let j = 0; j < y; j++) {
    for (let i = 0; i < x; i++) {
      matrix.push([i, j])
    }
  }
  return matrix
}

function handleMouseGesture(el = new HTMLElement()) {
  function handleMouseDown(e = new MouseEvent()) {
    e.preventDefault()
    mouseDownX = e.x
    mouseDownY = e.y
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  function handleMouseMove(e = new MouseEvent()) {
    e.preventDefault()
    function getMousePath() {
      //干嘛要显示完整的path？只要略带一点拖尾效果就好啦
      let path
      return path
    }
    function drawMousePath(path = '') {
      // use SVG
    }

    const topmostElement = document.elementFromPoint(e.x, e.y)
    if (topmostElement) {
      topmostElement.dispatchEvent(
        new CustomEvent('mousedraw') 
      )
    }

    const path = getMousePath()
    drawMousePath(path)
  }
  function handleMouseUp(e = new MouseEvent()) {
    e.preventDefault()
    mouseUpX = e.x
    mouseUpY = e.y
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  el.addEventListener('mousedown', handleMouseDown)
}


export function MultiSelectBoxes({ matrixSize = [4, 5] }) {
  const ref = useRef()
  const matrix = createMatrix(matrixSize)
  useEffect(() => {
    ref && handleMouseGesture(ref.current)
  }, [])
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${matrixSize[0]}, 1fr)`
      }}
      ref={ref}
    >
      {matrix.flatMap(co => (
        <SelectBox key={co} co={co} />
      ))}
    </div>
  )
}
