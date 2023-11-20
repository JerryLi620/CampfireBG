import csv


def get_target_type(file_name):
    with open(file_name, 'r') as file:
        content = list(csv.DictReader(file))
        fieldnames = content[0].keys() if content else []

    with open(file_name, 'w', newline='') as w:
        csv_writer = csv.DictWriter(w, fieldnames=fieldnames)
        csv_writer.writeheader()
        for row in content:
            if row['type'] == 'boardgame' or row['type'] == 'boardgameexpansion':
                csv_writer.writerow(row)


def add_id(file_name, item, game_set, ID):
    # Read the file content into a list of dictionaries
    with open(file_name, 'r', newline='') as file:
        content = list(csv.DictReader(file))
    
    items = {}
    count = 1
    new_content = [] 

    for row in content:
        data = row[item]
        
        if row['game_id'] in game_set:
            if data.lower() == 'null':
                continue
            elif data in items:
                row[ID] = items[data]
            else:
                row[ID] = count
                items[data] = count
                count += 1
            new_content.append(row) 

    fieldnames = new_content[0].keys() if new_content else []

    with open(file_name, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(new_content)


def clean_nan(file_name):
    with open(file_name, 'r', newline='') as file:
        content = list(csv.DictReader(file))

    for row in content:
        for key, value in row.items():
            if value.lower() == 'nan':
                row[key] = None

    # Get the fieldnames from the first row
    fieldnames = content[0].keys() if content else []

    # Write the modified content back to the file
    with open(file_name, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(content)


if __name__ == "__main__":
    get_target_type('data_cleaned/games.csv')

    with open('data_cleaned/games.csv', 'r') as file:
        content = list(csv.DictReader(file))
        game_set = set()
        for row in content:
            game_set.add(row['game_id'])

    clean_nan('data_cleaned/games.csv')
    add_id('data_cleaned/categorized.csv',
           'categories', game_set, 'category_ID')
    clean_nan('data_cleaned/categorized.csv')
    add_id('data_cleaned/designed.csv', 'designers', game_set, 'designer_ID')
    clean_nan('data_cleaned/designed.csv')
    add_id('data_cleaned/moves.csv', 'mechanics', game_set, 'mechanism_ID')
    clean_nan('data_cleaned/moves.csv')
    add_id('data_cleaned/painted.csv', 'artists', game_set, 'artist_ID')
    clean_nan('data_cleaned/painted.csv')
    add_id('data_cleaned/published.csv',
           'publishers', game_set, 'publisher_ID')
    clean_nan('data_cleaned/published.csv')
