import React, { useState,useEffect } from "react";
import './Dashboard.scss';
import { connect ,useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { mnemonicGenerate, seedWasmAddress,balance,translist,gasFree,sendSignTransfer,parseTime,tokenPrice } from "../../../filecoin/api.js";
import { setAccount,setSeed,setPrivateKey } from '../../store/action';
import dashboard_img from '../../images/dashboard.png';
import avatar_img from '../../images/avatar.png';
import icon_1_img from '../../images/icon_1.png';
import icon_2_img from '../../images/icon_2.png';
import icon_3_img from '../../images/icon_3.png';

import icon_btc_img from '../../images/icon_btc.png';
import icon_eth_img from '../../images/icon_eth.png';
import icon_fil_img from '../../images/icon_fil.png';

import btc_line from '../../images/btc_line.png';
import eth_line from '../../images/eth_line.png';
import fil_line from '../../images/fil_line.png';

import recent_trans_img from '../../images/recent_trans.png';
import btn_more_img from  '../../images/btn_more.png';
import market_head_img from  '../../images/market_head.png';


function Dashboard(props) {
    const { account , privateKey} = props;
    const Navigate = useNavigate();
    const [totalBalance, setTotalBalance] = useState(0);
    const [inputBalance, setInputBalance] = useState(0);
    const [outBalance, setOutBalance] = useState(0);

    const [totalPrice, setTotalPrice] = useState(0);
    const [inputPrice, setInputPrice] = useState(0);
    const [outprice, setOutprice] = useState(0);

    const [btc, setBtc] = useState(0);
    const [eth, setEth] = useState(0);
    const [fil, setFil] = useState(0);
    const [record, setRecord] = useState([])

    const moreNavigate = () => {
        console.log('click');
        Navigate('/WalletHome');
    }
   

    const getBalance = async()=>{
        balance(account).then(res => {
            setTotalBalance(res.result * 1 / 1000000000000000000);

            tokenPrice().then(r => {
               r.data.map( async(item)=>{
                    let value = ( item.priceUsd * 1 ).toFixed(2);
                    if(item.symbol == 'BTC'){
                        setBtc(value);
                    }
                    if(item.symbol == 'ETH'){
                        setEth(value);
                    }
                    if(item.symbol == 'FIL'){
                        setFil(value);
                    }
                    
               })
                
            })
        })
    }



    const getTransList = async() =>{

        translist(account,0,0).then(res => {
            var newData = [];
            let input = 0;
            let out = 0;
            res.transfers.map( async(item)=>{
                if(newData.length < 5){
                    newData.push({timestamp:item.timestamp,value:item.value});
                }
              
                if(item.value.slice(0,1) == '-'){
                    out += item.value / 1000000000000000000 *1;
                }else{
                    input += item.value / 1000000000000000000 *1;
                }

            })

            setRecord(newData)
            //sum input
            setInputBalance(input);
            //sum out
            setOutBalance(out);
        })
    }

    const token = () =>{
        setTotalPrice( (totalBalance * fil * 1).toFixed(2));
        setInputPrice(  (inputBalance * fil * 1).toFixed(2) );
        setOutprice(  (outBalance * fil * 1).toFixed(2))
    }
    
    useEffect( ()=>{
        if( typeof account == 'undefined' || account == ''){
            Navigate('/WalletConfirm');
        }

        getBalance();
        getTransList();
    },[])

    useEffect( ()=>{
        token();
    },[fil])

    return (
        <div className={account !== '' ? "dashboard": 'hide'} >
            <div className='top_'>
                <img src={dashboard_img} />
                <div>
                    <img src={avatar_img} />
                    <span>{typeof account != 'undefined' ?account.slice(0, 4):''} </span>
                    <span> *****</span>
                    <span>{typeof account != 'undefined' ?account.slice(account.length - 4, account.length):''}</span>
                </div>
            </div>

            <div className='fil_balance'>
                <div className="fil_balanc_bg">
                        <table>
                            <tr>
                                <td className="td_img"><img src={icon_1_img}></img> </td>
                                <td className="td_number">FIL Balance</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td className="td_img"></td>
                                <td className="td_number td_input_numer">{totalBalance.toFixed(8)}</td>
                                <td className="td_input_numer">$ {totalPrice}</td>
                            </tr>

                            <tr>
                                <td className="td_img"><img src={icon_2_img}></img> </td>
                                <td className="td_number">Total FIL Input</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td className="td_img"></td>
                                <td className="td_number td_input_numer">{inputBalance.toFixed(8)}</td>
                                <td className="td_input_numer">$ {inputPrice}</td>
                            </tr>

                            <tr>
                                <td className="td_img"><img src={icon_3_img}></img> </td>
                                <td className="td_number">Total FIL Output</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td className="td_img"></td>
                                <td className="td_number td_input_numer">{outBalance.toFixed(8)}</td>
                                <td className="td_input_numer">$ {outprice}</td>
                            </tr>
                        </table>
                </div>

                <div className="fil_recent_trans">

                        <div className='head'  onClick={moreNavigate} >
                            <img src={recent_trans_img} />
                            <img src={btn_more_img} className="btn_more"/>
                        </div>
                        <div>
                            <table>
                                <tr>
                                    <td className="time">Time</td>
                                    <td className="center">Amount</td>
                                </tr>

                                {
                                record.map((item,index)=>{
                                
                                return    <tr key={index}>
                                <td>{parseTime(item.timestamp * 1 - 28800)}</td>
                                <td className="center">{ (item.value * 1 / 1000000000000000000 ).toFixed(4)}</td>
                            </tr>
                           
                         })
                         }

                            </table>
                        </div>
                        
                </div>
            </div>


            <div className="mark">
                <div className='top_'>
                    <img src={market_head_img} />
                </div>

                <ul>
                    <li>
                        <table>
                            <tr>
                                <td> <img src={icon_btc_img}/> <span>Bitcoin</span></td>
                                <td className="right"> <span className="icon_btn">BTC</span></td>
                            </tr>

                            <tr>
                                <td colSpan="3"> 
                                <p>$ {btc} </p>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3" > <img  className="line" src="https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1.svg" /></td>
                            </tr>

                        </table>
                    </li>
                    <li>
                    <table>
                            <tr>
                                <td> <img src={icon_eth_img}/> <span>Ethereum</span></td>
                                <td className="right"><span className="icon_btn">ETH</span></td>
                            </tr>

                            <tr>
                                <td colSpan="3"> 
                                <p>$ {eth} </p>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3" > <img   className="line" src="https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1027.svg" /></td>
                            </tr>

                        </table>
                    </li>
                    <li>
                        <table>
                            <tr>
                                <td> <img src={icon_fil_img}/> <span>Filecoin</span></td>
                                <td className="right"> <span className="icon_btn">FIL</span></td>
                            </tr>

                            <tr>
                                <td colSpan="3"> 
                                <p>$ {fil} </p>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3"> <img src="https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/2280.svg"  className="line"/></td>
                            </tr>

                        </table>
                    </li>
                </ul>
            </div>
          

            <div className="coming">
                <ul>
                    <li className="coming_1"></li>
                    <li className="coming_2"></li>
                </ul>
            </div>

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
        account: state.account,
        privateKey:state.privateKey

    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)
