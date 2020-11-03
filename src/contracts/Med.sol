pragma solidity >=0.4.21 <0.6.0;

contract Med {
    //smart contract code

    string theHash;

    //write function
    function set (string memory _theHash) public{
        theHash = _theHash;
    }

    //read function
    function get() public view returns (string memory) {
        return theHash;
    }
    
}


