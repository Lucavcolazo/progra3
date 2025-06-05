import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Boards from './pages/Boards';
import BoardDetail from './pages/BoardDetail';
import Settings from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/boards',
    element: <Boards />,
  },
  {
    path: '/board/:boardName',
    element: <BoardDetail />,
  },
  {
    path: '/settings',
    element: <Settings />,
  }
]);

export default router;