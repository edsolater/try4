import React, { useRef, useEffect } from 'react'
import { _SelectBox } from './SelectBox'

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
function mapOriginalEvent(gridContainer, { selectedItemClassName } = {}) {
  const delay = 300 // 判定框选的鼠标长按毫秒数
  let mouseDownX = 0
  let mouseDownY = 0
  let mouseUpX = 0
  let mouseUpY = 0
  let isMouseDown = false
  let hasMouseDownMove = false
  let gridChildIsSelected = false
  /**@type {NodeJS.Timeout} */
  let timeout

  /**
   *
   * @param {MouseEvent} e
   */
  function whenMouseDown(e) {
    e.preventDefault() // 禁止默认的文字拖选行为
    isMouseDown = true
    mouseDownX = e.x
    mouseDownY = e.y
    gridChildIsSelected = e.target.classList.contains(selectedItemClassName)

    document.addEventListener('mousemove', draglySelect)
    timeout = setTimeout(() => {
      // 判定为 “长按” 后的逻辑
      document.removeEventListener('mousemove', draglySelect)
      document.addEventListener('mousemove', rectlySelect)
    }, delay)
    document.addEventListener('mouseup', clicklySelect)
    document.addEventListener('mouseup', whenMouseUp)
  }
  /**
   *
   * @param {MouseEvent} e
   */
  function clicklySelect(e) {
    clearTimeout(timeout) // 此行为已定性为 “短按”
    if (isMouseDown && !hasMouseDownMove) {
      const topmostElement = document.elementFromPoint(e.x, e.y)
      if (topmostElement) {
        topmostElement.dispatchEvent(
          new CustomEvent('clickly-select', {
            bubbles: true,
            detail: { mode: gridChildIsSelected ? 'remove' : 'add' }
          })
        )
      }
    }
  }
  /**
   *
   * @param {MouseEvent} e
   */
  function draglySelect(e) {
    clearTimeout(timeout) // 此行为已定性为 “短按”
    hasMouseDownMove = true
    const topmostElement = document.elementFromPoint(e.x, e.y)
    if (topmostElement) {
      topmostElement.dispatchEvent(
        new CustomEvent('dragly-select', {
          bubbles: true,
          detail: { mode: gridChildIsSelected ? 'remove' : 'add' }
        })
      )
    }
  }
  /**
   *
   * @param {MouseEvent} e
   */
  function rectlySelect(e) {
    const topmostElement = document.elementFromPoint(e.x, e.y)
    if (topmostElement) {
      topmostElement.dispatchEvent(
        new CustomEvent('rectly-select', {
          bubbles: true,
          detail: {
            firstTimeInvoke: !hasMouseDownMove,
            startItem: document.elementFromPoint(mouseDownX, mouseDownY),
            mode: gridChildIsSelected ? 'remove' : 'add'
          }
        })
      )
    }
    hasMouseDownMove = true
    document.addEventListener('mouseup', rectlySelectFinish)
  }
  /**
   *
   * @param {MouseEvent} e
   */
  function rectlySelectFinish(e) {
    const topmostElement = document.elementFromPoint(e.x, e.y)
    if (topmostElement) {
      topmostElement.dispatchEvent(
        new CustomEvent('rectly-select-finish', {
          bubbles: true
        })
      )
    }
    document.removeEventListener('mouseup', rectlySelectFinish)
  }
  /**
   *
   * @param {MouseEvent} e
   */
  function whenMouseUp(e) {
    isMouseDown = false
    hasMouseDownMove = false
    mouseUpX = e.x
    mouseUpY = e.y
    document.removeEventListener('mousemove', draglySelect)
    document.removeEventListener('mousemove', rectlySelect)
    document.removeEventListener('mouseup', clicklySelect)
    document.removeEventListener('mouseup', whenMouseUp)
  }
  gridContainer.addEventListener('mousedown', whenMouseDown)
}

/**
 *
 * @param {HTMLElement} gridContainer
 */
