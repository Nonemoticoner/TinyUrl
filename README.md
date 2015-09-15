# TinyUrl (under construction)
Create redirect links easiely with use of Express (Node) and MySQL.

#### Installation
1. Setup the MySQL database with use of *init.sql*.
2. Copy the whole repository on your server.
3. In *app.js*:
  * Fill correct credentials in MySQL **connection** object.
  * You may configure **pc_config** object as you please according to documentation of [password-creator](https://www.npmjs.com/package/password-creator) package. 
  * There are many comments in file those explain how the app works.

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

#### License
[MIT](https://github.com/Nonemoticoner/TinyUrl/blob/master/LICENSE)
