import React, { useEffect, useState } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import Interaction from "./pages/Interaction";

import "./App.css";

const App = () => {

  const [state, setState] = useState({ storageValue: 0, web3: null, accounts: null, contract: null });
  // const [web3, setWeb3] = useState({})


  const initContract = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // setState({ ...state, web3: web });
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // setState({ ...state, accounts: accounts });
      // Get the contract instance.

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setState({ ...state, contract: instance, web3, accounts: accounts });
      const response = await instance.methods.get().call();

      // Update state with the result.
      setState({ ...state, storageValue: response, contract: instance, web3, accounts: accounts });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };



  useEffect(() => {
    initContract();
    console.log(state)
  });

  // const runExample = async () => {
  //   const { accounts, contract } = state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });
  //   // await contract.methods.set(5).send({ from: "0x45Cb151f59d0BF30cD22eE081293e58F88b1fd48" });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   setState({ ...state, storageValue: response });
  // };


  if (!state.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <>
      <div className="App">
        <h1>Good to Go!!!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {state.storageValue}</div>


      </div>
      <Interaction web0={state.web3} />
    </>
  );
}


export default App;
