# MMM-Pollenrapport
A MagicMirror module for showing pollen-levels in Sweden.

See https://github.com/MichMich/MagicMirror

It shows colored cicles for each discovered pollen-type. The cirlce filling up, and the color going from green to red depending on the amount of pollen.

![Example image](https://github.com/atrixiex/MMM-Pollenrapport/blob/master/Example.png?raw=True)

## Usage
### Find your city ID
1. Go to https://pollenkoll.se/wp-content/themes/pollenkoll/api/get_cities.php 
2. You will se a list and have to click around until you see the name of your city (or the closest city to you that measures pollen in Sweden)
3. Note the "cityid" field.

### Installation
1. Clone this repository into your modules directory
2. Edit the settings file:
```javascript
{
    module: 'MMM-Pollenrapport',
    position: 'position',
    config: {
        city: 'City ID from the "Finding your city ID"-section', # Defaults to: '94'
        updateInterval: Time in milliseconds between updates, # Defaults to 6 hours: 6 * 1000 * 60 * 60
        itemsPerRow: How many circles to show side by side before creating a new row of circles. # Defaults to: 2
    }
},
```
