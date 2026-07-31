import { getAuctionHandler } from './auctions.show'
import { setBetHandler, listBetsHandler } from './auctions.bets'
import { listAuctionsHandler } from './auctions.list'

export const handlers = [listAuctionsHandler, getAuctionHandler, listBetsHandler, setBetHandler]
