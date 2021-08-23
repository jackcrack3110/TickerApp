import "./styles.css";
import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
import { TickerData } from "../../models/Ticker";

export default function Ticker() {
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(
      "wss://api-pub.bitfinex.com/ws/2",
      {
        shouldReconnect() {
          return true;
        }
      }
    );
    const [tickerData, setTickerData] = useState<TickerData | null>();
    useEffect(() => {
      // this will run ONLY ONCE when the component first renders
      sendJsonMessage({
        event: "subscribe",
        channel: "ticker",
        symbol: "tBTCUSD"
      });
    }, [sendJsonMessage]);
  
    useEffect(() => {
      if (!Array.isArray(lastJsonMessage)) {
        return;
      }
      const [CHANNEL_ID, hbOrTradingPairs]: readonly [
        number,
        (
          | string
          | [
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number
            ]
        )
      ] = lastJsonMessage as [any, any];
  
      if (typeof hbOrTradingPairs === "string") {
        return;
      } else {
        const [
          BID,
          BID_SIZE,
          ASK,
          ASK_SIZE,
          DAILY_CHANGE,
          DAILY_CHANGE_RELATIVE,
          LAST_PRICE,
          VOLUME,
          HIGH,
          LOW
        ] = hbOrTradingPairs;
  
        setTickerData({
          BID,
          BID_SIZE,
          ASK,
          ASK_SIZE,
          DAILY_CHANGE,
          DAILY_CHANGE_RELATIVE,
          LAST_PRICE,
          VOLUME,
          HIGH,
          LOW,
          CHANNEL_ID
        });
      }
    }, [lastJsonMessage]);
    const change = Math.abs(tickerData?.DAILY_CHANGE!);
  
    return (
      <div className="ContentWrapperRow">
        <div className="rewardKYCBlock">
          <div className="spaceBetween">
            <div>
              {" "}
              <img
                src="https://static.bitfinex.com/images/icons/BTC-alt.svg"
                className="tickerIcon"
                alt="tickerImage"
              />
            </div>
          </div>
          <div className="spaceBetween">
            <div className="tickerItems">
              <div>
                <h5>
                  <span className="btcUSD">
                    <span>BTC</span>
                    <span className="lightenText">/</span>
                    <span>USD</span>
                  </span>
                </h5>
              </div>
            </div>
            <div className="tickerItems">
              <h5>
                <div>{tickerData?.BID.toLocaleString("en-US")}</div>
              </h5>
            </div>
          </div>
          <div className="spaceBetween">
            <div className="tickerItems">
              <h5>
                <span className="lightenText">VOL</span>
                <span style={{ marginLeft: "5px" }}>
                  {tickerData?.VOLUME.toFixed(2)}
                </span>
                <span
                  style={{ marginLeft: "3px", textDecoration: "underline" }}
                  className="lightenText"
                >
                  BTC
                </span>
              </h5>
            </div>
            <div className="tickerItems">
              <h5>
                {Math.sign(tickerData?.DAILY_CHANGE_RELATIVE!) === 1 && (
                  <span className="greenText">
                    <span>{change.toLocaleString("en-US")}</span>(
                    {(tickerData?.DAILY_CHANGE_RELATIVE! * 100).toFixed(2)}%)
                  </span>
                )}
                {Math.sign(tickerData?.DAILY_CHANGE_RELATIVE!) === -1 && (
                <span className="redText">
                  <span>{change.toLocaleString("en-US")}</span>(
                  {(tickerData?.DAILY_CHANGE_RELATIVE! * 100).toFixed(2)}%)
                </span>
              )}
              </h5>
            </div>
          </div>
          <div className="spaceBetween">
            <div className="tickerItems">
              <div>
                <h5>
                  <span>
                    <span>LOW</span>
                    <span style={{ marginLeft: "3px" }}>
                      {tickerData?.LOW.toLocaleString("en-US")}
                    </span>
                  </span>
                </h5>
              </div>
            </div>
            <div className="tickerItems">
              <div>
                <h5>
                  <span>
                    <span>HIGH</span>
                    <span style={{ marginLeft: "3px" }}>
                      {tickerData?.HIGH.toLocaleString("en-US")}
                    </span>
                  </span>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  