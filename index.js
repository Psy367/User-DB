const http = require('http');
const fs = require('fs/promises');
const url = require('url');
const path = require('path');
const formidable = require('formidable');
const psy367 = require('./psy367.js');
var form;
var users;
var ticket = {
    Username: false
};

http.createServer(async function (req, res) {
    function serve_html(html) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html);
        return(res.end())
    };
    console.log('Username: ' + ticket.Username);
    let address = url.parse(req.url, true);
    let ext = path.extname(address.pathname);
    if(ext) {
        if(ext ===  '.html') {
            res.writeHead(200, {'Content-Type': 'text/html'});
        } else if(ext ===  '.css') {
            res.writeHead(200, {'Content-Type': 'text/css'});
        } else if(ext ===  '.js') {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
        } else if(ext ===  '.jpg' && ticket.Username) {
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
        };
        res.write(await fs.readFile('./' + address.pathname));
        return(res.end())
    } else {
        if(address.pathname === '/login') {
            form = new formidable.IncomingForm();
            return(form.parse(req, async function(err, fields) {
                if(err) {
                    console.log(err);
                    return(serve_html(await fs.readFile('./index.html')))
                } else {
                    try {
                        let username = fields.username[0].toLowerCase();
                        let password = fields.password[0];
                        users = await fs.readdir('./users');
                        if(users.includes(username)) {
                            let user_ticket = JSON.parse(await fs.readFile(`./users/${username}/ticket.json`));
                            let compare = psy367.co_cipher(user_ticket.Password, user_ticket.Seed);
                            if(compare === password) {
                                console.log('password match');
                                ticket = JSON.parse(await fs.readFile(`./users/${username}/ticket.json`));
                                return(serve_html(psy367.welcome(ticket)))
                            } else {
                                return(serve_html(await fs.readFile('./incorrect-password.html')))
                            };
                        } else {
                            return(serve_html(await fs.readFile('./user-not-found.html')))
                        };
                    } catch(err) {
                        console.log(err);
                        return(serve_html(await fs.readFile('./user-not-found.html')))
                    };
                };
            }))
        } else if(address.pathname === '/create-user') {
            form = new formidable.IncomingForm();
            return(form.parse(req, async function(err, fields, files) {
                if(err) {
                    console.log(err);
                    return(serve_html(await fs.readFile('./index.html')))
                } else {
                    try {
                        await psy367.build_user(fields, files);
                        ticket = JSON.parse(await fs.readFile(`./users/${fields.username[0].toLowerCase()}/ticket.json`));
                        return(serve_html(psy367.welcome(ticket)))
                    } catch(err) {
                        console.log(err);
                        return(serve_html(await fs.readFile('./index.html')))
                    };
                };
            }))
        } else if(address.pathname ===  '/modify-style') {
            return(serve_html(psy367.modify_style(ticket)))
        } else if(address.pathname === '/update-style') {
            form = new formidable.IncomingForm();
            return(form.parse(req, async function(err, fields) {
                if(err) {
                    console.log(err);
                    return(serve_html(await fs.readFile('./index.html')))
                } else {
                    try{
                        await psy367.update_style(fields, ticket);
                    } catch(err) {
                        console.log(err);
                        return(serve_html(await fs.readFile('./index.html')))
                    };
                    return(serve_html(psy367.welcome(ticket)))
                };
            }))
        } else if(address.pathname === '/view-profile') {
            return(serve_html(psy367.view_profile(ticket)))
        } else if(address.pathname === '/update-profile') {
            form = new formidable.IncomingForm({allowEmptyFiles: true, minFileSize: 0});
            return(form.parse(req, async function(err, fields, files) {
                if(err) {
                    console.log(err);
                    return(serve_html(await fs.readFile('./index.html')))
                } else {
                    try {
                        await psy367.update_profile(fields, files, ticket);
                    } catch(err) {
                        console.log(err);
                        return(serve_html(await fs.readFile('./index.html')))
                    };
                    return(serve_html(psy367.welcome(ticket)))
                };
            }))
        } else {
            return(serve_html(await fs.readFile('./index.html')))
        };
    };
}).listen(8080);