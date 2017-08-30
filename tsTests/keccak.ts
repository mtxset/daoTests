import { keccak, sha3num, sha3withsize } from './helpers/keccak'
import * as chai from 'chai'

const should = chai.should()

describe('solidity-sha3', () => {
    it('should hash a string', () => {
      keccak('a').should.equal('0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb')
    })
  
    it('should hash a hex string without padding', () => {
      keccak('0x0a').should.equal('0x0ef9d8f8804d174666011a394cab7901679a8944d24249fd148a6a36071151f8')
    })
  
    it('should hash a number as uint256', () => {
      keccak(1).should.equal('0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6')
    })
  
    it('should hash negative numbers as int256', () => {
      keccak(-1).should.equal('0xa9c584056064687e149968cbab758a3376d22aedc6a55823d1b3ecbee81b8fb9')
    })
  
    it('should hash multiple arguments', () => {
      keccak('a', 1).should.equal('0xb5cafab5b83d18303877bb912b2d66ca18ab7390cfd9be8a2e66cc5096e0ea02')
    })
  
    it('should hash a value of a specific size', () => {
        sha3withsize(1, 8).should.equal('0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2')
        sha3withsize(1, 32).should.equal('0x51f81bcdfc324a0dff2b5bec9d92e21cbebc4d5e29d3a3d30de3e03fbeab8d7f')
    })
  
    it('should hash a number stored in a string', () => {
        sha3num(web3.toWei('100')).should.equal('0xc7cc234d21c9cfbd4632749fd77669e7ae72f5241ce5895e410c45185a469273')
    })
  })