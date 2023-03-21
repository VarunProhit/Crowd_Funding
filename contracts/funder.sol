// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract funder {
  uint public numOfFunder;
  
  mapping(uint=>address) private funders;
 
  receive() external payable{}

  function  transfer() external payable{
    funders[numOfFunder]=msg.sender;
  } 

  function withdraw(uint withdrawAmount) external{
    require(withdrawAmount<= 1000000000000000000,"Cannot withdraw more than 1 Ether");
    payable(msg.sender).transfer(withdrawAmount);
  }
   
   
}
