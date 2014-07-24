Google Calendar wrapper
======

This project is a gooogle calendar API wrapper degigned to support **multi-user login** and provide a easily use way to **retrieval the latest event data** thought a set of hardware friendly **RESTful API**.

![Google Calendar](images/google-calendar.jpg)

There are two different implecations of the same functionality.

* Python
* Node.JS

Python wrapper
------

### How to use
1. Install [Python 2](http://www.python.org/).
2. Fork this project and install the [Google App Engine SDK for Python](https://developers.google.com/appengine/downloads#Google_App_Engine_SDK_for_Python), unzip all folder at the python folder of this project.
3. Create a application on [Google APP engine](https://appengine.google.com/).
4. Enable Google Calendar API access of the application on [Google Developers Console](https://console.developers.google.com/project?authuser=0).
5. Download the [client secrets file](https://developers.google.com/api-client-library/python/guide/aaa_client_secrets) from your [Google Developers Console](https://console.developers.google.com/project?authuser=0) and put it at the python folder of this project.
6. Run the application: **python app.py**
7. Visit [http://<host-ip>:9999/login?user=\<id\>](#) to open the Google [OAuth2](https://developers.google.com/api-client-library/python/guide/aaa_oauth) login page.
8. Now visit [http://<host-ip>:9999/event/list?user=\<id\>](#) to get the lastest event of specified user in JSON format.

Node.JS wrapper
------
### How to use
1. Install [Node.JS](http://nodejs.org/)
2. Fork this project to your local computer
3. Follow step 3-5 of python wrapper
4. Run the application: **node app.js**
5. Follow step 7-8 of python wrapper
