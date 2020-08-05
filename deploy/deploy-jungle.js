const eoslime = require('eoslime').init('jungle');

const CONTRACT_GREENBACK_WASM_PATH = './contracts/greenback.wasm';
const CONTRACT_GREENBACK_ABI_PATH = './contracts/greenback.abi';
const CONTRACT_EOSIO_TOKEN_WASM_PATH = './contracts/eosio.token.wasm';
const CONTRACT_EOSIO_TOKEN_ABI_PATH = './contracts/eosio.token.abi';

// default
// Private key: PW5KNkhj46LiEWpK5T3XnRvtCBdEVVft4bTgNnU2NQbsek7gSZa2d

// eosio
// Private key: 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
// Public key: EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

// ****************************************************************************
// *************************        CONTRACTS         *************************
// ****************************************************************************

// const GREENBACK = "grbackacc115";
// const GREENBACK_PRIVATE_KEY = "5JMVko8dUFYRRzQkhd6oZCf181WMJp5joDeSUgz7i1akoHg5EvC";
// const GREENABCK_PUBLIC_KEY = "EOS8ZYk9efK6VpiPPG8aMyJwgsJQ6sJUwCyRz4Lwsnc2MjAHHDojk";

// const EOSIO_TOKEN = "gbtokenac115";
// const EOSIO_TOKEN_PRIVATE_KEY = "5JH9U88G6X3PRs4yEUTpUXa8fZLy4qGSS9GCkgPeZjFdvWN3149";
// const EOSIO_TOKEN_PUBLIC_KEY = "EOS7j4RogByNMZanb7gnHD8mVZ14Qv6y1eWrPsbZAFcxAFHeU9KGR";

// ****************************************************************************
// *************************          PICKERS         *************************
// ****************************************************************************

const PICKER1 = "gbackpicker1";
const PICKER1_PRIVATE_KEY = "5Jjc6Cm1NvSVrcbmmRRsqh9NK1LjDGzoeVjrQSvUGzPv6VicWAx";
const PICKER1_PUBLIC_KEY = "EOS7BTw34nGiSS7NRMpyEHdJ8Vv8dBtK2yTQhvNwfHtWN7sCkS66Z";

const PICKER2 = "gbackpicker2";
const PICKER2_PRIVATE_KEY = "5KCwUXHVPS9fsgyucARaNzefzaXKhaa2X4j2wTYDcJTTf8DFC7S";
const PICKER2_PUBLIC_KEY = "EOS5iuSzanw2kx8CnkLBcjktqz6UbBzH6rwKFs7FBR1xiE4ho4TD3";

const PICKER3 = "gbackpicker3";
const PICKER3_PRIVATE_KEY = "5Kg9ZxCUpLyxbcqQKok5LeZsoMZNF6H5rrk1AxLfymhFwpGAtat";
const PICKER3_PUBLIC_KEY = "EOS6sMMpFhqJAfHWmLCCVXsqomCxxSGyw7jNADhZsxuGRBjhX392a";

const PICKER4 = "gbackpicker4";
const PICKER4_PRIVATE_KEY = "5KUBaomkFVvs21dL72DQDvcAvWximLKGQpsLRqrv1QP2EZRye6f";
const PICKER4_PUBLIC_KEY = "EOS8f3qzLq7sYZfaGczExFjLnqiVQ8GyCzn8h4J12e7rAULkdgR4g";

const PICKER5 = "gbackpicker5";
const PICKER5_PRIVATE_KEY = "5JgX94xZXDuXiaALsNG679uJSwkVGkjwHu6Kwptw39NwTWSioQb";
const PICKER5_PUBLIC_KEY = "EOS7kgyUxoJQNB71XVQrEacZnVQEAULqcfXaCSnRCqUfHG9DjPU33";

// ****************************************************************************
// *************************     RECEPTION CENTERS    *************************
// ****************************************************************************

const RECEPTION1 = "gbreception1";
const RECEPTION1_PRIVATE_KEY = "5KYLqEmpm1zNyzJ6CxFpiunQhijsEnuuvka9LCk3tERGjppwXU4";
const RECEPTION1_PUBLIC_KEY = "EOS85BDzEg6aQWkSDCREArSbnGbYmDMCr2orqL5tpwY6drxiKiHHa";

