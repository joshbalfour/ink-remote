import { render } from 'ink'
import React from 'react'

import { App } from './app'
import { serve } from './ink-remote'

serve((ses, shell, renderOpts, info) => {
  const res = render(<App shell={shell} />, renderOpts)
  ses.on('window-change', ((accept,b,info) => {
    if (accept) {
      accept()
    }
    if (renderOpts.stdout) {
      renderOpts.stdout.columns = info.cols
      renderOpts.stdout.rows = info.rows
    }
    renderOpts.stdout?.emit('resize')
    res.rerender(<App shell={shell} />)
  }))
  res.waitUntilExit().then(() => {
    shell.exit(0)
    shell.close()
  })
}, 1337)

process.on('SIGTERM', () => {
  process.exit(0)
})