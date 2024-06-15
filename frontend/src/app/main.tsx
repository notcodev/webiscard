import './index.css'
import ReactDOM from 'react-dom/client'
import { appStarted } from '~/shared/config/init'
import { App } from './application'

const container = document.querySelector('#root') as HTMLElement
const root = ReactDOM.createRoot(container)

appStarted()
root.render(<App />)
