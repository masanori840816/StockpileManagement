import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { RegisterPage } from './RegisterPage';
import { EditPage } from './EditPage';
import { TopPage } from './TopPage';

import './App.css'

function App() {

  return (
    <>
      <BrowserRouter basename='/stockpiles/'>
        <Routes>
          <Route path='/' element={<TopPage />} />
          <Route path='/pages/register' element={<RegisterPage />} />
          <Route path='/pages/edit' element={<EditPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
