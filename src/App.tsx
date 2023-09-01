import { FC, useEffect, useRef } from 'react'
import { Nodebox } from '@codesandbox/nodebox'

export const App: FC = () => {
  const nodeboxIframe = useRef<HTMLIFrameElement>(null)
  const previewIframe = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    ;(async () => {
      if (!nodeboxIframe.current) {
        return
      }
      const nodebox = new Nodebox({ iframe: nodeboxIframe.current })
      await nodebox.connect()
      await nodebox.fs.init({
        'package.json': JSON.stringify({
          dependencies: {
            express: '4.18.2',
          },
        }),
        'index.js': `const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(port)`,
      })
      const shell = nodebox.shell.create()
      const { id } = await shell.runCommand('node', ['index.js'])
      const { url } = await nodebox.preview.getByShellId(id)
      previewIframe.current!.src = url
    })()
  }, [])

  return (
    <>
      Hello World!!
      <iframe ref={nodeboxIframe} />
      <iframe ref={previewIframe} />
    </>
  )
}
