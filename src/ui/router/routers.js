import Index from "../pages/Dashboard/Dashboard";
import WalletConfirm from "../pages/WalletConfirm/Confirm";
import CreatWallte from '../pages/CreatWallte/CreatWallte';
import LoginWallet from '../pages/LoginWallet/LoginWallet';
import WalletHome from '../pages/WalletHome/WalletHome';
import PrivateWallet from '../pages/PrivateWallet/PrivateWallet';
import Risk from '../pages/Risk/Risk';

//The routing configuration
const routes =  [
    {
        path:'/', 
        component: Index,
        exact: true,
        },

    {
    path:'/Wallet',
    component: WalletHome,
    exact: true,    

    },
    {
        path:'/WalletConfirm',
        component: WalletConfirm,
        exact: true,    
    
        },
    {
        path:'/Dashboard',
        component: Index,
        exact: true,    
    
        },
    {
        lable:'CreatWallte',
        path: "/CreatWallet",
        component: CreatWallte,
        exact: true,
        key:'CreatWallte',
    },
    {
        path: "/LoginWallet",
        component: LoginWallet,
        exact: true,
        key:'LoginWallet',
    },
    {
        path: "/PrivateWallet",
        component: PrivateWallet,
        exact: true,
        key:'PrivateWallet',
    },
    {
        path: "/WalletHome",
        component: WalletHome,
        exact: true,
        key:'WalletHome',
    }, {
        path: "/Risk",
        component: Risk,
        exact: true,
        key:'Risk',
    },
]
export default routes;