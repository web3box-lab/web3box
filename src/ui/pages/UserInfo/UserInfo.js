import React, { useState,useEffect } from "react";
import './UserInfo.scss';
import { connect, useDispatch, useSelector } from 'react-redux';
import { setAccount, setPrivateKey} from '../../store/action';
import { mnemonicGenerate, seedWasmAddress,balance,translist,gasFree,sendSignTransfer } from "../../../filecoin/api.js";
import { decrypt } from "../../../filecoin/cryptoutils.js";
import { useNavigate } from 'react-router-dom';
import Loding from '../../images/loding.png';
import Success from '../../images/success.png';
import Error from '../../images/error.png';
import QRCode from 'qrcode.react';
import tx from '../../images/tx.png';
import File from '../../images/file.png';
import { Button, Select, message, Input,Modal } from 'antd';

const { Option } = Select;
// 

const UserInfo = (props) => {
    // console.log(knownSubstrate)
    const { account,privateKey} = props;
    const Navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalTransVisible, setIsModalTransVisible] = useState(false);
    const [isModalVisibleLoading, setIsModalVisibleLoading] = useState(false);
    const [isModalPasswordVisible, setIsModalPasswordVisible] = useState(false);
    const [selectTab, setSelectTab] = useState('2');
    const [receiveAddress, setReceiveAddress] = useState('');
    const [tokenAccount, setTokenAccount] = useState('');
    const [gasfees, setGasfees] = useState('');
    const [isLoding, setIsLoding] = useState('3');
    const [balances, setBalances] = useState(0);
    const [passwords, setPasswords] = useState('');
    const [exportPasswords, setExportPasswords] = useState('');
    const handleCancelLoading = () => {
        setIsModalVisibleLoading(false);
      };
    const clearinput = () =>{
        setReceiveAddress('');
        setTokenAccount('');
        setPasswords('');
        setGasfees('');
    }
    const showModalRecive = () => {
        setIsModalOpen(true);
        setSelectTab(1);
        clearinput();

    };
      const showModalSend = () => {
        setIsModalOpen(true);
        setSelectTab(2);
        clearinput();
      };
    
      const handleOk = () => {

        if(tokenAccount <= 0.01){
            message.error('Minimum account amount must be greater than 0.01' );
            return;
        }
      
        if(passwords==''){
            message.error('Wrong Password.');
            return;
        }
        if(tokenAccount==''){
            message.error('Amount not entered.');
            return;
        }
        if(receiveAddress==''){
            message.error('The Address is not entered.');
            return;
        }
        
        try{
            const p = decrypt(privateKey,passwords);
            if(p == ''){
                message.error('Wrong Password. Please check your input.');
                return;
            }
        }catch(error){
            message.error('Wrong Password. Please check your input.');
            return;
        }

        try{
            gasFree(account,receiveAddress.trim(),tokenAccount).then(r =>{
                console.log(r.result);
                setGasfees( (r.result.GasLimit * 1 * r.result.GasFeeCap * 1 ) / 1000000000000000000);
            })
        }catch(error){

        }finally{
            setIsModalOpen(false);
            setIsModalTransVisible(true);
        }
      };

      const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalTransVisible(false);
        setIsModalPasswordVisible(false);
        handleCancelLoading();

        clearinput();
        
      };
    
    const tab_recive = () => {
        setSelectTab(1);
    }
    const tab_send = () => {
        setSelectTab(2);
    }
    
    const copyAddress = () => {
            let copyContent = account;
            var input = document.createElement("input");
            input.value = copyContent;
            document.body.appendChild(input);
            input.select();
            document.execCommand("Copy");
            document.body.removeChild(input);
            message.success('Successfully copied Address.');
    };
    
    const SendToken= async()=>{
        setIsModalTransVisible(false);
        setIsModalVisibleLoading(true);
        setIsLoding(0);
        try{
            //send
            sendSignTransfer(account,receiveAddress.trim(),tokenAccount,decrypt(privateKey,passwords)).then(res => {
                setIsLoding(1);
                getBalance(account);

                //ws ipfs

            })
        }catch(error){
            console.log(error);
            setIsLoding(2);
        }finally{
            clearinput();
        }
       
    }
    const showExportodel = () =>{
        setIsModalPasswordVisible(true);
    }

    const exportConfirm=async()=>{
        let pkey = '';
        if(exportPasswords == ''){
            message.error('Wrong Password.');
            return;
        }
       
        try{
            pkey = decrypt(privateKey,exportPasswords);
            if(pkey == ''){
                message.error('Wrong Password. Please check your input.');
                return;
            }
        }catch(error){
            message.error('Wrong Password. Please check your input.');
            return;
        }


        let r = {};
        r.address = account;
        r.privateKey = pkey;
        funDownload(JSON.stringify(r), `${account}.json`);
        setIsModalPasswordVisible(false);
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

    const getBalance = async()=>{
        balance(account).then(res => {
            setBalances(res.result * 1 / 1000000000000000000)
        })
    }
    
    useEffect(()=>{
        if( typeof account == 'undefined'  || account == ''){
            Navigate('/WalletConfirm');
        }
        getBalance(account);

    },[account])

    const receiveChange=(e)=>{
        setReceiveAddress(e.target.value);
    }
    const accountChange=(e)=>{
        setTokenAccount(e.target.value);
    }
    
    const passwordChange=(e)=>{
        setPasswords(e.target.value)
    }
    const exportPasswordChange=(e)=>{
        setExportPasswords(e.target.value)
    }
    const clickMax = () =>{
        setTokenAccount(balances > 0 ? balances * 1 - 0.01:0);
    }

    return (
        <div className={account !== '' ? "UserInfo": 'hide'}  >
            <div className='user_wallet'>
                <img className='avatar' src={tx}></img>

                <div className='address_ehem'>
                    <p>FIL Balance: <span>{balances}</span></p>
                    <p>Address：
                    <span>{typeof account != 'undefined'?account.slice(0, 4):''} </span>
                    <span> *****</span>
                    <span>{typeof account != 'undefined'?account.slice(account.length - 4, account.length):''}</span>
                    <img onClick={copyAddress} src={File}></img></p>
                </div>

                <div className='not'>
                    <Button className='send' onClick={showModalSend}>Send</Button>
                    <Button className='receive' onClick={showModalRecive}>Receive</Button>
                    <Button className='export' onClick={showExportodel}>Export</Button>
                </div>
            </div>

            <Modal wrapClassName='ModalSendAndReceive' width='600px'  open={isModalOpen} >
                
                <div className='head'>
                    <span className="point"></span>
                    <div className="btn_div">
                        <span className={selectTab == '1' ? 'active' : 'btn'} onClick={tab_recive}>Receive</span>
                        <span className={selectTab == '2' ? 'active' : 'btn'} onClick={tab_send}>Send</span>
                    </div>
                </div>
                <div className="line"></div>

                <div  className={selectTab == '2' ? 'show' : 'hide'} >
                                <div className='_address'>
                                <Input placeholder="Enter Address" value={receiveAddress} onChange={receiveChange} className='_address_input'></Input>
                                </div>
                                <div className='_Amount'>
                                <Input placeholder="Enter Amount" value={tokenAccount}   onChange={accountChange} ></Input>
                                <Button onClick={clickMax} >MAX</Button>
                                </div>
                            
                                <div className='_address'>
                                <Input type='password' value={passwords}  onChange={passwordChange}   placeholder="Enter Password" className='_address_input'></Input>
                                </div>
                                <p className='balance'> Balance: {balances}</p>
                </div>

                <div  className={selectTab == '1' ? 'show' : 'hide'} >
                        <div className="QR_CODE">
                                 <QRCode value={account} size={170}></QRCode>
                                    </div>
                                    <p> Your Address </p>
                                    <span className='address_'>{account}</span>
                        </div>
                            
                <div className="modal_footer"  >
                    <Button  className="Cancel" onClick={handleCancel} >Cancel</Button>
                    <Button  className={selectTab == '2' ? 'Confirm' : 'hide'} onClick={handleOk} >Send</Button>
                </div>
            </Modal>


            <Modal wrapClassName='ModalDiag' title="Transaction Confirm" width='600px' visible={isModalTransVisible} onCancel={handleCancel}>
            <p><span>Send：</span> <a>{typeof account != 'undefined' ? account.slice(0, 4) :''}****{typeof account != 'undefined' ? account.slice(account.length - 4, account.length):''}</a></p>
            <p><span>Receive：</span> <a>{receiveAddress}</a></p>
            <p><span>Total amount：</span> <a>{tokenAccount}</a></p>
            <p><span>Transaction  Fee：</span> <a>{gasfees}</a></p>
            <div className='modal_footer'>
                <Button onClick={handleCancel} className='Cancel'>Cancel</Button>
                <Button onClick={SendToken} className='Confirm'>Confirm</Button>
            </div>
            </Modal>

            <Modal wrapClassName='ModalDiag' title="Input Password" width='600px' visible={isModalPasswordVisible} onCancel={handleCancel}>
            <Input type='password'  onChange={exportPasswordChange}   placeholder="Enter Password" className='_address_input'></Input>
            <div className='modal_footer'>
                <Button onClick={exportConfirm} className='Confirm'>Confirm</Button>
            </div>
            </Modal>


            <Modal wrapClassName='ModalDiag' title="Transaction Confirmation" width='600px' visible={isModalVisibleLoading} onCancel={handleCancelLoading}>
                    <div className={isLoding==0?'loding madelHide':'loding '}>
                    <img src={Loding}></img>
                    </div>
                    <div className={isLoding==1?'success madelHide':'success '}>
                    <img src={Success}></img>
                    </div>
                    <div className={isLoding==2?'success madelHide':'success '}>
                    <img src={Error}></img>
                    <p> Please try again.</p>
                    </div>

            </Modal>
        </div>

        

    )
}
const mapDispatchToProps = (dispatch) => { 
   return {
    setAccount:(account) => dispatch(setAccount(account)),
    setPrivateKey:(privateKey) => dispatch(setPrivateKey(privateKey)),
    }
}
const mapStateToProps = (state) => {
    return { 
        account: state.account ,
        privateKey:state.privateKey,
    }
}  
export default  connect(mapStateToProps,mapDispatchToProps)(UserInfo)
