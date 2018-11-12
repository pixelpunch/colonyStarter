// import big number
import BN from 'bn.js'
import web3 from 'web3'

// createToken

export const createToken = async (networkClient, name, symbol) => {

  // create token
  const {
    meta: { receipt: { contractAddress: tokenAddress } }
  } = await networkClient.createToken.send({
    name: web3.utils.sha3(name),
    symbol: web3.utils.sha3(symbol),
  })

  // return token address
  return tokenAddress

}

// getToken

export const getToken = async (colonyClient) => {

  // set token address
  const address = colonyClient.token._contract.address

  // get token info
  const info = await colonyClient.token.getTokenInfo.call()

  // get total supply
  const { amount } = await colonyClient.token.getTotalSupply.call()

  // set supply
  const supply = amount.toNumber()

  // return token
  return { address, supply, ...info }

}

// mintTokens

export const mintTokens = async (colonyClient, amount) => {

  // mint tokens
  await colonyClient.mintTokens.send({ amount: new BN(amount) })

  // get token
  const token = await getToken(colonyClient)

  // return token
  return token

}
