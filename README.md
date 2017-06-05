# Dungeon-Master-Toolkit

Tabletop gaming utilities, for those who want to try a digital table.

##The utilities:

###Dice Roller

Rolls a specified number of dice of a given size.  If you need to roll 20 instances of 8-sided dice, it may be faster than doing so phyisically.

###PDF Rule Finder

Searches every pdf file in a configured directory for a set of given keywords to find what pages they appear in and in what file.  Useful for finding rules regarding specific terms.  

##The technologies:

Primarily, nodejs.  There will probably be more JavaScript libraries as I get deeper into the project, but for now, node is a quick way to get started, a technology that I have been meaning to learn, and a good way to later integrate these tools into a nice webapp that may allow for online game sessions.

##Getting Started:

###Install the dependencies

####Dice roller

You will need to have nodejs installed.

####Pdf-Rulefinder

The following commands will install the dependencies for the rulefinding tool
First, make sure that npm and nodejs are installed, then run the following commands.

```
$yum -y install mongodb-server  #install Mongo on your system #or apt -y install mongodb

$npm install -g mongodb pdf-text-extract serve-static express fs wait.for

$npm link mongodb pdf-text-extract serve-static express fs wait.for
```

You will need to copy the config file to the appropriate place on your filesystem and edit it to make it actually be useful.  The file is located at pdf-rulefind/files/pdf-rulefind-config.json.example.
Additionally, the rule directory pointed to by the file must exist, so create it.  Put any pdf files that you will want to search in the rule directory.  In the config file, the default location is /usr/local/dmtk.  The config file also contains entries relating to the blacklisting and whitelisting of books.  By editing the lists of books and the setting for whether dungeon masters override the available book set, it is possible to restrict the books searched within the rulebook directory to only a subset.  

Before you can run the program, MongoDB must be running.  On Centos, this can be started with systemctl start mongod.

Finally, on the first run, the pdf files' text must be extracted using the `--refresh-db` flag.

After the dependencies are installed, the books are in the right directory, and the database is configured, the utility can be used via the webpage served at localhost:8080.
