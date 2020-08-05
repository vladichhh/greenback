#include "greenback.hpp"

namespace greenbackproject
{

void greenback::regdelivery(uint64_t delivery_id, name picker, name reception, bool auto_filled, vector<item> items, string batch_hash, string ipfs_url, double total_weighted)
{
    require_auth(reception);

    auto iterDeliveries = deliveryhsTable.find(delivery_id);
    check(iterDeliveries == deliveryhsTable.end(), "delivery id already existing");

    auto iterPickers = pickersTable.find(picker.value);
    check(iterPickers != pickersTable.end(), "picker does not exist");

    auto iteratorReceptions = receptionsTable.find(reception.value);
    check(iteratorReceptions != receptionsTable.end(), "reception center does not exist");

    // set confirmed flag to false -> a new data is added but not transported yet
    receptionsTable.modify(iteratorReceptions, _self, [&](auto &r) {
        r.confirmed = false;
        r.total_weighted += total_weighted;
    });

    double tokensToMint = 0;
    double totalDeliveredWeight = 0;
    vector<uint64_t> rateByType;
    vector<double> weightByType;
    vector<uint64_t> countByType;

    rateByType.push_back(0);
    weightByType.push_back(0);
    countByType.push_back(0);

    // loads plastic rates by type
    for (auto itr = plasticTTable.begin(); itr != plasticTTable.end(); ++itr)
    {
        rateByType.push_back(itr->rate);
        weightByType.push_back(0);
        countByType.push_back(0);
    }

    // parse incoming data for delivered plastic by type and weight
    for (item i : items)
    {
        weightByType.at(i.plastic_type) += i.total_weight;
        countByType.at(i.plastic_type) += i.count;

        // add new record to deliveryls table
        deliverylsTable.emplace(_self, [&](auto &l) {
            l.id = deliverylsTable.available_primary_key();
            l.delivery_id = delivery_id;
            l.item_id = i.item_id;
            l.plastic_type = i.plastic_type;
            l.total_weight = i.total_weight;
            l.count = i.count;
        });

        // add/update total weight per plastic type and producer
        auto producers_index = producersTable.get_index<name("groupkey")>();
        auto group_producer_id = combine_ids(i.producer, i.plastic_type);
        auto itrProds = producers_index.find(group_producer_id);

        if (itrProds == producers_index.end())
        {
            producersTable.emplace(_self, [&](auto &p) {
                p.id = producersTable.available_primary_key();
                p.producer = i.producer;
                p.plastic_type = i.plastic_type;
                p.total_weight = i.total_weight;
                p.count = i.count;
            });
        }
        else
        {
            producers_index.modify(itrProds, _self, [&](auto &p) {
                p.total_weight += i.total_weight;
                p.count += i.count;
            });
        }
    }

    // calculate amount of GBT tokens to be minted
    for (auto i = 0; i < weightByType.size(); i++)
    {
        if (weightByType[i] > 0)
        {
            totalDeliveredWeight += weightByType[i];
            tokensToMint += weightByType[i] * rateByType[i];

            // add new record to deliverypwts table
            deliveryptwsTable.emplace(_self, [&](auto &p) {
                p.id = deliveryptwsTable.available_primary_key();
                p.delivery_id = delivery_id;
                p.plastic_type = i;
                p.total_weight = weightByType[i];
            });

            // add/update record for reception
            auto totplrecepts_index = totplasticsTable.get_index<name("groupkey")>();
            auto group_reception_id = combine_ids(reception.value, i);
            auto itrRecepts = totplrecepts_index.find(group_reception_id);

            if (itrRecepts == totplrecepts_index.end())
            {
                totplasticsTable.emplace(_self, [&](auto &r) {
                    r.id = totplasticsTable.available_primary_key();
                    r.account = reception.value;
                    r.plastic_type = i;
                    r.total_weight = weightByType[i];
                    r.count = countByType[i];
                });
            }
            else
            {
                totplrecepts_index.modify(itrRecepts, _self, [&](auto &p) {
                    p.total_weight += weightByType[i];
                    p.count += countByType[i];
                });
            }

            // add/update record for picker
            auto totplpickers_index = totplasticsTable.get_index<name("groupkey")>();
            auto group_picker_id = combine_ids(picker.value, i);
            auto itrPickers = totplpickers_index.find(group_picker_id);

            if (itrPickers == totplpickers_index.end())
            {
                totplasticsTable.emplace(_self, [&](auto &p) {
                    p.id = totplasticsTable.available_primary_key();
                    p.account = picker.value;
                    p.plastic_type = i;
                    p.total_weight = weightByType[i];
                    p.count = countByType[i];
                });
            }
            else
            {
                totplpickers_index.modify(itrPickers, _self, [&](auto &p) {
                    p.total_weight += weightByType[i];
                    p.count += countByType[i];
                });
            }
        }
    }

    // convert from tokens/grams to tokens/tons
    tokensToMint /= (1000 * 1000);

    // add new record deliveryhs table
    deliveryhsTable.emplace(_self, [&](auto &h) {
        h.delivery_id = delivery_id;
        h.picker = picker.value;
        h.reception = reception.value;
        h.date_added = current_time_point().sec_since_epoch();
        h.hasAI = auto_filled;
        h.total_minted_tokens = tokensToMint;
        h.batch_hash = batch_hash;
        h.ipfs_url = ipfs_url;
        h.total_weighted = total_weighted;
    });

    // update picker's total delivered amount
    auto iteratorPickers = pickersTable.find(picker.value);
    pickersTable.modify(iteratorPickers, _self, [&](auto &p) {
        p.total_delivered_weight += totalDeliveredWeight;
        p.total_minted_tokens += tokensToMint;
        p.total_weighted += total_weighted;
    });

    // issue calculated amount of GBT tokens
    issue_tokens(picker, asset(tokensToMint * 10000, symbol("GBT", 4)), "issue tokens");
}

void greenback::buyplastic(name buyer, name recycler, uint64_t plastic_type, double plastic_weight)
{
    require_auth(buyer);

    auto recycler_index = recyclersTable.get_index<name("accountkey")>();
    auto recycler_iterator = recycler_index.find(recycler.value);
    check(recycler_iterator != recycler_index.end(), "recycler does not exist");

    auto plastictype_iterator = plasticTTable.find(plastic_type);
    check(plastictype_iterator != plasticTTable.end(), "plastic type does not exist");

    auto recycler_pltype_index = recyclersTable.get_index<name("groupkey")>();
    auto group_id = combine_ids(recycler.value, plastic_type);
    auto recycler_pltype_iterator = recycler_pltype_index.find(group_id);

    check(recycler_pltype_iterator != recycler_pltype_index.end(), "recycler not operating with this plastic type");

    check(plastic_weight > 0, "plastic weight should be positive");

    auto plasticRate = plastictype_iterator->rate * 3;

    double weightInStock = 0;
    double weightSold = 0;

    // calculates weight of plastic in stock
    for (auto itr = receptionsTable.begin(); itr != receptionsTable.end(); ++itr)
    {
        auto totplrecepts_index = totplasticsTable.get_index<name("groupkey")>();
        auto group_reception_id = combine_ids(itr->account, plastic_type);
        auto itrRecept = totplrecepts_index.find(group_reception_id);

        if (itrRecept != totplrecepts_index.end())
        {
            weightInStock += itrRecept->total_weight;
        }
    }

    // calculates weight of sold plastic
    for (auto itr = purchasesTable.begin(); itr != purchasesTable.end(); ++itr)
    {
        if (itr->plastic_type == plastic_type)
        {
            weightSold += itr->total_weight;
        }
    }

    check(weightInStock >= (weightSold + plastic_weight), "not enought plastic weight in stock");

    // registers purchase
    purchasesTable.emplace(_self, [&](auto &p) {
        p.id = purchasesTable.available_primary_key();
        p.buyer = buyer.value;
        p.recycler = recycler.value;
        p.date_of_purchase = current_time_point().sec_since_epoch();
        p.plastic_type = plastic_type;
        p.total_weight = plastic_weight;
    });

    auto tokensToTransfer = (plastic_weight * plasticRate) / (1000 * 1000);

    // transfer calculated amount of GBT tokens
    transfer_tokens(buyer, recycler, asset(tokensToTransfer * 10000, symbol("GBT", 4)), "transfer tokens");
}

void greenback::adjust(name transfer, name reception, vector<adjustment> adjustments, double total_weighted)
{
    require_auth(transfer);

    auto iteratorReceptions = receptionsTable.find(reception.value);
    check(iteratorReceptions != receptionsTable.end(), "reception center does not exist");

    // set confirmed flag to true -> reception center data is transfered
    receptionsTable.modify(iteratorReceptions, _self, [&](auto &r) {
        r.confirmed = true;
        r.total_weighted += total_weighted;
    });

    // parse incoming data for adjusted weights by plastic type
    for (adjustment i : adjustments)
    {
        // add/update record for reception
        auto totplrecepts_index = totplasticsTable.get_index<name("groupkey")>();
        auto group_reception_id = combine_ids(reception.value, i.plastic_type);
        auto itrRecepts = totplrecepts_index.find(group_reception_id);

        totplrecepts_index.modify(itrRecepts, _self, [&](auto &p) {
            p.total_weight += i.total_weight;
        });
    }
}

void greenback::deldata(name account)
{
}

void greenback::addplastic(uint64_t id, string name, uint64_t rate)
{
    // only the contract's account (admin) is allowed to call this action
    require_auth(_self);

    auto iteratorPlasticTypes = plasticTTable.find(id);
    check(iteratorPlasticTypes == plasticTTable.end(), "plastic type already exists");

    plasticTTable.emplace(_self, [&](auto &s) {
        s.id = id;
        s.type = name;
        s.rate = rate;
    });
}

void greenback::addreception(name reception_account)
{
    // only the contract's account (admin) is allowed to call this action
    require_auth(_self);

    auto iteratorReceptions = receptionsTable.find(reception_account.value);
    check(iteratorReceptions == receptionsTable.end(), "reception center already exists");

    receptionsTable.emplace(_self, [&](auto &s) {
        s.account = reception_account.value;
    });
}

void greenback::addrecycler(name recycler_account, vector<uint64_t> plastic_types)
{
    // only the contract's account (admin) is allowed to call this action
    require_auth(_self);

    auto recycler_index = recyclersTable.get_index<name("accountkey")>();
    auto recycler_iterator = recycler_index.find(recycler_account.value);
    check(recycler_iterator == recycler_index.end(), "recycler already exists");

    for (auto i : plastic_types)
    {
        auto plastic_iterator = plasticTTable.find(i);

        if (plastic_iterator == plasticTTable.end())
        {
            continue;
        }

        auto recycler_pltype_index = recyclersTable.get_index<name("groupkey")>();
        auto group_id = combine_ids(recycler_account.value, i);
        auto recycler_pltype_iterator = recycler_pltype_index.find(group_id);

        if (recycler_pltype_iterator == recycler_pltype_index.end())
        {
            recyclersTable.emplace(_self, [&](auto &recycler) {
                recycler.id = recyclersTable.available_primary_key();
                recycler.account = recycler_account.value;
                recycler.plastic_type = i;
            });
        }
    }
}

void greenback::addpicker(name picker_account)
{
    // only the contract's account (admin) is allowed to call this action
    require_auth(_self);

    auto iteratorPickers = pickersTable.find(picker_account.value);
    check(iteratorPickers == pickersTable.end(), "picker already exists");

    pickersTable.emplace(_self, [&](auto &s) {
        s.account = picker_account.value;
    });
}

void greenback::issue_tokens(name to, asset quantity, string memo)
{
    token::issue_action issue("eosio.token"_n, {get_self(), "active"_n});
    issue.send(to, quantity, memo);
}

void greenback::transfer_tokens(name from, name to, asset quantity, string memo)
{
    token::transfer_action transfer("eosio.token"_n, {from, "active"_n});
    transfer.send(from, to, quantity, memo);
}

} // namespace greenbackproject

EOSIO_DISPATCH(greenbackproject::greenback, (regdelivery)(buyplastic)(adjust)(deldata)(addplastic)(addreception)(addrecycler)(addpicker))
