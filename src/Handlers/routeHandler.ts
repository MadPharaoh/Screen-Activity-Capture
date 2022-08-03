import express from 'express'
import path from 'path';
import os from 'os';

export let router = express.Router();

router.get('/', function(_req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'))
})
router.get(`/${os.hostname}`, function(_req, res) {
  res.sendFile(path.join(__dirname, './public/user.html'))
})
router.get(`/${os.hostname()}/Logs`, function(_req, res) {
  res.sendFile(path.join(__dirname, './public/archive.html'))
})
