const eosjs = require("eosjs");
const assert = require('assert');
const eoslime = require('eoslime').init('local');

const CONTRACT_GREENBACK_WASM_PATH = './contracts/greenback.wasm';
const CONTRACT_GREENBACK_ABI_PATH = './contracts/greenback.abi';
const CONTRACT_EOSIO_TOKEN_WASM_PATH = './contracts/eosio.token.wasm';
const CONTRACT_EOSIO_TOKEN_ABI_PATH = './contracts/eosio.token.abi';

// default
// Private key: PW5KNkhj46LiEWpK5T3XnRvtCBdEVVft4bTgNnU2NQbsek7gSZa2d

// eosio
// Private key: 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
// Public key: EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

const GREENBACK = "greenback";
const EOSIO_TOKEN = "eosio.token";

const TOTAL_TOKEN_SUPPLY = "1000000000.0000 GBT";
const TOKEN_AMOUNT = "1000000.0000 GBT";
const TOKEN_SYMBOL = "GBT";

const DELIVERY_ID = 11111;
const HAS_AI = 0;
const ITEM_ID_1 = 101;
const ITEM_ID_2 = 202;
const PLTYPE_PET_ID = 1;
const PLTYPE_PET_NAME = "PET";
const PLTYPE_PET_RATE = 1;
const PLTYPE_PS_ID = 2;
const PLTYPE_PS_NAME = "PS";
const PLTYPE_PS_RATE = 1;
const PLTYPE_HDPE_ID = 3;
const PLTYPE_HDPE_NAME = "HDPE";
const PLTYPE_HDPE_RATE = 1;
const TOTAL_WEIGHT_1 = 1001; // grams
const TOTAL_WEIGHT_2 = 2002; // grams
const TOTAL_WEIGHT = TOTAL_WEIGHT_1 + TOTAL_WEIGHT_2; // grams
const TOTAL_WEIGHTED = 5000.7; // grams
const ADJUSTMENT_TOTAL_WEIGHT = -10; // grams
const ADJUSTMENT_TOTAL_WEIGHTED = -1000; // grams
const ITEM_COUNT_1 = 5;
const ITEM_COUNT_2 = 7;
const ITEM_COUNT = ITEM_COUNT_1 + ITEM_COUNT_2;
const PRODUCER_1 = "1";
const PRODUCER_2 = "2";
const BATCH_HASH = "c8w76ew8c76ewc876erw8c67w8ce67rwc7ercw67e";
const IPFS_URL = "https://gateway.pinata.cloud/ipfs/QmVGvMygSFLkcLMKdVMnhhgVZ3s6fG9uXZAQAKzfEgu8Yr";
const WEIGHT_TO_BUY = 1501; // grams

