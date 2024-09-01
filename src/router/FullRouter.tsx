import { Route, Routes } from 'react-router-dom'
import AbiCallerPage from '@/pages/AbiCaller/AbiCaller'

export default function FullRouter() {
  return (
    <Routes>
      <Route path="/" element={<AbiCallerPage />}></Route>
    </Routes>
  )
}
