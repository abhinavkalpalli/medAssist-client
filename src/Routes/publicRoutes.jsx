import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';


const PublicRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
//   const isAdminAuthenticated = useSelector((state) => state.admin.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to='/' />
  }
//    else if (isAdminAuthenticated) {
//     return <Navigate to='/admin/dashboard' />
//   }

  return <Outlet />
}

export default PublicRoutes