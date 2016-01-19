//
// header-start
//////////////////////////////////////////////////////////////////////////////////
//
// \file      server/bootstrap.ts
//
// \brief     This file belongs to the ng2 tutorial project
//
// \author    Bernard
//
// \copyright Copyright ng2goodies 2015
//            Distributed under the MIT License
//            See http://opensource.org/licenses/MIT
//
//////////////////////////////////////////////////////////////////////////////////
// header-log
//
// $Author$
// $Date$
// $Revision$
//
//////////////////////////////////////////////////////////////////////////////////
// header-end
//
const express = require('express');
const morgan  = require('morgan');
const gpath   = require('path');

const base_dir = process.cwd();
const static_dir = gpath.resolve(base_dir, 'dist/client');
const index_file = gpath.resolve(static_dir, 'index.html');


const GPORT  = 8080;
const GURL   = 'http://localhost';

let error_url = '';

let app = express();
//app.use(morgan('tiny'));
app.use(express.static(static_dir));


//
// Additional web services goes here
//
app.get('/api/public/v1/errorurl', (req: any, res: any) => {
  console.log(`[INFO] Server special request: ${req.originalUrl}`);
  console.log(`[INFO] ... error url: ${error_url}`);
  if (error_url) {
    res.send(error_url);
  } else {
    res.send(null);
  }
  error_url = '';
});


//
// 404 catch
// 
app.all('*', (req: any, res: any) => {
  console.log(`[INFO] Server 404 request: ${req.originalUrl}`);
  //res.set({'Warning': req.originalUrl});
  error_url = req.originalUrl;
  res.status(200).sendFile(index_file);
});


app.listen(GPORT);
let msg = process.env.RESTART ? 'restarted' : 'started';
console.log(`[INFO] Server ${msg} at: ${GURL}:${GPORT}`);
console.log(`[INFO] Static directory is: ${static_dir}`);
