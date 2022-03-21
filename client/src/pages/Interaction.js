import React, { useState, useEffect } from 'react';
import StakingRewardsContract from "../contracts/StakingRewards.json";
// import getWeb3 from "../getWeb3";

function Interaction({ web0 }) {

    const [contractConnect, setContractConnect] = useState({ web3: web0, accounts: null, contract: null });
    const [tokenStake, setTokenStake] = useState();
    const [balance, setBalance] = useState(0);
    const [balanceAddr, setBalanceAddr] = useState("");
    const [stakedTokens, setStakedTokens] = useState(0);
    const [transferAddr, setTransferAddr] = useState("");
    const [tokenTransfer, setTokenTransfer] = useState(0);




    const getContracts = async () => {
        try {
            // Get network provider and web3 instance.

            // const web3 = await getWeb3();
            // console.log("here");
            // Use web3 to get the user's accounts.
            const accounts = await contractConnect.web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await contractConnect.web3.eth.net.getId();
            const deployedNetwork = StakingRewardsContract.networks[networkId];
            const instance = new contractConnect.web3.eth.Contract(
                StakingRewardsContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            setContractConnect({ ...contractConnect, accounts, contract: instance });
            const response = await instance?.methods.totalSupply().call();

            setStakedTokens(response);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or BoriStakeContract. Check console for details.`,
            );
            console.error(error);
        }


    }

    useEffect(() => {
        getContracts();
        console.log("hera");
        // return () => {
        //     const ac = new AbortController();
        //     getContracts(ac.signal);
        //     ac.abort();
        // };
        // eslint-disable-next-line
    }, [])

    const handleStake = async () => {
        const { accounts, contract } = contractConnect;

        await contract?.methods.stake(tokenStake).send({ from: accounts[0] });

        const response = await contract.methods.totalSupply().call();

        // Update state with the result.
        setStakedTokens(response);
    }

    const viewBalance = async () => {
        const { contract } = contractConnect;

        const response = await contract.methods.balanceOf(balanceAddr).call();

        // Update state with the result.
        setBalance(response);
    }

    const handleTransfer = async () => {
        const { accounts, contract } = contractConnect;

        await contract.methods.transfer(transferAddr, tokenTransfer).send({ from: accounts[0] });


    }

    return (

        <div className="container">
            <div className="mb-3 mt-5 d-flex justify-content-between">
                <label className="">Staked Tokens</label>
                <input type="text" className="form-control" value={stakedTokens} disabled />
                {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
            </div>
            <div className="mb-3 mt-5 d-flex justify-content-between">
                <button className="rounded-pill btn-primary ml-2 "
                    onClick={handleStake}
                >
                    Stake</button>
                <input type="number" className="form-control mx-3" placeholder='Enter Amount of tokens you want to stake'
                    value={tokenStake}
                    onChange={(e) => { setTokenStake(e.target.value) }}
                />
                {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
            </div>
            <div className="mb-3 mt-5 d-flex justify-content-between">
                <button className="rounded-pill btn-primary ml-2 "
                    onClick={viewBalance}
                >
                    View Balance</button>
                <input type="text" className="form-control mx-3"
                    value={balanceAddr}
                    onChange={(e) => { setBalanceAddr(e.target.value) }}
                    placeholder='Enter an address to check its balance'
                />
                <input type="text" className="form-control mx-3" disabled
                    value={balance}
                />
                {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
            </div>
            <div className="mb-3 mt-5 d-flex justify-content-between">
                <button className="rounded-pill btn-primary ml-2 "
                    onClick={handleTransfer}
                >
                    Transfer</button>
                <input type="text" className="form-control mx-3" placeholder='Enter recipient Address'
                    value={transferAddr}
                    onChange={(e) => { setTransferAddr(e.target.value) }}
                />
                <input type="number" className="form-control mx-3" placeholder='Enter amount of tokens you want to send'
                    value={tokenTransfer}
                    onChange={(e) => { setTokenTransfer(e.target.value) }}
                />
                {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
            </div>

        </div>
    )
}


export default (Interaction);
