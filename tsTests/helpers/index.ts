import * as assert from 'assert'

export const expectThrow = async promise => {
  try {
    await promise
  } catch (error) {

    const invalidJump = error.message.search('invalid JUMP') >= 0

    const invalidOpcode = error.message.search('invalid opcode') >= 0

    const outOfGas = error.message.search('out of gas') >= 0
    assert(invalidJump || invalidOpcode || outOfGas, "Expected throw, got '" + error + "' instead")
    return true;
  }
  return false;
}

export const mineBlocks = async function (num=1) {
  for (let i=0; i<num; ++i) {
    await new Promise(function(resolve, reject) 
    { web3.currentProvider.sendAsync({ jsonrpc: "2.0", method: "evm_mine", id: i },
     function(err, result) { resolve(); }); })
  }
}

export const blockNumber = () => {
  return new Promise(function(resolve, reject) {
    web3.currentProvider.sendAsync({ jsonrpc: "2.0", method: "eth_blockNumber", id: 0x05 }, 
    function(err, result) { resolve(parseInt(result.result)) })
  })
}

export const snapshot = () => {
  return new Promise(function(resolve, reject) {
    web3.currentProvider.sendAsync({ jsonrpc: "2.0", method: "evm_snapshot" }, 
    function(err, result) { resolve(); })
  })
}

export const revert = () => {
  return new Promise(function(resolve, reject) {
    web3.currentProvider.sendAsync({ jsonrpc: "2.0", method: "evm_revert" }, 
    function(err, result) { resolve(); })
  })
}

export const reset = () => {
  return new Promise(function(resolve, reject) {
    web3.currentProvider.sendAsync({ jsonrpc: "2.0", method: "evm_reset", id: 0xabce }, 
    function(err, result) { resolve(); })
  })
}