function dealWithCustomEvent(
  gridContainer,
  { selectedItemClassName, rectlySelectedItemClassName } = {}
) {
  const gridChildren = Array.from(gridContainer.children)
  let shouldPaintItems = []
  let paintMode
  function getDatasetValue(target, key) {
    if (target) {
      return target.dataset && target.dataset[key]
    }
    return null
  }
  /**
   *
   * @param {HTMLElement[] | HTMLElement} item
   * @param {string} mode
   */
  function paintItem(item, { mode, className } = {}) {
    if (item instanceof Array) {
      item.forEach(item => item.classList[mode](className))
    } else {
      item.classList[mode](className)
    }
  }
  function getItemByCoordinate(coordinate = []) {
    if (typeof coordinate === 'string') {
      return gridChildren.find(item => {
        const gridChildCoordinate = getDatasetValue(item, 'coordinate')
        return gridChildCoordinate === coordinate
      })
    } else {
      return gridChildren.filter(item => {
        const gridChildCoordinate = getDatasetValue(item, 'coordinate')
        return coordinate.includes(gridChildCoordinate)
      })
    }
  }
  /**
   *
   * @eventListener
   */
  function clicklySelect({ target: targetGridChild, detail }) {
    const mode = detail && detail.mode
    if (gridChildren.includes(targetGridChild)) {
      paintItem(targetGridChild, { mode, className: selectedItemClassName })
    }
  }
  /**
   *
   * @eventListener
   */
  function draglySelect({ target: targetGridChild, detail }) {
    const mode = detail && detail.mode
    if (gridChildren.includes(targetGridChild)) {
      paintItem(targetGridChild, { mode, className: selectedItemClassName })
    }
  }
  /**
   *
   * @eventListener
   */
  function rectlySelect({ target: endGridChild, detail }) {
    if (!detail) detail = {}
    /**
     *
     * @pureFunction
     */
    function diff(prevCoordinates = [], newCoordinates = []) {
      function arrayMinus(array1, array2) {
        return array1.filter(x => !array2.includes(x))
      }
      function arrayInterset(array1, array2) {
        return array1.filter(x => array2.includes(x))
      }
      const commonCoordinates = arrayInterset(prevCoordinates, newCoordinates)
      return {
        newItems: arrayMinus(newCoordinates, commonCoordinates),
        oldItems: arrayMinus(prevCoordinates, commonCoordinates)
      }
    }
    /**
     *
     * @DOMEffect
     */
    function drawRect(shouldDeselectItems, shouldSelectItems) {
      paintItem(getItemByCoordinate(shouldSelectItems), {
        mode: 'add',
        className: rectlySelectedItemClassName
      })
      paintItem(getItemByCoordinate(shouldDeselectItems), {
        mode: 'remove',
        className: rectlySelectedItemClassName
      })
    }
    function getSelectedCoordinates(point1, point2) {
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
    const startGridChild = detail.startItem
    paintMode = detail.mode
    if (gridChildren.includes(startGridChild) && gridChildren.includes(endGridChild)) {
      const prevCoordinates = detail.firstTimeInvoke ? [] : rectlySelect.prevCoordinates
      const newCoordinates = getSelectedCoordinates(
        startGridChild.dataset.coordinate,
        endGridChild.dataset.coordinate
      )
      rectlySelect.prevCoordinates = newCoordinates
      const { oldItems: shouldDeselectItems, newItems: shouldSelectItems } = diff(
        prevCoordinates,
        newCoordinates
      )
      shouldPaintItems = newCoordinates
      drawRect(shouldDeselectItems, shouldSelectItems)
    }
  }
  /**
   *
   * @eventListener
   */
  function rectlySelectFinish() {
    getItemByCoordinate(shouldPaintItems).forEach(item => {
      paintItem(item, { mode: paintMode, className: selectedItemClassName })
      paintItem(item, { mode: 'remove', className: rectlySelectedItemClassName })
    })
    shouldPaintItems = []
  }
  gridContainer.addEventListener('clickly-select', clicklySelect)
  gridContainer.addEventListener('dragly-select', draglySelect)
  gridContainer.addEventListener('rectly-select', rectlySelect)
  gridContainer.addEventListener('rectly-select-finish', rectlySelectFinish)
}

/**
 *
 * @param {HTMLElement} gridContainer
 */
function understandSelectGesture(gridContainer, config) {
  mapOriginalEvent(gridContainer, config)
  dealWithCustomEvent(gridContainer, config)
}

export function MultiSelectBoxes({
  matrixSize = [15, 15],
  config: { selectedItemClassName = 'selected', rectlySelectedItemClassName = 'inSelectRect' } = {}
}) {
  const ref = useRef()
  const matrix = createMatrix(matrixSize)
  useEffect(() => {
    understandSelectGesture(ref.current, { selectedItemClassName, rectlySelectedItemClassName })
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
