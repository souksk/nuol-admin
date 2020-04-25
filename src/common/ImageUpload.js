import React from 'react'
import {useS3Upload} from './useS3Upload'

export function ImageUpload ({
  children,
  presignedUploadUrl
  // other props here
}) {
  const {getRootProps, getInputProps} = useS3Upload({
    presignedUploadUrl
    // callbacks here
  })

  return (
    <div {...getRootProps()}>
      {children}
      <input {...getInputProps()} />
    </div>
  )
}
