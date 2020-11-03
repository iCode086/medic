const Med = artifacts.require("Med");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Med', (accounts) => {
    //tests
    let med

    before(async () => {
        med = await Med.deployed()
    })

    describe('deployment', async () => {

        it('deploys successfully', async () => {
            
            const address = med.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
    })

    describe('storage', async () => {
        it('updates the theHash', async () => {
            let theHash
            theHash = 'abc123'
            await med.set(theHash)
            const result = await med.get()
            assert.equal(result, theHash)
        })
    })
})