import { useEffect, useState ,useLayoutEffect} from 'react';
import Cookies from 'js-cookie';
import { Routes, Route } from 'react-router-dom';
import BrandRoutes from '../Layout/Brand/BrandRoutes';
import InfluencerRoutes from '../Layout/Influencer/InfluencerRoutes';
import UserRoutes from '../Layout/User/UserRoutes';
import Login2 from '../Layout/Login/Login2';
import RootSignUp from '../Layout/SignUp/RootSignUp';
import BrandSignUp from '../Layout/SignUp/BrandSignUp';
import InfluencerSignUp from '../Layout/SignUp/InfluencerSignUp';
import UserSignUp from '../Layout/SignUp/UserSignUp';

function Authentication() {
  const [component, setComponent] = useState(null);

  useLayoutEffect(() => {
    const cookie = Cookies.get('yourCookieName'); // Replace 'yourCookieName' with your actual cookie name

    if (cookie) {
      if (cookie.includes('b')) {
        setComponent(<BrandRoutes />);
      } else if (cookie.includes('i')) {
        setComponent(<InfluencerRoutes />);
      } else if (cookie.includes('u')) {
        setComponent(<UserRoutes />);
      } 
    } 
  }, []);
  console.log("Authentication is Called");

  return (
    component || ( <>
    <div>
      Front Page is Under-Construction .Please proceed to <a  className='Button poppins-regular rounded-md  py-[5px] md:py-[6px] text-[12px] px-5 cursor-pointer' href="/Login">Login</a>
    </div>
    </>)
    // component || (
    //   <Routes>
        
    //     <Route path="/" element={<Login2 />} />
        
    //     {/* Nested routes under /SignUp */}
    //     <Route path="/SignUp/*" element={<RootSignUp />}>
    //       <Route index element={<RootSignUp />} />
    //       <Route path="Brand" element={<BrandSignUp />} />
    //       <Route path="Influencer" element={<InfluencerSignUp />} />
    //       <Route path="User" element={<UserSignUp />} />
    //     </Route>

       
    //   </Routes>
    // )
  );
}

const Frontpage = () => {
  return (
    <>
    To be made :Rizwan Sabir
    </>
  )
}

export default Authentication;