import json

export = open('ground_coord.json', 'w')
export.write('var groundCoord = [')
for item in json.load(open('ground.json')):
    export.write(
        u'{x: ' + item['Cells']['Longitude_WGS84'] +
        ', y: ' + item['Cells']['Latitude_WGS84'] +
        ', line: ' + item['Cells']['RouteNumbers'] +
        '},\n')
export.write('];')
export.close()
