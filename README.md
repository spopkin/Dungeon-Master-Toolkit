# Dungeon-Master-Toolkit
Tabletop gaming utilities, for those who want to try a digital table.

##The utilities:
###Dice Roller
Rolls a specified number of dice of a given size.  If you need to roll 20 instances of 8-sided dice, it may be faster than doing so phyisically.

##The technologies:
Primarily, nodejs.  There will probably be more JavaScript libraries as I get deeper into the project, but for now, node is a quick way to get started,
a technology that I have been meaning to learn, and a good way to later integrate these tools into a nice webapp that may allow for online game sessions.

##Getting Started:
###Install the dependencies
####Dice roller
You will need to have nodejs installed.

####Pdf-Rulefinder
The following commands will install the dependencies for the rulefinding tool
First, make sure that npm and nodejs are installed, then run the following commands.

```
$npm install -g connect serve-static

$npm link connect && npm link serve-static
```