const RECEPTION2 = "gbreception2";
const RECEPTION2_PRIVATE_KEY = "5JZMPTaRSyTc5DrrxmugyipamdYaWqBywQ9fukktJRgaL5cfLZN";
const RECEPTION2_PUBLIC_KEY = "EOS4vuzenXCyuPcisL3uKjJZHgBVXkEZW2DZ4ZrgEPzapEEN7e6Ex";

const RECEPTION3 = "gbreception3";
const RECEPTION3_PRIVATE_KEY = "5Hy7Yoo3Tig8Ky5vSkZ1DyKyaAWsqoxTWiFz8wzHwQRjUNrbDDv";
const RECEPTION3_PUBLIC_KEY = "EOS7UrmswG11rG6d4T518X2noHRKwyoCYNsXe3Dbrz8HBH4trZYLA";

const RECEPTION4 = "gbreception4";
const RECEPTION4_PRIVATE_KEY = "5Jegum4xXKH6reMn6UqxvNwAYtzSwws4D3CavWdshbU1CtS3fBh";
const RECEPTION4_PUBLIC_KEY = "EOS8R338WLScPfftRY4iR9C3acpWGTZ7K8b4Kx8LVj3j5fKTtwvNM";

// ****************************************************************************
// *************************     TRANSFER CENTERS     *************************
// ****************************************************************************

const TRANSFER1 = "gbtransferc1";
const TRANSFER1_PRIVATE_KEY = "5J1ybinVX23cad6HFyFH1q74F5ERP5iEYXanXT12htEZLnnzDbb";
const TRANSFER1_PUBLIC_KEY = "EOS5sVAH2nXo7mSv3vn62JX7msSmZJddYf5g2Mbnjegq6juCAPJAb";

const TRANSFER2 = "gbtransferc2";
const TRANSFER2_PRIVATE_KEY = "5KSYx6kRE5XRTmzHd6rPhGmoPzESMv8TGa1sFB92fFXCGc5Z81Z";
const TRANSFER2_PUBLIC_KEY = "EOS5XgFS6hcdXcZYjTYAkFwerAnmQ71xh4BWR8pz4UvCgzkjriMrW";

// ****************************************************************************
// *************************         RECYCLERS        *************************
// ****************************************************************************

const RECYCLER1 = "gbrecyclerc1";
const RECYCLER1_PRIVATE_KEY = "5HpsacVCh33QmjG4pGzvru84bHT5VAtdQyGTGCy7kUeBAZBDPxT";
const RECYCLER1_PUBLIC_KEY = "EOS8KQRFQs9eqqubZuSZ1Yefx2AJ811N2S2SwWxRh66MspKdVo4zm";

const RECYCLER2 = "gbrecyclerc2";
const RECYCLER2_PRIVATE_KEY = "5HupuhhF5FWhQmbMVYhSXy4wwdC2uhzXgK749fX5iGaLRRUhVR6";
const RECYCLER2_PUBLIC_KEY = "EOS58XeeuJj8ijBCwxSkR9dgogb3uMYW1efxPg5VUX8qmYjmSMZEo";

const RECYCLER3 = "gbrecyclerc3";
const RECYCLER3_PRIVATE_KEY = "5JuYEyYF9k3LWx1sa89VARe2gnUe5jLFN6wgRHTUt9Hq3g4QnHx";
const RECYCLER3_PUBLIC_KEY = "EOS6Q4tfw2LXuNkmB1dVPZuTrwoFAeqCbTuiZVyiXfBB7KJ1sAwuC";

// ****************************************************************************
// *************************         CUSTOMERS        *************************
// ****************************************************************************

const CUSTOMER11 = "gbcustomer11";
const CUSTOMER11_PRIVATE_KEY = "5KgwsA635J9Z6992PN8D3fgMbFUW1GFJ9jAYr6vTbMPhqDVPe5R";
const CUSTOMER11_PUBLIC_KEY = "EOS6Ao4RtWSM88gP7EY2j9ubJVZLj7XB3GpzEZZAKYj9bsuRwrzXn";

