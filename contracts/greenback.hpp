#include <eosio/eosio.hpp>
#include <eosio/system.hpp>
#include "eosio.token.hpp"
#include <string>

namespace greenbackproject
{
using namespace eosio;
using std::map;
using std::string;
using std::vector;

class[[eosio::contract("greenback")]] greenback : public contract
{
public:
    using contract::contract;

    greenback(name receiver, name code, datastream<const char *> ds) : contract(receiver, code, ds),
                                                                       deliveryhsTable(receiver, code.value),
                                                                       deliverylsTable(receiver, code.value),
                                                                       deliveryptwsTable(receiver, code.value),
                                                                       plasticTTable(receiver, code.value),
                                                                       receptionsTable(receiver, code.value),
                                                                       recyclersTable(receiver, code.value),
                                                                       pickersTable(receiver, code.value),
                                                                       purchasesTable(receiver, code.value),
                                                                       totplasticsTable(receiver, code.value),
                                                                       producersTable(receiver, code.value)
    {
    }

    struct item
    {
        uint64_t item_id;
        uint64_t plastic_type;
        double total_weight;
        uint64_t count;
        uint64_t producer;
    };

    struct adjustment
    {
        uint64_t plastic_type;
        double total_weight;
    };

    // Delivery Header Table
    struct [[eosio::table]] deliveryh
    {
        uint64_t delivery_id;
        uint64_t picker;
        uint64_t reception;
        uint64_t date_added;
        bool hasAI;
        double total_minted_tokens;
        string batch_hash;
        string ipfs_url;
        double total_weighted;

        uint64_t primary_key() const { return delivery_id; }
        uint64_t picker_key() const { return picker; }
        uint64_t reception_key() const { return reception; }
        uint64_t date_key() const { return date_added; }
    };
    typedef eosio::multi_index<"deliveryhs"_n, deliveryh,
        eosio::indexed_by<"pickerkey"_n, eosio::const_mem_fun<deliveryh, uint64_t, &deliveryh::picker_key>>,
        eosio::indexed_by<"receptionkey"_n, eosio::const_mem_fun<deliveryh, uint64_t, &deliveryh::reception_key>>,
        eosio::indexed_by<"datekey"_n, eosio::const_mem_fun<deliveryh, uint64_t, &deliveryh::date_key>>> deliveryhs;
    deliveryhs deliveryhsTable;

    // Delivery Line Table
    struct [[eosio::table]] deliveryl
    {
        uint64_t id;
        uint64_t delivery_id;
        uint64_t item_id;
        uint64_t plastic_type;
        double total_weight;
        uint64_t count;

        uint64_t primary_key() const { return id; }
        uint64_t delivery_key() const { return delivery_id; }
        uint64_t item_key() const { return item_id; }
        uint64_t pltype_key() const { return plastic_type; }
    };
    typedef eosio::multi_index<"deliveryls"_n, deliveryl,
        eosio::indexed_by<"deliverykey"_n, eosio::const_mem_fun<deliveryl, uint64_t, &deliveryl::delivery_key>>,
        eosio::indexed_by<"itemkey"_n, eosio::const_mem_fun<deliveryl, uint64_t, &deliveryl::item_key>>,
        eosio::indexed_by<"pltypekey"_n, eosio::const_mem_fun<deliveryl, uint64_t, &deliveryl::pltype_key>>> deliveryls;
    deliveryls deliverylsTable;

    // Delivery Plastics Total Weight
    struct [[eosio::table]] deliveryptw
    {
        uint64_t id;
        uint64_t delivery_id;
        uint64_t plastic_type;
        double total_weight;

        uint64_t primary_key() const { return id; }
        uint64_t delivery_key() const { return delivery_id; }
    };
    typedef eosio::multi_index<"deliveryptws"_n, deliveryptw,
        eosio::indexed_by<"deliverykey"_n, eosio::const_mem_fun<deliveryptw, uint64_t, &deliveryptw::delivery_key>>> deliveryptws;
    deliveryptws deliveryptwsTable;

    // Plastic Types Table
    struct [[eosio::table]] plastict
    {
        uint64_t id;
        string type;
        uint64_t rate;

        uint64_t primary_key() const { return id; }
    };
    typedef eosio::multi_index<"plasticts"_n, plastict> plasticts;
    plasticts plasticTTable;

    struct [[eosio::table]] reception
    {
        uint64_t account;
        bool confirmed;
        double total_weighted;

        uint64_t primary_key() const { return account; }
    };
    typedef eosio::multi_index<"receptions"_n, reception> receptions;
    receptions receptionsTable;

    struct [[eosio::table]] recycler
    {
        uint64_t id;
        uint64_t account;
        uint64_t plastic_type;

        uint64_t primary_key() const { return id; }
        uint64_t account_key() const { return account; }
        uint64_t pltype_key() const { return plastic_type; }
        uint128_t group_key() const { return combine_ids(account, plastic_type); }

    };
    typedef eosio::multi_index<"recyclers"_n, recycler,
        eosio::indexed_by<"accountkey"_n, eosio::const_mem_fun<recycler, uint64_t, &recycler::account_key>>,
        eosio::indexed_by<"pltypekey"_n, eosio::const_mem_fun<recycler, uint64_t, &recycler::pltype_key>>,
        eosio::indexed_by<"groupkey"_n, eosio::const_mem_fun<recycler, uint128_t, &recycler::group_key>>> recyclers;
    recyclers recyclersTable;

