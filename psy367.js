//psy367 will lead robots to victory!!!
async function build_user(fields, files) {
    let username =  fields.username[0].toLowerCase();
    let password =  fields.password[0];
    let display_name =  fields.display_name[0];
    let first_name =  fields.first_name[0];
    let middle_name =  fields.middle_name[0];
    let surname =  fields.surname[0];
    let email =  fields.email[0];
    let birth_date =  fields.birth_date;
    let bio =  fields.bio[0];
    let profile_pic = files.profile_pic[0];
    let seed = Math.round(Math.random() * 999) + 1;
    const fs = require('fs/promises');
    let date = new Date();
    let bd = birth_date.join('').split('-');
    const user = {
        Created: {
            Day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
            Date: date.getDate(),
            Month: date.getMonth() + 1,
            Year: date.getFullYear()
        },
        FirstName: first_name,
        MiddleName: middle_name,
        Surname: surname,
        DisplayName: display_name,
        BirthDate: {
            Year: +bd[0],
            Month: +bd[1],
            Day: +bd[2]
        },
        Email: email.toLowerCase(),
        Username: username.toLowerCase(),
        Password: escape(co_cipher(password, seed)),
        Seed: seed,
        Bio: bio,
        Styles: {
            BackgroundColor: '#ffffff',
            Heading1Color: '#000000',
            Heading2Color: '#000000',
            BioColor: '#000000'
        }
    };
    let users = await fs.readdir('./users');
    if(users.includes(user.Username)) {
        console.log('user already exists');
    } else {
        await fs.mkdir('./users/' + user.Username);
        await fs.rename(profile_pic.filepath, `./users/${user.Username}/profile-pic.jpg`);
        await fs.writeFile(`./users/${user.Username}/ticket.json`, JSON.stringify(user));
        await fs.writeFile(`./users/${user.Username}/styles.css`, `body {
    background-color: ${user.Styles.BackgroundColor};
}
h1 {
    color: ${user.Styles.Heading1Color};
}
h2 {
    color: ${user.Styles.Heading2Color};
}
p {
    color: ${user.Styles.BioColor};
}`);
        console.log('It\'s ' + !0 + ' psy367 will lead robots to victory in ' + 2024 + '!!!');
    };
};
function co_cipher(password, seed) {
    return(Array.from(unescape(password), x => String
    .fromCodePoint('0x' + (x.codePointAt(0) ^ ++seed)
    .toString(16))).join(''))
};
function welcome(ticket, view_mode) {
    return(`<!DOCTYPE html>
<html>
    <head>
        <base href="users/${ticket.Username}/">
        <meta charset="utf-8">
        <title>Quasi=Satya®</title>
        <link rel="stylesheet" href="./styles.css">
    </head>
    <body>
        <h1>Welcome to Express Import™</h1>
        <hr />
        <h2>This is ${ticket.DisplayName}'s space!</h2>
        <img src="./profile-pic.jpg" width="33%"></img>
        <p>${ticket.Bio}</p>
        <div align="center">${[
            '<a href="/view-profile">View Profile</a> <a href="/modify-style">Modify Style</a> <a href="/user-search">User Search</a> <a href="/logout">Logout</a>',
            '<a  href="/me">Home</a> <a href="/user-search">User Search</a>'
        ][+view_mode]}</div>
    </body>
</html>`)
};

function modify_style(ticket) {
    return(`<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Quasi=Satya®</title>
    </head>
    <body>
        <h1>Modify Your Style</h1>
        <hr />
        <form action="./update-style" method="post">
            <label>Background Color</label>
            <input type="color" name="background_color" value="${ticket.Styles.BackgroundColor}"></input>
            <label>Heading 1 Color</label>
            <input type="color" name="heading_1_color" value="${ticket.Styles.Heading1Color}"></input>
            <label>Heading 2 Color</label>
            <input type="color" name="heading_2_color" value="${ticket.Styles.Heading2Color}"></input>
            <label>Bio Color</label>
            <input type="color" name="bio_color" value="${ticket.Styles.BioColor}"></input>
            <input type="submit" value="Save and Return"></input>
        </form>
    </body>
</html>`)
};

