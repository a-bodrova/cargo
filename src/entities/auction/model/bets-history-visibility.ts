/** hide_bets_history is duplicated on both the root response and trading — either one true hides the whole section and skips the listBets request. */
export function isBetsHistoryHidden(auction: { hide_bets_history: boolean; trading: { hide_bets_history: boolean } }): boolean {
  return auction.hide_bets_history === true || auction.trading.hide_bets_history === true
}
