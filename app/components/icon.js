import React from 'react'
import classnames from 'classnames'

export default function Icon(props) {
  let classNames = classnames({
    'fa': true,
    [`fa-${props.type}`]: true
  }, props.className)
  return <i className={classNames} />
}