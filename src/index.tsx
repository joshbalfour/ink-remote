import React from 'react'
import { inkRemote } from "./ink-remote"
import { App } from './app'

inkRemote(() => <App />, 1337)