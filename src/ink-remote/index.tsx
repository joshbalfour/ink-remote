import { render } from 'ink'
import React from 'react'

import { AppWrapper } from './app-wrapper'
import { serve } from './ink-remote'

export const inkRemote = (app: () => JSX.Element, port: number) => {
  serve((ses, shell, renderOpts) => {
    const res = render(<AppWrapper shell={shell}>{app()}</AppWrapper>, renderOpts)
    ses.on('window-change', ((accept,b,info) => {
      if (accept) {
        accept()
      }
      if (renderOpts.stdout) {
        renderOpts.stdout.columns = info.cols
        renderOpts.stdout.rows = info.rows
      }
      renderOpts.stdout?.emit('resize')
      res.rerender(<AppWrapper shell={shell}>{app()}</AppWrapper>)
    }))
    res.waitUntilExit().then(() => {
      shell.exit(0)
      shell.close()
    })
  }, port)

  process.on('SIGTERM', () => {
    process.exit(0)
  })
}

