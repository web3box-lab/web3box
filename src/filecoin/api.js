// /* eslint-disable no-unused-vars */
// import signer_wasm from '@zondax/filecoin-signing-tools';
import BN from 'bn.js';
import * as bip39 from 'bip39';
import * as bip32Default from 'bip32'
// import * as ecc from 'tiny-secp256k1'
// import * as ecc from 'noble-secp256k1';
// import * as ecc from '@noble/secp256k1';
import * as filecoin from "@nodefactory/filecoin-address";
import * as cbor from '@ipld/dag-cbor'
import secp256k1 from 'secp256k1';
import ExtendedKey from './extendedkey.js';
import { Buffer } from 'buffer';
import axios from 'axios';
import toUint8Array from 'base64-to-uint8array'


import { getDigest, getCoinTypeFromPath, addressAsBytes, bytesToAddress, tryToPrivateKeyBuffer,getPayloadSECP256K1, getChecksum } from './utils.js';
import { ProtocolIndicator } from './constants.js';

// import { Transform } from 'stream';
// @ts-ignore
window.Buffer = Buffer;
// window.Transform = Transform;

// let bip32;
// (async () => {
//   await import('tiny-secp256k1').then(ecc => {
//     bip32 = bip32Default.BIP32Factory(ecc);
//   })
// })();

// const ecc = require('tiny-secp256k1');
// const bip32 = bip32Default.BIP32Factory(ecc)
// proxy 
const rpc = "https://filfox.info/rpc/v0";
const api = "https://filfox.info/api/v1";


// Randomly generated mnemonic
export function mnemonicGenerate(){
    var mnemonic = bip39.generateMnemonic()
    return mnemonic;
}

export async function seedWasmAddress(mnemonic,password){
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const keys = filecoin.keyPairFromSeed(seed, "f");
  const address = keys.address;
  const private_hexstring = keys.privateKey;
  console.log(private_hexstring);
   return {
      address,
      private_hexstring
   };
}

export async function seedWasmAddressByPrivatekey(privatekey,password){
  const keys = filecoin.keyPairFromPrivateKey(privatekey, "f");
  const address = keys.address;
  const private_hexstring = keys.privateKey;
  console.log(private_hexstring);
   return {
      address,
      private_hexstring
   };
}



export async function balance(address){
  let d = {};
  d.id = 1
  d.jsonrpc = "2.0";
  d.method = "Filecoin.WalletBalance";
  d.params = [];
  d.params[0] = address;
  let r =  await axios.post(rpc,
      d, 
      {
      headers:{
          'Content-Type':'application/json',
          'authority': 'filfox.info'
      }
  })
  return r.data;
}

export async function gasFree(from,to,balance){
  let d = {};
  d.id = 1
  d.jsonrpc = "2.0";
  d.method = "Filecoin.GasEstimateMessageGas";
  d.params = [
    {
      "Version": 0,
      "To": from,
      "From": to,
      "Nonce": 0,
      "Value": balance * 1000000000000000000 + '',
      "GasLimit": 0,
      "GasFeeCap": "0",
      "GasPremium": "0",
      "Method": 0,
      "Params": ""
    },
    {
      "MaxFee": "1000000000000000"
    },
    []
  ];
  ;
  let r =  await axios.post(rpc,
      d, 
      {
      headers:{
          'Content-Type':'application/json',
          'authority': 'filfox.info'
      }
  })
  return r.data;
}

//
export async function tokenPrice(){
  let r =  await axios.get('https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,filecoin',
      {}, 
      {
      headers:{
          'Content-Type':'application/json',
      }
  })
  return r.data;
}
//"PYBpU/OBiiSgDstxxxVr6L85MYz1ILvHZuC2q+7yfjxwuIA+iAmquKOaXw6DxOfbeHGqOzlTm0gcNudc+w49bwE="
export async function sendSignTransfer(from,to,balance,privateKey){
  const value =  balance * 1000000000000000000 +'';
  const nonce = await GetNonce(from);
  // let message =  {
  //   "Version": 0,
  //   "To":from,
  //   "From": to,
  //   "Nonce": nonce * 1,
  //   "Value": value,
  //   "GasLimit": 603460,
  //   "GasFeeCap": '1364744801',
  //   "GasPremium": '34158613',
  //   "Method": 0,
  //   "Params": ""
  // };

  let message =  {
    "Version": 0,
    "To": to,
    "From": from,
    "Nonce": parseInt(nonce) ,
    "Value": value.toString(),
    "GasLimit": 603460,
    "GasFeeCap": "933777773",
    "GasPremium": "939251",
    "Method": 0,
    "Params": ""
  }

  const basekey = Buffer.from(privateKey, 'hex').toString('base64');
  const signedMessage = transactionSignRaw(message,toUint8Array(basekey)).toString('base64');
  // const signedMessage = transactionSignRaw(privateKey.toString('base64')).toString('base64');
  let d = {};
  d.id = 1
  d.jsonrpc = "2.0";
  d.method = "Filecoin.MpoolPush";
  d.params = [
      {
        "Message": message,
        "Signature": {
          "Type": 1,
          "Data": signedMessage
        }
      }
  ];
  console.log(JSON.stringify(d))
  let r =  await axios.post(rpc,
      d, 
      {
      headers:{
          'Content-Type':'application/json',
          'authority': 'filfox.info'
      }
  })
  return r.data;
}

