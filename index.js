const http = require('http');
const fs = require('fs/promises');
const url = require('url');
const path = require('path');
const formidable = require('formidable');
const psy367 = require('./psy367.js');
const CoCipher = require('./CoCipher.js');

var form;
var user_ticket;
var users;

http.createServer(async function (req, res) {
    let q = url.parse(req.url, true);
    let ext = path.extname(q.pathname);
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
        res.write(await fs.readFile('./' + q.pathname));
        return(res.end())
    } else {
        if(q.pathname === '/login') {
            form = new formidable.IncomingForm();
            return(form.parse(req, async function(err, fields) {
                if(err) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(err.toString());
                    return(res.end());
                } else {
                    let username = fields.username[0].toLowerCase();
                    let password = fields.password[0];
                    users = await fs.readdir('./users');
                    if(users.includes(username)) {
                        user_ticket = JSON.parse(await fs.readFile(`./users/${username}/ticket.json`));
                        if(CoCipher(user_ticket.password, user_ticket.seed) === password) {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.write(await fs.readFile(`./users/${username}/welcome.html`));
                            return(res.end())
                        } else {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.write(await fs.readFile('./incorrect-password.html'));
                            return(res.end())
                        };
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(await fs.readFile('./user-not-found.html'));
                        return(res.end())
                    };
                };
            }))
        } else if(q.pathname === '/create-user') {
            form = new formidable.IncomingForm();
            return(form.parse(req, async function(err, fields, files) {
                if(err) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(err.toString());
                    return(res.end());
                } else {
                    let username =  fields.username[0].toLowerCase();
                    let password =  fields.password[0];
                    let display_name =  fields.display_name[0];
                    let first_name =  fields.first_name[0];
                    let middle_name =  fields.middle_name[0];
                    let surname =  fields.surname[0];
                    let email =  fields.email[0];
                    let birth_date = fields.birth_date;
                    let bio =  fields.bio[0];
                    let profile_pic = files.profile_pic[0];
                    await psy367(email, username, password, Math.round(Math.random() * 1000) + 1, first_name, middle_name, surname, display_name, birth_date, bio, profile_pic);
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(await fs.readFile(`./users/${username}/welcome.html`));
                    return(res.end())
                };
            }))
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(await fs.readFile('./index.html'));
            return(res.end())
        };
    };
}).listen(8080);