const CUSTOMER12 = "gbcustomer12";
const CUSTOMER12_PRIVATE_KEY = "5Hpk5amcN2yzqGCHGkdwLc7UyyVk8vkVkoh2sErVJQ9BNznx5Mj";
const CUSTOMER12_PUBLIC_KEY = "EOS6i4yXD4yN2cp6ZJ5i6pxnZvtZsZS5jgRMDRLwCEskzca6fg83o";

const CUSTOMER13 = "gbcustomer13";
const CUSTOMER13_PRIVATE_KEY = "5KTVD6qwGdz4fskgDqnYN6Dm4duJCUH8H7Wvr74W694qH4eimy4";
const CUSTOMER13_PUBLIC_KEY = "EOS5XPMW9n89AVUGG9KVwfCzYsJtuQdRHCesohKqBGBD3xeuxaw2d";



const TOTAL_TOKEN_SUPPLY = "1000000000000.0000 GBT";
const TOKEN_AMOUNT = "1000000.0000 GBT";
const TOKEN_SYMBOL = "GBT";

describe('GREENBACK TESTS', function () {

    let greenbackAccount;
    let tokenAccount;
    let picker1Account;
    let picker2Account;
    let picker3Account;
    let picker4Account;
    let picker5Account;
    let reception1Account;
    let reception2Account;
    let reception3Account;
    let reception4Account;
    let transfer1Account;
    let transfer2Account;
    let recycler1Account;
    let recycler2Account;
    let recycler3Account;
    let customer11Account;
    let customer12Account;
    let customer13Account;

    let greenbackContract;
    let tokenContract;

    before(async() => {

        /*
         * LOAD ACCOUNTS
         */

        greenbackAccount = await eoslime.Account.load(GREENBACK, GREENBACK_PRIVATE_KEY);
        tokenAccount = await eoslime.Account.load(EOSIO_TOKEN, EOSIO_TOKEN_PRIVATE_KEY);
        
        picker1Account = await eoslime.Account.load(PICKER1, PICKER1_PRIVATE_KEY);
        picker2Account = await eoslime.Account.load(PICKER2, PICKER2_PRIVATE_KEY);
        picker3Account = await eoslime.Account.load(PICKER3, PICKER3_PRIVATE_KEY);
        picker4Account = await eoslime.Account.load(PICKER4, PICKER4_PRIVATE_KEY);
        picker5Account = await eoslime.Account.load(PICKER5, PICKER5_PRIVATE_KEY);
        reception1Account = await eoslime.Account.load(RECEPTION1, RECEPTION1_PRIVATE_KEY);
        reception2Account = await eoslime.Account.load(RECEPTION2, RECEPTION2_PRIVATE_KEY);
        reception3Account = await eoslime.Account.load(RECEPTION3, RECEPTION3_PRIVATE_KEY);
        reception4Account = await eoslime.Account.load(RECEPTION4, RECEPTION4_PRIVATE_KEY);
        transfer1Account = await eoslime.Account.load(TRANSFER1, TRANSFER1_PRIVATE_KEY);
        transfer2Account = await eoslime.Account.load(TRANSFER2, TRANSFER2_PRIVATE_KEY);
        recycler1Account = await eoslime.Account.load(RECYCLER1, RECYCLER1_PRIVATE_KEY);
        recycler2Account = await eoslime.Account.load(RECYCLER2, RECYCLER2_PRIVATE_KEY);
        recycler3Account = await eoslime.Account.load(RECYCLER3, RECYCLER3_PRIVATE_KEY);
        customer11Account = await eoslime.Account.load(CUSTOMER11, CUSTOMER11_PRIVATE_KEY);
        customer12Account = await eoslime.Account.load(CUSTOMER12, CUSTOMER12_PRIVATE_KEY);
        customer13Account = await eoslime.Account.load(CUSTOMER13, CUSTOMER13_PRIVATE_KEY);

        /*
         * DEPLOY SMART CONTRACTS
         */

        // greenbackContract = await eoslime.AccountDeployer.deploy(CONTRACT_GREENBACK_WASM_PATH, CONTRACT_GREENBACK_ABI_PATH, greenbackAccount, {inline: true} );
        // tokenContract = await eoslime.AccountDeployer.deploy(CONTRACT_EOSIO_TOKEN_WASM_PATH, CONTRACT_EOSIO_TOKEN_ABI_PATH, tokenAccount, {inline: true} );

        /*
         * LOAD DEPLOYED SMART CONTRACTS
         */

        greenbackContract = await eoslime.Contract(CONTRACT_GREENBACK_ABI_PATH, GREENBACK, greenbackAccount);
        tokenContract = await eoslime.Contract(CONTRACT_EOSIO_TOKEN_ABI_PATH, EOSIO_TOKEN, tokenAccount);

    });

    beforeEach(async () => {
        
    });

    // it('Should register all plastic types', async () => {
    //     await greenbackContract.addplastic(1, "PET", 1);
    //     await greenbackContract.addplastic(2, "PP", 1);
    //     await greenbackContract.addplastic(3, "PS", 1);
    //     await greenbackContract.addplastic(4, "LDPE", 1);
    //     await greenbackContract.addplastic(5, "HDPE", 1);
    //     await greenbackContract.addplastic(6, "PVC", 1);
    //     await greenbackContract.addplastic(7, "Dirty & Mixed", 1);
    //     await greenbackContract.addplastic(8, "Unusable Plastic", 1);
    //     await greenbackContract.addplastic(9, "Aluminium", 1);
    //     await greenbackContract.addplastic(10, "Other", 1);
    // });

    // it('Should register all pickers', async () => {
    //     await greenbackContract.addpicker(picker1Account.name);
    //     await greenbackContract.addpicker(picker2Account.name);
    //     await greenbackContract.addpicker(picker3Account.name);
    //     await greenbackContract.addpicker(picker4Account.name);
    //     await greenbackContract.addpicker(picker5Account.name);
    // });

    // it('Should register all reception centers', async () => {
    //     await greenbackContract.addreception(reception1Account.name);
    //     await greenbackContract.addreception(reception2Account.name);
    //     await greenbackContract.addreception(reception3Account.name);
    //     await greenbackContract.addreception(reception4Account.name);
    // });

    // it('Should register all recycler centers', async () => {
    //     await greenbackContract.addrecycler(recycler1Account.name, [1]);
    //     await greenbackContract.addrecycler(recycler2Account.name, [4, 5]);
    //     await greenbackContract.addrecycler(recycler3Account.name, [10]);
    // });

    // it('Should register GBT token', async () => {
    //     await tokenContract.create(greenbackAccount.name, TOTAL_TOKEN_SUPPLY);
    // });

    // it('Should issue 1M tokens to greenback account', async () => {
    //     await tokenContract.issue(greenbackAccount.name, TOKEN_AMOUNT, "", { from: greenbackAccount });
    // });

    // it('Should register delivery', async () => {
    //     await greenbackContract.regdelivery(
    //                 1111111,
    //                 picker1Account.name,
    //                 reception1Account.name,
    //                 0,
    //                 [{"item_id": 101, "plastic_type": 1, "total_weight": 1001.1, "count": 5, "producer": 1},
    //                 {"item_id": 102, "plastic_type": 1, "total_weight": 1002, "count": 3, "producer": 1},
    //                 {"item_id": 103, "plastic_type": 2, "total_weight": 2001.2, "count": 5, "producer": 1},
    //                 {"item_id": 104, "plastic_type": 2, "total_weight": 2002, "count": 5, "producer": 2},
    //                 {"item_id": 105, "plastic_type": 5, "total_weight": 3004.3, "count": 10, "producer": 2},
    //                 {"item_id": 106, "plastic_type": 5, "total_weight": 3005, "count": 21, "producer": 2}],
    //                 "c8w76ew8c76ewc876erw8c67w8ce67rwc7ercw67e",
    //                 "https://gateway.pinata.cloud/ipfs/QmVGvMygSFLkcLMKdVMnhhgVZ3s6fG9uXZAQAKzfEgu8Yr",
    //                 { from : reception1Account });
    // });

    // it('Should register delivery', async () => {
    //     await greenbackContract.regdelivery(
    //                 2222222,
    //                 picker2Account.name,
    //                 reception2Account.name,
    //                 0,
    //                 [{"item_id": 201, "plastic_type": 1, "total_weight": 4001.4, "count": 18, , "producer": 1},
    //                 {"item_id": 202, "plastic_type": 1, "total_weight": 4002, "count": 2, "producer": 1},
    //                 {"item_id": 203, "plastic_type": 5, "total_weight": 5001.5, "count": 45, "producer": 1},
    //                 {"item_id": 204, "plastic_type": 5, "total_weight": 5002, "count": 15, "producer": 2},
    //                 {"item_id": 205, "plastic_type": 9, "total_weight": 6004.6, "count": 8, "producer": 2},
    //                 {"item_id": 206, "plastic_type": 9, "total_weight": 6005, "count": 4, "producer": 2}],
    //                 "c8w76ew8c76ewc876erw8c67w8ce67rwc7ercw67e",
    //                 "https://gateway.pinata.cloud/ipfs/QmVGvMygSFLkcLMKdVMnhhgVZ3s6fG9uXZAQAKzfEgu8Yr",
    //                 { from : reception2Account });
    // });

    // it('Should adjust plastic weights', async () => {
    //     await greenbackContract.adjust(transfer1Account.name,
    //                                    reception1Account.name,
    //                                    [{"plastic_type": 1, "total_weight": -10}],
    //                                    { from: transfer1Account });
    // });

    // it('Should buy plastic', async () => {
    //     await greenbackContract.buyplastic(
    //                 customer11Account.name,
    //                 recycler1Account.name,
    //                 1,
    //                 1000,
    //                 { from: customer11Account });
    // });

    it('Should get all records from all tables', async () => {
        let result;

        result = await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: "deliveryhs",
            json: true,
            limit: 100,
        });

        console.log("\nDelivery headers");
        console.log(result);

        result = await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: "deliveryls",
            json: true,
            limit: 100,
        });

        console.log("\nDelivery lines");
        console.log(result);

        result = await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: "deliveryptws",
            json: true,
            limit: 100,
        });

        console.log("\nDelivery plastic total weights");
        console.log(result);

        result = await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: "plasticts",
            json: true,
            limit: 100,
        });

        console.log("\nPlastic types");
        console.log(result);

        result = await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: "receptions",
            json: true,
            limit: 100,
        });

        console.log("\nReception centers");
        console.log(result);

        result = await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: "recyclers",
            json: true,
            limit: 100,
        });

        console.log("\nRecyclers");
        console.log(result);

        result = await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: "pickers",
            json: true,
            limit: 100,
        });

        console.log("\nPickers");
        console.log(result);

        result = await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: "purchases",
            json: true,
            limit: 100,
        });

        console.log("\nPurchases");
        console.log(result);

        result = await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: "totplastics",
            json: true,
            limit: 100,
        });

        console.log("\nTotal plastic weights");
        console.log(result);

        result = await greenbackContract.provider.eos.getTableRows({
            code: greenbackContract.name,
            scope: greenbackContract.name,
            table: "producers",
            json: true,
            limit: 1000,
        });

        console.log("\nProducers");
        console.log(result);
    });

    it('Should get all balances', async () => {
        let tokenInit;
        let balance;

        tokenInit = await tokenContract.provider.eos.getCurrencyStats(tokenContract.name, TOKEN_SYMBOL);
        console.log("TOKEN INIT: " + JSON.stringify(tokenInit));

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, greenbackAccount.name, TOKEN_SYMBOL);
        console.log("balance [greenback]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, picker1Account.name, TOKEN_SYMBOL);
        console.log("balance [picker1]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, picker2Account.name, TOKEN_SYMBOL);
        console.log("balance [picker2]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, picker3Account.name, TOKEN_SYMBOL);
        console.log("balance [picker3]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, picker4Account.name, TOKEN_SYMBOL);
        console.log("balance [picker4]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, picker5Account.name, TOKEN_SYMBOL);
        console.log("balance [picker5]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, customer11Account.name, TOKEN_SYMBOL);
        console.log("balance [customer1]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, customer12Account.name, TOKEN_SYMBOL);
        console.log("balance [customer2]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, customer13Account.name, TOKEN_SYMBOL);
        console.log("balance [customer3]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, recycler1Account.name, TOKEN_SYMBOL);
        console.log("balance [recycler1]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, recycler3Account.name, TOKEN_SYMBOL);
        console.log("balance [recycler2]: " + balance);

        balance = await tokenContract.provider.eos.getCurrencyBalance(tokenContract.name, recycler3Account.name, TOKEN_SYMBOL);
        console.log("balance [recycler3]: " + balance);
    });

});
