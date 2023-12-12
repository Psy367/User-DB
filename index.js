const http = require('http');
const fs = require('fs/promises');
const url = require('url');
const path = require('path');
const formidable = require('formidable');
const psy367 = require('./psy367.js');//ARGS: email, username, password, seed, fn, mn, s, dn, birth_date, bio, img;
const CoCipher = require('./CoCipher.js');//ARGS: password, seed;

var form;
var user_ticket;

http.createServer(async function (req, res) {
    let q = url.parse(req.url, true);
    let ext = path.extname(q.pathname);
    let write;
    if(ext) {
        if(ext ===  '.html') {
            res.writeHead(200, {'Content-Type': 'text/html'});
        } else if(ext ===  '.css') {
            res.writeHead(200, {'Content-Type': 'text/css'});
        } else if(ext ===  '.js') {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
        } else if(ext ===  '.jpg') {
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
        };
        write = await fs.readFile('./' + q.pathname);
    } else {
        if(q.pathname === '/login') {
            form = new formidable.IncomingForm();
            form.parse(req, async function(err, fields) {
                if(err) {
                    write = err;
                } else {
                    let username = fields.username[0].toLowerCase();
                    let password = fields.password[0];
                    files = await fs.readdir('./users');
                    console.log(`login = users: ${files}; user: ${username};`);
                    if(files.includes(username)) {
                        write = await fs.readFile(`./users/${username}/ticket.json`);
                        user_ticket = JSON.parse(write);
                        if(CoCipher(user_ticket.password, user_ticket.seed) === password) {
                            write = await fs.readFile(`./users/${username}/welcome.html`);
                        } else {
                            write = await fs.readFile('./incorrect-password.html');
                        };
                    } else {
                        write = await fs.readFile('./user-not-found.html');
                    };
                };
            });
        } else if(q.pathname === '/create-user') {
            form = new formidable.IncomingForm();
            form.parse(req, async function(err, fields, files) {
                if(err) {
                    write = err.toString();
                } else {
                    let username =  fields.username[0].toLowerCase();
                    let password =  fields.password[0];
                    let display_name =  fields.display_name[0];
                    let first_name =  fields.first_name[0];
                    let middle_name =  fields.middle_name[0];
                    let surname =  fields.surname[0];
                    let email =  fields.email[0];
                    let bd = fields.birth_date.join('').split('-');
                    let birth_date = {
                        year: bd[0],
                        month: bd[1],
                        day: bd[2]
                    };
                    let bio =  fields.bio[0];
                    let profile_pic = files.profile_pic[0];
                    psy367(email, username, password, Math.round(Math.random() * 1000) + 1, first_name, middle_name, surname, display_name, birth_date, bio, profile_pic);
                    write = await fs.readFile(`./users/${username}/welcome.html`);
                };
            });
        } else {
            write = await fs.readFile('./index.html');
        };
        res.writeHead(200, {'Content-Type': 'text/html'});
    };
    res.write(write.toString());
    return(res.end());
}).listen(8080);