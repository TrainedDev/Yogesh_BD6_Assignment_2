const express = require("express");
const { getAllStocks, getShowByTicker, addNewTrade } = require("./controller");
const app = express();
app.use(express.json());

app.get("/stocks", async (req, res) => {
    const data = await getAllStocks();
    if (!data) return res.send("Not Found");
    res.status(200).json(data);
  });
  
  app.get("/stocks/:ticker", async (req, res) => {
    const { ticker } = req.params;
    const data = await getShowByTicker(ticker);
    if (!data || data.length === 0) return res.status(404).json("Not Found");
    res.status(200).json(data);
  });
 

  const validTrade = (trade) => {
    if( !trade || typeof trade.stockId !== 'number')  return 'Provide Correct Details and it should be integer'
    if( !trade || typeof trade.quantity !== 'number')  return 'Provide Correct Details and it should be integer'
     if( !trade || typeof trade.tradeType !== 'string') return 'Provide Correct Details and it should be string'
     if( !trade || typeof trade.tradeDate !== 'string')  return 'Provide Correct Details and it should be string'

     return null;
  }
  
  app.post("/trades", async (req, res) => {
    const newTrade = req.body;
    const error = validTrade(newTrade);

    if(error) return error;

    const data = await addNewTrade(newTrade);
    if (!data) return res.json("Not Found");
    res.status(200).json(data);
  });

  app.get("/", (req, res) => res.send("Server Is Live"));

  module.exports = { app, validTrade };
  