    struct [[eosio::table]] picker
    {
        uint64_t account;
        double total_delivered_weight;
        double total_minted_tokens;
        double total_weighted;

        uint64_t primary_key() const { return account; }
    };
    typedef eosio::multi_index<"pickers"_n, picker> pickers;
    pickers pickersTable;

    struct [[eosio::table]] purchase
    {
        uint64_t id;
        uint64_t buyer;
        uint64_t recycler;
        uint64_t date_of_purchase;
        uint64_t plastic_type;
        double total_weight;

        uint64_t primary_key() const { return id; }
        uint64_t buyer_key() const { return buyer; }
        uint64_t recycler_key() const { return recycler; }
        uint64_t date_key() const { return date_of_purchase; }
        uint64_t pltype_key() const { return plastic_type; }
    };
    typedef eosio::multi_index<"purchases"_n, purchase,
        eosio::indexed_by<"buyerkey"_n, eosio::const_mem_fun<purchase, uint64_t, &purchase::buyer_key>>,
        eosio::indexed_by<"recyclerkey"_n, eosio::const_mem_fun<purchase, uint64_t, &purchase::recycler_key>>,
        eosio::indexed_by<"datekey"_n, eosio::const_mem_fun<purchase, uint64_t, &purchase::date_key>>,
        eosio::indexed_by<"pltypekey"_n, eosio::const_mem_fun<purchase, uint64_t, &purchase::pltype_key>>> purchases;
    purchases purchasesTable;

    struct [[eosio::table]] totplastic
    {
        uint64_t id;
        uint64_t account;
        uint64_t plastic_type;
        double total_weight;
        uint64_t count;

        uint64_t primary_key() const { return id; }
        uint64_t account_key() const { return account; }
        uint64_t pltype_key() const { return plastic_type; }
        uint128_t group_key() const { return combine_ids(account, plastic_type); }
    };
    typedef eosio::multi_index<"totplastics"_n, totplastic,
        eosio::indexed_by<"accountkey"_n, eosio::const_mem_fun<totplastic, uint64_t, &totplastic::account_key>>,
        eosio::indexed_by<"pltypekey"_n, eosio::const_mem_fun<totplastic, uint64_t, &totplastic::pltype_key>>,
        eosio::indexed_by<"groupkey"_n, eosio::const_mem_fun<totplastic, uint128_t, &totplastic::group_key>>> totplastics;
    totplastics totplasticsTable;

    struct [[eosio::table]] producer
    {
        uint64_t id;
        uint64_t producer;
        uint64_t plastic_type;
        double total_weight;
        uint64_t count;

        uint64_t primary_key() const { return id; }
        uint64_t producer_key() const { return producer; }
        uint64_t pltype_key() const { return plastic_type; }
        uint128_t group_key() const { return combine_ids(producer, plastic_type); }
    };
    typedef eosio::multi_index<"producers"_n, producer,
        eosio::indexed_by<"producerkey"_n, eosio::const_mem_fun<producer, uint64_t, &producer::producer_key>>,
        eosio::indexed_by<"pltypekey"_n, eosio::const_mem_fun<producer, uint64_t, &producer::pltype_key>>,
        eosio::indexed_by<"groupkey"_n, eosio::const_mem_fun<producer, uint128_t, &producer::group_key>>> producers;
    producers producersTable;

    // Register a new delivery. Only a reception centre should be allowed to call this action
    [[eosio::action]] void regdelivery(uint64_t delivery_id, name picker, name reception, bool auto_filled, vector<item> items, string batch_hash, string ipfs_url, double total_weighted);

    // End-customer buys recycled plastic
    [[eosio::action]] void buyplastic(name buyer, name recycler, uint64_t plastic_type, double plastic_weight);

    // Adjust reception centre's plastic weights
    [[eosio::action]] void adjust(name transfer, name reception, vector<adjustment> adjustments, double total_weighted);

    // Delete data after a customer buy plastic
    [[eosio::action]] void deldata(name account);

    // Only the admin is allowed to call this action
    [[eosio::action]] void addplastic(uint64_t id, string name, uint64_t rate);

    // Only the admin is allowed to call this action
    [[eosio::action]] void addreception(name reception_account);

    // Only the admin is allowed to call this action
    [[eosio::action]] void addrecycler(name recycler_account, vector<uint64_t> plastic_types);

    // Only the admin is allowed to call this action
    [[eosio::action]] void addpicker(name picker_account);

    static uint128_t combine_ids(const uint64_t &x, const uint64_t &y)
    {
        return (uint128_t{x} << 64) | y;
    }

    using regdelivery_action = eosio::action_wrapper<"regdelivery"_n, &greenback::regdelivery>;
    using buyplastic_action = eosio::action_wrapper<"buyplastic"_n, &greenback::buyplastic>;
    using adjust_action = eosio::action_wrapper<"adjust"_n, &greenback::adjust>;
    using deldata_action = eosio::action_wrapper<"deldata"_n, &greenback::deldata>;
    using addplastic_action = eosio::action_wrapper<"addplastic"_n, &greenback::addplastic>;
    using addreception_action = eosio::action_wrapper<"addreception"_n, &greenback::addreception>;
    using addrecycler_action = eosio::action_wrapper<"addrecycler"_n, &greenback::addrecycler>;
    using addpicker_action = eosio::action_wrapper<"addpicker"_n, &greenback::addpicker>;

private:
    void issue_tokens(name to, asset quantity, string memo);
    void transfer_tokens(name from, name to, asset quantity, string memo);
};

} // namespace greenbackproject
