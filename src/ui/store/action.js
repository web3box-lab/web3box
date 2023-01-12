
export const SET_ACCOUNT = 'set_Account'
export const SET_ADDRESS='set_Address'
export const SET_SEED='set_Seed'
export const SET_PRIVATE='set_Private'
export const SET_USERIMG='set_Userimg'
export const SET_ETHADDRESS='set_ethAddress'

export function setAddress(address) {
    return {
        type: SET_ADDRESS,
        address: address
    }
}
export function setUserimg(url) {
    return {
        type: SET_USERIMG,
        url: url
    }
}

export function setethAddress(ethAddress) {
    return {
        type: SET_ETHADDRESS,
        ethAddress: ethAddress
    }
}

export function setAccount(account) {
    return {
        type: SET_ACCOUNT,
        account: account
    }
}
//  get name
export function setSeed(seed) {
    return {
        type: SET_SEED,
        seed: seed
    }
}
export function setPrivateKey(privateKey) {
    return {
        type: SET_PRIVATE,
        privateKey: privateKey
    }
}