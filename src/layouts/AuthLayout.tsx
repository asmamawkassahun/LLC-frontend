import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="overflow-x-hidden">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

