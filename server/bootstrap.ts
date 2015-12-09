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
import * as express       from 'express';
import * as morgan        from 'morgan';
import * as path          from 'path';
import * as fs            from 'fs';


const base_dir = process.cwd();
const static_dir = path.resolve(base_dir, 'dist/client');
const index_file = path.resolve(static_dir, 'index.html');


let PORT  = 8080;
let URL   = 'http://localhost';

let app = express();
app.use(morgan('dev'));
app.use(express.static(static_dir));

//
// Additional web services goes here
//

//
// 404 catch
// 
app.all('*', (req, res) => {
  res.status(200).sendFile(index_file);
});


app.listen(PORT);
console.log(`[INFO] Server started at: ${URL}:${PORT}`);
console.log(`[INFO] Static directory is: ${static_dir}`);
