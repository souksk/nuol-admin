import {useDropzone} from 'react-dropzone'

export function useS3Upload ({
  presignedUploadUrl,
  onUploadStart,
  onUploadReady,
  onError
}) {
  async function handleDrop ([pendingImage]) {
    // Let the caller know that a file has been selected and a fetch is beginning.
    onUploadStart()

    // Upload the image to our pre-signed URL.
    const response = await fetch(
      new Request(presignedUploadUrl, {
        method: 'PUT',
        body: pendingImage,
        headers: new Headers({
          'Content-Type': 'file/*'
        })
      })
    )
    if (response.status !== 200) {
      // The upload failed, so let's notify the caller.
      onError()
      return
    }
    // Let the caller know that the upload is done, so that it can send the URL
    // to the backend again, persisting it to the database.
    onUploadReady()
  }

  return useDropzone({
    accept: 'file/*',
    disabled: typeof presignedUploadUrl !== 'string',
    handleDrop
  })
}