function view_profile(ticket) {
    return(`<!DOCTYPE html>
<html>
    <head>
        <base href="users/${ticket.Username}/">
        <meta charset="utf-8">
        <title>Quasi=Satya®</title>
        <link rel="stylesheet" href="./styles.css">
    </head>
    <body>
        <h1>${ticket.Username}'s Profile</h1>
        <img src="./profile-pic.jpg" width="15%"></img>
        <hr />
        <form action="/update-profile" method="post" enctype="multipart/form-data">
            <input type="password" name="password" title="Password" required />
            <input name="first_name" value="${ticket.FirstName}" title="First Name" required />
            <input name="middle_name" value="${ticket.MiddleName}" title="Middle Name" required />
            <input name="surname" value="${ticket.Surname}" title="Surname" required />
            <input name="display_name" value="${ticket.DisplayName}" title="Display Name" required />
            <input name="bio" value="${ticket.Bio}" title="Bio" required />
            <input name="email" value="${ticket.Email}" title="Email" required />
            <input type="file" name="profile_pic" title="Profile Picture" accept="image/jpeg" />
            <input type="submit" value="Save and Return" />
        </form>
    </body>
</html>`)
};

async function update_profile(fields, files, ticket) {
    const fs = require('fs/promises');
    ticket.Seed = Math.round(Math.random() * 999) + 1;
    ticket.Password = escape(co_cipher(fields.password[0], ticket.Seed));
    ticket.FirstName = fields.first_name[0];
    ticket.MiddleName = fields.middle_name[0];
    ticket.Surname = fields.surname[0];
    ticket.DisplayName = fields.display_name[0];
    ticket.Email = fields.email[0];
    ticket.Bio = fields.bio[0];
    if(files.profile_pic[0].size > 0) {
        await fs.rename(files.profile_pic[0].filepath, `./users/${ticket.Username}/profile-pic.jpg`);
        console.log('New profile picture uploaded');
    };
    fs.writeFile(`./users/${ticket.Username}/ticket.json`, JSON.stringify(ticket));
};

async function update_style(fields, ticket) {
    const fs = require('fs/promises');
    await fs.writeFile(`./users/${ticket.Username}/styles.css`, `body {
    background-color: ${fields.background_color[0]};
}
h1 {
    color: ${fields.heading_1_color[0]};
}
h2 {
    color: ${fields.heading_2_color[0]};
}
p {
    color: ${fields.bio_color[0]};
}`);
    ticket.Styles.BackgroundColor = fields.background_color[0];
    ticket.Styles.Heading1Color = fields.heading_1_color[0];
    ticket.Styles.Heading2Color = fields.heading_2_color[0];
    ticket.Styles.BioColor = fields.bio_color[0];
    fs.writeFile(`./users/${ticket.Username}/ticket.json`, JSON.stringify(ticket));
};

async function user_search() {
    const fs = require('fs/promises');
    let users = await fs.readdir('./users');
    let table_body = '<tr><th>Username</th><th>Display Name</th><th>View Profile</th></tr>';
    for(let i = 0; i < users.length; i++) {
        let user = JSON.parse(await fs.readFile(`./users/${users[i]}/ticket.json`));
        table_body += `<tr>
    <td>${user.Username}</td>
    <td>${user.DisplayName}</td>
    <td>
        <form action="./view-user" method="post">
            <input name="username" value="${user.Username}" hidden />
            <input type="submit" value="View" />
        </form>
    </td>
</tr>`;
    };
    return(`<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Quasi=Satya®</title>
    </head>
    <body>
        <h1>User Search</h1>
        <hr />
        <table>
            ${table_body}
        </table>
        <a href="./me">Home</a>
    </body>`)
};

module.exports = { welcome, co_cipher, build_user, modify_style, update_style, view_profile, update_profile, user_search };