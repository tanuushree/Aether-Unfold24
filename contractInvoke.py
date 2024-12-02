from web3 import Web3

# Initialize web3 connection to Base testnet
base_testnet_rpc_url = "https://goerli.base.org"  # Base testnet RPC URL
web3 = Web3(Web3.HTTPProvider(base_testnet_rpc_url))

if not web3.isConnected():
    raise Exception("Web3 is not connected. Check your Base testnet RPC URL.")

# Contract details
contract_address = "0xc383894c5ec09329bcf0e36479c483536aa0901e"  # Replace with your contract address
account_address = "0x4126daf3c32568fefd971b69857e226eb65a567d"   # Replace with your wallet address
private_key = "YOUR_PRIVATE_KEY"  # Replace with your private key (secure it properly)

# ABI of the `buyTokens` function
contract_abi = [
    {
        "inputs": [
            {"internalType": "address", "name": "tokenIn", "type": "address"},
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"internalType": "address", "name": "tokenOut", "type": "address"},
            {"internalType": "uint256", "name": "destinationChainId", "type": "uint256"},
            {"internalType": "address", "name": "receiver", "type": "address"}
        ],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
]

# Contract instance
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Function to call `buyTokens`
def call_buy_tokens(token_in, amount_in, token_out, destination_chain_id, receiver):
    nonce = web3.eth.getTransactionCount(account_address)
    tx = contract.functions.buyTokens(
        token_in,
        amount_in,
        token_out,
        destination_chain_id,
        receiver
    ).buildTransaction({
        'from': account_address,
        'gas': 300000,  # Estimate this or adjust based on actual usage
        'gasPrice': web3.toWei('20', 'gwei'),
        'nonce': nonce,
        'value': amount_in if token_in == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" else 0  # Include ETH value if tokenIn is native ETH
    })
    
    signed_tx = web3.eth.account.sign_transaction(tx, private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
    print(f"buyTokens transaction sent. Hash: {web3.toHex(tx_hash)}")
    return web3.eth.wait_for_transaction_receipt(tx_hash)

# Example parameters for `buyTokens`
token_in = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"  # Native ETH
amount_in = web3.toWei(1, 'ether')  # Replace with the desired amount in Wei
token_out = "0x0DFccd8150FB433B6A41063df27258808EEfD29"  # Replace with the tokenOut address
destination_chain_id = 8453  # Replace with the destination chain ID
receiver = "0x4126daf3c32568fefd971b69857e226eb65a567d"  # Replace with the receiver's address

# Call the function
receipt = call_buy_tokens(token_in, amount_in, token_out, destination_chain_id, receiver)
print(f"Transaction completed in block: {receipt.blockNumber}")
