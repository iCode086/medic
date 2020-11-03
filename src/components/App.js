import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Med from '../abis/Med.json'


const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  //get the account
  //get the network
  //get smart contract
  //-->abi: Med.abi
  //-->address: networkData.address
  //get med hash

  async loadBlockchainData() {
    const web3 = window.web3
    //load accounts
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Med.networks[networkId]
    if (networkData) {
      const abi = Med.abi
      const address = networkData.address
      //fetch contract

      const contract = web3.eth.Contract(abi, address)
      this.setState({ contract })
      const theHash = await contract.methods.get().call()
      this.setState({ theHash })

    } else {
      window.alert('smart contract not deployed...')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: null,
      web3: null,
      buffer: null,
      contract: null,
      theHash: ''
    };
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Please use metamask...')
    }
  }

  captureFile = (event) => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })

    }

  }
  //Example hash : "QmNmsKLxXoBddLD4jBHrMYdYVXG34ewdh22FVgxGdQeN1p"
  //Example url: https://ipfs.infura.io/ipfs/QmNmsKLxXoBddLD4jBHrMYdYVXG34ewdh22FVgxGdQeN1p
  onSubmit = (event) => {
    event.preventDefault()
    console.log("submitting the form...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("ipfs result", result)
      const theHash = result[0].hash

      if (error) {
        console.error(error)
        return
      }

      this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
        return this.setState({ theHash: result[0].hash })
      })
      //step2: store file on blockchain
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Medic Vedic
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{this.state.account}</small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href='https://ipfs.infura.io/ipfs/${this.state.theHash}'
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  
                  <img src={ `https://ipfs.infura.io/ipfs/${this.state.account}` } />
                </a>
                <p>&nbsp;</p>
                <h2>MEDIC VEDIC</h2>
                <form onSubmit={this.onSubmit} >
                  <input type="file" onChange={this.captureFile} />
                  <input type="submit" />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
