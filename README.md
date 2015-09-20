# TinyUrl
Create redirect links easiely with use of Express (Node) and MySQL.

#### Installation
1. Setup the MySQL database with use of *init.sql*.
2. Copy the whole repository on your server.
3. In *app.js*:
  * Fill correct credentials in MySQL **connection** object.
  * You may configure **pc_config** object as you please according to documentation of [password-creator](https://www.npmjs.com/package/password-creator) package. 
  * There are many comments in file those explain how the app works.
4. Run the application:
```bash
$ node app.js
```

#### How to use
###### Creating links
To create the redirect link, you have to send a http POST request to your domain under directory **/create** with such data:
```json
{
  "url": "http://example.com",
  "keyword": "exe", /*optional, if not specified, app will generate random*/
  "auth_key": "a5s4f6agfd6" /*optional, only necessary if was specified in app.js*/
}
```
###### Accessing links
The redirect link could look like this:
```bash
http://<YOUR_DOMAIN>/fwd/exe
```
Where **fwd** word is up to your choice and can be easiely replaced by any string of your choice. Just change the **LETTER** variable in *app.js*.

#### Script behaviour remark
If there is a keyword specified by user already taken, the link will be overwritten in the database. So, the the previous link that was hidden under that keyword will be lost.

#### Technologies
* [Node](https://github.com/nodejs/node)
* [Express](https://www.npmjs.com/package/express)
* [MySQL](https://www.npmjs.com/package/mysql)
* [body-parser](https://www.npmjs.com/package/body-parser)
* [password-creator](https://www.npmjs.com/package/password-creator)

#### License
[MIT](https://github.com/Nonemoticoner/TinyUrl/blob/master/LICENSE)
