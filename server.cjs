const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');
const livereload = require('livereload');
const connectLiveReload = require ('connect-livereload');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data');

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

// API: retrieve profile data
app.get('/api/profile', async (req, res) => {
  const profilePath = path.join(DATA_PATH, 'profile.json');

  try {
    const rawData = await fs.readFile(profilePath, 'utf8');
    res.json(JSON.parse(rawData));
  } catch (err) {
    res.status(500).json({ error: 'could not read profile.json' });
  }
});

// API: save profile data
app.post('/api/profile', async (req, res) => {
  const profilePath = path.join(DATA_PATH, 'profile.json');

  try {
    await fs.writeFile(profilePath, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'failed to write data' });
  }
});

// API: get list of available years and months
app.get('/api/listdata', async (req, res) => {
  try {
    const entries = await fs.readdir(DATA_PATH, {withFileTypes: true})
    const years = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    const yearsAndMonths = {};

    for (const year of years) {
      const yearPath = path.join(DATA_PATH, String(year));
      const entries = await fs.readdir(yearPath);
      const months = entries
        .filter(file => file.endsWith('.json'))
        .map(file => parseInt(file, 10))
        .filter(month => !isNaN(month))
        .sort((a, b) => a - b);

      yearsAndMonths[year] = months
    }
      
    res.json(yearsAndMonths);
  } catch (err) {
    res.status(500).json({ error: 'could not read data' });
  }
});

// API: get month of data
app.get('/api/data', async (req, res) => {
  const year = req.query.year;
  const month = req.query.month;
    
  const filePath = path.join(DATA_PATH, year.toString(), `${month.toString().padStart(2, '0')}.json`);

  try {
    const rawData = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(rawData));
  } catch (err) {
    res.status(500).json({ error:`'could not read ${filePath}` });
  }
});

// API: get month of data
app.post('/api/data', async (req, res) => {
  const year = req.query.year;
  const month = req.query.month;
    
  const filePath = path.join(DATA_PATH, year.toString(), `${month.toString().padStart(2, '0')}.json`);

  try {
    await fs.mkdir(path.dirname(filePath), {recursive: true});
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error:`'could not write ${filePath}` });
  }
});

// start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`App running at http://localhost:${PORT}`);
});