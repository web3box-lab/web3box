import {
  RiskIcon,
  WalletIcon,
  DashboardIcon,
} from '../../style/iconfont';
import { Button, Menu ,Modal} from 'antd';
import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './Menu.scss';
import logo from '../../images/web3box.png';
import logout_img from '../../images/logout.png';
import ipfs_img from '../../images/ipfs.png';
import { connect} from 'react-redux';
import { setAccount, setAddress, setPrivateKey} from '../../store/action';

const SiderMenu = (props) => {
  const {account ,dispatch }=props;
  // console.log(account)
  const items = [
    { label: 'Dashboard', key: '/Dashboard', icon: <DashboardIcon /> },
    { label: 'Wallet', key: '/Wallet', icon: <WalletIcon /> },
    { label: 'Risk', key: '/Risk', icon: <RiskIcon /> },
  ];
  const Navigate = useNavigate();
  const Location = useLocation();
  const [isModalVisibleLoading, setIsModalVisibleLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');

  const handleCancelLoading = () => {
    setIsModalVisibleLoading(false);
  };

  const logout = () =>{
    handleCancelLoading();
    dispatch(setAccount(''));
    dispatch(setPrivateKey(''));
    dispatch(setAddress(''));
    Navigate('/WalletConfirm');
  }

  const showLogout = () =>{
    setIsModalVisibleLoading(true)
  }

  const showLogin = () =>{
    console.log()
    Navigate('/Dashboard');
  }
  useEffect(() => {

    if(Location.pathname=='/'|| Location.pathname=='/Wallet'||Location.pathname=='/WalletHome'){
      setActiveMenu('/Wallet')
    }
    if(Location.pathname=='/Dashboard'){
      setActiveMenu('/Dashboard')
    }
    if(Location.pathname=='/Risk'){
      setActiveMenu('/Risk')
    }
   
    return () => {
    }
  }, [Location.pathname])
  const MenuRouter = (routers) => {
    if(account){
      if(routers.key=='/Wallet'){
        Navigate('/WalletHome')
      }else{
        Navigate(routers.key)
      }
    }else{
      Navigate(routers.key)
    }

 
  };

  return (
    <div
      style={{
        width: '300px',
        background: '#FFFFFF',
        height:'140vh'
        
      }}
    >
      <p className='Logo'><img src={logo}></img></p>
      <Menu className='menu' selectedKeys={[activeMenu]} onClick={MenuRouter} mode="inline" items={items} />
      <div className='line'></div>

      <div className='ipfs'>
                <img className='avatar' src={ipfs_img}></img>
                <span>IPFS</span>
      </div>
      <div className='setting'>
                <img className='avatar' src={logout_img}></img>
                <span className={ (typeof account == 'undefined' || account == '' ) ? 'hide':'' }  onClick={showLogout}>LogOut</span>
                <span className={ (typeof account != 'undefined' && account == '' ) ? '':'hide' }  onClick={showLogin}>Login</span>
      </div>



      <Modal wrapClassName='ModalDiag' title="Confirm" width='600px' visible={isModalVisibleLoading} onCancel={handleCancelLoading}>
            <h5>Are you sure logOut ?</h5>
            <div className='modal_footer'>
                <Button onClick={handleCancelLoading} className='Cancel'>Cancel</Button>
                <Button onClick={logout} className='Confirm'>Confirm</Button>
            </div>
            </Modal>

    </div>
  );
};
const mapStateToProps=(state)=>{
  return {account:state.account}
}
export default connect(mapStateToProps)(SiderMenu);