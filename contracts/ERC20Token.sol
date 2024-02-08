// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC20Token {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0), "ERC20: transfer to the zero address");
        require(
            balanceOf[_from] >= _value,
            "ERC20: transfer amount exceeds balance"
        );

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

    /**
     * Transfers tokens from the sender's account to another account.
     */
    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * Approves another address to spend tokens on behalf of the sender.
     */
    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
     * Transfers tokens from one account to another by an approved spender.
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(
            _value <= allowance[_from][msg.sender],
            "ERC20: transfer amount exceeds allowance"
        );
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * Mints new tokens and adds them to the specified account.
     */
    function mint(address _to, uint256 _value) external {
        balanceOf[_to] += _value;
        totalSupply += _value;
        emit Transfer(address(0), _to, _value);
    }

    /**
     * Burns a specified amount of tokens from the sender's account.
     */
    function burn(uint256 _value) public {
        require(
            balanceOf[msg.sender] >= _value,
            "ERC20: burn amount exceeds balance"
        );
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        emit Transfer(msg.sender, address(0), _value);
    }
}
