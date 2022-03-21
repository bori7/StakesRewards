// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BoriStake is ERC20, Ownable {

    uint256 public  rate = 1000;

    constructor() ERC20("BoriStake", "BSTK") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    event Buy(uint256 amount); 

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

   function modifyTokenBuyPrice(uint256 _rate) public onlyOwner {
        rate = _rate;
    }

    function buyToken(address receiver) public payable{

        require(msg.value > 0, "You need to send some ether"); 
        uint256 amountTobuy = msg.value * rate; 
        
        mint(receiver, amountTobuy);
        emit Buy(amountTobuy);
        payable(receiver).transfer(msg.value);
    }
}

contract StakingRewards is BoriStake{
    IERC20 public rewardsToken;
    IERC20 public stakingToken;

    uint public rewardRate = 100;
    uint public lastUpdateTime = block.timestamp;
    uint public rewardPerTokenStored = 0;

    mapping(address => uint) public userRewardPerTokenPaid;
    mapping(address => uint) public rewards;

    uint private _totalSupply;
    mapping(address => uint) private _balances;

    constructor(address _stakingToken, address _rewardsToken) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
    }

    function rewardPerToken() public view returns (uint) {
        require(block.timestamp -lastUpdateTime <= 1 * 1 weeks ,"Reward expired after a week");// expiry check
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored +
            ((rewardRate * 1e18) / _totalSupply);
    }

    function earned(address account) public view returns (uint) {
        return
            ((_balances[account] *
                (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) +
            rewards[account];
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;

        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }

    function stake(uint _amount) external updateReward(msg.sender) {
        _totalSupply += _amount;
        _balances[msg.sender] += _amount;
        stakingToken.transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(uint _amount) external updateReward(msg.sender) {
        _totalSupply -= _amount;
        _balances[msg.sender] -= _amount;
        stakingToken.transfer(msg.sender, _amount);
    }

    function getReward() external updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        rewardsToken.transfer(msg.sender, reward);
    }
}
