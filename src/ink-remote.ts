import { PseudoTtyInfo, Server, ServerChannel, Session } from 'ssh2'

import { readFileSync } from 'fs'
import { RenderOptions } from 'ink'
import ansiEscapes from 'ansi-escapes'

export const serve = (onSession: (session: Session, shell: ServerChannel, renderOptions: RenderOptions, info: PseudoTtyInfo) => void, port: number) => {
  const server = new Server({
    hostKeys: [readFileSync('../../.ssh/id_ed25519')]
  }, (client) => {
    console.log('Client connected!')
  
    client
      .on('authentication', (ctx) => {
        ctx.accept()
      })
      .on('session', (accept) => {
        const ses = accept()
        ses.on('pty', (accept, reject, info) => {
          accept()
          
          console.log('accepted pty', info)

          ses.on('shell', (accept) => {
            const shell = accept()
            console.log('accepted shell')
            // @ts-ignore
            shell.stdin.isRaw = true
            // @ts-ignore
            shell.stdin.isTTY = true
            // @ts-ignore
            shell.stdin.setRawMode = () => {}
            // @ts-ignore
            shell.stdout.columns = info.cols
            // @ts-ignore
            shell.stdout.rows = info.rows

            // @ts-ignore
            shell.stdout.write = (function(write) {
              return function(string, encoding, fd) {
                // @ts-ignore
                const newString = string.split('\n').map((l, x) => {
                  if (x !== 0) {
                    return ansiEscapes.cursorLeft+l
                  }
                  return l
                }).join('\n')
                // @ts-ignore
                write.apply(shell.stdout, [newString, encoding, fd]);
              }
            }(shell.stdout.write))

            onSession(ses, shell, {
              stdout: shell.stdout,
              stdin: shell.stdin,
              stderr: shell.stderr,
              patchConsole: false
            } as unknown as RenderOptions, info)
          })
        })
      })
  }).listen(port, '127.0.0.1', () => {
    console.log('Listening on ' + port);
  })

  return server
}