export async function translist(address,limit,page){
  if(address == ''){
    return;
  }
  let url = api + "/address/" + address + "/message-transfers";
  if(limit !== 0){
    url = url + ( url.slice(url.length - 1, url.length) == '?' ?  "?" : '') + "?pageSize=" + limit;
  }
  if(page !== 0){
    url = url +  ( url.slice(url.length - 1, url.length) == '?' ?  "&" : '') + "?page=" + page;
  }
  let r =  await axios.get(url,
      {}, 
      {
      headers:{
          'Content-Type':'application/json',
          'authority': 'filfox.info'
      }
  })
  return r.data;
}

// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}



async function GetNonce(address){
  let d = {};
  d.id = 1
  d.jsonrpc = "2.0";
  d.method = "Filecoin.MpoolGetNonce";
  d.params = [];
  d.params[0] = address;
  let r =  await axios.post(rpc,
      d, 
      {
      headers:{
          'Content-Type':'application/json',
          'authority': 'filfox.info'
      }
  })
  return r.data.result;
}


function transactionSign(unsignedMessage, privateKey) {
  if (typeof unsignedMessage !== 'object') {
    throw new Error("'message' need to be an object. Cannot be under CBOR format.")
  }
  const signature = transactionSignRaw(unsignedMessage,privateKey.toString('base64'))

  const signedMessage = {
    Data: signature.toString('base64'),
    Type: ProtocolIndicator.SECP256K1,
  }

  return signedMessage
}

function transactionSignRaw(unsignedMessage, privateKey) {
  if (typeof unsignedMessage === 'object') {
    unsignedMessage = transactionSerializeRaw(unsignedMessage)
  }
  if (typeof unsignedMessage === 'string') {
    unsignedMessage = Buffer.from(unsignedMessage, 'hex')
  }

  console.log(unsignedMessage);
  console.log(privateKey)
  // verify format and convert to buffer if needed
  // privateKey = tryToPrivateKeyBuffer( privateKey);

  const messageDigest = getDigest(unsignedMessage)
  const signature = secp256k1.ecdsaSign(messageDigest, privateKey)

  return Buffer.concat([Buffer.from(signature.signature), Buffer.from([signature.recid])])
}

function transactionSerializeRaw(message) {
  if (!('To' in message) || typeof message['To'] !== 'string') {
    throw new Error("'To' is a required field and has to be a 'string'")
  }
  if (!('From' in message) || typeof message['From'] !== 'string') {
    throw new Error("'From' is a required field and has to be a 'string'")
  }
  if (!('Nonce' in message) || typeof message['Nonce'] !== 'number') {
    throw new Error("'Nonce' is a required field and has to be a 'number'")
  }
  if (!('Value' in message) || typeof message['Value'] !== 'string' || message['Value'] === '' || message['Value'].includes('-')) {
    throw new Error("'Value' is a required field and has to be a 'string' but not empty or negative")
  }
  if (!('GasFeeCap' in message) || typeof message['GasFeeCap'] !== 'string') {
    throw new Error("'GasFeeCap' is a required field and has to be a 'string'")
  }
  if (!('GasPremium' in message) || typeof message['GasPremium'] !== 'string') {
    throw new Error("'GasPremium' is a required field and has to be a 'string'")
  }
  if (!('GasLimit' in message) || typeof message['GasLimit'] !== 'number') {
    throw new Error("'GasLimit' is a required field and has to be a 'number'")
  }
  if (!('Method' in message) || typeof message['Method'] !== 'number') {
    throw new Error("'Method' is a required field and has to be a 'number'")
  }
  if (!('Params' in message) || typeof message['Params'] !== 'string') {
    throw new Error("'Params' is a required field and has to be a 'string'")
  }

  const to = addressAsBytes(message['To'])
  const from = addressAsBytes(message['From'])

  const value = serializeBigNum(message['Value'])
  const gasfeecap = serializeBigNum(message['GasFeeCap'])
  const gaspremium = serializeBigNum(message['GasPremium'])

  const message_to_encode = [
    0,
    to,
    from,
    message['Nonce'],
    value,
    message['GasLimit'],
    gasfeecap,
    gaspremium,
    message['Method'],
    Buffer.from(message['Params'], 'base64'),
  ]

  return cbor.encode(message_to_encode);
}


function serializeBigNum(gasprice) {
  if (gasprice == '0') {
    return Buffer.from('')
  }
  const gaspriceBigInt = new BN(gasprice, 10)
  const gaspriceBuffer = gaspriceBigInt.toArrayLike(Buffer, 'be', gaspriceBigInt.byteLength())
  return Buffer.concat([Buffer.from('00', 'hex'), gaspriceBuffer])
}
