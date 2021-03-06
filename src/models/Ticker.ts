export type TickerData = {
    BID: number;
    BID_SIZE: number;
    ASK: number;
    ASK_SIZE: number;
    DAILY_CHANGE: number;
    DAILY_CHANGE_RELATIVE: number;
    LAST_PRICE: number;
    VOLUME: number;
    HIGH: number;
    LOW: number;
    CHANNEL_ID: number | null;
  };