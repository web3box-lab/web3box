import React, { useState, useEffect } from "react";
import './WalletHome.scss';
//react-redux
import { connect, useDispatch, useSelector } from 'react-redux';
import { setAccount, setSeed,setAddress,setethAddress,setUserimg } from '../../store/action';
import { mnemonicGenerate, seedWasmAddress,balance,translist,parseTime } from "../../../filecoin/api.js";
import { useNavigate } from 'react-router-dom';
import UserInfo from '../UserInfo/UserInfo'

import statu_pending from '../../images/pending.png';
import statu_success from '../../images/success_status.png';
import { Button, Spin ,message,Pagination} from 'antd';
import axios  from 'axios';

const WalletHome = (props) => {
    const { account, records } = props;
    const [tabType, setTabType] = useState(true);
    const [lodingL, setLodingL] = useState(false);
    const [record, setRecord] = useState([])
    const Navigate = useNavigate();
    const RecordBtn = () => {
        Navigate('/sendRecord')
    }
   
    const getTransList = async() =>{
        translist(account,0,0).then(res => {
            setRecord(res.transfers)
        })
    }

    const copyHash=(hash)=>{
        let copyContent = hash;
        var input = document.createElement("input");
        input.value = copyContent;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        document.body.removeChild(input);
        message.success('Copy success message');
    }

    const copyhashfilter =(hash) =>{
       return hash.slice(0,4) + "*****" + hash.slice(hash.length - 4, hash.length);
    }
    useEffect(() => {
        getTransList(account);
    }, [account])
    return (
        <div className={account !== '' ? "WalletHome": 'hide'}>
            <UserInfo></UserInfo>
            <div className='LoginWallet_c'>
                <div className={tabType ? 'active' : 'key'}>
                    <ul className='Assets_record'>
                    <div className={lodingL?'Spin_modal':'key'}>
                    <Spin></Spin>
                    </div>
                    <li className='title'>
                            <p>Transaction Hash</p >
                            <p>Time (UTC+0)</p >
                            <p>Amount</p >
                            <p>Method</p >
                            <p>Statement</p >
                        </li>
                                                        {/* <img src={statu_pending} ></img> */}
                                                        {
                        record.map((item,index)=>{
                        
                        return  <li key={index}>
                        <p onClick={()=>copyHash(item.message)}>{ copyhashfilter (item.message)}</p> 
                        <p>{parseTime(item.timestamp * 1 - 28800)}</p> 
                        <p>{(item.value * 1 / 1000000000000000000).toFixed(4) }</p> 
                        <p className={item.value.slice(0,1) == '-' ? '':'hide'}>Send</p> 
                        <p className={item.value.slice(0,1) != '-' ? '':'hide'}>Recive</p> 
                        <p ><img src={statu_success} ></img></p> 
                     </li>
                        })
                    }
                    </ul>
                </div>
                

            </div>

        </div>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        setAccount:(account) => dispatch(setAccount(account)),
        setSeed:(data) => dispatch(setSeed(data)),
    }
}
const mapStateToProps = (state) => {
    return {
        account: state.account,
        records: state.records,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(WalletHome)