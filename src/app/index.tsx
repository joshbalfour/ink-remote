import { Box, Newline, Text, useStdout } from 'ink'
import React from 'react'

export const App = () => {
  const { stdout } = useStdout()
  return (
    <Box borderColor="green" borderStyle='bold'>
      <Text>Rows: {stdout?.rows} <Newline /> Columns: {stdout?.columns}</Text>
    </Box>
  )
}

