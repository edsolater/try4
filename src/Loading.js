import React, { useRef, useEffect, useState } from 'react'
// 这个组件无关事件交互，应该想着怎么用事件驱动

export function Loading({ needTime = 200 }) {
  // 只用百分比表示进度
  const ref = useRef()
  useEffect(() => {
    getLoading(ref.current)
  })
  return (
    <progress
      className="loading"
      style={{
        width: 100,
        height: 100
      }}
      ref={ref}
    >
      hello
    </progress>
  )
}

/**
 *
 * @param {HTMLProgressElement} el
 */
function getLoading(el) {
  console.log(el)
}
