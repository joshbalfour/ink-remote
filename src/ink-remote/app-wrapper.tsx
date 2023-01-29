import React, { PropsWithChildren } from 'react'
import { Text, useInput } from 'ink'
import { ServerChannel } from 'ssh2'
import escapes from 'ansi-escapes'

export const AppWrapper = ({ shell, children } : PropsWithChildren<{ shell: ServerChannel }>) => {
	useInput((input, key) => {
		if (key.ctrl && input === 'c') {
			shell.close()
		}
	})

	return (
		<>
			<Text>{escapes.clearScreen}</Text>
			{children}
		</>
	)
}
