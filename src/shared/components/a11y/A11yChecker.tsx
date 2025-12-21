"use client"

import { useEffect } from "react"

/**
 * 개발 환경에서만 접근성 검사를 수행하는 컴포넌트
 * 프로덕션에서는 자동으로 비활성화됩니다.
 */
export function A11yChecker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return
    }

    // @axe-core/react는 개발 환경에서만 동적으로 로드
    import("@axe-core/react").then((axe) => {
      const React = require("react")
      const ReactDOM = require("react-dom")
      axe.default(React, ReactDOM, 1000)
    })
  }, [])

  return null
}

