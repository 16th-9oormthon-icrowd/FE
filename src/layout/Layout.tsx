import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className='px-5'>
      <Outlet />
    </div>
  );
};

export default Layout;
