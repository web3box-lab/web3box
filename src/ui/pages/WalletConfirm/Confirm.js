import React, { useState,useEffect } from "react";
import './Confirm.scss';
import { connect ,useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Select, message, Input,Modal } from 'antd';
import { setAccount,setSeed } from '../../store/action';



function ModalDiag(props) {
    const {setAddress,address} = props;
    const [isModalTransVisible, setIsModalTransVisible] = useState(true);

    const Navigate = useNavigate();

    const CreatWallet = (props) => {
       setIsModalTransVisible(false);
       Navigate('/CreatWallet')
    };

    const LoginWallet = (props) => {
        setIsModalTransVisible(false);
        Navigate('/LoginWallet')
    };

    const PrivateWallet = (props) => {
        setIsModalTransVisible(false);
        Navigate('/PrivateWallet')
    };


    const handleCancel = () => {
        setIsModalTransVisible(false);
    };

    
    return (
        <Modal wrapClassName='ModalDiag' title="Login Web3Box" width='600px' visible={isModalTransVisible} onCancel={handleCancel}>
              <Button  className="btn" onClick={CreatWallet} >Create wallet</Button>
              <Button  className="btn" onClick={LoginWallet} >Import from seed words</Button>
              <Button  className="btn" onClick={PrivateWallet} >Import from private key</Button>
              <span className="foot_span">Supported by IPFS & Filecoin Network</span>
        </Modal>
    )
}
const mapDispatchToProps= () =>{ 
    return {
        setAccount, setSeed 
    }
}
export default connect(mapDispatchToProps)(ModalDiag)
