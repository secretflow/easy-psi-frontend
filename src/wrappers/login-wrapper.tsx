import { Outlet } from 'umi';

const LoginAuth = () => {
  localStorage.removeItem('User-Token');
  return <Outlet />;
};

export default LoginAuth;
