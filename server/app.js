const express = require('express');
const http = require('http');
const app = express();
const port = 3000;
const cors = require('cors')
const router = require('./routers');
const { initSocket } = require('./socket');
const { closeEndedAuctions, openStartedAuctions } = require('./jobs/closeAuctions');
const cron = require('node-cron');


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const httpServer = http.createServer(app);

const io = initSocket(httpServer);
app.set('io', io);

app.use(router)

cron.schedule('*/30 * * * * *', () => {
  openStartedAuctions(io).catch((err) => console.log('[cron] error:', err));
  closeEndedAuctions(io).catch((err) => console.log('[cron] error:', err));
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});