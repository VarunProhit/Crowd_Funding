import { useState, useEffect } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,

  }); 

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reload, shouldReload] = useState(false);

  const reloadEffect = () => shouldReload(!reload);
  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => setAccount(accounts[0]));
  };  
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("funder", provider);
      if (provider) {
        setAccountListener(provider);
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
         contract,
        });
      } 
      else {
        console.error("Please install MetaMask!");
      }
    }

    //   let provider=null
    //   if (window.ethereum) {
    //     provider = window.ethereum;
    //     try {
    //       await provider.request({ method: "eth_requestAccounts" });
    //     } catch {
    //       console.error("User is not allowed");
    //     }
    //   } else if (window.web3) {
    //     provider = window.web3.currentProvider;
    //   } else if (!process.env.production) {
    //     provider = new Web3.providers.HttpProvider("http://localhost:7545");
    //   }
    //     setWeb3Api({
    //       web3: new Web3(provider),
    //       provider
    //     });
    //     //console.log(provider)
    // };
   
    loadProvider();
   }, []);

  useEffect(() => {
    const loadBalance = async () => {
       const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
 }, [web3Api,reload]); 

  const transferFund = async () => {
    const { web3, contract } = web3Api;
    await contract.transfer({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    reloadEffect();
  };

  const withdrawFund = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmout = web3.utils.toWei("1", "ether");
    await contract.withdraw(withdrawAmout, {
      from: account,
    });
    reloadEffect();
  };  

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

   console.log(web3Api.web3);
  return (
    <>
      <div className="card text-center">
        <div className="card-header">Funding</div>
        <div className="card-body">
          <h5 className="card-title">Balance: {balance} ETH </h5>
          <p className="card-text">
            Account : {account ? account : "not connected"}
          </p> 
          {/* <button type="button" className="btn btn-success"
            onClick={async () => {
              const accounts = await window.ethereum.request({ method: "eth_requestAccounts"});
              console.log(accounts);
            }}>
            Connect to metamask
          </button> */}
          &nbsp;
          <button type="button" className="btn btn-success " onClick={transferFund}>
          {/* <button type="button" className="btn btn-success " > */}
            Transfer
          </button>
          &nbsp;
          <button type="button" className="btn btn-primary " onClick={withdrawFund}>
          {/* <button type="button" className="btn btn-primary "> */}
            Withdraw
          </button>
        </div>
        <div className="card-footer text-muted">Varun Prohit</div>
      </div>
    </>
  );
}

export default App;
//npm install --save react-scripts@4.0.3