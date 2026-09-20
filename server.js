const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');
const livereload = require('livereload');
const connectLiveReload = require ('connect-livereload');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data', 'budget.json');

// set up live reload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use('/js/chart.js', express.static(path.join(__dirname, 'node_modules/chart.js/dist/chart.umd.min.js')));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font/fonts')));
app.use(connectLiveReload());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: retrieve data
app.get('/api/budget', async (req, res) => {
  try {
    const rawData = await fs.readFile(DATA_PATH, 'utf8');
    res.json(JSON.parse(rawData));
  } catch (err) {
    res.status(500).json({ error: 'could not read budget.json' });
  }
});

// API: save data
app.post('/api/budget', async (req, res) => {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'failed to write data' });
  }
});

// start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`App running at http://localhost:${PORT}`);
});