describe('GREENBACK PROJECT', function () {

    let greenbackContract;
    let tokenContract;

    let greenbackAccount;
    let tokenAccount;
    let receptionAccount;
    let transferAccount;
    let recyclerAccount;
    let pickerAccount;
    let customerAccount;
    let maliciousAccount;

    const searchRecord = async function (table, bound, index_position) {
        return (await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: table,
            key_type: "i64",
            index_position: index_position,
            lower_bound: bound,
            upper_bound: bound,
            json: true
        })).rows;
    }

    const sleep = async function (ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, ms);

        });
    }

    describe('initial contract data', function () {

        beforeEach(async () => {

            // create accounts
            let accounts = await eoslime.Account.createRandoms(6);
            greenbackAccount = accounts[0];
            tokenAccount = accounts[1];
            receptionAccount = accounts[2];
            recyclerAccount = accounts[3];
            pickerAccount = accounts[4];
            maliciousAccount = accounts[5];

            // deploy smart contracts
            greenbackContract = await eoslime.AccountDeployer.deploy(CONTRACT_GREENBACK_WASM_PATH, CONTRACT_GREENBACK_ABI_PATH, greenbackAccount, {inline: true} );
            tokenContract = await eoslime.AccountDeployer.deploy(CONTRACT_EOSIO_TOKEN_WASM_PATH, CONTRACT_EOSIO_TOKEN_ABI_PATH, tokenAccount, {inline: true} );

        });

        describe('plastic types', function () {

            it('Should add plastic type successfully', async () => {
                await greenbackContract.addplastic(PLTYPE_PET_ID, PLTYPE_PET_NAME, PLTYPE_PET_RATE);
        
                let plastictypes = await searchRecord("plasticts");
        
                assert.equal(plastictypes.length, 1);
                assert.equal(plastictypes[0].id, PLTYPE_PET_ID);
                assert.equal(plastictypes[0].type, PLTYPE_PET_NAME);
                assert.equal(plastictypes[0].rate, PLTYPE_PET_RATE);
            });
        
            it('Should throw if non-admin tries to add plastic type', async () => {
                try {
                    await greenbackContract.addplastic(PLTYPE_PET_ID, PLTYPE_PET_NAME, PLTYPE_PET_RATE, { from: maliciousAccount });
        
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('Missing required authority'), 'Non-admin can add plastic types');
                }
            });
        
            it('Should throw if admin tries to add already existing plastic type', async () => {
                await greenbackContract.addplastic(PLTYPE_PET_ID, PLTYPE_PET_NAME, PLTYPE_PET_RATE);

                await sleep(500);
        
                try {
                    await greenbackContract.addplastic(PLTYPE_PET_ID, PLTYPE_PET_NAME, PLTYPE_PET_RATE);
        
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('plastic type already exists'), 'An admin can re-add plastic types');
                }
            });

        });

        describe('reception centers', function () {
    
            it('Should add reception center successfully', async () => {
                await greenbackContract.addreception(receptionAccount.name);
        
                let receptions = await searchRecord("receptions");
        
                assert.equal(receptions.length, 1);
                assert.equal(eosjs.modules.format.decodeName(receptions[0].account, false), receptionAccount.name);
            });
        
            it('Should throw if non-admin tries to add reception center', async () => {
                try {
                    await greenbackContract.addreception(receptionAccount.name, { from: maliciousAccount});
        
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('Missing required authority'), 'Non-admin can add reception centers');
                }
            });
        
            it('Should throw if admin tries to add already existing reception center', async () => {
                await greenbackContract.addreception(receptionAccount.name);

                await sleep(500);
                
                try {
                    await greenbackContract.addreception(receptionAccount.name);
        
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('reception center already exists'), 'An admin can re-add reception centers');
                }
            });

        });

        describe('recycler centers', function () {

            beforeEach(async () => {
                await greenbackContract.addplastic(PLTYPE_PET_ID, PLTYPE_PET_NAME, PLTYPE_PET_RATE);
                await greenbackContract.addplastic(PLTYPE_PS_ID, PLTYPE_PS_NAME, PLTYPE_PS_RATE);
                await greenbackContract.addplastic(PLTYPE_HDPE_ID, PLTYPE_HDPE_NAME, PLTYPE_HDPE_RATE);
            });
    
            it('Should add recycler center successfully', async () => {
                await greenbackContract.addrecycler(recyclerAccount.name, [PLTYPE_PET_ID, PLTYPE_PS_ID, PLTYPE_HDPE_ID]);
        
                let recyclers = await searchRecord("recyclers", recyclerAccount.name, 2);
        
                assert.equal(recyclers.length, 3);
                assert.equal(eosjs.modules.format.decodeName(recyclers[0].account, false), recyclerAccount.name);
                assert.equal(recyclers[0].plastic_type, PLTYPE_PET_ID);
                assert.equal(eosjs.modules.format.decodeName(recyclers[1].account, false), recyclerAccount.name);
                assert.equal(recyclers[1].plastic_type, PLTYPE_PS_ID);
                assert.equal(eosjs.modules.format.decodeName(recyclers[2].account, false), recyclerAccount.name);
                assert.equal(recyclers[2].plastic_type, PLTYPE_HDPE_ID);
            });
        
            it('Should throw if non-admin tries to add recycler center', async () => {
                try {
                    await greenbackContract.addrecycler(recyclerAccount.name, [PLTYPE_PET_ID], { from: maliciousAccount });
        
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('Missing required authority'), 'Non-admin can add recycler centers');
                }
            });
        
            it('Should throw if admin tries to add already existing recycler center', async () => {
                await greenbackContract.addrecycler(recyclerAccount.name, [PLTYPE_PET_ID]);

                await sleep(500);
        
                try {
                    await greenbackContract.addrecycler(recyclerAccount.name, [PLTYPE_PET_ID]);
        
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('recycler already exists'), 'An admin can re-add recycler centers');
                }
            });

            it('Should not throw when admin tries to add recycler center with duplicate plastic types', async () => {
                await greenbackContract.addrecycler(recyclerAccount.name, [PLTYPE_PET_ID, 1]);
        
                let recyclers = await searchRecord("recyclers", recyclerAccount.name, 2);
        
                assert.equal(recyclers.length, 1);
                assert.equal(eosjs.modules.format.decodeName(recyclers[0].account, false), recyclerAccount.name);
                assert.equal(recyclers[0].plastic_type, PLTYPE_PET_ID);
            });

            it('Should not throw when admin tries to add recycler center with unknown plastic type', async () => {
                await greenbackContract.addrecycler(recyclerAccount.name, [PLTYPE_PET_ID, 5]);
        
                let recyclers = await searchRecord("recyclers", recyclerAccount.name, 2);
        
                assert.equal(recyclers.length, 1);
                assert.equal(eosjs.modules.format.decodeName(recyclers[0].account, false), recyclerAccount.name);
                assert.equal(recyclers[0].plastic_type, PLTYPE_PET_ID);
            });

        });

        describe('pickers', function () {
    
            it('Should add picker successfully', async () => {
                await greenbackContract.addpicker(pickerAccount.name);
        
                let pickers = await searchRecord("pickers");
        
                assert.equal(pickers.length, 1);
                assert.equal(eosjs.modules.format.decodeName(pickers[0].account, false), pickerAccount.name);
            });
        
            it('Should throw if non-admin tries to add picker', async () => {
                try {
                    await greenbackContract.addpicker(pickerAccount.name, { from: maliciousAccount });
        
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('Missing required authority'), 'Non-admin can add pickers');
                }
            });
        
            it('Should throw if admin tries to add already existing picker', async () => {
                await greenbackContract.addpicker(pickerAccount.name);

                await sleep(500);

                try {
                    await greenbackContract.addpicker(pickerAccount.name);
        
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('picker already exists'), 'An admin can re-add pickers');
                }
            });

        });

    });

    describe('main contract actions', function () {

        before(async () => {

            // create accounts
            let accounts = await eoslime.Account.createRandoms(6);
            greenbackAccount = await eoslime.Account.createFromName(GREENBACK);
            tokenAccount = await eoslime.Account.createFromName(EOSIO_TOKEN);
            receptionAccount = accounts[0];
            transferAccount = accounts[1];
            recyclerAccount = accounts[2];
            pickerAccount = accounts[3];
            customerAccount = accounts[4];
            maliciousAccount = accounts[5];

            // deploy smart contract
            greenbackContract = await eoslime.AccountDeployer.deploy(CONTRACT_GREENBACK_WASM_PATH, CONTRACT_GREENBACK_ABI_PATH, greenbackAccount, {inline: true} );
            tokenContract = await eoslime.AccountDeployer.deploy(CONTRACT_EOSIO_TOKEN_WASM_PATH, CONTRACT_EOSIO_TOKEN_ABI_PATH, tokenAccount, {inline: true} );

            // register initial contract data
            await greenbackContract.addplastic(PLTYPE_PET_ID, PLTYPE_PET_NAME, PLTYPE_PET_RATE);
            await greenbackContract.addpicker(pickerAccount.name);
            await greenbackContract.addreception(receptionAccount.name);
            await greenbackContract.addrecycler(recyclerAccount.name, [PLTYPE_PET_ID]);
    
            // register GBT token
            await tokenContract.create(greenbackAccount.name, TOTAL_TOKEN_SUPPLY);

            // issue tokens to customer
            await tokenContract.issue(customerAccount.name, TOKEN_AMOUNT, "", { from: greenbackAccount });

        });

        describe('register delivery', function () {

            it('Should register delivery successfully', async () => {
                // register delivery
                await greenbackContract.regdelivery(DELIVERY_ID,
                    pickerAccount.name,
                    receptionAccount.name,
                    HAS_AI,
                    [{"item_id": ITEM_ID_1, "plastic_type": PLTYPE_PET_ID, "total_weight": TOTAL_WEIGHT_1, "count": ITEM_COUNT_1, "producer": PRODUCER_1},
                    {"item_id": ITEM_ID_2, "plastic_type": PLTYPE_PET_ID, "total_weight": TOTAL_WEIGHT_2, "count": ITEM_COUNT_2, "producer": PRODUCER_2}],
                    BATCH_HASH,
                    IPFS_URL,
                    TOTAL_WEIGHTED,
                    { from: receptionAccount });
        
                let deliveryhs = await searchRecord("deliveryhs");
        
                assert.equal(deliveryhs.length, 1);
                assert.equal(deliveryhs[0].delivery_id, DELIVERY_ID);
                assert.equal(eosjs.modules.format.decodeName(deliveryhs[0].picker, false), pickerAccount.name);
                assert.equal(eosjs.modules.format.decodeName(deliveryhs[0].reception, false), receptionAccount.name);
                assert.equal(deliveryhs[0].hasAI, HAS_AI);
                assert.equal(Number(deliveryhs[0].total_minted_tokens), TOTAL_WEIGHT/(1000 * 1000));
                assert.equal(deliveryhs[0].batch_hash, BATCH_HASH);
                assert.equal(deliveryhs[0].ipfs_url, IPFS_URL);
                assert.equal(deliveryhs[0].total_weighted, TOTAL_WEIGHTED);

                let deliveryls = await searchRecord("deliveryls");
        
                assert.equal(deliveryls.length, 2);
                assert.equal(deliveryls[0].delivery_id, DELIVERY_ID);
                assert.equal(deliveryls[0].item_id, ITEM_ID_1);
                assert.equal(deliveryls[0].plastic_type, PLTYPE_PET_ID);
                assert.equal(deliveryls[0].total_weight, TOTAL_WEIGHT_1);
                assert.equal(deliveryls[0].count, ITEM_COUNT_1);
                assert.equal(deliveryls[1].delivery_id, DELIVERY_ID);
                assert.equal(deliveryls[1].item_id, ITEM_ID_2);
                assert.equal(deliveryls[1].plastic_type, PLTYPE_PET_ID);
                assert.equal(deliveryls[1].total_weight, TOTAL_WEIGHT_2);
                assert.equal(deliveryls[1].count, ITEM_COUNT_2);

                let deliveryptws = await searchRecord("deliveryptws");
        
                assert.equal(deliveryptws.length, 1);
                assert.equal(deliveryptws[0].delivery_id, DELIVERY_ID);
                assert.equal(deliveryptws[0].plastic_type, PLTYPE_PET_ID);
                assert.equal(deliveryptws[0].total_weight, TOTAL_WEIGHT);

                let totplastics = await searchRecord("totplastics");
        
                assert.equal(totplastics.length, 2);
                assert.equal(eosjs.modules.format.decodeName(totplastics[0].account, false), receptionAccount.name);
                assert.equal(totplastics[0].plastic_type, PLTYPE_PET_ID);
                assert.equal(totplastics[0].total_weight, TOTAL_WEIGHT);
                assert.equal(totplastics[0].count, ITEM_COUNT);
                assert.equal(eosjs.modules.format.decodeName(totplastics[1].account, false), pickerAccount.name);
                assert.equal(totplastics[1].plastic_type, PLTYPE_PET_ID);
                assert.equal(totplastics[1].total_weight, TOTAL_WEIGHT);
                assert.equal(totplastics[1].count, ITEM_COUNT);

                let producers = await searchRecord("producers");
        
                assert.equal(producers.length, 2);
                assert.equal(producers[0].producer, 1);
                assert.equal(producers[0].plastic_type, PLTYPE_PET_ID);
                assert(producers[0].total_weight - TOTAL_WEIGHT_1 < 0.0000001);
                assert.equal(producers[0].count, ITEM_COUNT_1);
                assert.equal(producers[1].producer, PRODUCER_2);
                assert.equal(producers[1].plastic_type, PLTYPE_PET_ID);
                assert(producers[1].total_weight - TOTAL_WEIGHT_2 < 0.0000001);
                assert.equal(producers[1].count, ITEM_COUNT_2);

                let receptions = await searchRecord("receptions");
        
                assert.equal(receptions.length, 1);
                assert.equal(eosjs.modules.format.decodeName(receptions[0].account, false), receptionAccount.name);
                assert.equal(receptions[0].confirmed, 0);
                assert.equal(receptions[0].total_weighted, TOTAL_WEIGHTED);

                let pickers = await searchRecord("pickers");
        
                assert.equal(pickers.length, 1);
                assert.equal(eosjs.modules.format.decodeName(pickers[0].account, false), pickerAccount.name);
                assert.equal(pickers[0].total_delivered_weight, TOTAL_WEIGHT);
                assert(pickers[0].total_delivered_weight - TOTAL_WEIGHT < 0.0000001);
                assert.equal(pickers[0].total_weighted, TOTAL_WEIGHTED);
        
                let pickerBalance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, pickerAccount.name, TOKEN_SYMBOL);
                assert.equal(parseFloat(pickerBalance), (TOTAL_WEIGHT/(1000 * 1000)).toFixed(4));
            });
        
            it('Should throw if non-authorized reception center tries to add delivery', async () => {
                try {
                    await greenbackContract.regdelivery(22222,
                        pickerAccount.name,
                        maliciousAccount.name,
                        HAS_AI,
                        [{"item_id": ITEM_ID_1, "plastic_type": PLTYPE_PET_ID, "total_weight": TOTAL_WEIGHT_1, "count": ITEM_COUNT_1, "producer": PRODUCER_1},
                        {"item_id": ITEM_ID_2, "plastic_type": PLTYPE_PET_ID, "total_weight": TOTAL_WEIGHT_2, "count": ITEM_COUNT_2, "producer": PRODUCER_2}],
                        BATCH_HASH,
                        IPFS_URL,
                        TOTAL_WEIGHTED,
                        { from: maliciousAccount });
            
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('reception center does not exist'), 'Non-authorized reception center can add deliveries');
                }
            });
        
            it('Should throw if reception center tries to add already existing delivery', async () => {
                await sleep(500);

                try {
                    await greenbackContract.regdelivery(DELIVERY_ID,
                        pickerAccount.name,
                        receptionAccount.name,
                        HAS_AI,
                        [{"item_id": ITEM_ID_1, "plastic_type": PLTYPE_PET_ID, "total_weight": TOTAL_WEIGHT_1, "count": ITEM_COUNT_1, "producer": PRODUCER_1},
                        {"item_id": ITEM_ID_2, "plastic_type": PLTYPE_PET_ID, "total_weight": TOTAL_WEIGHT_2, "count": ITEM_COUNT_2, "producer": PRODUCER_2}],
                        BATCH_HASH,
                        IPFS_URL,
                        TOTAL_WEIGHTED,
                        { from: receptionAccount });
            
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('delivery id already existing'), 'Reception center can re-add deliveries');
                }
            });
        
            it('Should throw if attempts to register new delivery with invalid picker', async () => {
                try {
                    await greenbackContract.regdelivery(33333,
                        receptionAccount.name,
                        receptionAccount.name,
                        HAS_AI,
                        [{"item_id": ITEM_ID_1, "plastic_type": PLTYPE_PET_ID, "total_weight": TOTAL_WEIGHT_1, "count": ITEM_COUNT_1, "producer": PRODUCER_1},
                        {"item_id": ITEM_ID_2, "plastic_type": PLTYPE_PET_ID, "total_weight": TOTAL_WEIGHT_2, "count": ITEM_COUNT_2, "producer": PRODUCER_2}],
                        BATCH_HASH,
                        IPFS_URL,
                        TOTAL_WEIGHTED,
                        { from: receptionAccount });
            
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('picker does not exist'), 'Reception center can add deliveries with invalid pickers');
                }
            });

        });

        describe('adjust plastic weights', function () {

            it('Should adjust plastic weight', async () => {
                let receptions = await searchRecord("receptions");

                assert.equal(receptions.length, 1);
                assert.equal(eosjs.modules.format.decodeName(receptions[0].account, false), receptionAccount.name);
                assert.equal(receptions[0].confirmed, 0);
                assert.equal(receptions[0].total_weighted, TOTAL_WEIGHTED);

                await greenbackContract.adjust(transferAccount.name,
                    receptionAccount.name,
                    [{"plastic_type": PLTYPE_PET_ID, "total_weight": ADJUSTMENT_TOTAL_WEIGHT}],
                    ADJUSTMENT_TOTAL_WEIGHTED,
                    { from: transferAccount });

                receptions = await searchRecord("receptions");

                assert.equal(receptions.length, 1);
                assert.equal(eosjs.modules.format.decodeName(receptions[0].account, false), receptionAccount.name);
                assert.equal(receptions[0].confirmed, 1);
                assert.equal(receptions[0].total_weighted, TOTAL_WEIGHTED + ADJUSTMENT_TOTAL_WEIGHTED);

                let totplastics = await searchRecord("totplastics");

                assert.equal(totplastics.length, 2);
                assert.equal(eosjs.modules.format.decodeName(totplastics[0].account, false), receptionAccount.name);
                assert.equal(totplastics[0].plastic_type, PLTYPE_PET_ID);
                assert.equal(totplastics[0].total_weight, TOTAL_WEIGHT + ADJUSTMENT_TOTAL_WEIGHT);
                assert.equal(totplastics[0].count, ITEM_COUNT);
                assert.equal(eosjs.modules.format.decodeName(totplastics[1].account, false), pickerAccount.name);
                assert.equal(totplastics[1].plastic_type, PLTYPE_PET_ID);
                assert.equal(totplastics[1].total_weight, TOTAL_WEIGHT);
                assert.equal(totplastics[1].count, ITEM_COUNT);
            });

            it('Should throw if transfer center tries to adjust data of non-existing reception center', async () => {
                try {
                    await greenbackContract.adjust(transferAccount.name,
                        pickerAccount.name,
                        [{"plastic_type": PLTYPE_PET_ID, "total_weight": ADJUSTMENT_TOTAL_WEIGHT}],
                        ADJUSTMENT_TOTAL_WEIGHTED,
                        { from: transferAccount });

                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('reception center does not exist'), 'Transfer center can adjust data of non-existing reception centers');
                }
            });

        });

        describe('buy plastic', function () {

            before(async () => {
                await greenbackContract.addplastic(2, "PS", 1);
                await customerAccount.addPermission('eosio.code', greenbackAccount.name);
            });

            it('Should buy plastic successfully', async () => {
                let customerInitBalance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, customerAccount.name, TOKEN_SYMBOL);
                assert.equal(customerInitBalance, TOKEN_AMOUNT);

                await greenbackContract.buyplastic(
                    customerAccount.name,
                    recyclerAccount.name,
                    PLTYPE_PET_ID,
                    WEIGHT_TO_BUY,
                    { from: customerAccount });

                let purchases = await searchRecord("purchases");
        
                assert.equal(purchases.length, 1);
                assert.equal(eosjs.modules.format.decodeName(purchases[0].buyer, false), customerAccount.name);
                assert.equal(eosjs.modules.format.decodeName(purchases[0].recycler, false), recyclerAccount.name);
                assert(purchases[0].date_of_purchase > 0);
                assert.equal(purchases[0].plastic_type, PLTYPE_PET_ID);
                assert.equal(purchases[0].total_weight, WEIGHT_TO_BUY);

                let customerFinalBalance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, customerAccount.name, TOKEN_SYMBOL);
                assert.equal(parseFloat(customerFinalBalance), (parseFloat(TOKEN_AMOUNT) - (WEIGHT_TO_BUY/(1000 * 1000)) * 3).toFixed(4));

                let recyclerFinalBalance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, recyclerAccount.name, TOKEN_SYMBOL);
                assert.equal(parseFloat(recyclerFinalBalance), ((WEIGHT_TO_BUY/(1000 * 1000)) * 3).toFixed(4));
            });

            it('Should throw if customer tries to buy plastic from non-existing recycler', async () => {
                try {
                    await greenbackContract.buyplastic(
                        customerAccount.name,
                        maliciousAccount.name,
                        PLTYPE_PET_ID,
                        1000,
                        { from: customerAccount });
                    
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('recycler does not exist'), 'Customer can buy plastic from non-existing recycler');
                }
            });

            it('Should throw if customer tries to buy plastic type recycler is not operating with', async () => {
                try {
                    await greenbackContract.buyplastic(
                        customerAccount.name,
                        recyclerAccount.name,
                        2,
                        1000,
                        { from: customerAccount });
                    
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('recycler not operating with this plastic type'), 'Customer can buy plastic type from recycler is not operating with');
                }
            });

            it('Should throw if customer tries to buy non-existing plastic type', async () => {
                try {
                    await greenbackContract.buyplastic(
                        customerAccount.name,
                        recyclerAccount.name,
                        15,
                        1000,
                        { from: customerAccount });
                    
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('plastic type does not exist'), 'Customer can buy non-existing plastic type');
                }
            });

            it('Should throw if customer tries to buy 0 plastic weight', async () => {
                try {
                    await greenbackContract.buyplastic(
                        customerAccount.name,
                        recyclerAccount.name,
                        PLTYPE_PET_ID,
                        0,
                        { from: customerAccount });
                    
                    assert(false, "Did not throw as expected");
                } catch (error) {
                    assert(error.includes('plastic weight should be positive'), 'Customer can buy 0 plastic weight');
                }
            });

            it('Should throw if customer tries to buy more than available plastic weight', async () => {
                try {
                    await greenbackContract.buyplastic(
                        customerAccount.name,
                        recyclerAccount.name,
                        PLTYPE_PET_ID,
                        1000000,
                        { from: customerAccount });
                    
                    assert(false, "Did not throw as ecpected");
                } catch (error) {
                    assert(error.includes('not enought plastic weight in stock'), 'Customer can buy more than available plastic weight');
                }
            });

        });

    });

});