import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import CreateItem from './Forms/CreateItem'
import EditItem from './Forms/EditItem'

export default createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world</div>
  },
  {
    path: '/item/create',
    element: <CreateItem />
  },
  {
    path: '/item/:itemId',
    element: <EditItem />,
  },
])
