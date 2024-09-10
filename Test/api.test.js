const request = require("supertest");
const http = require("http");
const { getAllStocks, getShowByTicker, addNewTrade } = require("../controller");
const { app, validTrade } = require("../index");

jest.mock("../controller", () => ({
    ...jest.requireActual("../controller"),
    getAllStocks: jest.fn(),
    getShowByTicker: jest.fn(),
    addNewTrade: jest.fn(),
}));

let server;

beforeAll((done) => {
    server = http.createServer(app);
    server.listen(3001, done);
});

afterAll((done) => {
    server.close(done);
});

// 1. Testing All Endpoints
describe("Testing All endpoints", () => {
    it("Should return all stocks", async () => {
        const stocks = [
            { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
            { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
            { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
          ];

        getAllStocks.mockResolvedValue(stocks); 

        const res = await request(server).get("/stocks");
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(stocks);
    });

    it("Should get stocks by their ticker", async () => {
        const stocks =  { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 };

        getShowByTicker.mockResolvedValue(stocks); 

        const res = await request(server).get("/stocks/AAPL");
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(stocks);
    });

    it("Should add new trade", async () => {
        const newTrade = {
            'tradeId': 4,
            'stockId': 1,
            'quantity': 15,
            'tradeType': 'buy',
            'tradeDate': '2024-08-08'
          };

        addNewTrade.mockResolvedValue(newTrade); 

        const res = await request(server).post("/trades").send({
            'stockId': 1,
            'quantity': 15,
            'tradeType': 'buy',
            'tradeDate': '2024-08-08'
          });
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(newTrade);
    });
});

// 2. Error Handling
describe("Handling Error", () => {
    it("Should return 404 when getting stocks by ticker", async () => {
        getShowByTicker.mockResolvedValue(null);

        const res = await request(server).get("/stocks/jdks");
        expect(res.status).toEqual(404);
    });
});

// 3. Input Validation
describe("Testing if input is valid", () => {
    it("Should validate show input", () => {
        expect(validTrade({
            'stockId': 1,
            'quantity': 15,
            'tradeType': 'buy',
            'tradeDate': '2024-08-08'
          })).toBeNull();
       
        expect(validTrade({
            'quantity': 15,
            'tradeType': 'buy',
            'tradeDate': '2024-08-08'
          })).toEqual('Provide Correct Details and it should be integer');

        expect(validTrade({
            'stockId': 1,
            'tradeType': 'buy',
            'tradeDate': '2024-08-08'
          })).toEqual('Provide Correct Details and it should be integer');

        expect(validTrade({
            'stockId': 1,
            'quantity': 15,
            'tradeDate': '2024-08-08'
          })).toEqual('Provide Correct Details and it should be string');

        expect(validTrade({
            'stockId': 1,
            'quantity': 15,
            'tradeType': 'buy',
          })).toEqual('Provide Correct Details and it should be string');

      
    });
});

// 4. Check Function
describe("Testing Functions", () => {
    it("Should return all stocks", () => {
        const stocks = [
            { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
            { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
            { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
          ];

        getAllStocks.mockReturnValue(stocks); 

        expect(getAllStocks()).toEqual(stocks);
        expect(getAllStocks().length).toBe(3);
    });
});

// 5. Mock async
describe("Testing Mock API", () => {
    beforeEach(() => jest.clearAllMocks());

    it("Should add new trade", async () => {
        const mockTrade = {
            'tradeId': 4,
            'stockId': 1,
            'quantity': 15,
            'tradeType': 'buy',
            'tradeDate': '2024-08-08'
          };

        addNewTrade.mockResolvedValue(mockTrade);

        const res = await request(server).post("/trades").send({
            'stockId': 1,
            'quantity': 15,
            'tradeType': 'buy',
            'tradeDate': '2024-08-08'
          });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual(mockTrade);
    });
});
