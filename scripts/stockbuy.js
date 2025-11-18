/**
 * Copyright (C) 2022 Duck McSouls
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Purchase shares of a stock.
 *
 * @param ns The Netscript API.
 * @param stk We want to purchase shares of this stock.
 */
function buy_stock(ns, stk) {
    // Do we skip buying shares of this stock?
    if (skip_stock(ns, stk)) {
        return;
    }
    // Purchase shares of a stock.  Cannot use getAskPrice() or getPrice()
    // without TIX API access.  So hard-code the value instead.
    const nshare = 100;
    ns.stock.buyStock(stk, nshare);
}

/**
 * Whether we have sufficient funds for puchasing stocks.  This function
 * takes into account the minimum amount of money that should be held in
 * reserve whenever we trade on the Stock Market.
 *
 * @param ns The Netscript API.
 * @return true if we have enough money to buy stocks; false otherwise.
 */
function has_funds(ns) {
    const multiplier = 1.1;
    const money = ns.getServerMoneyAvailable("home");
    if (money <= multiplier * money_reserve()) {
        return false;
    }
    return true;
}

/**
 * The minimum amount of money we should always have in reserve.  Whenever we
 * trade on the Stock Market, we don't want to spend all our money on buying
 * stocks.  Have at least some money lying around for various purposes, e.g.
 * purchase/upgrade servers and purchase/upgrade Hacknet nodes.
 *
 * @return The minimum amount of money to be held in reserve.
 */
function money_reserve() {
    const million = 1000000;
    return 50 * million;
}

/**
 * Whether to skip buying shares of a stock.
 *
 * @param ns The Netscript API.
 * @param stk Do we want to skip over this stock?
 * @return true if we are to skip this stock; false otherwise.
 */
function skip_stock(ns, stk) {
    const SKIP = true;
    const NO_SKIP = !SKIP;
    // Skip if we cannot afford to purchase any shares of the stock.
    if (!has_funds(ns)) {
        return SKIP;
    }
    return NO_SKIP;
}

/**
 * Automate our trading on the World Stock Exchange.  This is our trade bot.
 * Require TIX API access to automate the buying of stocks.
 *
 * @param ns The Netscript API.
 */
export async function main(ns) {
    // Make the log less verbose.
    ns.disableLog("sleep");
    ns.disableLog("getServerMoneyAvailable");
    // Wait for 6 seconds because the Stock Market updates approximately
    // every 6 seconds.
    const time = 6 * 1000;
    // Continuously trade on the Stock Market.
    const stock_symbol = ["ECP", "BLD", "KGI"];
    while (true) {
        // Iterate over each stock.  Decide whether to buy or sell.
        for (const stk of stock_symbol) {
            buy_stock(ns, stk);
        }
        await ns.sleep(time);
    }
}