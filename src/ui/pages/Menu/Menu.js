import {
  RiskIcon,
  WalletIcon,
  DashboardIcon,
} from '../../style/iconfont';
import { Button, Menu ,Modal} from 'antd';
import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './Menu.scss';
import {  Spin  } from 'antd';
import logo from '../../images/web3box.png';
import logout_img from '../../images/logout.png';
import ipfs_img from '../../images/ipfs.png';
import Loding from '../../images/loding.png';
import { connect} from 'react-redux';
import { setAccount, setAddress, setPrivateKey} from '../../store/action';
import axios from 'axios';
import { PinataApiKey,PinataSecretApiKe } from '../../../filecoin/constants.js';


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
  const [isModalDownloadLoading, setIsModalDownloadLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');

  const handleCancelLoading = () => {
    setIsModalVisibleLoading(false);
    setIsModalDownloadLoading(false);
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

  const downIPFS = async() =>{
    setIsModalDownloadLoading(true);
    var config = {
      method: 'get',
      url: 'https://api.pinata.cloud/data/pinList?includesCount=false&metadata[keyvalues][from]={"value":"'+account+'","op":"eq"}',
      headers: { 
        'pinata_api_key': PinataApiKey,
        'pinata_secret_api_key':PinataSecretApiKe,
      }
    };
    const res = await axios(config);
    setIsModalDownloadLoading(false);
    funDownload(JSON.stringify(res.data), `${account}.json`);
    // console.log(JSON.stringify(res.data));
  }

  const funDownload = (content, filename) => {
    var eleLink = document.createElement("a");
    eleLink.download = filename;
    eleLink.style.display = "none";
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
};

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
        height:'180vh'
        
      }}
    >
      <p className='Logo'><img src={logo}></img></p>
      <Menu className='menu' selectedKeys={[activeMenu]} onClick={MenuRouter} mode="inline" items={items} />
      <div className='line'></div>

      <div className='ipfs' onClick={downIPFS} >
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


            <Modal wrapClassName='ModalDiag' title="Download Transaction from ipfs" visible={isModalDownloadLoading} onCancel={handleCancelLoading}>
                    <div className='downloding'>
                        <Spin/>
                    </div>
            </Modal>

    </div>
  );
};
const mapStateToProps=(state)=>{
  return {account:state.account}
}
export default connect(mapStateToProps)(SiderMenu);