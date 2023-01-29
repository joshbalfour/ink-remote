import React from 'react'
import { Box, Newline, Text, useInput, useStdout } from 'ink'
import { ServerChannel } from 'ssh2'
import escapes from 'ansi-escapes'

export const App = ({ shell } : { shell: ServerChannel }) => {
	const {stdout} = useStdout()
	useInput((input, key) => {
		if (key.ctrl && input === 'c') {
			shell.close()
		}
	})

	return (
		<>
			<Text>{escapes.clearScreen}</Text>
			<Box width={"100%"} height="100" borderStyle="bold" borderColor={"green"} alignItems="center" justifyContent="center">
				<Text>{stdout?.columns} cols, {stdout?.rows} rows</Text>
			</Box>
		</>
	)
}
