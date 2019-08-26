import React, { useRef, useEffect } from 'react'
import { _SelectBox } from './SelectBox'

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

/**
 *
 * @param {HTMLElement} gridContainer
 */
function handleGesture(gridContainer) {
  let mouseDownX = 0
  let mouseDownY = 0
  let mouseUpX = 0
  let mouseUpY = 0
  let isMouseDown = false
  let hasMouseDownMove = false
  const delay = 300
  let timeout

  /**
   *
   * @param {MouseEvent} e
   */
  function mouseDown(e) {
    e.preventDefault() // 禁止默认的文字拖选行为
    isMouseDown = true
    mouseDownX = e.x
    mouseDownY = e.y

    document.addEventListener('mousemove', continuouslySelect)
    timeout = setTimeout(() => {
      // 判定为 “长按” 后的逻辑
      document.removeEventListener('mousemove', continuouslySelect)
      document.addEventListener('mousemove', rectangleSelect)
    }, delay)
    document.addEventListener('mouseup', mouseUp)
  }
  // /**
  //  *
  //  * @param {MouseEvent} e
  //  */
  // function clickSelect(e) {
  //   clearTimeout(timeout) // 此行为已定性为 “短按”
  //   function getMousePath() {
  //     //干嘛要显示完整的path？只要略带一点拖尾效果就好啦
  //     let path
  //     return path
  //   }
  //   function drawMousePath(path = '') {
  //     // use SVG
  //   }

  //   const topmostElement = document.elementFromPoint(e.x, e.y)
  //   if (topmostElement) {
  //     topmostElement.dispatchEvent(
  //       new CustomEvent('continuously-select', { bubbles: true })
  //     )
  //   }

  //   const path = getMousePath()
  //   drawMousePath(path)
  // }
  /**
   *
   * @param {MouseEvent} e
   */
  function continuouslySelect(e) {
    clearTimeout(timeout) // 此行为已定性为 “短按”
    hasMouseDownMove = true
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
        new CustomEvent('continuously-select', { bubbles: true })
      )
    }

    const path = getMousePath()
    drawMousePath(path)
  }
  /**
   *
   * @param {MouseEvent} e
   */
  function rectangleSelect(e) {
    hasMouseDownMove = true
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
        new CustomEvent('rectangle-select', {
          bubbles: true,
          detail: {
            startItem: document.elementFromPoint(mouseDownX, mouseDownY),
          }
        })
      )
    }
    const path = getMousePath()
    drawMousePath(path)
  }
  /**
   *
   * @param {MouseEvent} e
   */
  function mouseUp(e) {
    clearTimeout(timeout) // 此行为已定性为 “短按”
    if (isMouseDown && !hasMouseDownMove) {
      const topmostElement = document.elementFromPoint(e.x, e.y)
      if (topmostElement) {
        topmostElement.dispatchEvent(
          new CustomEvent('click-select', { bubbles: true })
        )
      }
    }
    isMouseDown = false
    hasMouseDownMove = false
    mouseUpX = e.x
    mouseUpY = e.y
    document.removeEventListener('mousemove', continuouslySelect)
    document.removeEventListener('mousemove', rectangleSelect)
    document.removeEventListener('mouseup', mouseUp)
  }
  gridContainer.addEventListener('mousedown', mouseDown)
}

/**
 *
 * @param {HTMLElement} gridContainer
 */
function mapGesture(gridContainer) {
  const gridChildren = gridContainer.childNodes
  gridContainer.addEventListener(
    'click-select',
    /**@type {MouseEvent} */ e => {
      /**@type {HTMLElement} */
      const targetGridChild = e.target
      if (targetGridChild) {
        targetGridChild.classList.toggle('selected')
      }
    }
  )
  gridContainer.addEventListener(
    'continuously-select',
    ({ target: targetGridChild }) => {
      if (targetGridChild) {
        targetGridChild.classList.add('selected')
      }
    }
  )
  gridContainer.addEventListener(
    'rectangle-select',
    /**@type {CustomEvent} */ ({
      target: endGridChild,
      detail: { startItem: startGridChild }
    }) => {
      const gridChildrens = Array.from(gridChildren)
      if (
        gridChildrens.includes(startGridChild) &&
        gridChildrens.includes(endGridChild)
      ) {
        function getRectangle(point1, point2) {
          point1 = point1.split(',')
          point2 = point2.split(',')
          const selectedCoordinates = []
          const top = Math.min(point1[1], point2[1])
          const right = Math.max(point1[0], point2[0])
          const bottom = Math.max(point1[1], point2[1])
          const left = Math.min(point1[0], point2[0])
          for (let i = left; i < right + 1; i++) {
            for (let j = top; j < bottom + 1; j++) {
              selectedCoordinates.push(`${i},${j}`)
            }
          }
          return selectedCoordinates
        }
        const rectangle = getRectangle(
          startGridChild.dataset.coordinate,
          endGridChild.dataset.coordinate
        )
        gridChildrens
          .filter(gridchild => rectangle.includes(gridchild.dataset.coordinate))
          .forEach(gridChild => gridChild.classList.add('selected'))
      }
    }
  )
}

export function MultiSelectBoxes({ matrixSize = [15, 15] }) {
  const ref = useRef()
  const matrix = createMatrix(matrixSize)
  useEffect(() => {
    handleGesture(ref.current)
    mapGesture(ref.current)
  }, [])
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${matrixSize[0]}, max-content)`
      }}
      ref={ref}
    >
      {matrix.flatMap(coordinate => (
        <_SelectBox key={coordinate} coordinate={coordinate} />
      ))}
    </div>
  )
}
